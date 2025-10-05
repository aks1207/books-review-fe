# Backend Implementation Guide

Quick reference for implementing the Books Review backend API.

## Tech Stack Recommendations

- **Node.js** with **Express.js** or **Fastify**
- **Database**: PostgreSQL or MySQL
- **ORM**: Prisma, Sequelize, or TypeORM
- **Authentication**: JWT with bcrypt for password hashing
- **File Storage**: AWS S3, Cloudinary, or local storage
- **Caching**: Redis
- **Validation**: Zod, Joi, or express-validator

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- bcrypt hashed
  avatar TEXT,
  bio TEXT,
  role VARCHAR(50) DEFAULT 'user', -- user, moderator, admin
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Books Table
```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20),
  genre VARCHAR(100) NOT NULL,
  description TEXT,
  cover_image TEXT,
  publication_year INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_created_at ON books(created_at DESC);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  spoiler BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(book_id, user_id) -- One review per user per book
);

CREATE INDEX idx_reviews_book_id ON reviews(book_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
```

### Review Likes Table
```sql
CREATE TABLE review_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

CREATE INDEX idx_review_likes_review_id ON review_likes(review_id);
```

### Comments Table (Optional)
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For nested comments
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_review_id ON comments(review_id);
```

### Follows Table (Optional)
```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);
```

## Authentication Flow

### 1. Sign Up
```javascript
POST /api/auth/signup
Body: { name, email, password }

Steps:
1. Validate input (email format, password length >= 6)
2. Check if email already exists
3. Hash password: bcrypt.hash(password, 10)
4. Create user in database
5. Generate JWT token: jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' })
6. Return: { token, user: { id, name, email, role } }
```

### 2. Login
```javascript
POST /api/auth/login
Body: { email, password }

Steps:
1. Find user by email
2. Compare password: bcrypt.compare(password, user.password)
3. Generate JWT token
4. Return: { token, user: { id, name, email, role } }
```

### 3. Auth Middleware
```javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
```

## Key API Implementations

### GET /api/books (with pagination, search, filters)
```javascript
GET /api/books?page=1&limit=20&search=gatsby&genre=Classic&sort=rating

Query params:
- page: number (default 1)
- limit: number (default 20)
- search: string (search in title, author)
- genre: string
- sort: 'title' | 'rating' | 'reviews' | 'newest'

SQL:
SELECT
  b.*,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(r.id) as review_count
FROM books b
LEFT JOIN reviews r ON b.id = r.book_id
WHERE
  (b.title ILIKE '%search%' OR b.author ILIKE '%search%')
  AND b.genre = 'Classic'
GROUP BY b.id
ORDER BY average_rating DESC
LIMIT 20 OFFSET 0;

Return: { books: [...], pagination: { page, limit, total, totalPages } }
```

### POST /api/books (with file upload)
```javascript
POST /api/books
Headers: Authorization: Bearer TOKEN
Body: FormData { title, author, isbn, genre, description, publicationYear, coverImage (file) }

Steps:
1. Authenticate user
2. Validate input
3. Upload image to S3/Cloudinary or save locally
4. Create book in database with image URL
5. Return: { id, title, ... }

Middleware: multer for file upload
```

### POST /api/books/:bookId/reviews
```javascript
POST /api/books/123/reviews
Headers: Authorization: Bearer TOKEN
Body: { rating: 5, text: "Great book!", spoiler: false }

Steps:
1. Authenticate user
2. Check if book exists
3. Check if user already reviewed this book (should prevent duplicates)
4. Create review
5. Return: { id, bookId, userId, userName, userAvatar, rating, text, ... }

Join with users table to get userName and userAvatar
```

### GET /api/books/:id/reviews
```javascript
GET /api/books/123/reviews?page=1&sort=newest

SQL:
SELECT
  r.*,
  u.name as user_name,
  u.avatar as user_avatar,
  COUNT(rl.id) as likes,
  CASE WHEN EXISTS(
    SELECT 1 FROM review_likes
    WHERE review_id = r.id AND user_id = 'current-user-id'
  ) THEN true ELSE false END as is_liked
FROM reviews r
JOIN users u ON r.user_id = u.id
LEFT JOIN review_likes rl ON r.id = rl.review_id
WHERE r.book_id = '123'
GROUP BY r.id, u.id
ORDER BY r.created_at DESC
LIMIT 20 OFFSET 0;
```

### GET /api/books/trending (Cache this!)
```javascript
GET /api/books/trending

Implementation:
1. Check Redis cache first: redis.get('trending:books')
2. If cached, return cached data
3. If not cached:
   - Query books with most reviews in last 7 days
   - Store in Redis with TTL (1 hour): redis.setex('trending:books', 3600, JSON.stringify(books))
4. Return books

SQL:
SELECT b.*, COUNT(r.id) as recent_reviews
FROM books b
JOIN reviews r ON b.id = r.book_id
WHERE r.created_at > NOW() - INTERVAL '7 days'
GROUP BY b.id
ORDER BY recent_reviews DESC
LIMIT 10;
```

## Authorization Examples

### Check if user owns resource
```javascript
// Update review - user can only update their own review
app.put('/api/reviews/:id', authMiddleware, async (req, res) => {
  const review = await db.reviews.findById(req.params.id);

  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Update review...
});
```

### Admin-only routes
```javascript
function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  // Get all users...
});
```

## File Upload Example (Multer + S3)

```javascript
const multer = require('multer');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/books', authMiddleware, upload.single('coverImage'), async (req, res) => {
  let coverImageUrl = null;

  if (req.file) {
    const params = {
      Bucket: 'your-bucket-name',
      Key: `books/${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const result = await s3.upload(params).promise();
    coverImageUrl = result.Location;
  }

  const book = await db.books.create({
    ...req.body,
    coverImage: coverImageUrl,
  });

  res.json(book);
});
```

## CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
```

## Environment Variables

```env
# .env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/bookreview
JWT_SECRET=your-super-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000

# AWS (if using S3)
AWS_ACCESS_KEY=xxx
AWS_SECRET_KEY=xxx
AWS_BUCKET_NAME=xxx

# Redis (if using caching)
REDIS_URL=redis://localhost:6379
```

## Error Handling Best Practices

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Usage
if (!book) {
  throw new AppError('Book not found', 404);
}
```

## Rate Limiting (Optional)

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Testing Tips

1. Use **Postman** or **Thunder Client** to test endpoints
2. Start with authentication endpoints first
3. Then implement CRUD for books
4. Then reviews
5. Finally admin features

## Deployment Checklist

- [ ] Set all environment variables in production
- [ ] Use HTTPS (SSL certificate)
- [ ] Enable CORS for frontend domain
- [ ] Set up database migrations
- [ ] Configure Redis for caching
- [ ] Set up logging (Winston, Pino)
- [ ] Add health check endpoint: `GET /health`
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Run security audit: `npm audit`

---

This guide covers the essentials. Refer to `lib/api.ts` in the frontend to see exactly what the frontend expects!

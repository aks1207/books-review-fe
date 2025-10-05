# BookReview - Frontend Application

A comprehensive book review platform built with Next.js for learning full-stack development.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Navigate to the project directory
cd books-review-fe

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
books-review-fe/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout with navbar
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── books/               # Books pages
│   │   ├── page.tsx         # Browse books
│   │   ├── new/             # Add new book
│   │   └── [id]/            # Book details & reviews
│   ├── profile/[id]/        # User profile page
│   └── admin/               # Admin dashboard
├── components/              # Reusable React components
│   ├── Navbar.tsx          # Navigation bar
│   ├── BookCard.tsx        # Book display card
│   └── ReviewCard.tsx      # Review display card
├── lib/                     # Utility functions
│   ├── api.ts              # Backend API client (axios)
│   ├── mockData.ts         # Mock data for development
│   └── utils.ts            # Helper functions
└── public/                  # Static assets
```

## 🎨 Features Implemented

### ✅ Authentication
- **Sign Up** (`/signup`)
- **Login** (`/login`)
- **Logout** (via navbar)
- JWT token storage in localStorage
- Protected routes for authenticated users

### ✅ Book Management
- **Browse Books** (`/books`) - with search, filter by genre, sort options
- **Book Details** (`/books/[id]`) - view book info and all reviews
- **Add New Book** (`/books/new`) - upload cover, add details (auth required)

### ✅ Review System
- **Write Reviews** - rating (1-5 stars), text, spoiler flag
- **View Reviews** - on book detail pages
- **Like Reviews** - helpful button
- **Spoiler Protection** - reviews with spoilers are hidden by default

### ✅ User Profiles
- **View Profile** (`/profile/[id]`) - user info, stats, reviews
- **Edit Profile** - update name and bio (own profile only)
- **User Stats** - review count, average rating, followers

### ✅ Admin Dashboard
- **Analytics** - total users, books, reviews, growth metrics
- **User Management** - change roles, ban users
- **Placeholder for charts and book management**

### ✅ UI/UX
- Clean, modern design with Tailwind CSS
- Responsive layout (mobile, tablet, desktop)
- Loading states and error handling
- Pagination support

## 🔌 Connecting to Backend

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### API Integration

All API calls are defined in `lib/api.ts`. Currently, they're commented out and using mock data.

**To connect to your backend:**

1. Set up the backend API URL in `.env.local`
2. In each page component, uncomment the API calls (look for `// TODO: Uncomment when backend is ready`)
3. Comment out or remove the mock data imports

Example in `app/books/page.tsx`:

```typescript
// Before (using mock data):
const [books, setBooks] = useState(mockBooks);

// After (using backend):
useEffect(() => {
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await booksAPI.getAll({
        page: 1,
        limit: 20,
        search: searchQuery,
        genre: selectedGenre !== 'All' ? selectedGenre : undefined,
        sort: sortBy,
      });
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchBooks();
}, [searchQuery, selectedGenre, sortBy]);
```

## 📡 Backend API Endpoints Required

Your brother needs to implement these endpoints:

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password with token

### Books
- `GET /api/books` - Get all books (with pagination, search, filters)
- `GET /api/books/:id` - Get single book details
- `POST /api/books` - Create new book (auth required, multipart/form-data for image)
- `PUT /api/books/:id` - Update book (auth required)
- `DELETE /api/books/:id` - Delete book (admin only)
- `GET /api/books/trending` - Get trending books (cache this!)
- `GET /api/books/:id/reviews` - Get all reviews for a book

### Reviews
- `GET /api/reviews` - Get all reviews (paginated)
- `POST /api/books/:bookId/reviews` - Create review (auth required)
- `PUT /api/reviews/:id` - Update review (own review only)
- `DELETE /api/reviews/:id` - Delete review (own review or admin)
- `POST /api/reviews/:id/like` - Like a review
- `DELETE /api/reviews/:id/like` - Unlike a review

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile (own profile only)
- `GET /api/users/:id/reviews` - Get user's reviews
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/role` - Change user role
- `PUT /api/admin/users/:id/ban` - Ban user
- `PUT /api/admin/users/:id/unban` - Unban user
- `GET /api/admin/analytics` - Get platform analytics

## 📊 Expected API Response Formats

### Books List Response
```json
{
  "books": [
    {
      "id": "1",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "9780743273565",
      "genre": "Classic",
      "description": "A novel set in the Jazz Age...",
      "coverImage": "https://example.com/cover.jpg",
      "averageRating": 4.5,
      "reviewCount": 234,
      "publicationYear": 1925,
      "createdAt": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Auth Response
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

### Review Response
```json
{
  "id": "1",
  "bookId": "1",
  "userId": "1",
  "userName": "John Doe",
  "userAvatar": "https://example.com/avatar.jpg",
  "rating": 5,
  "text": "Amazing book!",
  "spoiler": false,
  "likes": 45,
  "isLiked": false,
  "createdAt": "2024-02-01T00:00:00Z"
}
```

## 🗄️ Database Tables Needed

1. **users** - id, name, email, password (hashed), avatar, bio, role, created_at
2. **books** - id, title, author, isbn, genre, description, cover_image, publication_year, created_at
3. **reviews** - id, book_id, user_id, rating, text, spoiler, created_at, updated_at
4. **review_likes** - id, review_id, user_id, created_at
5. **comments** - id, review_id, user_id, parent_id, text, created_at
6. **follows** - id, follower_id, following_id, created_at
7. **sessions** - id, user_id, token, expires_at (if using sessions)

## 🚀 Deployment

### Deploy to Vercel (Recommended - Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variable: `NEXT_PUBLIC_API_URL=your-backend-url`
6. Click "Deploy"

Done! Your frontend will be live at `https://your-project.vercel.app`

### Deploy Backend

### Backend Development
- **Authentication**: JWT tokens, password hashing, session management
- **CRUD Operations**: Create, Read, Update, Delete for Books, Reviews, Users
- **Database Design**: Relationships (one-to-many, many-to-many)
- **File Upload**: Handle book cover images
- **Pagination**: Efficiently handle large datasets
- **Search & Filtering**: Query optimization
- **Authorization**: Role-based access control (user, moderator, admin)
- **Caching**: Redis for trending books, analytics
- **API Design**: RESTful endpoints, proper HTTP status codes
- **Error Handling**: Validation, error messages
- **Background Jobs**: Email notifications, cache updates

### Deployment
- Environment variables
- CORS configuration
- Database migrations
- SSL/TLS for production
- Logging and monitoring

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🎯 Testing the Integration

1. Start your frontend: `npm run dev` (port 3000)
2. Start your brother's backend: should run on port 3001
3. Set `NEXT_PUBLIC_API_URL=http://localhost:3001/api` in `.env.local`
4. Uncomment API calls in the code
5. Test each feature:
   - Sign up a new user
   - Login
   - Browse books
   - Add a new book
   - Write a review
   - Test admin features

## 📝 Notes

- All API calls use Axios with interceptors for automatic token injection
- Mock data is provided in `lib/mockData.ts` for testing without backend
- Images use Unsplash placeholder URLs - replace with actual uploaded images
- Admin role must be set directly in the database (for security)

## 🤝 Support

Questions about:
- What data format to return
- How authentication should work
- What database structure to use
- How to implement caching

Refer to the comments in `lib/api.ts` and this README.

---

Built with ❤️ for learning full-stack development!

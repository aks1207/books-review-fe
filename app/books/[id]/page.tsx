'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, Calendar, BookOpen, MessageSquare, Plus } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import { mockBooks, mockReviews } from '@/lib/mockData';
// import { booksAPI, reviewsAPI } from '@/lib/api';

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState(mockBooks.find((b) => b.id === bookId));
  const [reviews, setReviews] = useState(mockReviews.filter((r) => r.bookId === bookId));
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    text: '',
    spoiler: false,
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // TODO: Uncomment when backend is ready
    // const fetchBookDetails = async () => {
    //   try {
    //     const bookResponse = await booksAPI.getById(bookId);
    //     setBook(bookResponse.data);
    //
    //     const reviewsResponse = await booksAPI.getReviews(bookId);
    //     setReviews(reviewsResponse.data.reviews);
    //   } catch (error) {
    //     console.error('Error fetching book details:', error);
    //   }
    // };
    // fetchBookDetails();
  }, [bookId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    try {
      // TODO: Uncomment when backend is ready
      // const response = await reviewsAPI.create(bookId, reviewForm);
      // setReviews([response.data, ...reviews]);

      // Mock review submission
      const newReview = {
        id: Date.now().toString(),
        bookId,
        userId: user.id,
        userName: user.name,
        userAvatar: 'https://i.pravatar.cc/150?u=' + user.id,
        ...reviewForm,
        likes: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
      };
      setReviews([newReview, ...reviews]);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, text: '', spoiler: false });
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Book not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Book Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full rounded-lg shadow-md"
              />
            </div>

            {/* Book Info */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= Math.round(book.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-semibold text-gray-900">
                  {book.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-500">({book.reviewCount} reviews)</span>
              </div>

              {/* Meta Information */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <BookOpen className="h-5 w-5" />
                  <span>ISBN: {book.isbn}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>Published: {book.publicationYear}</span>
                </div>
              </div>

              {/* Genre */}
              <div className="mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {book.genre}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>

              {/* Review Button */}
              {user && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  <Plus className="h-5 w-5" />
                  <span>Write a Review</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Write Your Review</h2>
            <form onSubmit={handleSubmitReview}>
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= reviewForm.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600">{reviewForm.rating} star(s)</span>
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  id="review-text"
                  rows={6}
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your thoughts about this book..."
                  required
                />
              </div>

              {/* Spoiler Checkbox */}
              <div className="mb-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={reviewForm.spoiler}
                    onChange={(e) => setReviewForm({ ...reviewForm, spoiler: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">This review contains spoilers</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Section */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <MessageSquare className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Reviews ({reviews.length})
            </h2>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">No reviews yet. Be the first to review this book!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

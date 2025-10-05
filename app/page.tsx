'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TrendingUp, Star, Users, BookOpen, ArrowRight } from 'lucide-react';
import BookCard from '@/components/BookCard';
import { mockBooks } from '@/lib/mockData';
// import { booksAPI } from '@/lib/api';

export default function HomePage() {
  const [trendingBooks] = useState(mockBooks.slice(0, 5));
  const [topRatedBooks] = useState(
    [...mockBooks].sort((a, b) => b.averageRating - a.averageRating).slice(0, 5)
  );
  const [recentBooks] = useState(
    [...mockBooks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
  );

  useEffect(() => {
    // TODO: Uncomment when backend is ready
    // const fetchHomeData = async () => {
    //   try {
    //     const trending = await booksAPI.getTrending();
    //     setTrendingBooks(trending.data.books);
    //
    //     const topRated = await booksAPI.getAll({ sort: 'rating', limit: 5 });
    //     setTopRatedBooks(topRated.data.books);
    //
    //     const recent = await booksAPI.getAll({ sort: 'newest', limit: 5 });
    //     setRecentBooks(recent.data.books);
    //   } catch (error) {
    //     console.error('Error fetching home data:', error);
    //   }
    // };
    // fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover & Review Amazing Books
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Join our community of book lovers and share your reading experiences
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/books"
                className="px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 font-medium transition-colors"
              >
                Browse Books
              </Link>
              <Link
                href="/signup"
                className="px-8 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-900 font-medium border-2 border-white transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-3xl font-bold text-gray-900">1,000+</p>
              <p className="text-gray-600">Books Available</p>
            </div>
            <div>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-3xl font-bold text-gray-900">5,000+</p>
              <p className="text-gray-600">Active Readers</p>
            </div>
            <div>
              <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-3xl font-bold text-gray-900">15,000+</p>
              <p className="text-gray-600">Reviews Written</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Books */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Trending This Week</h2>
            </div>
            <Link
              href="/books"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Top Rated Books */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Highest Rated</h2>
            </div>
            <Link
              href="/books?sort=rating"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {topRatedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Recently Added */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Recently Added</h2>
            </div>
            <Link
              href="/books?sort=newest"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-50 rounded-lg border border-blue-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Start Your Reading Journey Today
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of readers sharing their favorite books and discovering new ones
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Create Free Account
          </Link>
        </section>
      </div>
    </div>
  );
}

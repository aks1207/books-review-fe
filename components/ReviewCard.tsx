'use client';

import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ReviewCardProps {
  review: {
    id: string;
    userName: string;
    userAvatar: string;
    rating: number;
    text: string;
    spoiler: boolean;
    likes: number;
    isLiked: boolean;
    createdAt: string;
  };
  onLike?: (id: string) => void;
}

export default function ReviewCard({ review, onLike }: ReviewCardProps) {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [isLiked, setIsLiked] = useState(review.isLiked);
  const [likes, setLikes] = useState(review.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike?.(review.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* User Info */}
      <div className="flex items-start space-x-4 mb-4">
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">{review.userName}</h4>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Review Text */}
      <div className="mb-4">
        {review.spoiler && !showSpoiler ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800 mb-2">
              ⚠️ This review contains spoilers
            </p>
            <button
              onClick={() => setShowSpoiler(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Show anyway
            </button>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed">{review.text}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 text-sm ${
            isLiked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>Helpful ({likes})</span>
        </button>
        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600">
          <MessageCircle className="h-4 w-4" />
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
}

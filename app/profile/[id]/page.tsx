'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User, Calendar, Star, BookOpen, Edit } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import { mockUser, mockReviews } from '@/lib/mockData';
// import { usersAPI } from '@/lib/api';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const [profile, setProfile] = useState(mockUser);
  const [reviews, setReviews] = useState(mockReviews);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: mockUser.name,
    bio: mockUser.bio,
  });

  useEffect(() => {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setIsOwnProfile(user.id === userId);
    }

    // TODO: Uncomment when backend is ready
    // const fetchProfile = async () => {
    //   try {
    //     const profileResponse = await usersAPI.getById(userId);
    //     setProfile(profileResponse.data);
    //
    //     const reviewsResponse = await usersAPI.getReviews(userId);
    //     setReviews(reviewsResponse.data.reviews);
    //   } catch (error) {
    //     console.error('Error fetching profile:', error);
    //   }
    // };
    // fetchProfile();
  }, [userId]);

  const handleSaveProfile = async () => {
    try {
      // TODO: Uncomment when backend is ready
      // const formData = new FormData();
      // formData.append('name', editForm.name);
      // formData.append('bio', editForm.bio);
      // await usersAPI.update(userId, formData);

      setProfile({ ...profile, name: editForm.name, bio: editForm.bio });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full"
            />

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({ name: profile.name, bio: profile.bio });
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                    {isOwnProfile && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{profile.email}</p>
                  <p className="text-gray-700 mb-4">{profile.bio}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profile.reviewCount}</p>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profile.averageRating.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profile.followersCount}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profile.followingCount}</p>
              <p className="text-sm text-gray-600">Following</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

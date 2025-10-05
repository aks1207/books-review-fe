'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, BookOpen, Star, TrendingUp, Shield, Ban } from 'lucide-react';
// import { adminAPI } from '@/lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'books'>('analytics');
  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', reviewCount: 12 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', reviewCount: 8 },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'moderator', status: 'active', reviewCount: 25 },
  ]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 5000,
    totalBooks: 1200,
    totalReviews: 15000,
    avgRating: 4.3,
    newUsersThisMonth: 234,
    newBooksThisMonth: 56,
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/');
      return;
    }

    setUser(parsedUser);

    // TODO: Uncomment when backend is ready
    // const fetchAdminData = async () => {
    //   try {
    //     const analyticsData = await adminAPI.getAnalytics();
    //     setAnalytics(analyticsData.data);
    //
    //     const usersData = await adminAPI.getUsers();
    //     setUsers(usersData.data.users);
    //   } catch (error) {
    //     console.error('Error fetching admin data:', error);
    //   }
    // };
    // fetchAdminData();
  }, [router]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // TODO: Uncomment when backend is ready
      // await adminAPI.updateUserRole(userId, newRole);

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      // TODO: Uncomment when backend is ready
      // await adminAPI.banUser(userId);

      setUsers(users.map(u => u.id === userId ? { ...u, status: 'banned' } : u));
      alert('User banned successfully!');
    } catch (error) {
      console.error('Error banning user:', error);
      alert('Failed to ban user');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage users, books, and monitor platform analytics</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'books'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Books
            </button>
          </nav>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Total Users */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-2">+{analytics.newUsersThisMonth} this month</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              {/* Total Books */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Books</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalBooks.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-2">+{analytics.newBooksThisMonth} this month</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-green-600" />
                </div>
              </div>

              {/* Total Reviews */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalReviews.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-2">Avg: {analytics.avgRating.toFixed(1)} ⭐</p>
                  </div>
                  <Star className="h-12 w-12 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                <div className="text-center text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p>Charts will be implemented with your backend analytics API</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.reviewCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                          >
                            <Ban className="h-4 w-4" />
                            <span>Ban</span>
                          </button>
                        ) : (
                          <span className="text-gray-400">Banned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Books Tab */}
        {activeTab === 'books' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Books management will be implemented with backend API</p>
            <p className="text-sm text-gray-400 mt-2">Features: Moderate books, edit details, remove inappropriate content</p>
          </div>
        )}
      </div>
    </div>
  );
}

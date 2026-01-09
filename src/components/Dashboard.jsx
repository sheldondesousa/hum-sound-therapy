import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUserMetrics } from '../hooks/useUserMetrics';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const metrics = useUserMetrics(currentUser?.uid);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-black">HUM Sound Therapy</h1>
            <button
              onClick={handleLogout}
              className="px-6 py-2 border-2 border-black rounded-full font-medium text-black hover:bg-black hover:text-white transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-black">
              Hello, {currentUser?.displayName || 'User'}
            </h2>
            <p className="text-gray-600">{currentUser?.email}</p>
          </div>
        </div>

        {/* Motivational Text */}
        <div className="mb-8">
          <p className="text-2xl font-bold text-black">Take a deep breath and relax</p>
        </div>

        {/* Metric Cards Grid */}
        <div className="space-y-6">
          {/* First Row: Active Days & Exercises Complete */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Active Days Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
              <h3 className="text-sm font-medium mb-2 opacity-90">Active Days</h3>
              {metrics.loading ? (
                <p className="text-4xl font-bold">...</p>
              ) : (
                <p className="text-4xl font-bold">{metrics.activeDays}</p>
              )}
            </div>

            {/* Exercises Complete Card */}
            <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-3xl p-6 text-white shadow-lg">
              <h3 className="text-sm font-medium mb-2 opacity-90">Exercises Complete</h3>
              {metrics.loading ? (
                <p className="text-4xl font-bold">...</p>
              ) : (
                <p className="text-4xl font-bold">{metrics.exercisesComplete}</p>
              )}
            </div>
          </div>

          {/* Second Row: Why Breathing Helps - Full Width */}
          <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl p-6 text-white shadow-lg">
            <h3 className="text-base font-bold">Why intentional breathing helps</h3>
          </div>
        </div>
      </main>
    </div>
  );
}

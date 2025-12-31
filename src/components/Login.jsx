import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signInWithGoogle, currentUser } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/home', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
    // Traditional username/password login can be implemented later
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      // Navigation will happen automatically via useEffect when currentUser updates
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {/* Mobile Container - iPhone 16 Pro Max dimensions with top/bottom lines */}
        <div className="relative w-full max-w-md bg-white px-8 flex flex-col justify-center" style={{ maxWidth: '430px', minHeight: '932px' }}>
          {/* Top line - 932px wide */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 border-t border-black" style={{ width: '932px' }}></div>

          {/* Bottom line - 932px wide */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-b border-black" style={{ width: '932px' }}></div>

        {/* Logo Placeholder */}
        <div className="flex justify-center mb-12 mt-0">
          <div className="w-64 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <span className="text-gray-400 text-sm font-medium">LOGO</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-center mb-8 text-black">
          Let's get started
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {/* Username Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-400 text-black bg-white"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-400 text-black bg-white"
            />
          </div>

          {/* Forgot Password & Login */}
          <div className="flex justify-between items-center pt-2">
            <button type="button" className="text-sm text-black hover:underline">
              Forgot username or password?
            </button>
            <button
              type="submit"
              className="px-8 py-3 border-2 border-black rounded-full font-medium text-black hover:bg-black hover:text-white transition-colors"
            >
              Log in
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Social Login Button */}
        <div className="mb-8">
          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:ring-2 hover:ring-gray-300 transition-all bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-black">
              {loading ? 'Signing in...' : 'Log In with Google'}
            </span>
          </button>
        </div>

        {/* Create Account */}
        <div className="text-center mb-6">
          <button className="text-black underline font-medium hover:no-underline">
            Create an account
          </button>
        </div>

        {/* Terms & Privacy */}
        <p className="text-center text-sm text-gray-500">
          By clicking continue, you agree to our{' '}
          <span className="text-black font-semibold">Terms of Service</span> and{' '}
          <span className="text-black font-semibold">Privacy Policy</span>
        </p>
        </div>
      </div>
    </>
  );
}

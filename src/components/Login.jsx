import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';
import { trackPageView, trackAuth } from '../services/analytics';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);

  const navigate = useNavigate();
  const { signInWithGoogle, currentUser } = useAuth();

  // Check if user has visited before
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedLogin');
    if (hasVisited) {
      setIsReturningUser(true);
    } else {
      localStorage.setItem('hasVisitedLogin', 'true');
    }
  }, []);

  // Track page view on mount
  useEffect(() => {
    trackPageView('login');
  }, []);

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
      const result = await signInWithGoogle();
      await trackAuth('login', result.user.uid, 'google');
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
      <div
        className="min-h-screen flex"
        style={{
          background: 'linear-gradient(135deg, #746DB6 0%, #AD88C6 25%, #E1AFD1 50%, #F7D6EC 75%, #FFE6E6 100%)'
        }}
      >
        {/* Left Side - Login Credentials (50%) */}
        <div className="w-1/2 flex flex-col justify-center px-12">
          <div className="max-w-md mx-auto w-full bg-white bg-opacity-75 backdrop-blur-md p-8 rounded-2xl shadow-lg">
            {/* Logo */}
            <div className="flex justify-center mb-12">
              <img src="/Hush-Logo.png" alt="Hush" style={{ height: '43px' }} />
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

        {/* Right Side - Proof Points (50%) */}
        <div className="w-1/2 flex flex-col justify-between px-12 py-12">
          <div className="max-w-4xl mx-auto w-full">
            {/* Title - Aligned with logo */}
            <div className="flex justify-center mb-12" style={{ height: '43px' }}>
              <h2 className="font-bold flex items-center"
                  style={{ fontSize: '53px', color: '#000000' }}>
                Take a deep breath and relax
              </h2>
            </div>

            {/* Proof Points - 3 Blocks Side by Side */}
            <div className="grid grid-cols-3 gap-6" style={{ gridAutoRows: '1fr' }}>
              {!isReturningUser ? (
                <>
                  {/* Version A - First Time Users */}
                  {/* Proof Point 1 */}
                  <div className="rounded-xl p-6 text-center flex flex-col justify-start" style={{ minHeight: '280px', height: '280px', backgroundColor: '#746DB6' }}>
                    <p className="font-bold text-white"
                       style={{ fontSize: '38px', marginBottom: '16px', whiteSpace: 'nowrap' }}>
                      500,000
                    </p>
                    <div className="w-full border-t border-white mb-4"></div>
                    <p className="text-base text-white">
                      users worldwide trust Hush to manage stress
                    </p>
                  </div>

                  {/* Proof Point 2 */}
                  <div className="rounded-xl p-6 text-center flex flex-col justify-start" style={{ minHeight: '280px', height: '280px', backgroundColor: '#E1AFD1' }}>
                    <p className="font-bold text-black"
                       style={{ fontSize: '38px', marginBottom: '16px', whiteSpace: 'nowrap' }}>
                      93%
                    </p>
                    <div className="w-full border-t border-black mb-4"></div>
                    <p className="text-base text-black">
                      of users report feeling calmer after just one session
                    </p>
                  </div>

                  {/* Proof Point 3 */}
                  <div className="rounded-xl p-6 text-center flex flex-col justify-start" style={{ minHeight: '280px', height: '280px', backgroundColor: '#FFE6E6' }}>
                    <p className="font-bold text-black"
                       style={{ fontSize: '38px', marginBottom: '16px', whiteSpace: 'nowrap' }}>
                      5 minutes
                    </p>
                    <div className="w-full border-t border-black mb-4"></div>
                    <p className="text-base text-black">
                      of intentional breathing helps restores calm
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Version B - Returning Users */}
                  {/* Proof Point 1 */}
                  <div className="rounded-xl p-6 text-center flex flex-col justify-start" style={{ minHeight: '280px', height: '280px', backgroundColor: '#746DB6' }}>
                    <p className="font-bold text-white"
                       style={{ fontSize: '38px', marginBottom: '16px', whiteSpace: 'nowrap' }}>
                      1.2M+
                    </p>
                    <div className="w-full border-t border-white mb-4"></div>
                    <p className="text-base text-white">
                      mindful minutes logged by users this year
                    </p>
                  </div>

                  {/* Proof Point 2 */}
                  <div className="rounded-xl p-6 text-center flex flex-col justify-start" style={{ minHeight: '280px', height: '280px', backgroundColor: '#E1AFD1' }}>
                    <p className="font-bold text-black"
                       style={{ fontSize: '38px', marginBottom: '16px', whiteSpace: 'nowrap' }}>
                      28%
                    </p>
                    <div className="w-full border-t border-black mb-4"></div>
                    <p className="text-base text-black">
                      avg reduction in stress levels reported by users after 7 days
                    </p>
                  </div>

                  {/* Proof Point 3 */}
                  <div className="rounded-xl p-6 text-center flex flex-col justify-start" style={{ minHeight: '280px', height: '280px', backgroundColor: '#FFE6E6' }}>
                    <p className="font-bold text-black"
                       style={{ fontSize: '38px', marginBottom: '16px', whiteSpace: 'nowrap' }}>
                      Six
                    </p>
                    <div className="w-full border-t border-black mb-4"></div>
                    <p className="text-base text-black">
                      science-inspired techniques for calm, focus, and stress
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Store Badges */}
          <div className="flex justify-center gap-4">
            <div className="bg-white rounded-full px-6 py-3 flex items-center gap-3 border-2 border-black" style={{ minWidth: '200px' }}>
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
              <div className="text-left">
                <p className="text-xs text-black">Coming soon</p>
                <p className="text-lg font-semibold text-black">App Store</p>
              </div>
            </div>

            <div className="bg-white rounded-full px-6 py-3 flex items-center gap-3 border-2 border-black" style={{ minWidth: '200px' }}>
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#34A853" d="M3.609 3.609L13.5 13.5v7.95l-9.891-9.891z"/>
                <path fill="#FBBC04" d="M13.5 2.55v10.95L3.609 3.609l9.891-1.059z"/>
                <path fill="#4285F4" d="M21.441 12l-7.941 4.591V5.409z"/>
                <path fill="#EA4335" d="M13.5 13.5l7.941-1.5-7.941-7.5z"/>
              </svg>
              <div className="text-left">
                <p className="text-xs text-black">Coming soon</p>
                <p className="text-lg font-semibold text-black">Play Store</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

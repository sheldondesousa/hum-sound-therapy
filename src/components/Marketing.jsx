import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

export default function Marketing() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/home');
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/Hush-Logo.png" alt="Hush" style={{ height: '32px' }} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Calm
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Experience guided breathing exercises designed to reduce stress, improve focus, and enhance your well-being
          </p>

          {/* Sign In Section */}
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:ring-2 hover:ring-purple-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-semibold text-gray-900 text-lg">
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </span>
            </button>

            {error && (
              <div className="max-w-md w-full p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <h2 className="text-3xl font-bold text-gray-900">Your journey begins here</h2>
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Pause, Breathe Section */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Pause, Breathe</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Unlock your body's built-in reset button to transform high-pressure stress into quiet, focused clarity.
                </p>
              </div>
              <div className="order-1 md:order-2">
                {/* Hush Card Mock */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 rounded-3xl transform rotate-3 opacity-20"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                    <div className="text-center">
                      <div className="flex justify-center mb-6">
                        <img src="/Hush-Logo.png" alt="Hush" style={{ height: '43px' }} />
                      </div>
                      <p className="text-gray-600 text-base leading-relaxed">A simple, effective way to manage stress, centre yourself, and find your rhythm again.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* No Distractions Section */}
          <div className="mb-32">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Just You. Your Breath. Nothing Else.</h3>
                <p className="text-lg text-gray-600">
                  No distractions, no pressure, no agenda. Just a simple tool that works when you need it.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* What we don't have */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      <span className="line-through text-lg">Advertisements</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      <span className="line-through text-lg">Courses to buy</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      <span className="line-through text-lg">Checklists</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      <span className="line-through text-lg">Timetables</span>
                    </div>
                  </div>

                  {/* What we have */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#7469B6]">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span className="text-lg font-medium">You</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#7469B6]">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span className="text-lg font-medium">Your terms</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#7469B6]">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span className="text-lg font-medium">For yourself</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complete App Flow Preview */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Experience the Full Journey</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From choosing your exercise to completing your practice, every screen is designed for clarity and calm
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {/* 1. Home Screen */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[280px] bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 mb-4">
                  <div className="aspect-[9/16] bg-white rounded-2xl overflow-hidden flex flex-col">
                    {/* Header area */}
                    <div className="px-4 pt-6 pb-4">
                      <h3 className="font-medium text-xl text-gray-900">
                        Select a breathing technique
                      </h3>
                    </div>

                    {/* Exercise List */}
                    <div className="flex-1 px-4 space-y-3 overflow-hidden">
                      {/* Box Breathing */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 mb-1">Box Breathing</div>
                          <div className="flex gap-0.5 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                          </div>
                          <div className="text-xs text-gray-600">Stress & focus</div>
                        </div>
                        <svg width="40" height="40" viewBox="0 0 48 48" style={{ border: '1px solid #999', borderRadius: '6px' }}>
                          <rect x="6" y="6" width="16" height="16" rx="2" fill="#7469B6" />
                          <rect x="26" y="6" width="16" height="16" rx="2" fill="#AD88C6" />
                          <rect x="6" y="26" width="16" height="16" rx="2" fill="#E1AFD1" />
                          <rect x="26" y="26" width="16" height="16" rx="2" fill="#F6D0EA" />
                        </svg>
                      </div>

                      {/* Humming Bee */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 mb-1">Humming Bee</div>
                          <div className="flex gap-0.5 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                          </div>
                          <div className="text-xs text-gray-600">Anxiety & sleep</div>
                        </div>
                        <svg width="40" height="40" viewBox="0 0 48 48" style={{ border: '1px solid #999', borderRadius: '50%' }}>
                          <defs>
                            <radialGradient id="gradient-home-list-humming">
                              <stop offset="0%" stopColor="rgba(225, 175, 209, 1)" />
                              <stop offset="100%" stopColor="rgba(225, 175, 209, 0.3)" />
                            </radialGradient>
                          </defs>
                          <circle cx="24" cy="24" r="20" fill="url(#gradient-home-list-humming)" />
                          <line x1="20" y1="20" x2="20" y2="28" stroke="#7469B6" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="24" y1="17" x2="24" y2="31" stroke="#7469B6" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="28" y1="20" x2="28" y2="28" stroke="#7469B6" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>

                      {/* 4-7-8 Breathing */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 mb-1">4-7-8 Breathing</div>
                          <div className="flex gap-0.5 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                          </div>
                          <div className="text-xs text-gray-600">Sleep & relaxation</div>
                        </div>
                        <svg width="40" height="40" viewBox="0 0 48 48" style={{ border: '1px solid #999', borderRadius: '50%' }}>
                          <defs>
                            <radialGradient id="gradient-home-list-478">
                              <stop offset="0%" stopColor="rgba(116, 105, 187, 1)" />
                              <stop offset="50%" stopColor="rgba(116, 105, 187, 0.6)" />
                              <stop offset="100%" stopColor="rgba(116, 105, 187, 0.2)" />
                            </radialGradient>
                          </defs>
                          <circle cx="24" cy="24" r="20" fill="url(#gradient-home-list-478)" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-base font-semibold text-gray-900 text-center">1. Choose Exercise</p>
              </div>

              {/* 2. Info Screen - Box Breathing */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[280px] bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 mb-4">
                  <div className="aspect-[9/16] bg-white rounded-2xl overflow-hidden flex flex-col">
                    {/* Header with back button */}
                    <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-900">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span className="text-xs">Back</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-4 flex flex-col">
                      <h1 className="text-2xl font-bold text-gray-900 mb-3">Box Breathing</h1>

                      {/* Gradient Separator */}
                      <div className="w-full h-1 rounded-full mb-3" style={{ background: 'linear-gradient(to right, #7469B6, #AD88C6, #E1AFD1, #F6D0EA, #FFE6E6)' }}></div>

                      {/* Description */}
                      <div className="text-xs text-gray-900 leading-relaxed mb-2 line-clamp-3">
                        Box breathing is a simple, effective relaxation technique where you inhale for 4 counts, hold for 4, exhale for 4, and hold again for 4, creating a pattern to calm the nervous system...
                      </div>

                      {/* Show more button */}
                      <button className="flex items-center gap-1 mb-2 text-xs text-purple-600">
                        <span>Show more</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>

                      {/* 2x2 Info Grid */}
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center p-2 shadow-inner">
                          <svg className="w-5 h-5 mb-1 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-[9px] font-semibold text-gray-900">Tips</span>
                        </div>
                        <div className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center p-2 shadow-inner">
                          <svg className="w-5 h-5 mb-1 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          <span className="text-[9px] font-semibold text-gray-900">Preparation</span>
                        </div>
                        <div className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center p-2 shadow-inner">
                          <svg className="w-5 h-5 mb-1 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[9px] font-semibold text-gray-900">Try this when</span>
                        </div>
                        <div className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center p-2 shadow-inner">
                          <svg className="w-5 h-5 mb-1 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span className="text-[9px] font-semibold text-gray-900">Precautions</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <p className="text-base font-semibold text-gray-900 text-center">2. Learn About It</p>
              </div>

              {/* 3. Animation Screen */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[280px] bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 mb-4">
                  <div className="aspect-[9/16] bg-white rounded-2xl overflow-hidden flex flex-col items-center justify-center">
                    {/* Breathing Circle */}
                    <div className="relative w-48 h-48 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-pink-200 rounded-full opacity-40"></div>
                      <div className="absolute inset-3 bg-gradient-to-br from-purple-400 to-pink-300 rounded-full opacity-50"></div>
                      <div className="absolute inset-6 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full opacity-60"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-base font-medium text-gray-900">Breathe In</span>
                      </div>
                    </div>

                    {/* Timer */}
                    <div className="text-5xl font-bold text-gray-900 mb-8">4</div>

                    {/* Bottom Tab Bar */}
                    <div className="bg-white rounded-xl p-3 shadow-lg flex items-center justify-around" style={{ width: '220px', height: '70px' }}>
                      <div className="flex flex-col items-center gap-1">
                        <svg width="20" height="20" viewBox="0 0 118 118" fill="none">
                          <path d="M19.6667 24.5845L49.1667 24.5833" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                          <path d="M63.9167 24.5833H98.3334" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                          <path d="M78.6667 44.25V73.75" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                          <path d="M49.1667 9.83333V39.3333" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                          <path d="M59 78.6667V108.167" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                          <path d="M78.6667 59L98.3334 59.001" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                          <path d="M19.6667 59.001L63.9167 59" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                          <path d="M59 93.4167H98.3333" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                          <path d="M19.6667 93.4176L44.2501 93.4167" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                        </svg>
                        <span className="text-[9px] font-medium">Customize</span>
                      </div>
                      <div className="w-px h-10 bg-gray-200"></div>
                      <div className="flex flex-col items-center gap-1">
                        <svg width="20" height="20" viewBox="2 0 20 24" fill="none">
                          <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                          <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                        </svg>
                        <span className="text-[9px] font-medium">Pause</span>
                      </div>
                      <div className="w-px h-10 bg-gray-200"></div>
                      <div className="flex flex-col items-center gap-1">
                        <svg width="20" height="20" viewBox="-2 -2 22 22" fill="none">
                          <path d="M17.1884 9.09605C17.1884 8.98559 17.1884 8.87994 17.1836 8.76948C17.1355 7.29029 16.7513 5.89755 16.1078 4.67769C14.6382 1.88741 11.8287 0 8.59658 0C5.36446 0 2.55016 1.88741 1.08058 4.67769C0.437033 5.90235 0.0528329 7.29029 0.00480725 8.76948C4.69011e-06 8.87994 0 8.98559 0 9.09605V13.6201C0 15.6035 1.39754 17.2556 3.26574 17.6542C3.46744 17.8607 3.77482 18 4.12061 18C4.46639 18 4.77375 17.8655 4.97546 17.6542L4.98987 17.6398V9.60032H4.98506C4.78816 9.3842 4.47119 9.24013 4.1158 9.24013C3.76041 9.24013 3.44344 9.3842 3.24654 9.60032H3.24173C2.59819 9.73479 2.01228 10.0277 1.52242 10.4264C1.484 10.46 1.17182 10.7385 1.07577 10.8538V9.01441C1.07577 8.88474 1.18143 8.77428 1.3159 8.77428H1.32551H1.42155C1.58004 4.73052 4.73053 1.5032 8.58698 1.5032C12.4434 1.5032 15.5891 4.73052 15.7476 8.77428H15.8581C15.9925 8.77428 16.0982 8.88474 16.0982 9.01441V10.8538C16.0021 10.7385 15.8917 10.6281 15.7764 10.5368C15.7764 10.5368 15.69 10.46 15.6515 10.4264C15.1617 10.0277 14.5758 9.73959 13.9322 9.60032C13.7305 9.3842 13.4136 9.24013 13.0582 9.24013C12.7028 9.24013 12.3954 9.3746 12.1889 9.59552V17.6494C12.1889 17.6494 12.1937 17.6542 12.1985 17.6542C12.4002 17.8607 12.7124 18 13.0534 18C13.3943 18 13.7065 17.8655 13.9082 17.6542C15.7764 17.2556 17.174 15.6035 17.174 13.6201C17.174 13.3031 17.1355 12.9909 17.0683 12.6932C17.1355 12.9909 17.174 13.2983 17.174 13.6201V9.09605H17.1884Z" fill="currentColor"/>
                        </svg>
                        <span className="text-[9px] font-medium">Sound</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-base font-semibold text-gray-900 text-center">3. Practice</p>
              </div>

              {/* 4. Sound Bottom Sheet */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[280px] bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 mb-4">
                  <div className="aspect-[9/16] bg-white rounded-2xl overflow-hidden flex flex-col p-5">
                    {/* Sheet Handle */}
                    <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>

                    {/* Sound Options */}
                    <div className="space-y-2">
                      {/* No Music - Selected */}
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border-2 border-purple-400">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">No Music</div>
                          <div className="text-xs text-gray-600">Silent practice</div>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        </div>
                      </div>

                      {/* Nature Sounds */}
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">Nature Sounds</div>
                          <div className="text-xs text-gray-600">Forest ambience</div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      </div>

                      {/* Ambient Music */}
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">Ambient Music</div>
                          <div className="text-xs text-gray-600">Peaceful tones</div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      </div>

                      {/* Binaural Beats */}
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">Binaural Beats</div>
                          <div className="text-xs text-gray-600">Focus frequencies</div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      </div>

                      {/* Ocean Waves */}
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">Ocean Waves</div>
                          <div className="text-xs text-gray-600">Wave sounds</div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-base font-semibold text-gray-900 text-center">4. Choose Sound</p>
              </div>
            </div>
          </div>

          {/* Home Screen Preview */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {/* Home Screen Mock - Light Mode */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl transform -rotate-3 opacity-20"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Exercise Tiles - Light Mode with actual app icons */}
                      <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center" style={{ minHeight: '140px' }}>
                        <svg width="56" height="56" viewBox="0 0 48 48" style={{ border: '1px solid #999', borderRadius: '6px', marginBottom: '12px' }}>
                          <rect x="6" y="6" width="16" height="16" rx="2" fill="#7469B6" />
                          <rect x="26" y="6" width="16" height="16" rx="2" fill="#AD88C6" />
                          <rect x="6" y="26" width="16" height="16" rx="2" fill="#E1AFD1" />
                          <rect x="26" y="26" width="16" height="16" rx="2" fill="#F6D0EA" />
                        </svg>
                        <p className="text-gray-900 text-base font-semibold text-center">Box Breathing</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center" style={{ minHeight: '140px' }}>
                        <svg width="56" height="56" viewBox="0 0 48 48" style={{ border: '1px solid #999', borderRadius: '50%', marginBottom: '12px' }}>
                          <defs>
                            <radialGradient id="gradient-humming-marketing">
                              <stop offset="0%" stopColor="rgba(225, 175, 209, 1)" />
                              <stop offset="100%" stopColor="rgba(225, 175, 209, 0.3)" />
                            </radialGradient>
                          </defs>
                          <circle cx="24" cy="24" r="20" fill="url(#gradient-humming-marketing)" />
                          <line x1="20" y1="20" x2="20" y2="28" stroke="#7469B6" strokeWidth="2.5" opacity="1" strokeLinecap="round" />
                          <line x1="24" y1="17" x2="24" y2="31" stroke="#7469B6" strokeWidth="2.5" opacity="1" strokeLinecap="round" />
                          <line x1="28" y1="20" x2="28" y2="28" stroke="#7469B6" strokeWidth="2.5" opacity="1" strokeLinecap="round" />
                        </svg>
                        <p className="text-gray-900 text-base font-semibold text-center">Humming Bee</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center" style={{ minHeight: '140px' }}>
                        <svg width="56" height="56" viewBox="0 0 48 48" style={{ border: '1px solid #999', borderRadius: '50%', marginBottom: '12px' }}>
                          <defs>
                            <radialGradient id="gradient-478-marketing">
                              <stop offset="0%" stopColor="rgba(116, 105, 187, 1)" />
                              <stop offset="50%" stopColor="rgba(116, 105, 187, 0.6)" />
                              <stop offset="100%" stopColor="rgba(116, 105, 187, 0.2)" />
                            </radialGradient>
                          </defs>
                          <circle cx="24" cy="24" r="20" fill="url(#gradient-478-marketing)" />
                        </svg>
                        <p className="text-gray-900 text-base font-semibold text-center">4-7-8 Breathing</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center" style={{ minHeight: '140px' }}>
                        <svg width="56" height="56" viewBox="0 0 48 48" style={{ border: '1px solid #999', borderRadius: '50%', marginBottom: '12px' }}>
                          <defs>
                            <radialGradient id="gradient-coherent-marketing">
                              <stop offset="0%" stopColor="rgba(255, 230, 230, 0.8)" />
                              <stop offset="100%" stopColor="rgba(246, 208, 234, 1)" />
                            </radialGradient>
                          </defs>
                          <circle cx="24" cy="24" r="20" fill="url(#gradient-coherent-marketing)" />
                        </svg>
                        <p className="text-gray-900 text-base font-semibold text-center">Coherent Breathing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Choose a breathing technique</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Multiple breathing exercises tailored to your needs. From calming box breathing to energizing techniques.
                </p>
              </div>
            </div>
          </div>

          {/* Animation Screen Preview */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Guided Animation</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Visual animations guide your breathing rhythm. Follow along with smooth, calming animations.
                </p>
              </div>
              <div className="order-1 md:order-2">
                {/* Animation Screen Mock - Light Mode */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl transform rotate-3 opacity-20"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                    <div className="flex flex-col items-center justify-center">
                      {/* Breathing circle animation */}
                      <div className="relative w-48 h-48 mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
                        <div className="absolute inset-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                        <div className="absolute inset-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-900 text-lg font-medium">Breathe In</span>
                        </div>
                      </div>
                      {/* Tab bar - Light Mode */}
                      <div className="flex gap-0 bg-white rounded-2xl overflow-hidden border border-gray-200" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <div className="flex flex-col items-center justify-end p-3 gap-1 min-w-[80px]">
                          <svg width="24" height="24" viewBox="0 0 118 118" fill="none">
                            <path d="M19.6667 24.5845L49.1667 24.5833" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                            <path d="M63.9167 24.5833H98.3334" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                            <path d="M78.6667 44.25V73.75" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                            <path d="M49.1667 9.83333V39.3333" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round"/>
                          </svg>
                          <span className="text-black text-xs font-medium">Customize</span>
                        </div>
                        <div className="h-16 w-px bg-gray-200"></div>
                        <div className="flex flex-col items-center justify-end p-3 gap-1 min-w-[80px]">
                          <svg width="24" height="24" viewBox="2 0 20 24" fill="none">
                            <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                            <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                          </svg>
                          <span className="text-black text-xs font-medium">Pause</span>
                        </div>
                        <div className="h-16 w-px bg-gray-200"></div>
                        <div className="flex flex-col items-center justify-end p-3 gap-1 min-w-[80px]">
                          <svg width="24" height="24" viewBox="-2 -2 22 22" fill="none">
                            <path d="M17.1884 9.09605C17.1884 8.98559 17.1884 8.87994 17.1836 8.76948C17.1355 7.29029 16.7513 5.89755 16.1078 4.67769C14.6382 1.88741 11.8287 0 8.59658 0C5.36446 0 2.55016 1.88741 1.08058 4.67769C0.437033 5.90235 0.0528329 7.29029 0.00480725 8.76948C4.69011e-06 8.87994 0 8.98559 0 9.09605V13.6201C0 15.6035 1.39754 17.2556 3.26574 17.6542C3.46744 17.8607 3.77482 18 4.12061 18C4.46639 18 4.77375 17.8655 4.97546 17.6542L4.98987 17.6398V9.60032H4.98506C4.78816 9.3842 4.47119 9.24013 4.1158 9.24013C3.76041 9.24013 3.44344 9.3842 3.24654 9.60032H3.24173C2.59819 9.73479 2.01228 10.0277 1.52242 10.4264C1.484 10.46 1.17182 10.7385 1.07577 10.8538V9.01441C1.07577 8.88474 1.18143 8.77428 1.3159 8.77428H1.32551H1.42155C1.58004 4.73052 4.73053 1.5032 8.58698 1.5032C12.4434 1.5032 15.5891 4.73052 15.7476 8.77428H15.8581C15.9925 8.77428 16.0982 8.88474 16.0982 9.01441V10.8538C16.0021 10.7385 15.8917 10.6281 15.7764 10.5368C15.7764 10.5368 15.69 10.46 15.6515 10.4264C15.1617 10.0277 14.5758 9.73959 13.9322 9.60032C13.7305 9.3842 13.4136 9.24013 13.0582 9.24013C12.7028 9.24013 12.3954 9.3746 12.1889 9.59552V17.6494C12.1889 17.6494 12.1937 17.6542 12.1985 17.6542C12.4002 17.8607 12.7124 18 13.0534 18C13.3943 18 13.7065 17.8655 13.9082 17.6542C15.7764 17.2556 17.174 15.6035 17.174 13.6201C17.174 13.3031 17.1355 12.9909 17.0683 12.6932C17.1355 12.9909 17.174 13.2983 17.174 13.6201V9.09605H17.1884Z" fill="currentColor"/>
                          </svg>
                          <span className="text-black text-xs font-medium">Sound</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sound Options Preview */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {/* Sound Bottom Sheet Mock - Light Mode */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-400 rounded-3xl transform -rotate-3 opacity-20"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                    <div className="bg-gray-50 p-6 border-b border-gray-200">
                      <h4 className="text-xl font-bold text-gray-900 text-center">Background Sound</h4>
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="flex items-center gap-4 p-5 bg-purple-50 rounded-2xl border-2 border-purple-400">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">No Music</div>
                          <div className="text-sm text-gray-600">Silent practice</div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-5 bg-white hover:bg-gray-50 rounded-2xl transition-colors border border-gray-200">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Nature Sounds</div>
                          <div className="text-sm text-gray-600">Calming forest ambience</div>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                      </div>
                      <div className="flex items-center gap-4 p-5 bg-white hover:bg-gray-50 rounded-2xl transition-colors border border-gray-200">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Ambient Music</div>
                          <div className="text-sm text-gray-600">Peaceful background tones</div>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                      </div>
                      <div className="flex items-center gap-4 p-5 bg-white hover:bg-gray-50 rounded-2xl transition-colors border border-gray-200">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Binaural Beats</div>
                          <div className="text-sm text-gray-600">Focus-enhancing frequencies</div>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                      </div>
                      <div className="flex items-center gap-4 p-5 bg-white hover:bg-gray-50 rounded-2xl transition-colors border border-gray-200">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Ocean Waves</div>
                          <div className="text-sm text-gray-600">Gentle wave sounds</div>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Ambient Soundscapes</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Enhance your practice with carefully curated sounds. From nature to binaural beats, find what works for you.
                </p>
              </div>
            </div>
          </div>

          {/* Customization Screen Preview */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Adapt to Your Schedule</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Whether you have a minute or ten to spare, personalize your breathing technique to match your available time. Simply adjust the number of cycles to match a time frame.
                </p>
              </div>
              <div className="order-1 md:order-2">
                {/* Customization Screen Mock */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl transform rotate-3 opacity-20"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="text-center mb-6">
                        <h4 className="text-2xl font-bold text-gray-900">Personalize Your Experience</h4>
                      </div>

                      {/* Duration Selector */}
                      <div>
                        <label className="text-sm font-semibold text-gray-900 mb-3 block">Duration</label>
                        <div className="grid grid-cols-3 gap-3">
                          <button className="py-3 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-semibold hover:bg-gray-100 transition-colors">
                            1 min
                          </button>
                          <button className="py-3 px-4 bg-purple-50 border-2 border-purple-400 rounded-xl text-gray-900 font-semibold">
                            5 min
                          </button>
                          <button className="py-3 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-semibold hover:bg-gray-100 transition-colors">
                            10 min
                          </button>
                        </div>
                      </div>

                      {/* Cycles Slider */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-sm font-semibold text-gray-900">Number of Cycles</label>
                          <span className="text-lg font-bold text-[#AD88C6]">8</span>
                        </div>
                        <div className="relative pt-1">
                          <input
                            type="range"
                            min="1"
                            max="15"
                            value="8"
                            readOnly
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                            style={{
                              background: 'linear-gradient(to right, #AD88C6 0%, #AD88C6 50%, #e5e7eb 50%, #e5e7eb 100%)'
                            }}
                          />
                          <style jsx>{`
                            .slider-thumb::-webkit-slider-thumb {
                              appearance: none;
                              width: 20px;
                              height: 20px;
                              border-radius: 50%;
                              background: #AD88C6;
                              cursor: pointer;
                              border: 3px solid white;
                              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            }
                            .slider-thumb::-moz-range-thumb {
                              width: 20px;
                              height: 20px;
                              border-radius: 50%;
                              background: #AD88C6;
                              cursor: pointer;
                              border: 3px solid white;
                              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            }
                          `}</style>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-2">
                          <span>1</span>
                          <span>15</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-16">
            <div className="w-3 h-3 rounded-full bg-[#AD88C6]"></div>
            <h2 className="text-4xl font-bold text-center text-gray-900">
              Why Choose Hush?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Science-Based</h3>
              <p className="text-gray-600">
                Our breathing exercises are based on proven techniques used by therapists and wellness experts worldwide.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fully Customizable</h3>
              <p className="text-gray-600">
                Adjust timing, choose sounds, and personalize your experience to match your preferences and goals.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy First</h3>
              <p className="text-gray-600">
                Your practice is personal. We don't collect or share your breathing data. Your wellness, your privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/Hush-Logo.png" alt="Hush" style={{ height: '32px' }} />
          </div>
          <p className="mb-6 text-gray-600">Find your calm. Breathe better. Live better.</p>

          {/* Coming Soon Badges */}
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            <div className="bg-white rounded-lg px-6 py-3 border border-gray-200 shadow-md">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#1a1a1a">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-500">Coming Soon</div>
                  <div className="text-sm font-semibold text-gray-900">App Store</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg px-6 py-3 border border-gray-200 shadow-md">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#1a1a1a">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-500">Coming Soon</div>
                  <div className="text-sm font-semibold text-gray-900">Play Store</div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">© 2026 Hush. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </>
  );
}

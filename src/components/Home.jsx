import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex w-64 border-r border-gray-300 p-8 flex-col">
          <nav className="space-y-0">
            <div className="pb-6 border-b border-gray-300">
              <h2 className="text-lg font-semibold text-black">Menu</h2>
            </div>
            <button className="block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300">
              About Hum
            </button>
            <button className="block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300">
              Support the app
            </button>
            <button className="block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300">
              FAQs
            </button>
            <button className="block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300">
              Terms & Conditions
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-base text-black hover:opacity-70 transition-opacity pt-6"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMenuOpen(false)}>
            <div className="bg-white w-64 h-full p-8" onClick={(e) => e.stopPropagation()}>
              <nav className="space-y-0 mt-16">
                <div className="pb-6 border-b border-gray-300">
                  <h2 className="text-lg font-semibold text-black">Menu</h2>
                </div>
                <button className="block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300">
                  About Hum
                </button>
                <button className="block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300">
                  Support the app
                </button>
                <button className="block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300">
                  FAQs
                </button>
                <button className="block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300">
                  Terms & Conditions
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-base text-black hover:opacity-70 transition-opacity pt-6"
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row">
          {/* Left Half - Image Placeholder (50% of horizontal space on desktop, full width on mobile) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 border-t border-b border-gray-300">
            <div className="text-center">
              <svg className="w-32 h-32 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-gray-500">Image placeholder</p>
            </div>
          </div>

          {/* Right Half - Music Player + Cards Container (50% of horizontal space on desktop, full width on mobile) */}
          <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-6 px-4 lg:px-8 py-8 lg:py-12 border-t border-b border-gray-300 items-center justify-start">
            {/* Music Player - Responsive on mobile, iPhone 17 Pro Max Size on desktop */}
            <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 flex flex-col w-full" style={{ maxWidth: '100%' }}>
              {/* Album Art & Info */}
              <div className="mb-6">
                <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl text-black mb-1">Album Title</h3>
                <p className="text-sm text-gray-600">Artist Name</p>
              </div>

              {/* Track List */}
              <div className="flex-1 space-y-0 mb-6">
                {/* Track 1 */}
                <button className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-6">1</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-black">Track Name One</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">3:24</span>
                </button>

                {/* Track 2 - Currently Playing */}
                <button className="w-full flex items-center justify-between py-4 border-b border-gray-200 bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-medium text-black">Track Name Two</p>
                    </div>
                  </div>
                  <span className="text-sm text-black font-medium">2:51</span>
                </button>

                {/* Track 3 */}
                <button className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-6">3</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-black">Track Name Three</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">4:12</span>
                </button>
              </div>

              {/* Player Controls */}
              <div className="border-t border-gray-200 pt-4">
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-black h-1.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1:16</span>
                    <span>2:51</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <button className="p-2 hover:opacity-70 transition-opacity">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                  </button>
                  <button className="p-3 bg-black text-white rounded-full hover:opacity-90 transition-opacity">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  </button>
                  <button className="p-2 hover:opacity-70 transition-opacity">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 18h2V6h-2zm-11 0l8.5-6L5 6z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Cards Container - Right Side */}
            <div className="flex flex-col justify-center w-full lg:w-auto px-4 lg:px-12">
              {/* Header */}
              <h1 className="text-4xl lg:text-5xl font-bold text-black mb-8 whitespace-nowrap">Choose your path</h1>

              {/* Separator */}
              <div className="border-t border-gray-300 mb-0"></div>

              {/* Focus Option */}
              <button className="w-full py-6 lg:py-8 flex items-center justify-between border-b border-gray-300 hover:scale-105 transition-transform group">
                <div className="flex-1 text-left pl-4">
                  <h2 className="text-2xl lg:text-3xl font-semibold text-black mb-1">Focus</h2>
                  <p className="text-base lg:text-lg text-gray-700">Enhance concentration</p>
                </div>
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-black transition-transform group-hover:translate-x-2 flex-shrink-0 pr-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              {/* Calm Option */}
              <button className="w-full py-6 lg:py-8 flex items-center justify-between border-b border-gray-300 hover:scale-105 transition-transform group">
                <div className="flex-1 text-left pl-4">
                  <h2 className="text-2xl lg:text-3xl font-semibold text-black mb-1">Calm</h2>
                  <p className="text-base lg:text-lg text-gray-700">Relax and rejuvenate</p>
                </div>
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-black transition-transform group-hover:translate-x-2 flex-shrink-0 pr-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              {/* Breathe Option */}
              <button className="w-full py-6 lg:py-8 flex items-center justify-between border-b border-gray-300 hover:scale-105 transition-transform group">
                <div className="flex-1 text-left pl-4">
                  <h2 className="text-2xl lg:text-3xl font-semibold text-black mb-1">Breathe</h2>
                  <p className="text-base lg:text-lg text-gray-700">Reset your rhythm</p>
                </div>
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-black transition-transform group-hover:translate-x-2 flex-shrink-0 pr-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

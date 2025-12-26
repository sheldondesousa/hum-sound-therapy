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
        <main className="flex-1 flex flex-row">
          {/* Left Half - Image Placeholder (50% of horizontal space) */}
          <div className="w-1/2 flex items-center justify-center bg-gray-100 border-t border-b border-gray-300">
            <div className="text-center">
              <svg className="w-32 h-32 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-gray-500">Image placeholder</p>
            </div>
          </div>

          {/* Right Half - Music Player + Cards Container (50% of horizontal space) */}
          <div className="w-1/2 flex flex-col justify-end px-4 lg:px-12 py-8 lg:py-12 border-t border-b border-gray-300 gap-6">
            {/* Music Player Placeholder */}
            <div className="bg-white border-2 border-gray-300 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-black">Track Title</h3>
                  <p className="text-sm text-gray-600">Artist Name</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-black h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1:23</span>
                  <span>3:45</span>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-4">
                <button className="p-2 hover:opacity-70 transition-opacity">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                  </svg>
                </button>
                <button className="p-3 bg-black text-white rounded-full hover:opacity-90 transition-opacity">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                <button className="p-2 hover:opacity-70 transition-opacity">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 18h2V6h-2zm-11 0l8.5-6L5 6z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 gap-4 max-w-sm w-full">
              {/* Focus Card */}
              <button className="relative aspect-[3/4] max-h-64 rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] group" style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #FFA06B 50%, #FFD700 100%)' }}>
                {/* Geometric Shapes Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="absolute w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
                    <rect x="0" y="0" width="150" height="150" fill="white" opacity="0.3"/>
                    <rect x="250" y="50" width="120" height="120" fill="white" opacity="0.2"/>
                    <circle cx="200" cy="400" r="100" fill="white" opacity="0.25"/>
                    <rect x="150" y="200" width="130" height="130" fill="white" opacity="0.15" transform="rotate(45 215 265)"/>
                  </svg>
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                  <div className="mb-4">
                    <svg className="w-16 lg:w-20 h-16 lg:h-20" viewBox="0 0 80 80" fill="black">
                      <circle cx="40" cy="40" r="12" fill="black"/>
                      <path d="M40 8 C40 8, 25 25, 25 40 C25 55, 40 72, 40 72 C40 72, 55 55, 55 40 C55 25, 40 8, 40 8" fill="none" stroke="black" strokeWidth="3"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-semibold text-black mb-1" style={{ fontFamily: 'Roboto Serif, serif' }}>Focus</h2>
                  <p className="text-sm lg:text-base text-black">Enhance concentration</p>
                </div>
              </button>

              {/* Calm Card */}
              <button className="relative aspect-[3/4] max-h-64 rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] group" style={{ background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 50%, #43E97B 100%)' }}>
                {/* Geometric Shapes Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="absolute w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
                    <rect x="30" y="80" width="140" height="140" fill="white" opacity="0.25"/>
                    <rect x="230" y="30" width="110" height="110" fill="white" opacity="0.3"/>
                    <circle cx="100" cy="450" r="90" fill="white" opacity="0.2"/>
                    <rect x="180" y="250" width="120" height="120" fill="white" opacity="0.15" transform="rotate(30 240 310)"/>
                  </svg>
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                  <div className="mb-4">
                    <svg className="w-16 lg:w-20 h-16 lg:h-20" viewBox="0 0 80 80" fill="black">
                      <path d="M20 50 Q20 30, 30 25 Q35 22, 40 30 Q45 22, 50 25 Q60 30, 60 50" fill="black"/>
                      <path d="M25 60 Q25 45, 32 42 Q36 40, 40 46 Q44 40, 48 42 Q55 45, 55 60" fill="black"/>
                      <path d="M30 70 Q30 58, 36 56 Q39 55, 40 59 Q41 55, 44 56 Q50 58, 50 70" fill="black"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-semibold text-black mb-1" style={{ fontFamily: 'Roboto Serif, serif' }}>Calm</h2>
                  <p className="text-sm lg:text-base text-black">Relax and rejuvenate</p>
                </div>
              </button>

              {/* Breathe Card */}
              <button className="relative aspect-[3/4] max-h-64 rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] group" style={{ background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #4C1D95 100%)' }}>
                {/* Geometric Shapes Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="absolute w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
                    <rect x="50" y="50" width="140" height="140" fill="white" opacity="0.25"/>
                    <rect x="240" y="100" width="100" height="100" fill="white" opacity="0.3"/>
                    <circle cx="300" cy="400" r="95" fill="white" opacity="0.2"/>
                    <rect x="160" y="280" width="115" height="115" fill="white" opacity="0.15" transform="rotate(20 217 337)"/>
                  </svg>
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                  <div className="mb-4">
                    <svg className="w-16 lg:w-20 h-16 lg:h-20" viewBox="0 0 80 80" fill="black">
                      <circle cx="40" cy="40" r="3" fill="black"/>
                      {/* Radiating lines */}
                      <line x1="40" y1="10" x2="40" y2="25" stroke="black" strokeWidth="2.5"/>
                      <line x1="40" y1="70" x2="40" y2="55" stroke="black" strokeWidth="2.5"/>
                      <line x1="10" y1="40" x2="25" y2="40" stroke="black" strokeWidth="2.5"/>
                      <line x1="70" y1="40" x2="55" y2="40" stroke="black" strokeWidth="2.5"/>
                      <line x1="18" y1="18" x2="28" y2="28" stroke="black" strokeWidth="2.5"/>
                      <line x1="62" y1="62" x2="52" y2="52" stroke="black" strokeWidth="2.5"/>
                      <line x1="62" y1="18" x2="52" y2="28" stroke="black" strokeWidth="2.5"/>
                      <line x1="18" y1="62" x2="28" y2="52" stroke="black" strokeWidth="2.5"/>
                      <line x1="40" y1="15" x2="40" y2="20" stroke="black" strokeWidth="2"/>
                      <line x1="40" y1="65" x2="40" y2="60" stroke="black" strokeWidth="2"/>
                      <line x1="15" y1="40" x2="20" y2="40" stroke="black" strokeWidth="2"/>
                      <line x1="65" y1="40" x2="60" y2="40" stroke="black" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-semibold text-black mb-1" style={{ fontFamily: 'Roboto Serif, serif' }}>Breathe</h2>
                  <p className="text-sm lg:text-base text-black">Build a rhythm</p>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

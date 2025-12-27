import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Track data for each option
  const tracksByOption = {
    focus: [
      { id: 1, name: 'Deep Concentration', duration: '8:24' },
      { id: 2, name: 'Mental Clarity', duration: '6:15' },
      { id: 3, name: 'Flow State', duration: '7:48' }
    ],
    calm: [
      { id: 4, name: 'Peaceful Mind', duration: '9:12' },
      { id: 5, name: 'Inner Stillness', duration: '7:30' },
      { id: 6, name: 'Gentle Waves', duration: '8:05' }
    ],
    breathe: [
      { id: 7, name: 'Rhythmic Breathing', duration: '5:40' },
      { id: 8, name: 'Deep Relaxation', duration: '6:55' },
      { id: 9, name: 'Centered Balance', duration: '7:20' }
    ]
  };

  const currentTracks = selectedOption ? tracksByOption[selectedOption] : [];

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
      <style>{`
        @media (min-width: 1024px) {
          .music-player-desktop {
            width: 430px !important;
            height: 932px !important;
          }
        }
      `}</style>
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
        <main className="flex-1 flex items-center justify-center p-8 lg:p-16">
          {/* Centered Container - Tiles + Music Player */}
          <div className="flex flex-col lg:flex-row gap-9 lg:gap-12 items-center justify-center max-w-7xl">
            {/* Cards Container */}
            <div className="flex flex-col justify-center w-full lg:w-auto" style={{ minWidth: '340px', maxWidth: '493px' }}>
              {/* Header */}
              <h1 className="text-3xl lg:text-4xl font-bold text-black mb-8 whitespace-nowrap">Choose your path</h1>

              {/* Separator */}
              <div className="border-t border-gray-300 mb-0"></div>

              {/* Focus Option */}
              <button
                onClick={() => setSelectedOption('focus')}
                className={`w-full py-6 lg:py-8 flex items-center justify-between border-b border-gray-300 hover:scale-105 transition-all group ${
                  selectedOption === 'focus' ? 'bg-black' : ''
                }`}
              >
                <div className="flex-1 text-left pl-4">
                  <h2 className={`text-xl lg:text-2xl font-semibold mb-1 ${
                    selectedOption === 'focus' ? 'text-white' : 'text-black'
                  }`}>Focus</h2>
                  <p className={`text-sm lg:text-base ${
                    selectedOption === 'focus' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Enhance concentration</p>
                </div>
                <svg className={`w-8 h-8 lg:w-9 lg:h-9 transition-transform group-hover:translate-x-2 flex-shrink-0 pr-4 ${
                  selectedOption === 'focus' ? 'text-white' : 'text-black'
                }`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              {/* Calm Option */}
              <button
                onClick={() => setSelectedOption('calm')}
                className={`w-full py-6 lg:py-8 flex items-center justify-between border-b border-gray-300 hover:scale-105 transition-all group ${
                  selectedOption === 'calm' ? 'bg-black' : ''
                }`}
              >
                <div className="flex-1 text-left pl-4">
                  <h2 className={`text-xl lg:text-2xl font-semibold mb-1 ${
                    selectedOption === 'calm' ? 'text-white' : 'text-black'
                  }`}>Calm</h2>
                  <p className={`text-sm lg:text-base ${
                    selectedOption === 'calm' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Relax and rejuvenate</p>
                </div>
                <svg className={`w-8 h-8 lg:w-9 lg:h-9 transition-transform group-hover:translate-x-2 flex-shrink-0 pr-4 ${
                  selectedOption === 'calm' ? 'text-white' : 'text-black'
                }`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              {/* Breathe Option */}
              <button
                onClick={() => setSelectedOption('breathe')}
                className={`w-full py-6 lg:py-8 flex items-center justify-between border-b border-gray-300 hover:scale-105 transition-all group ${
                  selectedOption === 'breathe' ? 'bg-black' : ''
                }`}
              >
                <div className="flex-1 text-left pl-4">
                  <h2 className={`text-xl lg:text-2xl font-semibold mb-1 ${
                    selectedOption === 'breathe' ? 'text-white' : 'text-black'
                  }`}>Breathe</h2>
                  <p className={`text-sm lg:text-base ${
                    selectedOption === 'breathe' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Reset your rhythm</p>
                </div>
                <svg className={`w-8 h-8 lg:w-9 lg:h-9 transition-transform group-hover:translate-x-2 flex-shrink-0 pr-4 ${
                  selectedOption === 'breathe' ? 'text-white' : 'text-black'
                }`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            {/* Music Player - iPhone 17 Pro Max dimensions on desktop */}
            <div className="music-player-desktop bg-white border-2 border-gray-300 rounded-2xl p-6 flex flex-col w-full lg:flex-shrink-0">
              {/* Album Art & Info */}
              <div className="mb-6">
                <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl text-black mb-1 capitalize">
                  {selectedOption ? `${selectedOption} Collection` : 'Select Your Path'}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedOption ? '3 Tracks' : 'Choose Focus, Calm, or Breathe'}
                </p>
              </div>

              {/* Track List */}
              <div className="flex-1 space-y-0 mb-6">
                {!selectedOption ? (
                  <div className="flex items-center justify-center py-12 text-center">
                    <p className="text-gray-400 text-sm">Select Focus, Calm, or Breathe to see tracks</p>
                  </div>
                ) : (
                  currentTracks.map((track, index) => (
                    <button
                      key={track.id}
                      className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 hover:opacity-70 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-6">{index + 1}</span>
                        <div className="text-left">
                          <p className="text-sm font-medium text-black">{track.name}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{track.duration}</span>
                    </button>
                  ))
                )}
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
          </div>
        </main>
      </div>
    </div>
  );
}

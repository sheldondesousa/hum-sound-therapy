import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isExercising, setIsExercising] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold1, exhale, hold2
  const [timer, setTimer] = useState(1);
  const [selectedCycles, setSelectedCycles] = useState(4);
  const [currentCycle, setCurrentCycle] = useState(0);

  // Breathing animation cycle effect
  useEffect(() => {
    if (!isExercising) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        // Handle phase transitions and timer logic
        // INHALE: 1-2-3-4 (increment)
        if (breathingPhase === 'inhale') {
          if (prevTimer < 4) {
            return prevTimer + 1;
          } else {
            setBreathingPhase('hold1');
            return 4;
          }
        // HOLD: 4-3-2-1 (decrement)
        } else if (breathingPhase === 'hold1') {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            setBreathingPhase('exhale');
            return 1;
          }
        // EXHALE: 1-2-3-4 (increment)
        } else if (breathingPhase === 'exhale') {
          if (prevTimer < 4) {
            return prevTimer + 1;
          } else {
            setBreathingPhase('hold2');
            return 4;
          }
        // HOLD: 4-3-2-1 (decrement)
        } else if (breathingPhase === 'hold2') {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            // Cycle completed, check if we should continue
            const nextCycle = currentCycle + 1;
            if (nextCycle >= selectedCycles) {
              // Reached target cycles, stop the exercise
              setIsExercising(false);
              setCurrentCycle(0);
              setBreathingPhase('inhale');
              return 1;
            } else {
              // Continue to next cycle
              setCurrentCycle(nextCycle);
              setBreathingPhase('inhale');
              return 1;
            }
          }
        }
        return prevTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isExercising, breathingPhase, currentCycle, selectedCycles]);

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
      { id: 7, name: 'Box Breathing (4-4-4-4)', duration: '5:00' },
      { id: 8, name: '4-7-8 Breathing', duration: '4:30' },
      { id: 9, name: 'Coherent breathing (5-5)', duration: '6:00' },
      { id: 10, name: 'Physiological Sigh', duration: '3:45' }
    ]
  };

  const currentTracks = selectedOption ? tracksByOption[selectedOption] : [];

  // Get circle color based on breathing phase and timer
  const getCircleColor = () => {
    // Base color: #067AC3 with transparency changes
    // Start with darkest (100% opacity) as default, get lighter with each increment
    // 25% increments for better visual difference
    // Timer 1: 100% opacity (darkest - default)
    // Timer 2: 75% opacity (25% lighter)
    // Timer 3: 50% opacity (25% lighter)
    // Timer 4: 25% opacity (25% lighter - lightest)
    const colors = {
      1: 'rgba(6, 122, 195, 1.0)',
      2: 'rgba(6, 122, 195, 0.75)',
      3: 'rgba(6, 122, 195, 0.50)',
      4: 'rgba(6, 122, 195, 0.25)'
    };

    if (breathingPhase === 'inhale' || breathingPhase === 'exhale') {
      // Increment: gets lighter
      return colors[timer];
    } else {
      // HOLD: Decrement - reverse to become darker
      return colors[5 - timer];
    }
  };

  // Get circle size based on breathing phase and timer
  const getCircleSize = () => {
    // First circle reduced by 30% from original 262px
    // Each subsequent circle builds on previous with no gaps (adds 40px for 20px border on each side)
    // Timer 1: 183px (base - 30% reduction)
    // Timer 2: 223px (builds on previous + 40px)
    // Timer 3: 263px (builds on previous + 40px)
    // Timer 4: 303px (builds on previous + 40px)
    const sizes = {
      1: 183,
      2: 223,
      3: 263,
      4: 303
    };

    if (breathingPhase === 'inhale' || breathingPhase === 'exhale') {
      // Increment: grows larger
      return sizes[timer];
    } else {
      // Decrement: shrinks smaller (reverse the sizes)
      return sizes[5 - timer];
    }
  };

  // Get number of circles to display based on phase and timer
  const getVisibleCircleCount = () => {
    if (breathingPhase === 'inhale') {
      return timer; // INHALE: Show 1, 2, 3, 4 circles (small to big)
    } else if (breathingPhase === 'hold1') {
      return 4; // HOLD after INHALE: Keep all 4 circles expanded
    } else if (breathingPhase === 'exhale') {
      return 5 - timer; // EXHALE: Show 4, 3, 2, 1 circles (big to small)
    } else if (breathingPhase === 'hold2') {
      return 1; // HOLD after EXHALE: Keep 1 circle (smallest)
    }
    return timer;
  };

  // Get data for all circles to render
  const getCirclesData = () => {
    const circleCount = getVisibleCircleCount();
    const sizes = [183, 223, 263, 303];  // Each builds on previous with no gaps
    const colors = [
      'rgba(6, 122, 195, 1.0)',   // 100% opacity (darkest - innermost)
      'rgba(6, 122, 195, 0.75)',  // 75% opacity (25% lighter)
      'rgba(6, 122, 195, 0.50)',  // 50% opacity (25% lighter)
      'rgba(6, 122, 195, 0.25)'   // 25% opacity (25% lighter - lightest - outermost)
    ];
    const blurs = [20, 22, 24, 26];  // 10% blur increase per circle (20, 20*1.1, 20*1.2, 20*1.3)

    const circles = [];
    for (let i = 0; i < circleCount; i++) {
      circles.push({
        size: sizes[i],
        color: colors[i],
        blur: blurs[i],
        key: i
      });
    }

    // Render from largest to smallest so all rings are visible
    return circles.reverse();
  };

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
        @keyframes subtlePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }
        .pulse-hold {
          animation: subtlePulse 2s ease-in-out infinite;
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
              <h1 className="text-3xl lg:text-4xl font-bold text-black mb-8 whitespace-nowrap pl-4">Choose your path</h1>

              {/* Separator */}
              <div className="border-t border-gray-300 mb-0"></div>

              {/* Focus Option */}
              <button
                onClick={() => {
                  setSelectedOption('focus');
                  setSelectedExercise(null);
                }}
                className={`w-full py-3 lg:py-4 flex items-center justify-between border-b border-gray-300 hover:scale-105 transition-all group ${
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
                onClick={() => {
                  setSelectedOption('calm');
                  setSelectedExercise(null);
                }}
                className={`w-full py-3 lg:py-4 flex items-center justify-between border-b border-gray-300 hover:scale-105 transition-all group ${
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
                onClick={() => {
                  setSelectedOption('breathe');
                  setSelectedExercise(null);
                }}
                className={`w-full py-3 lg:py-4 flex items-center justify-between border-b border-gray-300 hover:scale-105 transition-all group ${
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
              {/* Album Art & Info - Hide when breathing exercise is selected */}
              {!(selectedOption === 'breathe' && selectedExercise) && (
                <div className="mb-6">
                  <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-xl text-black mb-1 capitalize">
                    {selectedOption === 'breathe' ? 'Breathing Techniques' : selectedOption ? `${selectedOption} Collection` : 'Select Your Path'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedOption === 'breathe'
                      ? `${currentTracks.length} Exercise${currentTracks.length !== 1 ? 's' : ''}`
                      : selectedOption
                      ? `${currentTracks.length} Track${currentTracks.length !== 1 ? 's' : ''}`
                      : 'Choose Focus, Calm, or Breathe'}
                  </p>
                </div>
              )}

              {/* Track List or Exercise Detail View */}
              <div className={`flex-1 ${selectedOption === 'breathe' && selectedExercise ? 'flex' : 'space-y-0 mb-6'}`}>
                {!selectedOption ? (
                  <div className="flex items-center justify-center py-12 text-center">
                    <p className="text-gray-400 text-sm">Select Focus, Calm, or Breathe to see tracks</p>
                  </div>
                ) : selectedOption === 'breathe' && selectedExercise ? (
                  /* Breathing Exercise Detail View */
                  <div className="flex flex-col h-full w-full">
                    {/* Header - 10% */}
                    <div className="flex-[0.1] flex items-center justify-between px-2">
                      <button
                        onClick={() => setSelectedExercise(null)}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span>Back</span>
                      </button>

                      <h3 className="text-base font-semibold text-black text-center flex-1 px-4">{selectedExercise.name}</h3>

                      {/* Spacer to balance layout */}
                      <div className="w-14"></div>
                    </div>

                    {/* Exercise Image/Animation Area - 80% */}
                    <div className="flex-[0.8] bg-white rounded-lg flex flex-col items-center justify-center my-3 p-4">
                      {/* Conditional Animation based on exercise */}
                      {selectedExercise?.name === 'Box Breathing (4-4-4-4)' ? (
                        <>
                          {/* Breathing Circle Illustration - Box Breathing Only */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Timeline Progress Ring - Shows during HOLD phases */}
                            {(breathingPhase === 'hold1' || breathingPhase === 'hold2') && (
                              <svg
                                className="absolute"
                                width="363"
                                height="363"
                                style={{ transform: 'rotate(-90deg)' }}
                              >
                                {/* Background circle */}
                                <circle
                                  cx="181.5"
                                  cy="181.5"
                                  r="175"
                                  fill="none"
                                  stroke="#E5E7EB"
                                  strokeWidth="4"
                                />
                                {/* Progress circle */}
                                <circle
                                  cx="181.5"
                                  cy="181.5"
                                  r="175"
                                  fill="none"
                                  stroke="#067AC3"
                                  strokeWidth="4"
                                  strokeDasharray="1100"
                                  strokeDashoffset={1100 - (1100 * (5 - timer) / 4)}
                                  className="transition-all duration-1000"
                                  strokeLinecap="round"
                                />
                              </svg>
                            )}

                            {getCirclesData().map((circle) => (
                              <div
                                key={circle.key}
                                className="rounded-full transition-all duration-1000 ease-in-out absolute"
                                style={{
                                  width: `${circle.size}px`,
                                  height: `${circle.size}px`,
                                  border: `20px solid ${circle.color}`,
                                  backgroundColor: 'transparent',
                                  boxShadow: `0 0 ${circle.blur}px ${circle.color}`
                                }}
                              />
                            ))}

                            {/* Timer Display - Inside First Circle */}
                            <div className="absolute text-center">
                              <div
                                className={`text-lg font-semibold text-gray-700 uppercase tracking-wider mb-2 ${
                                  (breathingPhase === 'hold1' || breathingPhase === 'hold2') ? 'pulse-hold' : ''
                                }`}
                              >
                                {breathingPhase === 'inhale' && 'INHALE'}
                                {breathingPhase === 'hold1' && 'HOLD'}
                                {breathingPhase === 'exhale' && 'EXHALE'}
                                {breathingPhase === 'hold2' && 'HOLD'}
                              </div>
                              {/* Show timer only during INHALE and EXHALE */}
                              {(breathingPhase === 'inhale' || breathingPhase === 'exhale') && (
                                <div className="text-5xl font-bold text-gray-900">
                                  {timer}
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Placeholder for other breathing exercises */
                        <div className="flex-1 flex items-center justify-center w-full">
                          <div className="text-center">
                            <p className="text-gray-400 text-lg">Animation for</p>
                            <p className="text-gray-600 text-xl font-semibold mt-2">{selectedExercise?.name}</p>
                            <p className="text-gray-400 text-sm mt-4">Coming soon</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Section - Cycle Display and Navigation */}
                    <div className="flex-[0.1] flex flex-col">
                      {/* Cycle Display Area - Centered with equal spacing */}
                      <div className="flex-1 flex flex-col items-center justify-center">
                        {/* Progress Display - Show during exercise */}
                        {isExercising && (
                          <div className="text-center">
                            <span className="text-sm text-gray-600 font-medium">
                              Cycle {currentCycle + 1} of {selectedCycles}
                            </span>
                          </div>
                        )}

                        {/* Cycle Selection - Only show when not exercising */}
                        {!isExercising && (
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-sm text-gray-600 font-medium">Select Cycles</span>
                            <div className="flex gap-3">
                              {[4, 8, 12].map((cycles) => (
                                <button
                                  key={cycles}
                                  onClick={() => setSelectedCycles(cycles)}
                                  className={`w-12 h-12 rounded-full text-base font-bold transition-all ${
                                    selectedCycles === cycles
                                      ? 'bg-black text-white shadow-lg'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  }`}
                                >
                                  {cycles}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Navigation Buttons - At the bottom */}
                      <div className="flex items-center justify-between px-4 pb-4">
                      <button
                        onClick={() => {
                          const currentIndex = currentTracks.findIndex(t => t.id === selectedExercise.id);
                          const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentTracks.length - 1;
                          setSelectedExercise(currentTracks[prevIndex]);
                        }}
                        className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span className="text-xs text-gray-700 font-medium">Previous</span>
                      </button>

                      {/* Start Button */}
                      <button
                        onClick={() => {
                          if (!isExercising) {
                            setIsExercising(true);
                            setBreathingPhase('inhale');
                            setTimer(1);
                            setCurrentCycle(0);
                          } else {
                            setIsExercising(false);
                            setBreathingPhase('inhale');
                            setTimer(1);
                            setCurrentCycle(0);
                          }
                        }}
                        className="px-8 py-2 bg-black text-white rounded-full hover:opacity-90 transition-opacity font-medium text-sm"
                      >
                        {isExercising ? 'Stop' : 'Start'}
                      </button>

                      <button
                        onClick={() => {
                          const currentIndex = currentTracks.findIndex(t => t.id === selectedExercise.id);
                          const nextIndex = currentIndex < currentTracks.length - 1 ? currentIndex + 1 : 0;
                          setSelectedExercise(currentTracks[nextIndex]);
                        }}
                        className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                        </svg>
                        <span className="text-xs text-gray-700 font-medium">Next</span>
                      </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Track List */
                  currentTracks.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => {
                        if (selectedOption === 'breathe') {
                          setSelectedExercise(track);
                        }
                      }}
                      className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 hover:opacity-70 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-6">{index + 1}</span>
                        <div className="text-left">
                          <p className="text-sm font-medium text-black">{track.name}</p>
                        </div>
                      </div>
                      {selectedOption !== 'breathe' && (
                        <span className="text-sm text-gray-500">{track.duration}</span>
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Player Controls */}
              {selectedOption !== 'breathe' && (
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
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

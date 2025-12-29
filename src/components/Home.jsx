import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Exercise content data
  const exerciseContent = {
    'Box Breathing (4-4-4-4)': {
      description: 'Box breathing (4-4-4-4) is a simple, effective relaxation technique where you inhale for 4 counts, hold for 4, exhale for 4, and hold again for 4, creating a pattern to calm the nervous system, reduce stress, and improve focus for important moments.',
      sectionTitle: 'Why it works',
      sectionContent: [
        { label: 'Calms your nervous system:', text: 'Activates the parasympathetic (rest-and-digest) system, counteracting the fight-or-flight response.' },
        { label: 'Reduces stress & anxiety:', text: 'Helps lower heart rate and blood pressure, bringing a sense of calm.' },
        { label: 'Improves focus:', text: 'Enhances concentration, making it great for high-pressure situations like presentations or exams.' }
      ]
    },
    '4-7-8 Breathing': {
      description: 'The 4-7-8 breathing technique, also known as the "Relaxing Breath," is a rhythmic breathing pattern developed by Dr. Andrew Weil. Rooted in the ancient yogic practice of pranayama, it acts as a "natural tranquilizer" for the nervous system by activating the parasympathetic response.',
      sectionTitle: 'Tips',
      sectionContent: [
        { label: '', text: 'Breathe in normally through your nose.' },
        { label: 'Position your tongue:', text: 'Place the tip of your tongue against the ridge of tissue just behind your upper front teeth and keep it there throughout the entire exercise.' },
        { label: 'Create sound:', text: 'Exhale completely through your mouth, making an audible "whoosh" sound as you release the air.' }
      ]
    },
    'Coherent breathing (5-5)': {
      description: 'Coherent breathing (or resonance breathing) is a slow, rhythmic breathing technique, typically inhaling for 6 seconds and exhaling for 6 seconds (5-6 breaths per minute), designed to sync your heart rate with your breath for optimal nervous system balance, reducing stress and anxiety while promoting calm and focus by activating the vagus nerve.',
      sectionTitle: 'How it works',
      sectionContent: [
        { label: 'Find Your Rhythm:', text: 'Aim for about 5-6 breaths per minute, meaning roughly 6 seconds to inhale and 6 seconds to exhale.' },
        { label: 'Breathe Through Your Nose:', text: 'Inhale and exhale gently and silently through your nose.' },
        { label: 'Engage Your Diaphragm:', text: 'Focus on your belly gently expanding on the inhale and contracting on the exhale, rather than your upper chest.' },
        { label: 'Relax:', text: 'Release tension in your face, neck, shoulders, and body.' },
        { label: 'Focus on the Sensation:', text: 'Acknowledge stray thoughts and return your attention to the feeling of your breath.' }
      ]
    }
  };
  const [showingInfo, setShowingInfo] = useState(false); // Track if showing info screen
  const [countdown, setCountdown] = useState(null); // Track countdown: 3, 2, 1, or null
  const [isExercising, setIsExercising] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Track if user manually paused
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold1, exhale, hold2
  const [timer, setTimer] = useState(0);
  const [selectedCycles, setSelectedCycles] = useState(4);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [showTipsSheet, setShowTipsSheet] = useState(false); // Track tips bottom sheet visibility

  // Auto-start countdown when exercise view loads
  useEffect(() => {
    if (selectedOption === 'breathe' && selectedExercise && !showingInfo && countdown === null && !isExercising) {
      setCountdown(3);
    }
  }, [showingInfo, selectedExercise, selectedOption, countdown, isExercising]);

  // Countdown effect
  useEffect(() => {
    if (countdown === null || isPaused) return;

    if (countdown === 0) {
      // Countdown finished, start exercise
      setCountdown(null);
      setIsExercising(true);
      setIsPaused(false);
      setBreathingPhase('inhale');
      setTimer(0);
      setCurrentCycle(0);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isPaused]);

  // Breathing animation cycle effect
  useEffect(() => {
    if (!isExercising || isPaused) return;

    // Exercise-specific timing configurations
    const is478 = selectedExercise?.name === '4-7-8 Breathing';

    // Dynamic interval based on breathing phase and exercise type
    let intervalDuration;
    if (is478) {
      // 4-7-8: INHALE=4s (5 counts, 800ms), HOLD=7s (7 counts, 1000ms), EXHALE=8s (8 counts, 1000ms)
      if (breathingPhase === 'inhale') intervalDuration = 800; // 5 counts * 800ms = 4s
      else if (breathingPhase === 'hold1') intervalDuration = 1000; // 7 counts * 1000ms = 7s
      else if (breathingPhase === 'exhale') intervalDuration = 1000; // 8 counts * 1000ms = 8s
      else intervalDuration = 1000;
    } else {
      // Box breathing: all phases use same interval pattern
      // INHALE and EXHALE: 5 counts (0-4) over 4 seconds = 800ms per count
      // HOLD1 and HOLD2: 4 counts (1-4) over 4 seconds = 1000ms per count
      intervalDuration = (breathingPhase === 'inhale' || breathingPhase === 'exhale') ? 800 : 1000;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        // Handle phase transitions and timer logic based on exercise type
        if (is478) {
          // 4-7-8 Breathing pattern
          if (breathingPhase === 'inhale') {
            // INHALE: 0-1-2-3-4 (5 counts over 4s)
            if (prevTimer < 4) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('hold1');
              return 0; // Start HOLD1 at 0
            }
          } else if (breathingPhase === 'hold1') {
            // HOLD: 0-1-2-3-4-5-6 (7 counts over 7s)
            if (prevTimer < 6) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('exhale');
              return 7; // Start EXHALE at 7
            }
          } else if (breathingPhase === 'exhale') {
            // EXHALE: 7-6-5-4-3-2-1-0 (8 counts over 8s, descending)
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              // Cycle completed, check if we should continue
              const nextCycle = currentCycle + 1;
              if (nextCycle >= selectedCycles) {
                // Reached target cycles, stop the exercise
                setIsExercising(false);
                setCurrentCycle(0);
                setBreathingPhase('inhale');
                return 0;
              } else {
                // Continue to next cycle
                setCurrentCycle(nextCycle);
                setBreathingPhase('inhale');
                return 0;
              }
            }
          }
        } else {
          // Box Breathing pattern (4-4-4-4)
          if (breathingPhase === 'inhale') {
            // INHALE: 0-1-2-3-4 (5 counts over 4s)
            if (prevTimer < 4) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('hold1');
              return 1; // Start HOLD1 at 1
            }
          } else if (breathingPhase === 'hold1') {
            // HOLD1: 1-2-3-4 (4 counts over 4s)
            if (prevTimer < 4) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('exhale');
              return 4; // Start EXHALE at 4
            }
          } else if (breathingPhase === 'exhale') {
            // EXHALE: 4-3-2-1-0 (5 counts over 4s)
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              setBreathingPhase('hold2');
              return 1; // Start HOLD2 at 1
            }
          } else if (breathingPhase === 'hold2') {
            // HOLD2: 1-2-3-4 (4 counts over 4s)
            if (prevTimer < 4) {
              return prevTimer + 1;
            } else {
              // Cycle completed, check if we should continue
              const nextCycle = currentCycle + 1;
              if (nextCycle >= selectedCycles) {
                // Reached target cycles, stop the exercise
                setIsExercising(false);
                setCurrentCycle(0);
                setBreathingPhase('inhale');
                return 0;
              } else {
                // Continue to next cycle
                setCurrentCycle(nextCycle);
                setBreathingPhase('inhale');
                return 0;
              }
            }
          }
        }
        return prevTimer;
      });
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [isExercising, isPaused, breathingPhase, currentCycle, selectedCycles, selectedExercise]);

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
    // Timer 0-4: 5 values with enhanced gradient (15% larger differences)
    // Timer 0: 100% opacity (darkest)
    // Timer 1: 75% opacity
    // Timer 2: 50% opacity
    // Timer 3: 25% opacity
    // Timer 4: 10% opacity (lightest)
    const colors = {
      0: 'rgba(6, 122, 195, 1.0)',
      1: 'rgba(6, 122, 195, 0.75)',
      2: 'rgba(6, 122, 195, 0.5)',
      3: 'rgba(6, 122, 195, 0.25)',
      4: 'rgba(6, 122, 195, 0.1)'
    };

    if (breathingPhase === 'inhale' || breathingPhase === 'exhale') {
      // Increment: gets lighter
      return colors[timer];
    } else {
      // HOLD: Decrement - reverse to become darker
      return colors[4 - timer];
    }
  };

  // Get circle size based on breathing phase and timer
  const getCircleSize = () => {
    // Timer 0-4: 5 size values
    // Timer 0: 100px (smallest - can be very small)
    // Timer 1: 160px
    // Timer 2: 220px
    // Timer 3: 280px
    // Timer 4: 340px (full size)
    // Each increment adds ~60px
    const sizes = {
      0: 100,
      1: 160,
      2: 220,
      3: 280,
      4: 340
    };

    if (breathingPhase === 'inhale' || breathingPhase === 'exhale') {
      // Increment: grows larger
      return sizes[timer];
    } else {
      // Decrement: shrinks smaller (reverse the sizes)
      return sizes[4 - timer];
    }
  };

  // Get number of circles to display based on phase and timer
  const getVisibleCircleCount = () => {
    if (breathingPhase === 'inhale') {
      // INHALE: timer 0→4, circles 0→4 (expanding)
      return timer === 0 ? 0 : timer;
    } else if (breathingPhase === 'hold1') {
      return 4; // HOLD after INHALE: Keep all 4 circles at max size
    } else if (breathingPhase === 'exhale') {
      // EXHALE: timer 4→0, circles 4→0 (contracting from max)
      return timer;
    } else if (breathingPhase === 'hold2') {
      return 0; // HOLD after EXHALE: No circles
    }
    return 0;
  };

  // Get visible circle count for 4-7-8 breathing
  const getVisibleCircleCount478 = () => {
    if (!isExercising) return 0;

    if (breathingPhase === 'inhale') {
      // INHALE: Add 2 circles per second (timer 0→4 shows 0,2,4,6,8 circles)
      return timer * 2;
    } else if (breathingPhase === 'hold1') {
      // HOLD: Keep all 8 circles visible
      return 8;
    } else if (breathingPhase === 'exhale') {
      // EXHALE: Remove 1 circle per second (timer 7→0 shows 8,7,6,5,4,3,2,1 circles)
      return Math.max(timer, 1);
    }

    return 0;
  };

  // Get circle data for 4-7-8 breathing
  const getCirclesData478 = () => {
    const circleCount = getVisibleCircleCount478();

    // 8 circles with 10% opacity decrements - adjusted sizes to fit container
    const sizes = [100, 140, 180, 220, 260, 300, 340, 360];
    const colors = [
      'rgba(5, 104, 166, 1.0)',   // 100% opacity (darkest - innermost) - 15% darker base
      'rgba(5, 104, 166, 0.9)',   // 90% opacity
      'rgba(5, 104, 166, 0.8)',   // 80% opacity
      'rgba(5, 104, 166, 0.7)',   // 70% opacity
      'rgba(5, 104, 166, 0.6)',   // 60% opacity
      'rgba(5, 104, 166, 0.5)',   // 50% opacity
      'rgba(5, 104, 166, 0.4)',   // 40% opacity
      'rgba(5, 104, 166, 0.3)'    // 30% opacity (lightest - outermost)
    ];
    const blurs = [20, 21, 22, 23, 24, 25, 26, 27];

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

  // Generate 4-7-8 wave path: rise → plateau → decline
  const generateWavePath478 = () => {
    const width = 700; // Width for one cycle
    const baseY = 300; // Baseline (bottom)
    const peakY = 80; // Peak (top)
    const startX = 50;

    // Phase widths based on time proportions (4:7:8)
    const totalTime = 4 + 7 + 8; // 19 seconds
    const inhaleWidth = (4 / totalTime) * width; // ~147px
    const holdWidth = (7 / totalTime) * width; // ~258px
    const exhaleWidth = (8 / totalTime) * width; // ~295px

    let path = `M ${startX},${baseY}`;

    // INHALE - smooth curve upward (4 seconds)
    const inhalePoints = 50;
    for (let i = 1; i <= inhalePoints; i++) {
      const progress = i / inhalePoints;
      const x = startX + inhaleWidth * progress;
      // Use easeInOut curve for smooth rise
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const y = baseY - (baseY - peakY) * easeProgress;
      path += ` L ${x},${y}`;
    }

    // HOLD - plateau (7 seconds)
    const holdStartX = startX + inhaleWidth;
    const holdEndX = holdStartX + holdWidth;
    path += ` L ${holdEndX},${peakY}`;

    // EXHALE - smooth curve downward (8 seconds)
    const exhalePoints = 50;
    for (let i = 1; i <= exhalePoints; i++) {
      const progress = i / exhalePoints;
      const x = holdEndX + exhaleWidth * progress;
      // Use easeInOut curve for smooth decline
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const y = peakY + (baseY - peakY) * easeProgress;
      path += ` L ${x},${y}`;
    }

    return path;
  };

  // Get dot position for 4-7-8 breathing animation
  const getDotPosition478 = () => {
    const width = 700;
    const baseY = 300;
    const peakY = 80;
    const startX = 50;

    const totalTime = 19;
    const inhaleWidth = (4 / totalTime) * width;
    const holdWidth = (7 / totalTime) * width;
    const exhaleWidth = (8 / totalTime) * width;

    let x = startX;
    let y = baseY;

    if (breathingPhase === 'inhale') {
      // INHALE: Move up the curve (0-4 seconds)
      const progress = timer / 4;
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      x = startX + inhaleWidth * progress;
      y = baseY - (baseY - peakY) * easeProgress;
    } else if (breathingPhase === 'hold1') {
      // HOLD: Move along the plateau (0-6 seconds)
      const progress = timer / 6;
      const holdStartX = startX + inhaleWidth;
      x = holdStartX + holdWidth * progress;
      y = peakY;
    } else if (breathingPhase === 'exhale') {
      // EXHALE: Move down the curve (7-0 seconds, descending)
      const progress = (7 - timer) / 7;
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const exhaleStartX = startX + inhaleWidth + holdWidth;
      x = exhaleStartX + exhaleWidth * progress;
      y = peakY + (baseY - peakY) * easeProgress;
    }

    return { x, y };
  };

  // Get data for all circles to render
  const getCirclesData = () => {
    const circleCount = getVisibleCircleCount();
    // Only 4 circles for timer values 1-4 (no circle for 0)
    const sizes = [160, 220, 280, 340];  // Timer 1-4: 4 circles with 60px increments
    const colors = [
      'rgba(6, 122, 195, 1.0)',   // 100% opacity (darkest - innermost) - timer 1
      'rgba(6, 122, 195, 0.75)',  // 75% opacity - timer 2
      'rgba(6, 122, 195, 0.5)',   // 50% opacity - timer 3
      'rgba(6, 122, 195, 0.25)'   // 25% opacity (lightest - outermost) - timer 4
    ];
    const blurs = [20, 22, 24, 26];  // Progressive blur increase

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
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 300ms ease-out;
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
            <div className="music-player-desktop bg-white border-2 border-gray-300 rounded-2xl p-6 flex flex-col w-full lg:flex-shrink-0 relative overflow-hidden">
              {/* Album Art & Info - Hide when breathing exercise is selected */}
              {!(selectedOption === 'breathe' && selectedExercise) && (
                <div className="mb-6">
                  <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-xl text-black mb-1 capitalize">
                    {selectedOption === 'breathe' ? 'Breathing exercises' : selectedOption ? `${selectedOption} Collection` : 'Select Your Path'}
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
                ) : selectedOption === 'breathe' && selectedExercise && showingInfo ? (
                  /* Breathing Exercise Info Screen */
                  <div className="flex flex-col h-full w-full">
                    {/* Header */}
                    <div className="flex-[0.1] flex items-center justify-between px-2 mb-4">
                      <button
                        onClick={() => {
                          setSelectedExercise(null);
                          setShowingInfo(false);
                        }}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span>Back</span>
                      </button>
                      <div className="w-14"></div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-2">
                      {/* Title */}
                      <h1 className="text-4xl font-bold mb-4 text-black">
                        {selectedExercise.name.replace(/\s*\([^)]*\)/, '')}
                      </h1>

                      {/* Description */}
                      <p className="text-base text-gray-700 mb-6 leading-relaxed">
                        {exerciseContent[selectedExercise.name]?.description || 'Exercise description not available.'}
                      </p>

                      {/* Tips Tile */}
                      <button
                        onClick={() => setShowTipsSheet(true)}
                        className="w-full flex items-center justify-between p-4 border-2 border-gray-300 rounded-xl mb-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-base font-semibold text-black">Tips</span>
                        </div>
                        <span className="text-2xl font-light text-gray-700">+</span>
                      </button>
                    </div>

                    {/* Cycle Selector - Static position */}
                    <div className="px-2 mb-[50px]">
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
                    </div>

                    {/* Start Exercise Button - Static position */}
                    <div className="px-2 pb-4">
                      <button
                        onClick={() => {
                          setShowingInfo(false);
                          setCountdown(3); // Start countdown
                        }}
                        className="w-full py-3 bg-black text-white text-base font-bold rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        Start Exercise
                      </button>
                    </div>

                    {/* Tips Bottom Sheet */}
                    {showTipsSheet && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end"
                        onClick={() => setShowTipsSheet(false)}
                      >
                        <div
                          className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto animate-slide-up"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-6">
                            {/* Sheet Handle */}
                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

                            {/* Section Title */}
                            <h2 className="text-2xl font-bold mb-4 text-black">
                              {exerciseContent[selectedExercise.name]?.sectionTitle || 'Tips'}
                            </h2>

                            {/* Section Content */}
                            <div className="text-base text-gray-700 mb-6 leading-relaxed">
                              {exerciseContent[selectedExercise.name]?.sectionContent.map((item, index) => (
                                <p key={index} className={index > 0 ? 'mt-4' : ''}>
                                  {item.label && <strong>{item.label}</strong>} {item.text}
                                </p>
                              ))}
                            </div>

                            {/* Close Button */}
                            <button
                              onClick={() => setShowTipsSheet(false)}
                              className="w-full py-3 bg-gray-100 text-black text-base font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : selectedOption === 'breathe' && selectedExercise ? (
                  /* Breathing Exercise Detail View */
                  <div className="flex flex-col h-full w-full justify-between">
                    {/* Header - 15% */}
                    <div className="flex-[0.15] flex items-center justify-center px-2">
                      <div className="flex items-center justify-between w-full max-w-md">
                      <button
                        onClick={() => {
                          // Reset all exercise state when going back
                          setSelectedExercise(null);
                          setIsExercising(false);
                          setShowingInfo(false);
                          setCountdown(null);
                          setIsPaused(false);
                          setBreathingPhase('inhale');
                          setTimer(0);
                          setCurrentCycle(0);
                        }}
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
                    </div>

                    {/* Timer Section - 15% */}
                    <div className="flex-[0.15] flex items-center justify-center">
                      {/* Timer Display - Show during INHALE and EXHALE */}
                      {isExercising && (breathingPhase === 'inhale' || breathingPhase === 'exhale') && (
                        <div className="text-center">
                          <div className="font-bold text-gray-900" style={{ fontSize: '4.32rem' }}>
                            {timer}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Breathing Circles Area - 40% */}
                    <div className="flex-[0.4] bg-white rounded-lg flex flex-col items-center justify-center p-4">
                      {/* Conditional Animation based on exercise */}
                      {selectedExercise?.name === 'Box Breathing (4-4-4-4)' ? (
                        <>
                          {/* Breathing Circle Illustration - Box Breathing Only */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Gray Background Circle - Always visible */}
                            <svg
                              className="absolute"
                              width="363"
                              height="363"
                              style={{ transform: 'rotate(-90deg)' }}
                            >
                              <circle
                                cx="181.5"
                                cy="181.5"
                                r="175"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="4"
                              />
                            </svg>

                            {/* Blue Progress Circle - Shows during HOLD phases */}
                            {(breathingPhase === 'hold1' || breathingPhase === 'hold2') && (
                              <svg
                                className="absolute"
                                width="363"
                                height="363"
                                style={{ transform: 'rotate(-90deg)' }}
                              >
                                <circle
                                  cx="181.5"
                                  cy="181.5"
                                  r="175"
                                  fill="none"
                                  stroke="#067AC3"
                                  strokeWidth="4"
                                  strokeDasharray="1100"
                                  strokeDashoffset={1100 - (1100 * timer / 4)}
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

                            {/* Phase Text - At Center of Circles */}
                            <div className="absolute text-center">
                              <div
                                className={`text-lg font-semibold text-gray-700 uppercase tracking-wider ${
                                  (breathingPhase === 'hold1' || breathingPhase === 'hold2') ? 'pulse-hold' : ''
                                }`}
                              >
                                {breathingPhase === 'inhale' && 'INHALE'}
                                {breathingPhase === 'hold1' && 'HOLD'}
                                {breathingPhase === 'exhale' && 'EXHALE'}
                                {breathingPhase === 'hold2' && 'HOLD'}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : selectedExercise?.name === '4-7-8 Breathing' ? (
                        /* 4-7-8 Triangle Animation */
                        <>
                          {/* Breathing Circle Illustration - 4-7-8 */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Gray Background Circle - Always visible */}
                            <svg
                              className="absolute"
                              width="363"
                              height="363"
                              style={{ transform: 'rotate(-90deg)' }}
                            >
                              <circle
                                cx="181.5"
                                cy="181.5"
                                r="180"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="4"
                              />
                            </svg>

                            {/* Blue Progress Circle - Shows during HOLD phase (7 seconds) */}
                            {breathingPhase === 'hold1' && (
                              <svg
                                className="absolute"
                                width="363"
                                height="363"
                                style={{ transform: 'rotate(-90deg)' }}
                              >
                                <circle
                                  cx="181.5"
                                  cy="181.5"
                                  r="180"
                                  fill="none"
                                  stroke="#067AC3"
                                  strokeWidth="4"
                                  strokeDasharray="1131"
                                  strokeDashoffset={1131 - (1131 * timer / 6)}
                                  className="transition-all duration-1000"
                                  strokeLinecap="round"
                                />
                              </svg>
                            )}

                            {/* Colored Circles - 8 circles with gradients */}
                            {getCirclesData478().map((circle) => (
                              <div
                                key={circle.key}
                                className="rounded-full transition-all duration-1000 ease-in-out absolute"
                                style={{
                                  width: `${circle.size}px`,
                                  height: `${circle.size}px`,
                                  border: circle.size === 100 ? 'none' : `20px solid ${circle.color}`,
                                  backgroundColor: circle.size === 100 ? circle.color : 'transparent',
                                  boxShadow: `0 0 ${circle.blur}px ${circle.color}`
                                }}
                              />
                            ))}

                            {/* Phase Text - At Center of Circles */}
                            <div className="absolute text-center">
                              <div
                                className={`text-lg font-semibold text-gray-800 uppercase tracking-wider bg-gradient-to-b from-white/85 to-gray-100/80 backdrop-blur-sm px-6 py-3 rounded-xl inline-block ${
                                  breathingPhase === 'hold1' ? 'pulse-hold' : ''
                                }`}
                              >
                                {breathingPhase === 'inhale' && 'INHALE'}
                                {breathingPhase === 'hold1' && 'HOLD'}
                                {breathingPhase === 'exhale' && 'EXHALE'}
                              </div>
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

                    {/* Exercise Starting Section - 15% */}
                    <div className="flex-[0.15] flex items-center justify-center">
                      {/* Countdown Progress Bar - Show during countdown */}
                      {countdown !== null && countdown > 0 && (
                        <div className="w-full max-w-xs px-4">
                          <span className="text-sm text-gray-600 font-medium mb-2 block text-center">
                            Exercise starting
                          </span>
                          {/* Progress Bar Container */}
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            {/* Segmented Progress */}
                            <div className="h-full flex gap-1">
                              {/* Show segments based on countdown value - decrements from left to right */}
                              {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                  key={index}
                                  className={`flex-1 transition-all duration-300 ${
                                    index >= (3 - countdown) ? 'bg-black' : 'bg-transparent'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Navigation Section - 15% */}
                    <div className="flex-[0.15] flex flex-col items-center justify-end pb-8">
                      <div className="flex items-center justify-between px-4 w-full max-w-md">
                      <button
                        onClick={() => {
                          // Navigate to previous exercise and show info screen
                          const currentIndex = currentTracks.findIndex(t => t.id === selectedExercise.id);
                          const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentTracks.length - 1;
                          setSelectedExercise(currentTracks[prevIndex]);
                          setShowingInfo(true);
                          // Reset all exercise state
                          setIsExercising(false);
                          setCountdown(null);
                          setIsPaused(false);
                          setBreathingPhase('inhale');
                          setTimer(0);
                          setCurrentCycle(0);
                        }}
                        className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span className="text-xs text-gray-700 font-medium">Previous</span>
                      </button>

                      {/* Start/Pause Button */}
                      <button
                        onClick={() => {
                          if (isPaused) {
                            // Resume from pause
                            setIsPaused(false);
                          } else if (countdown !== null && countdown > 0) {
                            // Pause during countdown
                            setIsPaused(true);
                          } else if (isExercising) {
                            // Pause during exercise
                            setIsPaused(true);
                          }
                        }}
                        className={`px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-medium text-sm border-2 ${
                          isPaused
                            ? 'bg-black text-white border-black'
                            : 'bg-transparent text-black border-black'
                        }`}
                      >
                        {isPaused ? 'Start' : 'Pause'}
                      </button>

                      <button
                        onClick={() => {
                          // Navigate to next exercise and show info screen
                          const currentIndex = currentTracks.findIndex(t => t.id === selectedExercise.id);
                          const nextIndex = currentIndex < currentTracks.length - 1 ? currentIndex + 1 : 0;
                          setSelectedExercise(currentTracks[nextIndex]);
                          setShowingInfo(true);
                          // Reset all exercise state
                          setIsExercising(false);
                          setCountdown(null);
                          setIsPaused(false);
                          setBreathingPhase('inhale');
                          setTimer(0);
                          setCurrentCycle(0);
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
                          // Show info screen for breathing exercises
                          setSelectedExercise(track);
                          setShowingInfo(true);
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

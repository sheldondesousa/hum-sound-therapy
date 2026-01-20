import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { trackPageView, trackSession, trackBreathingExercise, trackEvent } from '../services/analytics';
import { useUserMetrics } from '../hooks/useUserMetrics';
import { exerciseContent } from '../constants/exerciseContent';
import { tracksByOption } from '../constants/trackData';
import { carouselCards } from '../constants/carouselData';
import { getDifficultyLevel } from '../constants/difficultyMap';
import { getExerciseMetadata } from '../utils/exerciseMetadata';
import { generateWavePath478, getDotPosition478 } from '../utils/wavePathGenerator';
import { useCarousel } from '../hooks/useCarousel';
import { useBreathingAnimation } from '../hooks/useBreathingAnimation';

export default function Home() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const metrics = useUserMetrics(currentUser?.uid);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('breathe');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [currentView, setCurrentView] = useState('interactive'); // 'interactive', 'about', 'support', 'faqs', 'privacy', 'terms', 'breathing-info'
  const [profileImageError, setProfileImageError] = useState(false);
  const completionTrackedRef = useRef(false);
  const phaseHoldRef = useRef(false); // Track if we've held at final timer value for animation completion
  const nextPhaseRef = useRef(null); // Track target phase for Box Breathing transitions

  // Carousel hook
  const carousel = useCarousel(4); // max index = 4 (5 cards: 0-4)
  const { carouselIndex, setCarouselIndex, handleTouchStart, handleTouchMove, handleTouchEnd, goToPrevCard, goToNextCard } = carousel;

  // Random visual for album art placeholder
  const visuals = ['Visual1.jpeg', 'Visual2.jpeg', 'Visual3.jpeg', 'Visual4.jpeg'];
  const [currentVisual, setCurrentVisual] = useState(() => {
    const randomIndex = Math.floor(Math.random() * visuals.length);
    return visuals[randomIndex];
  });

  // Carousel content imported from constants

  // Track page view and session start
  useEffect(() => {
    const userId = currentUser?.uid;
    trackPageView('home', userId);
    trackSession('start', userId);
  }, [currentUser]);

  // Change visual when returning to listing page (when selectedExercise becomes null)
  useEffect(() => {
    if (!selectedExercise) {
      const randomIndex = Math.floor(Math.random() * visuals.length);
      setCurrentVisual(visuals[randomIndex]);
      // Reset profile image error state to retry loading image
      setProfileImageError(false);
    }
  }, [selectedExercise]);

  // Track exercise selection
  useEffect(() => {
    if (selectedExercise) {
      const userId = currentUser?.uid;
      trackBreathingExercise(selectedExercise, 'view_info', userId);
    }
  }, [selectedExercise, currentUser]);

  // Exercise content data
  // Exercise content imported from constants
  const [showingInfo, setShowingInfo] = useState(false); // Track if showing info screen
  const [countdown, setCountdown] = useState(null); // Track countdown: 3, 2, 1, or null
  const [isExercising, setIsExercising] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Track if user manually paused
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold1, exhale, hold2
  const [timer, setTimer] = useState(0);
  const [selectedCycles, setSelectedCycles] = useState(4);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [showTipsSheet, setShowTipsSheet] = useState(false); // Track tips bottom sheet visibility
  const [showPreparationSheet, setShowPreparationSheet] = useState(false); // Track preparation bottom sheet visibility
  const [showWhenToUseSheet, setShowWhenToUseSheet] = useState(false); // Track when to use bottom sheet visibility
  const [showSafetySheet, setShowSafetySheet] = useState(false); // Track safety bottom sheet visibility
  const [exerciseCompleted, setExerciseCompleted] = useState(false); // Track if exercise completed
  const [showCustomizationSheet, setShowCustomizationSheet] = useState(false); // Track customization bottom sheet visibility
  const [coherentCycles, setCoherentCycles] = useState(6); // Total cycles (default 6)
  const [coherentBreathTime, setCoherentBreathTime] = useState(5); // Inhale-Exhale time in seconds (default 5s)
  const [showLegend, setShowLegend] = useState(false); // Track legend visibility with delay
  const [animationReady, setAnimationReady] = useState(false); // Track when animation should start (after 300ms delay)
  const [alternateNostrilCycles, setAlternateNostrilCycles] = useState(6); // Total cycles for Alternate Nostril (default 6)
  const [alternateNostrilBreathTime, setAlternateNostrilBreathTime] = useState(5); // Breath time for Alternate Nostril (default 5s)

  // Track exercise completion (only once per completion)
  useEffect(() => {
    if (exerciseCompleted && selectedExercise && !completionTrackedRef.current) {
      completionTrackedRef.current = true;
      const userId = currentUser?.uid;
      const totalCycles = selectedExercise?.name === 'Coherent Breathing' ? coherentCycles :
                          selectedExercise?.name === 'Alternate Nostril' ? alternateNostrilCycles :
                          selectedCycles;
      trackBreathingExercise(selectedExercise?.name || selectedExercise, 'complete', userId, {
        completedCycles: totalCycles,
        totalCycles
      });
      console.log('🎉 Exercise completed tracked!', { exercise: selectedExercise?.name, cycles: totalCycles });
    }
    // Reset ref when exercise completes
    if (!exerciseCompleted) {
      completionTrackedRef.current = false;
    }
  }, [exerciseCompleted, selectedExercise, currentUser, coherentCycles, alternateNostrilCycles, selectedCycles]);

  // Auto-start countdown when exercise view loads
  useEffect(() => {
    if (selectedOption === 'breathe' && selectedExercise && !showingInfo && countdown === null && !isExercising) {
      setCountdown(3);
      phaseHoldRef.current = false; // Reset phase hold flag
    }
  }, [showingInfo, selectedExercise, selectedOption, countdown, isExercising]);

  // Set default cycles and timers when exercise is selected on info screen
  useEffect(() => {
    if (selectedExercise && showingInfo) {
      // Set defaults based on exercise type
      switch (selectedExercise.name) {
        case 'Box Breathing (4-4-4-4)':
          setSelectedCycles(4);
          break;
        case '4-7-8 Breathing':
          setSelectedCycles(4);
          break;
        case 'Coherent Breathing':
          setSelectedCycles(6);
          setCoherentCycles(6);
          setCoherentBreathTime(5); // Reset to default 5s
          break;
        case 'Physiological Sigh':
          setSelectedCycles(3);
          break;
        case 'Alternate Nostril':
          setSelectedCycles(6);
          setAlternateNostrilCycles(6);
          setAlternateNostrilBreathTime(5); // Reset to default 5s
          break;
        case 'Humming Bee':
          setSelectedCycles(4);
          break;
        default:
          setSelectedCycles(4);
      }
    }
  }, [selectedExercise, showingInfo]);

  // Countdown effect
  useEffect(() => {
    if (countdown === null || isPaused) return;

    if (countdown === 0) {
      // Countdown finished, start exercise
      setCountdown(null);
      setIsExercising(true);
      setIsPaused(false);
      setBreathingPhase('inhale');
      // Box Breathing starts at timer 1, all other exercises start at 0
      setTimer(selectedExercise?.name === 'Box Breathing (4-4-4-4)' ? 1 : 0);
      setCurrentCycle(0);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isPaused]);

  // Show legend with 150ms delay after countdown completes
  useEffect(() => {
    if (isExercising && countdown === null && !exerciseCompleted) {
      const timer = setTimeout(() => {
        setShowLegend(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setShowLegend(false);
    }
  }, [isExercising, countdown, exerciseCompleted]);

  // Show animation with 300ms delay after countdown completes for 4-7-8 Breathing and Coherent Breathing
  useEffect(() => {
    const is478 = selectedExercise?.name === '4-7-8 Breathing';
    const isCoherent = selectedExercise?.name === 'Coherent Breathing';
    const isPhysiological = selectedExercise?.name === 'Physiological Sigh';
    if ((is478 || isCoherent || isPhysiological) && isExercising && countdown === null && !exerciseCompleted) {
      const timer = setTimeout(() => {
        setAnimationReady(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimationReady(false);
    }
  }, [isExercising, countdown, exerciseCompleted, selectedExercise]);

  // Breathing animation cycle effect
  useEffect(() => {
    if (!isExercising || isPaused || exerciseCompleted) return;

    // Exercise-specific timing configurations
    const is478 = selectedExercise?.name === '4-7-8 Breathing';
    const isCoherent = selectedExercise?.name === 'Coherent Breathing';
    const isPhysiological = selectedExercise?.name === 'Physiological Sigh';
    const isAlternateNostril = selectedExercise?.name === 'Alternate Nostril';
    const isHummingBee = selectedExercise?.name === 'Humming Bee';

    // Dynamic interval based on breathing phase and exercise type
    let intervalDuration;
    if (is478) {
      // 4-7-8: 100ms intervals for smooth animation (timer/10 = seconds)
      // INHALE=4s, HOLD=7s, EXHALE=8s
      intervalDuration = 100; // 100ms for smooth transitions
    } else if (isCoherent) {
      // Coherent: INHALE=5s (50 counts, 100ms), EXHALE=5s (50 counts, 100ms) for smooth animation
      intervalDuration = 100; // 100ms for smooth transitions
    } else if (isPhysiological) {
      // Physiological Sigh: INHALE=4s (40 counts, 100ms), HOLD1=200ms, EXHALE=8s (80 counts, 100ms), HOLD2=100ms
      if (breathingPhase === 'hold1') intervalDuration = 200; // 200ms gap after INHALE
      else if (breathingPhase === 'hold2') intervalDuration = 100; // 100ms gap after EXHALE
      else intervalDuration = 100; // 100ms for smooth transitions
    } else if (isAlternateNostril) {
      // Alternate Nostril: INHALE=4s (40 counts, 100ms), EXHALE=4s (40 counts, 100ms), HOLD2=1s (10 counts, 100ms) nostril switch delay
      intervalDuration = 100; // 100ms for smooth gradient animation
    } else if (isHummingBee) {
      // Humming Bee: INHALE=4s (40 counts, 100ms), HOLD1=200ms, EXHALE=8s (80 counts, 100ms), HOLD2=200ms
      if (breathingPhase === 'hold1') intervalDuration = 200; // 200ms gap after INHALE
      else if (breathingPhase === 'hold2') intervalDuration = 200; // 200ms gap after EXHALE
      else intervalDuration = 100; // 100ms for smooth transitions
    } else {
      // Box breathing: use dynamic interval for phases and transitions
      // Main phases (inhale, hold1, exhale, hold2): 1000ms interval to show 1→2→3→4 (4 counts) in exactly 4 seconds
      // Transition phases: 300ms gap between main phases
      if (breathingPhase === 'transitionAfterInhale' || breathingPhase === 'transitionAfterHold1' ||
          breathingPhase === 'transitionAfterExhale' || breathingPhase === 'transitionAfterHold2') {
        intervalDuration = 300; // 300ms transition gap
      } else {
        intervalDuration = 1000; // 1000ms intervals for main phases (1→2→3→4)
      }
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        // Handle phase transitions and timer logic based on exercise type
        if (isCoherent) {
          // Coherent Breathing pattern (customizable)
          const maxTimer = coherentBreathTime * 10; // Convert seconds to 100ms intervals
          if (breathingPhase === 'inhale') {
            // INHALE: 0 to maxTimer (e.g., 0-50 for 5s)
            if (prevTimer < maxTimer) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('exhale');
              return maxTimer; // Start EXHALE at maxTimer
            }
          } else if (breathingPhase === 'exhale') {
            // EXHALE: maxTimer to 0 (descending)
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              // Cycle completed, check if we should continue
              const nextCycle = currentCycle + 1;
              // Use configured cycle count
              const totalCycles = coherentCycles;
              if (nextCycle >= totalCycles) {
                // Reached target cycles, show completion screen
                setIsExercising(false);
                setExerciseCompleted(true);
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
        } else if (is478) {
          // 4-7-8 Breathing pattern (4s-7s-8s, smooth)
          if (breathingPhase === 'inhale') {
            // INHALE: 0-40 (4 seconds with 100ms updates)
            if (prevTimer < 40) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('hold1');
              return 0; // Start HOLD1 at 0
            }
          } else if (breathingPhase === 'hold1') {
            // HOLD: 0-70 (7 seconds with 100ms updates)
            if (prevTimer < 70) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('exhale');
              return 80; // Start EXHALE at 80
            }
          } else if (breathingPhase === 'exhale') {
            // EXHALE: 80-0 (8 seconds with 100ms updates, descending)
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              // Cycle completed, check if we should continue
              const nextCycle = currentCycle + 1;
              if (nextCycle >= selectedCycles) {
                // Reached target cycles, show completion screen
                setIsExercising(false);
                setExerciseCompleted(true);
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
        } else if (isPhysiological) {
          // Physiological Sigh pattern
          if (breathingPhase === 'inhale') {
            // INHALE: 0-39 (40 counts over 4s)
            if (prevTimer < 39) {
              return prevTimer + 1;
            } else {
              // Transition to 200ms hold
              setBreathingPhase('hold1');
              return 0;
            }
          } else if (breathingPhase === 'hold1') {
            // HOLD1: 200ms gap after INHALE
            setBreathingPhase('exhale');
            return 79; // Start EXHALE at 79
          } else if (breathingPhase === 'exhale') {
            // EXHALE: 79-0 (80 counts over 8s, descending)
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              // EXHALE complete at 0, transition to hold2
              setBreathingPhase('hold2');
              return 0;
            }
          } else if (breathingPhase === 'hold2') {
            // HOLD2: 100ms gap after EXHALE
            const nextCycle = currentCycle + 1;
            if (nextCycle >= selectedCycles) {
              // Reached target cycles, show completion screen
              setIsExercising(false);
              setExerciseCompleted(true);
              setCurrentCycle(0);
              setBreathingPhase('inhale');
              return 0;
            } else {
              // Continue to next cycle
              setCurrentCycle(nextCycle);
              setBreathingPhase('inhale');
              return 0; // Start next INHALE at 0
            }
          }
        } else if (isAlternateNostril) {
          // Alternate Nostril pattern (customizable with 1s nostril switch delay)
          const maxTimer = alternateNostrilBreathTime * 10; // Convert seconds to 100ms intervals
          if (breathingPhase === 'inhale') {
            // INHALE: 0 to maxTimer (e.g., 0-40 for 4s)
            if (prevTimer < maxTimer) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('exhale');
              return maxTimer; // Start EXHALE at maxTimer
            }
          } else if (breathingPhase === 'exhale') {
            // EXHALE: maxTimer to 0 (descending)
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              // EXHALE complete, transition to hold2 for nostril switch
              setBreathingPhase('hold2');
              return 0; // Start HOLD2 at 0
            }
          } else if (breathingPhase === 'hold2') {
            // HOLD2: 1 second delay before switching nostrils (10 counts at 100ms intervals)
            if (prevTimer < 10) {
              return prevTimer + 1;
            } else {
              // Hold complete, check if we should continue to next cycle
              const nextCycle = currentCycle + 1;
              const totalCycles = alternateNostrilCycles;
              if (nextCycle >= totalCycles) {
                // Reached target cycles, show completion screen
                setIsExercising(false);
                setExerciseCompleted(true);
                setCurrentCycle(0);
                setBreathingPhase('inhale');
                return 0;
              } else {
                // Continue to next cycle (switch nostril)
                setCurrentCycle(nextCycle);
                setBreathingPhase('inhale');
                return 0;
              }
            }
          }
        } else if (isHummingBee) {
          // Humming Bee pattern (4s INHALE / 200ms HOLD / 8s EXHALE / 200ms HOLD)
          if (breathingPhase === 'inhale') {
            // INHALE: 0-40 (4 seconds with 100ms updates)
            if (prevTimer < 40) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('hold1');
              return 0;
            }
          } else if (breathingPhase === 'hold1') {
            // HOLD1: 200ms gap after INHALE
            setBreathingPhase('exhale');
            return 80; // Start EXHALE at 80
          } else if (breathingPhase === 'exhale') {
            // EXHALE: 80-0 (8 seconds with 100ms updates, descending)
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              // EXHALE complete at 0, transition to hold2
              setBreathingPhase('hold2');
              return 0;
            }
          } else if (breathingPhase === 'hold2') {
            // HOLD2: 200ms gap after EXHALE
            const nextCycle = currentCycle + 1;
            if (nextCycle >= selectedCycles) {
              // Reached target cycles, show completion screen
              setIsExercising(false);
              setExerciseCompleted(true);
              setCurrentCycle(0);
              setBreathingPhase('inhale');
              return 0;
            } else {
              // Continue to next cycle
              setCurrentCycle(nextCycle);
              setBreathingPhase('inhale');
              return 0; // Start next INHALE at 0
            }
          }
        } else {
          // Box Breathing pattern (4-4-4-4) - each phase counts 1→2→3→4 (4 seconds at 1s intervals)
          if (breathingPhase === 'inhale') {
            // INHALE: 1→2→3→4 (4 seconds total, 4 counts × 1000ms)
            if (prevTimer < 4) {
              return prevTimer + 1;
            } else {
              // Timer reached 4, transition to hold1 with 300ms gap
              setBreathingPhase('transitionAfterInhale');
              return 4; // Keep showing 4 during transition
            }
          } else if (breathingPhase === 'transitionAfterInhale') {
            // 300ms transition gap, then move to hold1
            setBreathingPhase('hold1');
            return 1; // Start hold1 at 1
          } else if (breathingPhase === 'hold1') {
            // HOLD1: 1→2→3→4 (4 seconds total, 4 counts × 1000ms)
            if (prevTimer < 4) {
              return prevTimer + 1;
            } else {
              // Timer reached 4, transition to exhale with 300ms gap
              setBreathingPhase('transitionAfterHold1');
              return 4; // Keep showing 4 during transition
            }
          } else if (breathingPhase === 'transitionAfterHold1') {
            // 300ms transition gap, then move to exhale
            setBreathingPhase('exhale');
            return 1; // Start exhale at 1
          } else if (breathingPhase === 'exhale') {
            // EXHALE: 1→2→3→4 (4 seconds total, 4 counts × 1000ms)
            if (prevTimer < 4) {
              return prevTimer + 1;
            } else {
              // Timer reached 4, transition to hold2 with 300ms gap
              setBreathingPhase('transitionAfterExhale');
              return 4; // Keep showing 4 during transition
            }
          } else if (breathingPhase === 'transitionAfterExhale') {
            // 300ms transition gap, then move to hold2
            setBreathingPhase('hold2');
            return 1; // Start hold2 at 1
          } else if (breathingPhase === 'hold2') {
            // HOLD2: 1→2→3→4 (4 seconds total, 4 counts × 1000ms)
            if (prevTimer < 4) {
              return prevTimer + 1;
            } else {
              // Timer reached 4, check if cycle completed
              const nextCycle = currentCycle + 1;
              if (nextCycle >= selectedCycles) {
                // Reached target cycles, show completion screen
                setIsExercising(false);
                setExerciseCompleted(true);
                setCurrentCycle(0);
                setBreathingPhase('inhale');
                return 1;
              } else {
                // Continue to next cycle with 300ms transition gap
                setBreathingPhase('transitionAfterHold2');
                return 4; // Keep showing 4 during transition
              }
            }
          } else if (breathingPhase === 'transitionAfterHold2') {
            // 300ms transition gap, then move to next cycle's inhale
            setCurrentCycle(currentCycle + 1);
            setBreathingPhase('inhale');
            return 1; // Start next inhale at 1
          }
        }
        return prevTimer;
      });
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [isExercising, isPaused, breathingPhase, currentCycle, selectedCycles, selectedExercise, exerciseCompleted, coherentCycles, coherentBreathTime, alternateNostrilCycles, alternateNostrilBreathTime]);

  // Track data for each option
  // Tracks imported from constants

  const currentTracks = selectedOption ? tracksByOption[selectedOption] : [];

  // Breathing animation hook
  const animations = useBreathingAnimation({
    breathingPhase,
    timer,
    isExercising,
    exerciseCompleted,
    animationReady,
    coherentBreathTime
  });

  // Destructure animation functions
  const {
    getCircleSize,
    getVisibleCircleCount,
    getVisibleCircleCount478,
    getCirclesData478,
    getCirclesData,
    getCoherentCircleSize,
    get478CircleSize,
    getHummingBeeCircleSize,
    getBoxBreathingOrbPosition,
    getBoxBreathingIndicatorPosition,
    getPhysiologicalCircleProgress,
    getPhysiologicalSighCircleSizes
  } = animations;

  const handleLogout = async () => {
    try {
      const userId = currentUser?.uid;
      await trackSession('end', userId);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Get difficulty level for each exercise (1-5, supports decimals)
  // Helper functions imported from constants/utils

  // Render difficulty indicator (1-5 circles, supports half-filled for decimals)
  const DifficultyIndicator = ({ level }) => {
    return (
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-500" style={{ fontSize: '13px' }}>Effort</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((circle) => {
            const isFilled = circle <= Math.floor(level);
            const isHalf = circle === Math.ceil(level) && level % 1 !== 0;

            return (
              <div
                key={circle}
                className="w-2 h-2 rounded-full relative overflow-hidden"
                style={{
                  backgroundColor: isFilled ? '#000000' : 'transparent',
                  border: !isFilled && !isHalf ? '1px solid #D1D5DB' : 'none'
                }}
              >
                {isHalf && (
                  <>
                    <div className="absolute inset-0 w-1/2 bg-black" />
                    <div className="absolute inset-0 w-full h-full border border-gray-300 rounded-full" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #F4F9FD, #C3DBEA)' }}>
      <style>{`
        @media (min-width: 1024px) {
          .music-player-desktop {
            width: 430px !important;
            height: 932px !important;
          }
        }
        .music-player-frame {
          box-shadow:
            0 0 0 8px white,
            0 10px 40px rgba(0, 0, 0, 0.12),
            0 4px 16px rgba(0, 0, 0, 0.08);
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
        @keyframes purpleBlink {
          0%, 100% {
            stroke: #E5E7EB;
          }
          50% {
            stroke: #9333EA;
          }
        }
        .blink-purple {
          animation: purpleBlink 400ms ease-in-out;
        }
        @keyframes greenFlash {
          0% {
            stroke: #6EE7B7;
            stroke-width: 8;
          }
          100% {
            stroke: #6EE7B7;
            stroke-width: 8;
          }
        }
        .flash-green {
          animation: greenFlash 1000ms linear forwards;
        }
        @keyframes breathingSmoke {
          0% {
            transform: translateY(20%) scale(1) rotate(0deg);
            opacity: 0;
          }
          30% {
            opacity: 0.6;
          }
          60% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100%) scale(1.5) rotate(10deg);
            opacity: 0;
          }
        }
        .breathing-smoke {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 1rem;
        }
        .breathing-smoke::before,
        .breathing-smoke::after {
          content: '';
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
          filter: blur(20px);
        }
        .breathing-smoke::before {
          bottom: -50px;
          left: 20%;
          animation: breathingSmoke 6s ease-in-out infinite;
        }
        .breathing-smoke::after {
          bottom: -50px;
          right: 20%;
          animation: breathingSmoke 6s ease-in-out 3s infinite;
        }
        @keyframes orb-pulse {
          0%, 100% {
            transform: scale(1.3);
            opacity: 0.7;
          }
          33% {
            transform: scale(1.5);
            opacity: 0.8;
          }
          66% {
            transform: scale(1.4);
            opacity: 0.75;
          }
        }
        @keyframes orb-glow {
          0%, 100% {
            filter: brightness(1.15) saturate(1.3) blur(8px);
          }
          50% {
            filter: brightness(1.5) saturate(1.5) blur(10px);
          }
        }
        @keyframes smoke-trail {
          0% {
            transform: scale(1.6);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.75);
            opacity: 0.6;
          }
          70% {
            transform: scale(1.9);
            opacity: 0.4;
          }
          100% {
            transform: scale(2);
            opacity: 0.2;
          }
        }
        @keyframes text-breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        @keyframes magnify-compress {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
      `}</style>
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-300 p-8 flex-col">
          <nav className="space-y-0">
            <div className="pb-6 border-b border-gray-300">
              <h2 className="text-lg font-semibold text-black">Menu</h2>
            </div>
            <button
              onClick={() => setCurrentView('interactive')}
              className={`block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300 ${currentView === 'interactive' ? 'font-bold' : ''}`}
            >
              Interactive mode
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className={`block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300 ${currentView === 'about' ? 'font-bold' : ''}`}
            >
              About Hum
            </button>
            <button
              onClick={() => setCurrentView('support')}
              className={`block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300 ${currentView === 'support' ? 'font-bold' : ''}`}
            >
              Support the app
            </button>
            <button
              onClick={() => setCurrentView('faqs')}
              className={`block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300 ${currentView === 'faqs' ? 'font-bold' : ''}`}
            >
              FAQs
            </button>
            <button
              onClick={() => setCurrentView('privacy')}
              className={`block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300 ${currentView === 'privacy' ? 'font-bold' : ''}`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setCurrentView('terms')}
              className={`block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300 ${currentView === 'terms' ? 'font-bold' : ''}`}
            >
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
                <button
                  onClick={() => {
                    setCurrentView('interactive');
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300 ${currentView === 'interactive' ? 'font-bold' : ''}`}
                >
                  Interactive mode
                </button>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300 ${currentView === 'about' ? 'font-bold' : ''}`}
                >
                  About Hum
                </button>
                <button
                  onClick={() => {
                    setCurrentView('support');
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300 ${currentView === 'support' ? 'font-bold' : ''}`}
                >
                  Support the app
                </button>
                <button
                  onClick={() => {
                    setCurrentView('faqs');
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300 ${currentView === 'faqs' ? 'font-bold' : ''}`}
                >
                  FAQs
                </button>
                <button
                  onClick={() => {
                    setCurrentView('privacy');
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300 ${currentView === 'privacy' ? 'font-bold' : ''}`}
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => {
                    setCurrentView('terms');
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left text-base text-black hover:opacity-70 transition-opacity py-6 border-b border-gray-300 ${currentView === 'terms' ? 'font-bold' : ''}`}
                >
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
          {/* Centered Container - Music Player */}
          <div className="flex items-center justify-center max-w-7xl">
            {currentView === 'about' ? (
              /* About Hum Page */
              <div className="music-player-desktop music-player-frame bg-white border-2 border-white rounded-3xl p-8 flex flex-col w-full lg:flex-shrink-0 relative overflow-y-auto" style={{ maxHeight: '90vh' }}>
                {/* Header with Back Button */}
                <div className="flex items-center mb-6 pb-4 border-b border-gray-300">
                  <button
                    onClick={() => setCurrentView('interactive')}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                    </svg>
                    <span>Back</span>
                  </button>
                  <h2 className="flex-1 text-center text-xl font-semibold text-black pr-12">About Hum</h2>
                </div>

                {/* Content */}
                <div className="space-y-6 text-black leading-relaxed">
                  <div>
                    <h3 className="font-bold text-lg mb-3">It Started With Silence.</h3>
                    <p className="text-base">
                      There's a particular kind of exhaustion that comes from being always on. The notifications, the deadlines, the endless scroll, the noise that follows you from the office to your living room to the space behind your eyes when you try to sleep.
                    </p>
                  </div>

                  <p className="text-base">
                    I love electronic dance music. I love the energy, the rhythm, the escape it offers. But I realized something: even my escape had become noise. Another layer on top of everything else. Another thing demanding my attention.
                  </p>

                  <p className="text-base">
                    I didn't need more content. I didn't need another course, another process, another seven-step journey to inner peace. I didn't need a meditation app that felt like homework or a wellness subscription that made me feel guilty for not "keeping up."
                  </p>

                  <p className="text-base">
                    I just needed to breathe. I needed something I could turn to—on my terms, in my time—that would let me detach. Not forever, just for a moment. A space where I could float, focus, or simply let my mind rest from its constant race.
                  </p>

                  <div>
                    <h3 className="font-bold text-lg mb-3">What I Couldn't Find</h3>
                    <p className="text-base">
                      So I went looking. And what I found were apps that were visually overwhelming, full of upsells, cluttered with features I didn't want. Apps that promised calm but delivered complexity. Apps that felt like they were designed to keep me engaged rather than let me disconnect.
                    </p>
                  </div>

                  <p className="text-base">
                    I wanted the opposite: minimalism that matches the clarity I was seeking. I wanted something backed by science—real evidence, not wellness buzzwords. Something simple, honest, and effective. Something that did one thing exceptionally well instead of everything moderately.
                  </p>

                  <div>
                    <h3 className="font-bold text-lg mb-3">The 'Aha' Moment</h3>
                    <p className="text-base">
                      It happened when I started experimenting with sound. Not music, not guided meditations—just sound. Pure, intentional, evidence-based frequencies designed to help the brain do what it naturally wants to do: settle. No voice telling me how to breathe. No subscription gate. No achievement badges or streaks.
                    </p>
                  </div>

                  <p className="text-base">
                    Just sound, space, and choice. That's when I realized: this is what I'd been looking for. And if I was searching for it, maybe others were too.
                  </p>

                  <div>
                    <h3 className="font-bold text-lg mb-3">This Is For You If...</h3>
                    <p className="text-base">
                      You're tired of the noise—all of it. The external chaos and the internal chatter. You want something on your terms. Not another commitment, not another thing to optimize or gamify.
                    </p>
                  </div>

                  <p className="text-base">
                    You're looking for a moment of detachment in a world that demands constant attachment. You value simplicity over complexity, and evidence over trends. You don't need millions of features. You need one thing that works.
                  </p>

                  <div>
                    <h3 className="font-bold text-lg mb-3">A Small Collective</h3>
                    <p className="text-base">
                      This app isn't built to chase millions of users or dominate app store rankings. It's built for people like us—a small collective who understand that sometimes the most radical thing you can do is simply rest your mind.
                    </p>
                  </div>

                  <p className="text-base">
                    The cities are loud. Work is loud. Social media is loud. Stress, anxiety, expectations—they're all loud.
                    This app is your companion when you need that break. When you need to empty your head of the unnecessary, refocus on what matters, or just exist without demands.
                  </p>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Join Us</h3>
                    <p className="text-base">
                      If this resonates with you, you're already part of this. Use the app when you need it. Share it if you want to. Support its growth if it serves you.
                      This isn't a revolution. It's quieter than that. It's a breath. And you're invited to take it with us.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentView === 'interactive' ? (
              /* Music Player - iPhone 17 Pro Max dimensions on desktop */
              <div
                className="music-player-desktop music-player-frame border-2 border-white rounded-3xl p-6 flex flex-col w-full lg:flex-shrink-0 relative overflow-hidden"
                style={
                  selectedExercise?.name === 'Box Breathing (4-4-4-4)'
                    ? { background: 'white' }
                    : { backgroundColor: 'white' }
                }
              >
              {/* Profile & Metrics Section - Show when on breathing exercises listing */}
              {!(selectedOption === 'breathe' && selectedExercise) && selectedOption === 'breathe' && (
                <div className="mb-6 flex-shrink-0">
                  {/* Profile Section */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {currentUser?.photoURL && !profileImageError ? (
                        <img
                          key={currentUser.photoURL}
                          src={currentUser.photoURL}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={() => {
                            setProfileImageError(true);
                          }}
                        />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-black truncate">
                        Hello {currentUser?.displayName?.split(' ')[0] || 'User'}!
                      </h2>
                    </div>
                  </div>

                  {/* Motivational Text */}
                  <h1 className="text-4xl font-bold text-black mb-8" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                    Take a deep breath<br />and relax
                  </h1>

                  {/* Why Breathing Helps - Working Carousel */}
                  <div className="mb-6">
                    <div
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      className="w-full rounded-2xl p-6 text-left relative overflow-hidden transition-all duration-300"
                      style={{
                        backgroundColor: carouselCards[carouselIndex].backgroundColor,
                        color: carouselCards[carouselIndex].textColor,
                        height: '240px'
                      }}
                    >
                      {/* Left Chevron - Show on cards 2-5 */}
                      {carouselIndex > 0 && (
                        <button
                          onClick={goToPrevCard}
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all"
                          style={{
                            backgroundColor: carouselCards[carouselIndex].textColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                            color: carouselCards[carouselIndex].textColor
                          }}
                          aria-label="Previous card"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}

                      {/* Card Content */}
                      <div className="flex items-center h-full">
                        <div className="flex-1 px-8">
                          <h3 className="text-base font-bold mb-3"
                              style={{ color: carouselCards[carouselIndex].textColor }}>
                            {carouselCards[carouselIndex].title}
                          </h3>
                          <p className="font-normal opacity-90 leading-relaxed"
                             style={{
                               color: carouselCards[carouselIndex].textColor,
                               fontSize: '16px'
                             }}>
                            {carouselCards[carouselIndex].content}
                          </p>
                        </div>
                      </div>

                      {/* Right Chevron - Show on cards 1-4 */}
                      {carouselIndex < 4 && (
                        <button
                          onClick={goToNextCard}
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all"
                          style={{
                            backgroundColor: carouselCards[carouselIndex].textColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                            color: carouselCards[carouselIndex].textColor
                          }}
                          aria-label="Next card"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Interactive Carousel Indicators */}
                    <div className="flex justify-center gap-2 mt-4">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <button
                          key={index}
                          onClick={() => setCarouselIndex(index)}
                          className="w-2 h-2 rounded-full transition-all"
                          style={{
                            backgroundColor: index === carouselIndex ? ['#7469B6', '#AD88C6', '#E1AFD1', '#F6D0EA', '#FFE6E6'][index] : '#D1D5DB',
                            transform: index === carouselIndex ? 'scale(1.2)' : 'scale(1)'
                          }}
                          aria-label={`Go to card ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Album Art & Info - Show for other options (focus/calm) */}
              {!(selectedOption === 'breathe' && selectedExercise) && selectedOption !== 'breathe' && (
                <div className="mb-6 flex-shrink-0">
                  <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  </div>
                  <h3 className="font-semibold text-xl text-black mb-1 capitalize">
                    {selectedOption ? `${selectedOption} Collection` : 'Select Your Path'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedOption
                      ? `${currentTracks.length} Track${currentTracks.length !== 1 ? 's' : ''}`
                      : 'Choose Focus, Calm, or Breathe'}
                  </p>
                </div>
              )}

              {/* Track List or Exercise Detail View */}
              <div className={`flex-1 overflow-hidden min-h-0 ${selectedOption === 'breathe' && selectedExercise ? 'flex' : 'flex flex-col'}`}>
                {selectedOption === 'breathe' && selectedExercise && showingInfo ? (
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
                    <div className="flex-1 overflow-y-auto px-2 hide-scrollbar">
                      {/* Title */}
                      <h1 className="text-4xl font-bold mb-4 text-black">
                        {selectedExercise.name.replace(/\s*\([^)]*\)/, '')}
                      </h1>

                      {/* Description */}
                      <p className="text-base text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
                        {(exerciseContent[selectedExercise.name]?.description || 'Exercise description not available.').split('\n').map((line, index) => (
                          <span key={index}>
                            {line.trim().startsWith('Suggested:') ? (
                              <span className="text-[15px]">
                                <span className="font-semibold">Suggested:</span> {line.trim().substring(10)}
                              </span>
                            ) : line}
                            {index < (exerciseContent[selectedExercise.name]?.description || '').split('\n').length - 1 && '\n'}
                          </span>
                        ))}
                      </p>

                      {/* Tips Tile */}
                      <button
                        onClick={() => setShowTipsSheet(true)}
                        className="w-full flex items-center justify-between p-4 border-2 border-gray-300 rounded-xl mb-5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-base font-semibold text-black">Tips</span>
                        </div>
                        <span className="text-2xl font-light text-gray-700">+</span>
                      </button>

                      {/* Preparation Tile - For all breathing exercises */}
                      {(selectedExercise?.name === 'Box Breathing (4-4-4-4)' || selectedExercise?.name === '4-7-8 Breathing' || selectedExercise?.name === 'Coherent Breathing' || selectedExercise?.name === 'Physiological Sigh' || selectedExercise?.name === 'Alternate Nostril' || selectedExercise?.name === 'Humming Bee') && (
                        <button
                          onClick={() => setShowPreparationSheet(true)}
                          className="w-full flex items-center justify-between p-4 border-2 border-gray-300 rounded-xl mb-5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <span className="text-base font-semibold text-black">Preparation</span>
                          </div>
                          <span className="text-2xl font-light text-gray-700">+</span>
                        </button>
                      )}

                      {/* Try this when Tile - For all breathing exercises */}
                      {(selectedExercise?.name === 'Box Breathing (4-4-4-4)' || selectedExercise?.name === '4-7-8 Breathing' || selectedExercise?.name === 'Coherent Breathing' || selectedExercise?.name === 'Physiological Sigh' || selectedExercise?.name === 'Alternate Nostril' || selectedExercise?.name === 'Humming Bee') && (
                        <button
                          onClick={() => setShowWhenToUseSheet(true)}
                          className="w-full flex items-center justify-between p-4 border-2 border-gray-300 rounded-xl mb-5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-base font-semibold text-black">Try this when</span>
                          </div>
                          <span className="text-2xl font-light text-gray-700">+</span>
                        </button>
                      )}

                      {/* Precautions Tile - For all breathing exercises */}
                      {(selectedExercise?.name === 'Box Breathing (4-4-4-4)' || selectedExercise?.name === '4-7-8 Breathing' || selectedExercise?.name === 'Coherent Breathing' || selectedExercise?.name === 'Physiological Sigh' || selectedExercise?.name === 'Alternate Nostril' || selectedExercise?.name === 'Humming Bee') && (
                        <button
                          onClick={() => setShowSafetySheet(true)}
                          className="w-full flex items-center justify-between p-4 border-2 border-gray-300 rounded-xl mb-5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-base font-semibold text-black">Precautions</span>
                          </div>
                          <span className="text-2xl font-light text-gray-700">+</span>
                        </button>
                      )}
                    </div>

                    {/* Cycle Selector - Static position */}
                    {selectedExercise?.name !== 'Physiological Sigh' && (
                      <div className="px-2 mb-[50px]">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-sm text-gray-600 font-medium">Select Cycles</span>
                          <div className="flex gap-3">
                            {selectedExercise?.name === 'Coherent Breathing' ? (
                              // Cycle options for Coherent Breathing + Personalize button
                              <>
                                {[3, 6, 9].map((cycles) => (
                                  <button
                                    key={cycles}
                                    onClick={() => {
                                      setSelectedCycles(cycles);
                                      setCoherentCycles(cycles);
                                      const userId = currentUser?.uid;
                                      trackEvent('cycle_selected', {
                                        exercise: 'Coherent Breathing',
                                        cycles
                                      }, userId);
                                    }}
                                    className={`w-12 h-12 rounded-full text-base font-bold transition-all ${
                                      selectedCycles === cycles
                                        ? 'bg-black text-white shadow-lg'
                                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    {cycles}
                                  </button>
                                ))}
                                {/* Personalize button - icon only */}
                                <button
                                  onClick={() => setShowCustomizationSheet(true)}
                                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                  </svg>
                                </button>
                              </>
                            ) : selectedExercise?.name === 'Alternate Nostril' ? (
                              // Cycle options for Alternate Nostril + Personalize button
                              <>
                                {[3, 6, 9].map((cycles) => (
                                  <button
                                    key={cycles}
                                    onClick={() => {
                                      setSelectedCycles(cycles);
                                      setAlternateNostrilCycles(cycles);
                                      const userId = currentUser?.uid;
                                      trackEvent('cycle_selected', {
                                        exercise: 'Alternate Nostril',
                                        cycles
                                      }, userId);
                                    }}
                                    className={`w-12 h-12 rounded-full text-base font-bold transition-all ${
                                      selectedCycles === cycles
                                        ? 'bg-black text-white shadow-lg'
                                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    {cycles}
                                  </button>
                                ))}
                                {/* Personalize button - icon only */}
                                <button
                                  onClick={() => setShowCustomizationSheet(true)}
                                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              // Cycle options for other exercises
                              [4, 8, 12].map((cycles) => (
                                <button
                                  key={cycles}
                                  onClick={() => {
                                    setSelectedCycles(cycles);
                                    const userId = currentUser?.uid;
                                    trackEvent('cycle_selected', {
                                      exercise: selectedExercise,
                                      cycles
                                    }, userId);
                                  }}
                                  className={`w-12 h-12 rounded-full text-base font-bold transition-all ${
                                    selectedCycles === cycles
                                      ? 'bg-black text-white shadow-lg'
                                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {cycles}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Start Exercise Button - Static position */}
                    <div className="px-2 pb-4">
                      <button
                        onClick={() => {
                          // Start the exercise by hiding the info screen
                          setShowingInfo(false);
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
                              {exerciseContent[selectedExercise.name]?.sectionContent.map((item, index) => {
                                // Helper function to bold "Start", "Inhale", "Hold", "Exhale", "HOLD"
                                const formatText = (text) => {
                                  const parts = text.split(/\b(Start|Inhale|Hold|Exhale|HOLD)\b/g);
                                  return parts.map((part, i) =>
                                    ['Start', 'Inhale', 'Hold', 'Exhale', 'HOLD'].includes(part) ?
                                      <strong key={i}>{part}</strong> : part
                                  );
                                };

                                return (
                                  <div key={index} className={`flex gap-3 ${index > 0 ? 'mt-4' : ''}`}>
                                    {/* Checkbox with tick mark for Box Breathing */}
                                    {selectedExercise?.name === 'Box Breathing (4-4-4-4)' && (
                                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24">
                                        {/* Blue circle */}
                                        <circle cx="12" cy="12" r="9" stroke="#067AC3" strokeWidth="2" fill="none" />
                                        {/* Black checkmark */}
                                        <path d="M9 12l2 2 4-4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                    <p>
                                      {item.label && <strong>{item.label}</strong>}{' '}
                                      {selectedExercise?.name === 'Box Breathing (4-4-4-4)' ? formatText(item.text) : item.text}
                                    </p>
                                  </div>
                                );
                              })}
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

                    {/* Preparation Bottom Sheet */}
                    {showPreparationSheet && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end"
                        onClick={() => setShowPreparationSheet(false)}
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
                              {exerciseContent[selectedExercise.name]?.preparationTitle || 'Preparation'}
                            </h2>

                            {/* Section Content */}
                            <div className="text-base text-gray-700 mb-6 leading-relaxed">
                              {exerciseContent[selectedExercise.name]?.preparationContent?.map((item, index) => (
                                <div key={index} className={`flex gap-3 ${index > 0 ? 'mt-4' : ''}`}>
                                  {/* Checkbox with tick mark */}
                                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24">
                                    {/* Blue circle */}
                                    <circle cx="12" cy="12" r="9" stroke="#067AC3" strokeWidth="2" fill="none" />
                                    {/* Black checkmark */}
                                    <path d="M9 12l2 2 4-4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  <p>
                                    {item.label && <strong>{item.label}</strong>} {item.text}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Close Button */}
                            <button
                              onClick={() => setShowPreparationSheet(false)}
                              className="w-full py-3 bg-gray-100 text-black text-base font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* When to use Bottom Sheet */}
                    {showWhenToUseSheet && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end"
                        onClick={() => setShowWhenToUseSheet(false)}
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
                              {exerciseContent[selectedExercise.name]?.whenToUseTitle || 'When to use'}
                            </h2>

                            {/* Section Content */}
                            <div className="text-base text-gray-700 mb-6 leading-relaxed">
                              {exerciseContent[selectedExercise.name]?.whenToUseContent?.map((item, index) => (
                                <div key={index} className={`flex gap-3 ${index > 0 ? 'mt-4' : ''}`}>
                                  {/* Checkbox with tick mark */}
                                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24">
                                    {/* Blue circle */}
                                    <circle cx="12" cy="12" r="9" stroke="#067AC3" strokeWidth="2" fill="none" />
                                    {/* Black checkmark */}
                                    <path d="M9 12l2 2 4-4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  <p>
                                    {item.label && <strong>{item.label}</strong>} {item.text}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Close Button */}
                            <button
                              onClick={() => setShowWhenToUseSheet(false)}
                              className="w-full py-3 bg-gray-100 text-black text-base font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Safety Bottom Sheet */}
                    {showSafetySheet && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end"
                        onClick={() => setShowSafetySheet(false)}
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
                              {exerciseContent[selectedExercise.name]?.safetyTitle || 'Safety'}
                            </h2>

                            {/* Section Content */}
                            <div className="text-base text-gray-700 mb-6 leading-relaxed">
                              {Array.isArray(exerciseContent[selectedExercise.name]?.safetyContent) ? (
                                exerciseContent[selectedExercise.name]?.safetyContent.map((item, index) => (
                                  <div key={index} className={`flex gap-3 ${index > 0 ? 'mt-4' : ''}`}>
                                    {/* Checkbox with tick mark */}
                                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24">
                                      {/* Blue circle */}
                                      <circle cx="12" cy="12" r="9" stroke="#067AC3" strokeWidth="2" fill="none" />
                                      {/* Black checkmark */}
                                      <path d="M9 12l2 2 4-4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p>
                                      {item.label && <strong>{item.label}</strong>} {item.text}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p>{exerciseContent[selectedExercise.name]?.safetyContent}</p>
                              )}
                            </div>

                            {/* Close Button */}
                            <button
                              onClick={() => setShowSafetySheet(false)}
                              className="w-full py-3 bg-gray-100 text-black text-base font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Customization Bottom Sheet - Only for Coherent Breathing */}
                    {showCustomizationSheet && selectedExercise?.name === 'Coherent Breathing' && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end"
                        onClick={() => setShowCustomizationSheet(false)}
                      >
                        <div
                          className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto animate-slide-up"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-6">
                            {/* Sheet Handle */}
                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

                            {/* Section Title */}
                            <h2 className="text-2xl font-bold mb-6 text-black">Personalize</h2>

                            {/* Cycles Selector */}
                            <div className="mb-6">
                              <label className="text-base font-semibold text-black mb-3 block">Cycles</label>
                              <div className="grid grid-cols-4 gap-2">
                                {[12, 18, 24, 30].map((cycles) => (
                                  <button
                                    key={cycles}
                                    onClick={() => {
                                      setCoherentCycles(cycles);
                                      const userId = currentUser?.uid;
                                      trackEvent('cycle_selected', {
                                        exercise: 'Coherent Breathing',
                                        cycles
                                      }, userId);
                                    }}
                                    className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                                      coherentCycles === cycles
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    {cycles}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Inhale-Exhale Timer Selector */}
                            <div className="mb-6">
                              <label className="text-base font-semibold text-black mb-3 block">Inhale-Exhale Timer</label>
                              <div className="grid grid-cols-3 gap-2">
                                {[4, 5, 6].map((seconds) => (
                                  <button
                                    key={seconds}
                                    onClick={() => setCoherentBreathTime(seconds)}
                                    className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                                      coherentBreathTime === seconds
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    {seconds}s
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Close Button */}
                            <button
                              onClick={() => setShowCustomizationSheet(false)}
                              className="w-full py-3 bg-gray-100 text-black text-base font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Customization Bottom Sheet - Only for Alternate Nostril */}
                    {showCustomizationSheet && selectedExercise?.name === 'Alternate Nostril' && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end"
                        onClick={() => setShowCustomizationSheet(false)}
                      >
                        <div
                          className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto animate-slide-up"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-6">
                            {/* Sheet Handle */}
                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

                            {/* Section Title */}
                            <h2 className="text-2xl font-bold mb-6 text-black">Personalize</h2>

                            {/* Cycles Selector */}
                            <div className="mb-6">
                              <label className="text-base font-semibold text-black mb-3 block">Cycles</label>
                              <div className="grid grid-cols-4 gap-2">
                                {[12, 18, 24, 30].map((cycles) => (
                                  <button
                                    key={cycles}
                                    onClick={() => {
                                      setAlternateNostrilCycles(cycles);
                                      const userId = currentUser?.uid;
                                      trackEvent('cycle_selected', {
                                        exercise: 'Alternate Nostril',
                                        cycles
                                      }, userId);
                                    }}
                                    className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                                      alternateNostrilCycles === cycles
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    {cycles}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Inhale-Exhale Timer Selector */}
                            <div className="mb-6">
                              <label className="text-base font-semibold text-black mb-3 block">Inhale-Exhale Timer</label>
                              <div className="grid grid-cols-3 gap-2">
                                {[4, 5, 6].map((seconds) => (
                                  <button
                                    key={seconds}
                                    onClick={() => setAlternateNostrilBreathTime(seconds)}
                                    className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                                      alternateNostrilBreathTime === seconds
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    {seconds}s
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Close Button */}
                            <button
                              onClick={() => setShowCustomizationSheet(false)}
                              className="w-full py-3 bg-gray-100 text-black text-base font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              Done
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
                          // Reset Coherent breathing customization to defaults
                          setCoherentCycles(6);
                          setCoherentBreathTime(5);
                          // Reset Alternate Nostril customization to defaults
                          setAlternateNostrilCycles(3);
                          setAlternateNostrilBreathTime(5);
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
                      {/* Timer Display - Show during all phases for Box Breathing, INHALE and EXHALE for others */}
                      {!exerciseCompleted && isExercising && countdown === null && (
                        selectedExercise?.name === 'Box Breathing (4-4-4-4)' ? (
                          /* Box Breathing: Show timer for ALL phases including HOLD */
                          <div className="text-center">
                            <div className="font-bold text-gray-900" style={{ fontSize: '4.32rem' }}>
                              {timer}
                            </div>
                          </div>
                        ) : (breathingPhase === 'inhale' || breathingPhase === 'exhale') ? (
                          /* Other exercises: Show timer only during INHALE and EXHALE */
                          <div className="text-center">
                            <div className="font-bold text-gray-900" style={{ fontSize: '4.32rem' }}>
                              {selectedExercise?.name === 'Coherent Breathing'
                                ? (breathingPhase === 'inhale'
                                    ? `${Math.floor(timer / 10)}s`  // INHALE: 0s to coherentBreathTime (e.g., 0s-6s)
                                    : `${Math.ceil(timer / 10)}s`)  // EXHALE: coherentBreathTime to 0s (e.g., 6s-0s)
                                : selectedExercise?.name === 'Alternate Nostril'
                                  ? (breathingPhase === 'inhale'
                                      ? `${Math.floor(timer / 10)}s`  // INHALE: 0s to alternateNostrilBreathTime (e.g., 0s-4s)
                                      : `${Math.ceil(timer / 10)}s`)  // EXHALE: alternateNostrilBreathTime to 0s (e.g., 4s-0s)
                                  : selectedExercise?.name === 'Physiological Sigh'
                                    ? (breathingPhase === 'inhale'
                                        ? `${Math.round(timer / 10)}s`  // INHALE: 0-39 → 0s-4s
                                        : `${Math.ceil(timer / 10)}s`)  // EXHALE: 79-0 → 8s-0s
                                    : selectedExercise?.name === '4-7-8 Breathing'
                                      ? (breathingPhase === 'inhale'
                                          ? `${Math.floor(timer / 10)}s`  // INHALE: 0-40 → 0s-4s
                                          : `${Math.ceil(timer / 10)}s`)  // EXHALE: 80-0 → 8s-0s
                                      : selectedExercise?.name === 'Humming Bee'
                                        ? (breathingPhase === 'inhale'
                                            ? `${Math.floor(timer / 10)}s`  // INHALE: 0-40 → 0s-4s
                                            : `${Math.ceil(timer / 10)}s`)  // EXHALE: 80-0 → 8s-0s
                                        : `${timer}s`
                              }
                            </div>
                          </div>
                        ) : null
                      )}
                    </div>

                    {/* Breathing Circles Area - 40% */}
                    <div className="flex-[0.4] rounded-lg flex flex-col items-center justify-center p-4">
                      {/* Show completion screen when exercise is completed */}
                      {exerciseCompleted ? (
                        <div className="flex flex-col items-center justify-center text-center gap-6">
                          <h2 className="font-bold text-black mb-6" style={{ fontSize: '1.59rem' }}>Completed</h2>
                          <div className="flex flex-col gap-3 w-full max-w-xs">
                            <button
                              onClick={() => {
                                setExerciseCompleted(false);
                                setIsExercising(false);
                                setSelectedExercise(null);
                                setTimer(0);
                                setCurrentCycle(0);
                                setBreathingPhase('inhale');
                                // Reset Coherent breathing customization to defaults
                                setCoherentCycles(6);
                                setCoherentBreathTime(5);
                                // Reset Alternate Nostril customization to defaults
                                setAlternateNostrilCycles(3);
                                setAlternateNostrilBreathTime(5);
                              }}
                              className="bg-black text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                              Return to Main Menu
                            </button>
                            <button
                              onClick={() => {
                                setExerciseCompleted(false);
                                setCurrentCycle(0);
                                // Box Breathing starts at timer 1, all other exercises start at 0
                                setTimer(selectedExercise?.name === 'Box Breathing (4-4-4-4)' ? 1 : 0);
                                setBreathingPhase('inhale');
                                setIsExercising(true);
                              }}
                              className="bg-white border-2 border-black text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                              Restart
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                      {/* Conditional Animation based on exercise */}
                      {selectedExercise?.name === 'Box Breathing (4-4-4-4)' ? (
                        <>
                          {/* Phase Indicator - 4 Boxes in Square Pattern (Clockwise) */}
                          <div className="flex-1 flex items-center justify-center w-full relative px-4">
                            <div className="flex flex-col items-center justify-center gap-1" style={{ maxWidth: '90vw', width: '100%', maxHeight: '80vh' }}>
                              {/* Top Row - Breathe In and Hold 1 */}
                              <div className="flex justify-center gap-1 w-full">
                                {/* Breathe In - Top Left */}
                                <div
                                  className="flex flex-col items-center justify-center rounded-2xl transition-all duration-300 flex-1 aspect-square max-w-[45vw]"
                                  style={{
                                    backgroundColor: (isExercising && countdown === null && breathingPhase === 'inhale') ? '#746996' : '#E5E7EB',
                                    minWidth: '178px',
                                    minHeight: '178px'
                                  }}
                                >
                                  <div className={`text-base font-semibold mb-2 text-center leading-tight ${(isExercising && countdown === null && breathingPhase === 'inhale') ? 'text-white' : 'text-gray-600'}`}>
                                    Breathe In
                                  </div>
                                  <div className={`text-2xl text-center ${(isExercising && countdown === null && breathingPhase === 'inhale') ? 'text-white' : 'text-gray-400'}`}>
                                    ↑
                                  </div>
                                </div>

                                {/* Hold 1 - Top Right */}
                                <div
                                  className="flex flex-col items-center justify-center rounded-2xl transition-all duration-300 flex-1 aspect-square max-w-[45vw]"
                                  style={{
                                    backgroundColor: (isExercising && countdown === null && breathingPhase === 'hold1') ? '#F6D0EA' : '#E5E7EB',
                                    minWidth: '178px',
                                    minHeight: '178px'
                                  }}
                                >
                                  <div className={`text-base font-semibold mb-2 text-center ${(isExercising && countdown === null && breathingPhase === 'hold1') ? 'text-gray-800' : 'text-gray-600'}`}>
                                    Hold Breath
                                  </div>
                                  <svg
                                    className={`${(isExercising && countdown === null && breathingPhase === 'hold1') ? 'text-gray-800' : 'text-gray-400'}`}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <rect x="6" y="4" width="4" height="16" rx="1"/>
                                    <rect x="14" y="4" width="4" height="16" rx="1"/>
                                  </svg>
                                </div>
                              </div>

                              {/* Bottom Row - Hold 2 and Breathe Out */}
                              <div className="flex justify-center gap-1 w-full">
                                {/* Hold 2 - Bottom Left */}
                                <div
                                  className="flex flex-col items-center justify-center rounded-2xl transition-all duration-300 flex-1 aspect-square max-w-[45vw]"
                                  style={{
                                    backgroundColor: (isExercising && countdown === null && breathingPhase === 'hold2') ? '#F6D0EA' : '#E5E7EB',
                                    minWidth: '178px',
                                    minHeight: '178px'
                                  }}
                                >
                                  <div className={`text-base font-semibold mb-2 text-center ${(isExercising && countdown === null && breathingPhase === 'hold2') ? 'text-gray-800' : 'text-gray-600'}`}>
                                    Hold Breath
                                  </div>
                                  <svg
                                    className={`${(isExercising && countdown === null && breathingPhase === 'hold2') ? 'text-gray-800' : 'text-gray-400'}`}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <rect x="6" y="4" width="4" height="16" rx="1"/>
                                    <rect x="14" y="4" width="4" height="16" rx="1"/>
                                  </svg>
                                </div>

                                {/* Breathe Out - Bottom Right */}
                                <div
                                  className="flex flex-col items-center justify-center rounded-2xl transition-all duration-300 flex-1 aspect-square max-w-[45vw]"
                                  style={{
                                    backgroundColor: (isExercising && countdown === null && breathingPhase === 'exhale') ? '#AD8FC6' : '#E5E7EB',
                                    minWidth: '178px',
                                    minHeight: '178px'
                                  }}
                                >
                                  <div className={`text-base font-semibold mb-2 text-center ${(isExercising && countdown === null && breathingPhase === 'exhale') ? 'text-white' : 'text-gray-600'}`}>
                                    Breathe Out
                                  </div>
                                  <div className={`text-2xl text-center ${(isExercising && countdown === null && breathingPhase === 'exhale') ? 'text-white' : 'text-gray-400'}`}>
                                    ↓
                                  </div>
                                </div>
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

                            {/* Blue-Violet Progress Circle - Shows during HOLD phase (7 seconds) */}
                            {breathingPhase === 'hold1' && animationReady && (
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
                                  stroke="#7469BB"
                                  strokeWidth="4"
                                  strokeDasharray="1131"
                                  strokeDashoffset={1131 - (1131 * (timer / 10) / 7)}
                                  style={{ transition: 'stroke-dashoffset 100ms linear' }}
                                  strokeLinecap="round"
                                />
                              </svg>
                            )}

                            {/* Single Expanding/Compressing Circle with Radial Gradient */}
                            {animationReady && !(breathingPhase === 'inhale' && timer === 0) && !(breathingPhase === 'exhale' && timer === 0) && (
                              <div
                                className="rounded-full absolute"
                                style={{
                                  width: `${get478CircleSize()}px`,
                                  height: `${get478CircleSize()}px`,
                                  background: 'radial-gradient(circle, rgba(116, 105, 187, 1) 0%, rgba(116, 105, 187, 0.6) 50%, rgba(116, 105, 187, 0.2) 100%)',
                                  boxShadow: '0 0 30px rgba(116, 105, 187, 0.5)',
                                  transition: 'all 100ms linear'
                                }}
                              />
                            )}

                            {/* Phase Text - At Center of Circles */}
                            <div className="absolute text-center">
                              <div
                                className={`text-lg font-semibold text-gray-800 uppercase tracking-wider ${
                                  breathingPhase === 'hold1' && animationReady ? 'pulse-hold' : ''
                                }`}
                              >
                                {breathingPhase === 'inhale' && animationReady && 'Breathe In'}
                                {breathingPhase === 'hold1' && animationReady && 'HOLD'}
                                {breathingPhase === 'exhale' && animationReady && 'Breathe Out'}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : selectedExercise?.name === 'Coherent Breathing' ? (
                        /* Coherent Breathing Animation */
                        <>
                          {/* Breathing Circle Illustration - Coherent */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Gray Background Circle - Blinks purple at transitions */}
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
                                className={timer === (coherentBreathTime * 10) || (timer === 0 && currentCycle > 0) ? 'blink-purple' : ''}
                              />
                            </svg>

                            {/* Single Expanding/Compressing Circle with Radial Gradient */}
                            <div
                              className="rounded-full absolute"
                              style={{
                                width: `${getCoherentCircleSize()}px`,
                                height: `${getCoherentCircleSize()}px`,
                                background: (() => {
                                  const size = getCoherentCircleSize();
                                  const intensity = size / 340; // 0 to 1, from empty to full

                                  // 5-color gradient sequence using all app colors: deep purple → medium purple → light purple → pale orchid → pale pink
                                  const colors = [
                                    { r: 116, g: 105, b: 182 },   // Deep Purple/Blue-Violet (empty)
                                    { r: 173, g: 136, b: 198 },   // Medium Purple/African Violet (25%)
                                    { r: 225, g: 175, b: 209 },   // Light Purple/Light Orchid (50%)
                                    { r: 246, g: 208, b: 234 },   // Pale Orchid (75%)
                                    { r: 255, g: 230, b: 230 }    // Pale Pink/Misty Rose (full)
                                  ];

                                  // Calculate which color segment we're in and interpolate
                                  let r, g, b;
                                  if (intensity <= 0.25) {
                                    // Interpolate between deep purple and medium purple
                                    const t = intensity / 0.25;
                                    r = Math.round(colors[0].r + (colors[1].r - colors[0].r) * t);
                                    g = Math.round(colors[0].g + (colors[1].g - colors[0].g) * t);
                                    b = Math.round(colors[0].b + (colors[1].b - colors[0].b) * t);
                                  } else if (intensity <= 0.5) {
                                    // Interpolate between medium purple and light purple
                                    const t = (intensity - 0.25) / 0.25;
                                    r = Math.round(colors[1].r + (colors[2].r - colors[1].r) * t);
                                    g = Math.round(colors[1].g + (colors[2].g - colors[1].g) * t);
                                    b = Math.round(colors[1].b + (colors[2].b - colors[1].b) * t);
                                  } else if (intensity <= 0.75) {
                                    // Interpolate between light purple and pale orchid
                                    const t = (intensity - 0.5) / 0.25;
                                    r = Math.round(colors[2].r + (colors[3].r - colors[2].r) * t);
                                    g = Math.round(colors[2].g + (colors[3].g - colors[2].g) * t);
                                    b = Math.round(colors[2].b + (colors[3].b - colors[2].b) * t);
                                  } else {
                                    // Interpolate between pale orchid and pale pink
                                    const t = (intensity - 0.75) / 0.25;
                                    r = Math.round(colors[3].r + (colors[4].r - colors[3].r) * t);
                                    g = Math.round(colors[3].g + (colors[4].g - colors[3].g) * t);
                                    b = Math.round(colors[3].b + (colors[4].b - colors[3].b) * t);
                                  }

                                  return `radial-gradient(circle, rgba(${r}, ${g}, ${b}, 1) 0%, rgba(${r}, ${g}, ${b}, 0.6) 50%, rgba(${r}, ${g}, ${b}, 0.2) 100%)`;
                                })(),
                                boxShadow: (() => {
                                  const size = getCoherentCircleSize();
                                  const intensity = size / 340;

                                  // Use same 5-color gradient for box shadow
                                  const colors = [
                                    { r: 116, g: 105, b: 182 },   // Deep Purple/Blue-Violet
                                    { r: 173, g: 136, b: 198 },   // Medium Purple/African Violet
                                    { r: 225, g: 175, b: 209 },   // Light Purple/Light Orchid
                                    { r: 247, g: 214, b: 236 },   // Pale Orchid
                                    { r: 255, g: 230, b: 230 }    // Pale Pink/Rose
                                  ];

                                  let r, g, b;
                                  if (intensity <= 0.25) {
                                    const t = intensity / 0.25;
                                    r = Math.round(colors[0].r + (colors[1].r - colors[0].r) * t);
                                    g = Math.round(colors[0].g + (colors[1].g - colors[0].g) * t);
                                    b = Math.round(colors[0].b + (colors[1].b - colors[0].b) * t);
                                  } else if (intensity <= 0.5) {
                                    const t = (intensity - 0.25) / 0.25;
                                    r = Math.round(colors[1].r + (colors[2].r - colors[1].r) * t);
                                    g = Math.round(colors[1].g + (colors[2].g - colors[1].g) * t);
                                    b = Math.round(colors[1].b + (colors[2].b - colors[1].b) * t);
                                  } else if (intensity <= 0.75) {
                                    const t = (intensity - 0.5) / 0.25;
                                    r = Math.round(colors[2].r + (colors[3].r - colors[2].r) * t);
                                    g = Math.round(colors[2].g + (colors[3].g - colors[2].g) * t);
                                    b = Math.round(colors[2].b + (colors[3].b - colors[2].b) * t);
                                  } else {
                                    const t = (intensity - 0.75) / 0.25;
                                    r = Math.round(colors[3].r + (colors[4].r - colors[3].r) * t);
                                    g = Math.round(colors[3].g + (colors[4].g - colors[3].g) * t);
                                    b = Math.round(colors[3].b + (colors[4].b - colors[3].b) * t);
                                  }

                                  return `0 0 30px rgba(${r}, ${g}, ${b}, 0.5)`;
                                })(),
                                transition: 'all 100ms linear'
                              }}
                            />

                            {/* Phase Text - At Center of Circle */}
                            <div className="absolute text-center">
                              <div
                                className={`text-lg font-semibold text-black uppercase tracking-wider`}
                              >
                                {breathingPhase === 'inhale' && animationReady && 'Breathe In'}
                                {breathingPhase === 'exhale' && animationReady && 'Breathe Out'}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : selectedExercise?.name === 'Physiological Sigh' ? (
                        /* Physiological Sigh Animation - Two-circle expanding effect */
                        <>
                          {/* Breathing Circle Illustration - Physiological Sigh */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Gray Background Circle */}
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

                            {(() => {
                              const { circle1Size, circle2Size } = getPhysiologicalSighCircleSizes();

                              return (
                                <>
                                  {/* Circle 2 - Lighter gradient (behind, larger) - Misty Rose to Pale Pink */}
                                  {circle2Size > 0 && (
                                    <div
                                      className="rounded-full absolute"
                                      style={{
                                        width: `${circle2Size}px`,
                                        height: `${circle2Size}px`,
                                        background: 'radial-gradient(circle, rgba(255, 230, 230, 1) 0%, rgba(246, 208, 234, 0.7) 50%, rgba(246, 208, 234, 0.3) 100%)',
                                        boxShadow: '0 0 30px rgba(246, 208, 234, 0.5)',
                                        transition: 'all 100ms linear',
                                        zIndex: 1
                                      }}
                                    />
                                  )}

                                  {/* Circle 1 - Darker gradient (front, smaller) - African Violet to Blue Violet */}
                                  {circle1Size > 0 && (
                                    <div
                                      className="rounded-full absolute"
                                      style={{
                                        width: `${circle1Size}px`,
                                        height: `${circle1Size}px`,
                                        background: 'radial-gradient(circle, rgba(173, 136, 198, 1) 0%, rgba(116, 105, 182, 0.8) 50%, rgba(116, 105, 182, 0.4) 100%)',
                                        boxShadow: '0 0 30px rgba(116, 105, 182, 0.5)',
                                        transition: 'all 100ms linear',
                                        zIndex: 2
                                      }}
                                    />
                                  )}
                                </>
                              );
                            })()}

                            {/* Phase Text - At Center of Circle */}
                            <div className="absolute text-center" style={{ zIndex: 3 }}>
                              <div
                                className={`text-lg font-semibold text-black uppercase tracking-wider`}
                              >
                                {breathingPhase === 'inhale' && animationReady && 'Breathe In'}
                                {breathingPhase === 'exhale' && animationReady && 'Breathe Out'}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : selectedExercise?.name === 'Alternate Nostril' ? (
                        /* Alternate Nostril Animation */
                        <>
                          {/* Breathing Container Illustration - Alternate Nostril */}
                          <div className="flex-1 flex items-center justify-center w-full relative px-4">
                            {/* Split square markers (50:50 left/right) with 8px gap */}
                            <div className="relative flex" style={{ gap: '8px' }}>
                              {/* Left Container */}
                              <div className="relative" style={{ width: '181.5px', height: '363px' }}>
                                {/* Gray outline */}
                                <svg width="181.5" height="363">
                                  <rect x="4" y="4" width="173.5" height="355" rx="15"
                                    fill="none" stroke="#E5E7EB" strokeWidth="4" />
                                </svg>

                                {/* Blue gradient fill - Left Nostril (even cycles: 0, 2, 4...) */}
                                {currentCycle % 2 === 0 && (() => {
                                  let heightPercent;
                                  if (breathingPhase === 'inhale') {
                                    heightPercent = timer / (alternateNostrilBreathTime * 10);
                                  } else if (breathingPhase === 'exhale') {
                                    heightPercent = timer / (alternateNostrilBreathTime * 10);
                                  } else {
                                    // hold2 or other phases: empty
                                    heightPercent = 0;
                                  }
                                  const heightPx = heightPercent * 355;
                                  const isFull = heightPercent >= 0.98; // Consider full at 98%+
                                  return (
                                    <div className="absolute" style={{
                                      bottom: '4px',
                                      left: '4px',
                                      width: '173.5px',
                                      height: `${heightPx}px`,
                                      background: 'linear-gradient(to top, rgba(6, 122, 195, 1) 0%, rgba(6, 122, 195, 0.6) 50%, rgba(6, 122, 195, 0.2) 100%)',
                                      borderRadius: isFull ? '15px' : '0 0 15px 15px',
                                      transition: 'height 100ms linear'
                                    }} />
                                  );
                                })()}

                                {/* Phase Text - Left Nostril */}
                                {currentCycle % 2 === 0 && (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <div className="text-lg font-semibold text-gray-900 uppercase tracking-wider">
                                      {breathingPhase === 'inhale' && 'Breathe In'}
                                      {breathingPhase === 'exhale' && 'Breathe Out'}
                                    </div>
                                    <div className="text-sm text-gray-700 mt-1">
                                      Left Nostril
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Right Container */}
                              <div className="relative" style={{ width: '181.5px', height: '363px' }}>
                                {/* Gray outline */}
                                <svg width="181.5" height="363">
                                  <rect x="4" y="4" width="173.5" height="355" rx="15"
                                    fill="none" stroke="#E5E7EB" strokeWidth="4" />
                                </svg>

                                {/* Blue gradient fill - Right Nostril (odd cycles: 1, 3, 5...) */}
                                {currentCycle % 2 === 1 && (() => {
                                  let heightPercent;
                                  if (breathingPhase === 'inhale') {
                                    heightPercent = timer / (alternateNostrilBreathTime * 10);
                                  } else if (breathingPhase === 'exhale') {
                                    heightPercent = timer / (alternateNostrilBreathTime * 10);
                                  } else {
                                    // hold2 or other phases: empty
                                    heightPercent = 0;
                                  }
                                  const heightPx = heightPercent * 355;
                                  const isFull = heightPercent >= 0.98; // Consider full at 98%+
                                  return (
                                    <div className="absolute" style={{
                                      bottom: '4px',
                                      left: '4px',
                                      width: '173.5px',
                                      height: `${heightPx}px`,
                                      background: 'linear-gradient(to top, rgba(6, 122, 195, 1) 0%, rgba(6, 122, 195, 0.6) 50%, rgba(6, 122, 195, 0.2) 100%)',
                                      borderRadius: isFull ? '15px' : '0 0 15px 15px',
                                      transition: 'height 100ms linear'
                                    }} />
                                  );
                                })()}

                                {/* Phase Text - Right Nostril */}
                                {currentCycle % 2 === 1 && (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <div className="text-lg font-semibold text-gray-900 uppercase tracking-wider">
                                      {breathingPhase === 'inhale' && 'Breathe In'}
                                      {breathingPhase === 'exhale' && 'Breathe Out'}
                                    </div>
                                    <div className="text-sm text-gray-700 mt-1">
                                      Right Nostril
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : selectedExercise?.name === 'Humming Bee' ? (
                        /* Humming Bee Animation - Similar to Coherent Breathing */
                        <>
                          {/* Breathing Circle Illustration - Humming Bee */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Gray Background Circle */}
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

                            {/* Single Expanding/Compressing Circle with Radial Gradient */}
                            <div
                              className="rounded-full absolute"
                              style={{
                                width: `${getHummingBeeCircleSize()}px`,
                                height: `${getHummingBeeCircleSize()}px`,
                                background: 'radial-gradient(circle, rgba(6, 122, 195, 1) 0%, rgba(6, 122, 195, 0.6) 50%, rgba(6, 122, 195, 0.2) 100%)',
                                boxShadow: '0 0 30px rgba(6, 122, 195, 0.5)',
                                transition: 'all 100ms linear'
                              }}
                            />

                            {/* Phase Text - At Center of Circle */}
                            <div className="absolute text-center">
                              {breathingPhase === 'inhale' ? (
                                <div className="text-lg font-semibold text-white uppercase tracking-wider">
                                  Breathe In
                                </div>
                              ) : (
                                <div>
                                  <div className="text-lg font-semibold text-white uppercase tracking-wider">
                                    Breathe Out
                                  </div>
                                  <div className="text-sm text-white mt-1">
                                    With Hum
                                  </div>
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
                        </>
                      )}
                    </div>

                    {/* Pattern Info Section - 10% */}
                    <div className="flex-[0.1] flex items-center justify-center pt-[5px]">
                      {/* Pattern info removed - tabs now shown within the exercise animation area */}
                    </div>

                    {/* Exercise Starting Section - 5% */}
                    <div className="flex-[0.05] flex items-center justify-center">
                      {/* Countdown Progress Bar - Show during countdown (only on first start, not after completion) */}
                      {countdown !== null && countdown > 0 && !exerciseCompleted && (
                        <div className="w-full max-w-xs px-4">
                          <span className="text-sm text-gray-600 font-medium mb-2 block text-center">
                            Exercise starting...
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
                                    index >= (3 - countdown) ? 'bg-[#9370DB]' : 'bg-transparent'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Legend for Physiological Sigh - Show after countdown completes with 150ms delay */}
                      {selectedExercise?.name === 'Physiological Sigh' && showLegend && (
                        <div className="flex items-center justify-center gap-6">
                          {/* Part 1 Gradient Legend (75% - First 3 seconds) */}
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ background: 'linear-gradient(135deg, #FFE6E6 0%, #F6D0EA 50%, #E1AFD1 100%)' }}></div>
                            <span className="text-sm text-gray-700 font-medium">Long breath (0-3s)</span>
                          </div>
                          {/* Part 2 Gradient Legend (25% - Last 1 second) */}
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ background: 'linear-gradient(135deg, #AD88C6 0%, #9179BE 50%, #7469B6 100%)' }}></div>
                            <span className="text-sm text-gray-700 font-medium">Quick short breath (1s)</span>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Navigation Section - 15% (hide when completed) */}
                    {!exerciseCompleted && (
                    <div className="flex-[0.15] flex flex-col items-center justify-end pb-8">
                      <div className="flex items-center justify-center w-full max-w-md px-4">
                      {/* Start/Pause Button - Centered */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (exerciseCompleted) {
                            // Restart exercise from beginning with countdown
                            setExerciseCompleted(false);
                            setCountdown(3);
                            setIsPaused(false);
                            setCurrentCycle(0);
                            setBreathingPhase('inhale');
                            setTimer(selectedExercise?.name === 'Physiological Sigh' ? 0 : 0);
                            phaseHoldRef.current = false; // Reset phase hold flag
                          } else if (isPaused) {
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
                        className={`w-20 h-20 rounded-full hover:opacity-90 transition-opacity font-medium text-sm border-2 flex items-center justify-center ${
                          isPaused || exerciseCompleted
                            ? 'bg-black text-white border-black'
                            : 'bg-transparent text-black border-black'
                        }`}
                      >
                        {exerciseCompleted || isPaused ? 'Start' : 'Pause'}
                      </button>
                      </div>
                    </div>
                    )}
                  </div>
                ) : selectedOption === 'focus' || selectedOption === 'calm' ? (
                  /* Development Message for Focus and Calm */
                  <div className="flex items-center justify-center py-12 text-center">
                    <p className="text-gray-400 text-sm">Feature is still in development</p>
                  </div>
                ) : (
                  /* Track List */
                  <div className="flex flex-col flex-1 min-h-0">
                    {selectedOption === 'breathe' && (
                      <div className="mt-1 mb-4 flex-shrink-0">
                        <h3 className="font-semibold text-2xl text-black">
                          Select a breathing technique
                        </h3>
                      </div>
                    )}
                    <div className="overflow-y-auto flex-1 min-h-0 hide-scrollbar">
                      {currentTracks.map((track, index) => (
                      <button
                        key={track.id}
                        onClick={() => {
                          if (selectedOption === 'breathe') {
                            // Show info screen for breathing exercises
                            setSelectedExercise(track);
                            setShowingInfo(true);
                          }
                        }}
                        className="w-full flex items-start py-4 border-b border-gray-200 hover:bg-gray-50 hover:opacity-70 transition-all group"
                    >
                      <div className="text-left flex-1">
                        <p className="text-base font-semibold text-black">{track.name}</p>
                        {selectedOption === 'breathe' && (() => {
                          const metadata = getExerciseMetadata(track.name);
                          return (
                            <>
                              <div className="text-gray-500 mt-1" style={{ fontSize: '13px' }}>
                                <p>
                                  <span className="font-bold">Helps with:</span> {metadata.bestFor}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <p>
                                    <span className="font-bold">Ideal time:</span> {metadata.idealSession}
                                  </p>
                                  <DifficultyIndicator level={getDifficultyLevel(track.name)} />
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {/* Right Side - Duration or Chevron */}
                      {selectedOption === 'breathe' ? (
                        <div className="flex items-center ml-4 self-center">
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">{track.duration}</span>
                      )}
                    </button>
                      ))}
                    </div>
                  </div>
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
            ) : (
              /* Placeholder pages for other menu options */
              <div className="music-player-desktop music-player-frame bg-white border-2 border-white rounded-3xl p-8 flex flex-col w-full lg:flex-shrink-0 relative overflow-y-auto" style={{ maxHeight: '90vh' }}>
                {/* Header with Back Button */}
                <div className="flex items-center mb-6 pb-4 border-b border-gray-300">
                  <button
                    onClick={() => setCurrentView('interactive')}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                    </svg>
                    <span>Back</span>
                  </button>
                  <h2 className="flex-1 text-center text-xl font-semibold text-black pr-12">
                    {currentView === 'support' && 'Support the App'}
                    {currentView === 'faqs' && 'FAQs'}
                    {currentView === 'privacy' && 'Privacy Policy'}
                    {currentView === 'terms' && 'Terms & Conditions'}
                    {currentView === 'breathing-info' && 'Why Intentional Breathing Helps'}
                  </h2>
                </div>

                {/* Content */}
                {currentView === 'faqs' ? (
                  <div className="flex flex-col py-6 text-left space-y-8 max-w-3xl mx-auto">
                    {/* General Section */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-4">General</h3>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">What is this app?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          This is a minimal, science-backed breathing app designed to help you detach from the noise of modern life. It offers a clean, distraction-free environment to help you reset—on your terms, in your time. No subscriptions, no gamification, no clutter.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">Why did you create this app?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          We built this because we couldn't find anything like it. Most apps were too noisy, too feature-heavy, or too focused on engagement. We wanted a simple, effective space for stillness—no voiceovers, no upsells, no pressure. Just sound, breath, and choice.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">Who is this app for?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          This is for people who are tired of constant noise—external and internal. If you're looking for a quiet companion that doesn't demand your attention, this is for you. No achievements. No streaks. Just space to breathe.
                        </p>
                      </div>
                    </section>

                    {/* Features Section */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-4">Features</h3>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">What breathing exercises are available?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          The app offers six distinct breathing exercises, each carefully curated to support different needs—whether you want to calm down, refocus, or simply pause.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">Can I customize the exercises?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Yes. Every breathing exercise allows you to choose how many cycles you want to complete. In the Coherent Breathing exercise, you can also adjust the inhale and exhale timer to suit your preferences.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">Does the app include guidance or preparation advice?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed mb-2">
                          Absolutely. Each exercise comes with a curated list of:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed ml-4">
                          <li>Tips</li>
                          <li>Preparation advice</li>
                          <li>When to try it</li>
                          <li>Precautions</li>
                        </ul>
                        <p className="text-gray-700 text-sm leading-relaxed mt-2">
                          This helps you make informed choices without being overwhelmed.
                        </p>
                      </div>
                    </section>

                    {/* Accessibility & Availability Section */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-4">Accessibility & Availability</h3>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">What platforms is the app available on?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Currently, the app is available only on the web. If demand continues, we'll explore building native mobile apps for iOS and Android.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">Do I need to create an account or sign in?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          No account required. We intentionally keep things simple and private.
                        </p>
                      </div>
                    </section>

                    {/* Cost & Monetization Section */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-4">Cost & Monetization</h3>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">Is the app free?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Yes, the app is 100% free to use. No subscriptions, no hidden fees, no upsells.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">Are there plans to monetize the app?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          We're considering adding an optional donation feature to help support hosting and future improvements. If implemented, it will be entirely optional—no pressure, ever.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">Will there ever be badges, rewards, or streaks?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          No. That's not what this app is about. We don't believe rest should be gamified.
                        </p>
                      </div>
                    </section>

                    {/* Philosophy & Community Section */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-4">Philosophy & Community</h3>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">What makes this app different from other wellness apps?</h4>
                        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed ml-4 space-y-2">
                          <li><span className="font-semibold">No distractions:</span> No pop-ups, no guided meditations, no complex dashboards.</li>
                          <li><span className="font-semibold">Evidence-based:</span> Breathing techniques and sound design are grounded in science, not trends.</li>
                          <li><span className="font-semibold">Minimalist design:</span> Built to help you detach, not keep you engaged.</li>
                          <li><span className="font-semibold">No algorithms:</span> We don't track your habits or try to increase "time in app."</li>
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">Is this part of a larger movement or community?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          It's not a movement—it's a mindset. A small collective of people who believe the most radical thing we can do is rest our minds. You're invited to use the app however and whenever you need it.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-black mb-2">How can I support this project?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Use it. Share it if you think someone else might need it. And if a donation feature is added in the future, support us if you feel moved to.
                        </p>
                      </div>
                    </section>

                    {/* Still Have Questions Section */}
                    <section className="border-t border-gray-300 pt-6">
                      <h3 className="text-lg font-bold text-black mb-4">Still Have Questions?</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Feel free to reach out to us directly through the app. We're always open to feedback and conversation, but we'll never spam you or push notifications.
                      </p>
                    </section>
                  </div>
                ) : currentView === 'privacy' ? (
                  <div className="flex flex-col py-6 text-left space-y-6 max-w-3xl mx-auto">
                    <p className="text-xs text-gray-600 italic">Last updated: January 9, 2026</p>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      We respect your privacy. This policy explains how we collect, use, and protect your data when you use our breathing app, currently available via web and powered by Firebase services.
                    </p>

                    {/* 1. Who We Are */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">1. Who We Are</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        This app is developed and operated by a small independent team based in India. Our mission is to offer a minimal, distraction-free space to breathe—without advertising, upsells, or pressure.
                      </p>
                    </section>

                    {/* 2. What Data We Collect */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">2. What Data We Collect</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        We do not collect or store any personal information beyond what is essential for app functionality.
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">We collect the following data:</p>

                      <div className="ml-4 mb-4">
                        <h4 className="text-sm font-semibold text-black mb-2">Authentication Data</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          When you log in via Google Authentication, Firebase (a Google service) verifies your identity. We do not store your email address or Google profile data in our own databases.
                        </p>
                      </div>

                      <div className="ml-4">
                        <h4 className="text-sm font-semibold text-black mb-2">App Activity Data</h4>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                          We track non-personal, anonymized usage information such as:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed ml-4 mb-2">
                          <li>Exercises started</li>
                          <li>Duration of usage</li>
                          <li>Frequency and timestamps</li>
                          <li>Crashes or errors (via Crashlytics)</li>
                        </ul>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          This helps us improve the app and understand what features are most helpful.
                        </p>
                      </div>
                    </section>

                    {/* 3. How We Use Your Data */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">3. How We Use Your Data</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        We use the above data only for the following purposes:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed ml-4 mb-3">
                        <li>To provide and improve app functionality</li>
                        <li>To monitor app stability and fix issues</li>
                        <li>To understand overall usage patterns</li>
                        <li>To ensure login security via Google Authentication</li>
                      </ul>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">We do not:</p>
                      <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed ml-4">
                        <li>Sell your data</li>
                        <li>Share your data with advertisers</li>
                        <li>Track you across other sites or apps</li>
                      </ul>
                    </section>

                    {/* 4. Third-Party Services */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">4. Third-Party Services</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        We rely on the following third-party services, which may process limited data:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed ml-4 mb-3">
                        <li>Firebase Authentication (Google LLC) – for login via Google</li>
                        <li>Firebase Analytics – for anonymous usage tracking</li>
                        <li>Firebase Crashlytics – for crash/error reporting</li>
                      </ul>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        These services are governed by{' '}
                        <a
                          href="https://policies.google.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Google's Privacy Policy
                        </a>.
                      </p>
                    </section>

                    {/* 5. Your Rights */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">5. Your Rights</h3>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-black mb-2">Under GDPR (EU/EEA) and Indian law:</p>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">You have the right to:</p>
                        <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed ml-4">
                          <li>Request access to the data we hold (limited to app activity logs)</li>
                          <li>Request correction or deletion of your data</li>
                          <li>Withdraw consent at any time (by stopping use of the app)</li>
                        </ul>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-black mb-2">Under California Consumer Privacy Act (CCPA):</p>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">You have the right to:</p>
                        <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed ml-4">
                          <li>Know what data we collect and how we use it</li>
                          <li>Request deletion of your data</li>
                          <li>Opt-out of the sale of personal data (we do not sell any data)</li>
                        </ul>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">
                        To exercise your rights, contact us at: <span className="font-semibold">myemail@email.com</span>
                      </p>
                    </section>

                    {/* 6. Data Retention */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">6. Data Retention</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        We retain activity logs (anonymized) for up to 12 months, to monitor usage patterns and improve functionality. After this, data may be deleted or aggregated.
                      </p>
                    </section>

                    {/* 7. Account Deletion */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">7. Account Deletion</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        We use Google Authentication for login but do not create standalone user accounts. Therefore, there is no separate "account" to delete. However, if you'd like us to remove your activity data, you may contact us using the email below.
                      </p>
                    </section>

                    {/* 8. Data Storage Location */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">8. Data Storage Location</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        All data is stored securely using Firebase, hosted on Google Cloud infrastructure. Data may be stored in servers located in the United States, EU, or Asia, subject to Google's data policies.
                      </p>
                    </section>

                    {/* 9. Changes to This Policy */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">9. Changes to This Policy</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        We may update this Privacy Policy as our app evolves. We will post the updated version with a new "last updated" date. Continued use of the app implies your acceptance of any changes.
                      </p>
                    </section>

                    {/* 10. Contact Us */}
                    <section className="border-t border-gray-300 pt-6">
                      <h3 className="text-base font-bold text-black mb-3">10. Contact Us</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        If you have any questions or concerns about your privacy, contact us at:
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        📧 <span className="font-semibold">myemail@email.com</span>
                      </p>
                    </section>
                  </div>
                ) : currentView === 'terms' ? (
                  <div className="flex flex-col py-6 text-left space-y-6 max-w-3xl mx-auto">
                    <p className="text-xs text-gray-600 italic">Last updated: January 9, 2026</p>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      Welcome to our breathing app. Please read these Terms and Conditions ("Terms") carefully before using the app. By accessing or using the app, you agree to be bound by these Terms.
                    </p>

                    <p className="text-sm text-gray-700 leading-relaxed font-semibold">
                      If you do not agree to these Terms, please do not use the app.
                    </p>

                    {/* 1. Who We Are */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">1. Who We Are</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        This app is developed by a small team based in India, offering a minimalist, free breathing tool. We do not serve ads, offer upsells, or sell your data.
                      </p>
                    </section>

                    {/* 2. Use of the App */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">2. Use of the App</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        You may use the app for personal, non-commercial purposes only. You must not:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed ml-4 mb-3">
                        <li>Use the app for unlawful or harmful purposes</li>
                        <li>Attempt to reverse-engineer, copy, or distribute the app or its content</li>
                        <li>Use automated systems to access the app or collect data</li>
                      </ul>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        We reserve the right to suspend or terminate access if misuse is detected.
                      </p>
                    </section>

                    {/* 3. Google Authentication */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">3. Google Authentication</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        The app uses Firebase Authentication for Google sign-in. We do not store your email or personal information outside of Firebase. By using the sign-in feature, you also agree to Google's terms and privacy practices.
                      </p>
                    </section>

                    {/* 4. Health Disclaimer */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">4. Health Disclaimer</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        This app provides general breathing exercises for relaxation and focus. It is not a substitute for professional medical advice or treatment.
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed ml-4">
                        <li>Use at your own risk.</li>
                        <li>If you have respiratory, cardiac, or neurological conditions, consult your doctor before using the app.</li>
                        <li>We are not responsible for any outcomes resulting from the use of the exercises.</li>
                      </ul>
                    </section>

                    {/* 5. Intellectual Property */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">5. Intellectual Property</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        All content in the app—including visuals, sound design, and breathing patterns—is owned by the app creators or used with permission.
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        You may not copy, reproduce, distribute, or modify any part of the app without explicit written consent.
                      </p>
                    </section>

                    {/* 6. Limitation of Liability */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">6. Limitation of Liability</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        The app is provided "as is" and "as available" without warranties of any kind.
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        To the fullest extent permitted by law, we disclaim all liability for:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed ml-4">
                        <li>Direct, indirect, incidental, or consequential damages</li>
                        <li>Health-related outcomes</li>
                        <li>Service interruptions or data loss</li>
                      </ul>
                    </section>

                    {/* 7. Privacy */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">7. Privacy</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Your use of the app is also governed by our{' '}
                        <button
                          onClick={() => setCurrentView('privacy')}
                          className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                        >
                          Privacy Policy
                        </button>
                        , which explains how we collect and use data, including through Firebase Analytics and Crashlytics.
                      </p>
                    </section>

                    {/* 8. Changes to the Terms */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">8. Changes to the Terms</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        We may update these Terms occasionally. Changes will be posted with an updated effective date. Continued use of the app implies your acceptance of the revised Terms.
                      </p>
                    </section>

                    {/* 9. Governing Law */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">9. Governing Law</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        These Terms are governed by the laws of India, without regard to conflict of law principles.
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
                      </p>
                    </section>

                    {/* 10. Contact Us */}
                    <section className="border-t border-gray-300 pt-6">
                      <h3 className="text-base font-bold text-black mb-3">10. Contact Us</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        If you have any questions about these Terms, please contact us at:
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        📧 <span className="font-semibold">myemail@email.com</span>
                      </p>
                    </section>
                  </div>
                ) : currentView === 'breathing-info' ? (
                  <div className="flex flex-col py-6 text-left space-y-6 max-w-3xl mx-auto">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Our breath is the fastest way to change how you feel—anytime, anywhere.
                    </p>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      Most of us breathe all day without noticing it. But when you intentionally guide your breath, something powerful happens: your nervous system listens. Heart rate slows. The mind becomes clearer. Stress loosens its grip.
                    </p>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      That's the promise behind The Hush Initiative—a calm, science-backed space where breathing becomes a daily ally, not another task on your list.
                    </p>

                    {/* Why breathing works */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">Why breathing works (and why you feel it so quickly)</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        Slow, rhythmic breathing gently activates your body's natural "rest and restore" response. This helps:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed ml-4 space-y-2">
                        <li>Lower stress and anxiety by signalling safety to the brain</li>
                        <li>Improve focus and decision-making during busy or high-pressure moments</li>
                        <li>Support better sleep by easing your body out of fight-or-flight</li>
                        <li>Build emotional resilience over time, so stress has less staying power</li>
                      </ul>
                      <p className="text-sm text-gray-700 leading-relaxed mt-3">
                        Even short sessions—just five minutes—can create noticeable shifts. With consistency, those shifts become your new baseline.
                      </p>
                    </section>

                    {/* Techniques */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">Techniques you'll experience inside the app</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        The Hush Initiative blends proven breathing techniques with calming visual animations, so your body can follow along effortlessly:
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-black mb-1">Cyclic Sighing (for mood resets)</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            A double inhale followed by a long exhale helps release tension quickly—ideal when emotions feel heavy or overwhelming.
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-black mb-1">Box Breathing (for focus)</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Equal, steady counts guide you back to clarity before a meeting or challenging task.
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-black mb-1">4-7-8 Breathing (for sleep)</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Longer exhales cue deep relaxation, making it easier to fall—and stay—asleep.
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-black mb-1">Alternate Nostril Breathing (for balance)</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            A gentle rhythm that supports calm, centered energy throughout the day.
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed mt-4">
                        The visuals do the counting for you. You simply breathe.
                      </p>
                    </section>

                    {/* Make it a habit */}
                    <section>
                      <h3 className="text-base font-bold text-black mb-3">Make it a habit, not a chore</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Use the app as a pause between moments: morning grounding, a midday reset, or a nighttime wind-down. Pair it with something you already do—coffee brewing, brushing your teeth, setting your alarm—and let repetition work its quiet magic.
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed mt-3">
                        The result: fewer reactive moments, more clarity, deeper rest—and a growing sense that calm is something you can access on demand.
                      </p>
                    </section>

                    {/* Closing */}
                    <section className="border-t border-gray-300 pt-6">
                      <p className="text-sm text-gray-700 leading-relaxed font-semibold mb-2">
                        One breath won't change your life.
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        But a few mindful breaths, practiced daily, can change how your life feels.
                      </p>
                    </section>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-gray-400 text-sm">This page is coming soon</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

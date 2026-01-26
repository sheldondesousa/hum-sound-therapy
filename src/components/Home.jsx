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
  const [showCarousel, setShowCarousel] = useState(false);
  const completionTrackedRef = useRef(false);
  const phaseHoldRef = useRef(false); // Track if we've held at final timer value for animation completion
  const nextPhaseRef = useRef(null); // Track target phase for Box Breathing transitions
  const audioRef = useRef(null); // Reference to audio element

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
  const [showMusicSheet, setShowMusicSheet] = useState(false); // Track music selection bottom sheet visibility
  const [selectedMusic, setSelectedMusic] = useState(null); // Track selected music track (null = no music)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // Track if description is expanded
  const [isDarkMode, setIsDarkMode] = useState(true); // Track light/dark mode (default: dark)
  const [selectedTab, setSelectedTab] = useState(null); // Track selected tab in info screen: 'customize', 'start', 'sound'

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
        case 'Box Breathing':
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
      setTimer(selectedExercise?.name === 'Box Breathing' ? 1 : 0);
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

  // Show animation with 300ms delay after countdown completes for 4-7-8 Breathing, Coherent Breathing, Physiological Sigh, and Humming Bee
  useEffect(() => {
    const is478 = selectedExercise?.name === '4-7-8 Breathing';
    const isCoherent = selectedExercise?.name === 'Coherent Breathing';
    const isPhysiological = selectedExercise?.name === 'Physiological Sigh';
    const isHummingBee = selectedExercise?.name === 'Humming Bee';
    if ((is478 || isCoherent || isPhysiological || isHummingBee) && isExercising && countdown === null && !exerciseCompleted) {
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

  // Audio playback effect - sync music with exercise
  useEffect(() => {
    // Music track URLs mapping (placeholder paths - update with actual audio file paths)
    const musicTracks = {
      nature: '/audio/nature-sounds.mp3',
      ambient: '/audio/ambient-music.mp3',
      binaural: '/audio/binaural-beats.mp3',
      ocean: '/audio/ocean-waves.mp3'
    };

    // Create or update audio element when music selection changes
    if (selectedMusic && musicTracks[selectedMusic]) {
      if (!audioRef.current) {
        audioRef.current = new Audio(musicTracks[selectedMusic]);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;
      } else if (audioRef.current.src !== musicTracks[selectedMusic]) {
        audioRef.current.pause();
        audioRef.current.src = musicTracks[selectedMusic];
      }
    } else if (!selectedMusic && audioRef.current) {
      // Stop and clear audio if no music selected
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Control playback based on exercise state
    if (audioRef.current) {
      if (isExercising && !isPaused && countdown === null) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      } else {
        audioRef.current.pause();
      }
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [selectedMusic, isExercising, isPaused, countdown]);

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
        <span className="text-sm" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>Effort</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((circle) => {
            const isFilled = circle <= Math.floor(level);
            const isHalf = circle === Math.ceil(level) && level % 1 !== 0;

            return (
              <div
                key={circle}
                className="w-2 h-2 rounded-full relative overflow-hidden"
                style={{
                  backgroundColor: isFilled ? (isDarkMode ? '#FFFFFF' : '#000000') : 'transparent',
                  border: !isFilled && !isHalf ? `1px solid ${isDarkMode ? '#9CA3AF' : '#6B7280'}` : 'none'
                }}
              >
                {isHalf && (
                  <>
                    <div className="absolute inset-0 w-1/2" style={{ backgroundColor: isDarkMode ? '#FFFFFF' : '#000000' }} />
                    <div className="absolute inset-0 w-full h-full rounded-full" style={{ border: `1px solid ${isDarkMode ? '#9CA3AF' : '#6B7280'}` }} />
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
    <div className="min-h-screen" style={{
      backgroundImage: 'url(/LoginScreen.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.3)',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>
      <style>{`
        @media (min-width: 1024px) {
          .music-player-desktop {
            width: 430px !important;
            height: min(932px, 90vh) !important;
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
      <div className="flex min-h-screen flex-col lg:flex-row" style={{ position: 'relative', zIndex: 1 }}>
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
              className="block w-full text-left text-base text-black hover:opacity-70 transition-opacity pt-6 pb-6 border-b border-gray-300"
            >
              Logout
            </button>

            {/* Theme Toggle */}
            <div className="pt-6 flex items-center justify-between">
              <span className="text-base text-black">Dark Mode</span>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{ backgroundColor: isDarkMode ? '#7469B6' : '#D1D5DB' }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  style={{ transform: isDarkMode ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
                />
              </button>
            </div>
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
                  className="block w-full text-left text-base text-black hover:opacity-70 transition-opacity pt-6 pb-6 border-b border-gray-300"
                >
                  Logout
                </button>

                {/* Theme Toggle */}
                <div className="pt-6 flex items-center justify-between">
                  <span className="text-base text-black">Dark Mode</span>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    style={{ backgroundColor: isDarkMode ? '#7469B6' : '#D1D5DB' }}
                  >
                    <span
                      className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      style={{ transform: isDarkMode ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
                    />
                  </button>
                </div>
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
                    I didn't need another course, another process, another seven-step journey to inner peace. I didn't need a meditation app that felt like homework or a wellness subscription that made me feel guilty for not "keeping up."
                  </p>

                  <p className="text-base">
                    I just needed to breathe. I needed something I could turn to—on my terms, in my time—that would let me detach. Not forever, just for a moment. A space where I could float, focus, or simply let my mind rest from its constant race.
                  </p>

                  <div>
                    <h3 className="font-bold text-lg mb-3">What I Couldn't Find</h3>
                    <p className="text-base">
                      I found were apps that were visually overwhelming, full of upsells, cluttered with features I didn't want. Apps that promised calm but delivered complexity. Apps that felt like they were designed to keep me engaged rather than let me disconnect.
                    </p>
                  </div>

                  <p className="text-base">
                    I wanted the opposite: minimalism that matches the clarity I was seeking. I wanted something backed by science—real evidence, not wellness buzzwords. Something simple, honest, and effective. Something that did one thing exceptionally well instead of everything moderately.
                  </p>

                  <div>
                    <h3 className="font-bold text-lg mb-3">The 'Aha' Moment</h3>
                    <p className="text-base">
                      It happened when I started experimenting with breathing and sound. Not guided meditations, just breathing and sound. Pure, intentional, evidence-based exercises and frequencies designed to help the brain do what it naturally wants to do: settle. No voice telling me how to breathe. No subscription gate. No achievement badges or streaks.
                    </p>
                  </div>

                  <p className="text-base">
                    That's when I realized: this is what I'd been looking for. And if I was searching for it, maybe others were too.
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
                style={{
                  backgroundColor: isDarkMode ? '#333' : '#FFFFFF',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
                }}
              >
              {/* Profile & Metrics Section - Show when on breathing exercises listing */}
              {!(selectedOption === 'breathe' && selectedExercise) && selectedOption === 'breathe' && (
                <div className="mb-6 flex-shrink-0">
                  {/* Profile Section */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                      <h2 className="text-lg font-semibold truncate" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                        Hello {currentUser?.displayName?.split(' ')[0] || 'User'}!
                      </h2>
                    </div>
                  </div>

                  {/* Motivational Text */}
                  <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'SF Pro Display', sans-serif", color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                    Take a deep breath<br />and relax
                  </h1>

                  {/* Gradient Separator */}
                  <div
                    className="w-full h-1 mb-4 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, #7469B6, #AD88C6, #E1AFD1, #F6D0EA, #FFE6E6)'
                    }}
                  />

                  {/* Why Breathing Helps - Working Carousel */}
                  {showCarousel && (
                  <div className="mb-6">
                    <div
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onMouseDown={handleTouchStart}
                      onMouseMove={handleTouchMove}
                      onMouseUp={handleTouchEnd}
                      onMouseLeave={handleTouchEnd}
                      className="w-full rounded-2xl p-6 text-left relative overflow-hidden transition-all duration-300 cursor-grab active:cursor-grabbing select-none"
                      style={{
                        backgroundColor: carouselCards[carouselIndex].backgroundColor,
                        color: carouselCards[carouselIndex].textColor,
                        height: '240px'
                      }}
                    >
                      {/* Close X Button - Top Right */}
                      <button
                        onClick={() => setShowCarousel(false)}
                        className="absolute top-3 right-3 z-20 p-2 transition-all hover:scale-110 active:scale-95"
                        style={{
                          color: carouselCards[carouselIndex].textColor
                        }}
                        aria-label="Close carousel"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>

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
                  )}
                </div>
              )}

              {/* Album Art & Info - Show for other options (focus/calm) */}
              {!(selectedOption === 'breathe' && selectedExercise) && selectedOption !== 'breathe' && (
                <div className="mb-6 flex-shrink-0">
                  <div className="w-full aspect-square bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  </div>
                  <h3 className="font-semibold text-xl text-white mb-1 capitalize">
                    {selectedOption ? `${selectedOption} Collection` : 'Select Your Path'}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {selectedOption
                      ? `${currentTracks.length} Track${currentTracks.length !== 1 ? 's' : ''}`
                      : 'Choose Focus, Calm, or Breathe'}
                  </p>
                </div>
              )}

              {/* Track List or Exercise Detail View */}
              <div className={`flex-1 overflow-auto min-h-0 ${selectedOption === 'breathe' && selectedExercise ? 'flex' : 'flex flex-col'}`}>
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
                        className="flex items-center gap-2 text-sm transition-colors"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span>Back</span>
                      </button>
                      <div className="w-14"></div>
                    </div>

                    {/* Scrollable Content with Flexbox Gap - All Exercises */}
                    <div className="flex-1 flex flex-col items-center">
                      <div className="flex flex-col gap-4 flex-1 w-full max-w-md px-2">
                        {/* Title */}
                        <h1
                          className="text-3xl font-bold"
                          style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                        >
                          {selectedExercise.name.replace(/\s*\([^)]*\)/, '')}
                        </h1>

                        {/* Gradient Separator */}
                        <div
                          className="w-full h-1 rounded-full"
                          style={{
                            background: 'linear-gradient(to right, #7469B6, #AD88C6, #E1AFD1, #F6D0EA, #FFE6E6)'
                          }}
                        />

                        {/* Description */}
                        <div>
                          <p
                            className="text-base leading-snug whitespace-pre-line"
                            style={{
                              color: isDarkMode ? '#FFFFFF' : '#000000',
                              display: '-webkit-box',
                              WebkitLineClamp: isDescriptionExpanded ? 'unset' : 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: isDescriptionExpanded ? 'visible' : 'hidden'
                            }}
                          >
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
                          <button
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="flex items-center gap-1 mt-2 text-sm"
                            style={{ color: isDarkMode ? '#F6D0EA' : '#7469B6' }}
                          >
                            <span>{isDescriptionExpanded ? 'Show less' : 'Show more'}</span>
                            <svg
                              className="w-4 h-4 transition-transform"
                              style={{ transform: isDescriptionExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                            </svg>
                          </button>
                        </div>

                        {/* 2x2 Grid Layout */}
                        <div className="grid grid-cols-2 gap-3 px-4">
                            {/* Tips Tile */}
                            <button
                              onClick={() => setShowTipsSheet(true)}
                              className="flex flex-col items-center justify-center gap-1 p-3 transition-all hover:brightness-110 active:brightness-90 aspect-square"
                              style={{
                                borderRadius: '13px',
                                background: isDarkMode ? '#333' : '#E8E8E8',
                                boxShadow: isDarkMode
                                  ? '-10px -10px 20px 0 #3C3C3C, 10px 10px 10px 0 rgba(30, 30, 30, 0.5), -4px -4px 8px 0 rgba(77, 77, 77, 0.25) inset, 4px 4px 8px 0 #1E1E1E inset'
                                  : '-10px -10px 20px 0 rgba(255, 255, 255, 0.8), 10px 10px 20px 0 rgba(0, 0, 0, 0.15), -4px -4px 8px 0 rgba(255, 255, 255, 0.5) inset, 4px 4px 8px 0 rgba(0, 0, 0, 0.15) inset'
                              }}
                            >
                              <svg className="w-6 h-6" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              <span className="text-xs font-semibold text-center" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Tips</span>
                            </button>

                            {/* Preparation Tile */}
                            <button
                              onClick={() => setShowPreparationSheet(true)}
                              className="flex flex-col items-center justify-center gap-1 p-3 transition-all hover:brightness-110 active:brightness-90 aspect-square"
                              style={{
                                borderRadius: '13px',
                                background: isDarkMode ? '#333' : '#E8E8E8',
                                boxShadow: isDarkMode
                                  ? '-10px -10px 20px 0 #3C3C3C, 10px 10px 10px 0 rgba(30, 30, 30, 0.5), -4px -4px 8px 0 rgba(77, 77, 77, 0.25) inset, 4px 4px 8px 0 #1E1E1E inset'
                                  : '-10px -10px 20px 0 rgba(255, 255, 255, 0.8), 10px 10px 20px 0 rgba(0, 0, 0, 0.15), -4px -4px 8px 0 rgba(255, 255, 255, 0.5) inset, 4px 4px 8px 0 rgba(0, 0, 0, 0.15) inset'
                              }}
                            >
                              <svg className="w-6 h-6" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                              </svg>
                              <span className="text-xs font-semibold text-center" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Preparation</span>
                            </button>

                            {/* Try this when Tile */}
                            <button
                              onClick={() => setShowWhenToUseSheet(true)}
                              className="flex flex-col items-center justify-center gap-1 p-3 transition-all hover:brightness-110 active:brightness-90 aspect-square"
                              style={{
                                borderRadius: '13px',
                                background: isDarkMode ? '#333' : '#E8E8E8',
                                boxShadow: isDarkMode
                                  ? '-10px -10px 20px 0 #3C3C3C, 10px 10px 10px 0 rgba(30, 30, 30, 0.5), -4px -4px 8px 0 rgba(77, 77, 77, 0.25) inset, 4px 4px 8px 0 #1E1E1E inset'
                                  : '-10px -10px 20px 0 rgba(255, 255, 255, 0.8), 10px 10px 20px 0 rgba(0, 0, 0, 0.15), -4px -4px 8px 0 rgba(255, 255, 255, 0.5) inset, 4px 4px 8px 0 rgba(0, 0, 0, 0.15) inset'
                              }}
                            >
                              <svg className="w-6 h-6" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-semibold text-center" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Try this when</span>
                            </button>

                            {/* Precautions Tile */}
                            <button
                              onClick={() => setShowSafetySheet(true)}
                              className="flex flex-col items-center justify-center gap-1 p-3 transition-all hover:brightness-110 active:brightness-90 aspect-square"
                              style={{
                                borderRadius: '13px',
                                background: isDarkMode ? '#333' : '#E8E8E8',
                                boxShadow: isDarkMode
                                  ? '-10px -10px 20px 0 #3C3C3C, 10px 10px 10px 0 rgba(30, 30, 30, 0.5), -4px -4px 8px 0 rgba(77, 77, 77, 0.25) inset, 4px 4px 8px 0 #1E1E1E inset'
                                  : '-10px -10px 20px 0 rgba(255, 255, 255, 0.8), 10px 10px 20px 0 rgba(0, 0, 0, 0.15), -4px -4px 8px 0 rgba(255, 255, 255, 0.5) inset, 4px 4px 8px 0 rgba(0, 0, 0, 0.15) inset'
                              }}
                            >
                              <svg className="w-6 h-6" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <span className="text-xs font-semibold text-center" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Precautions</span>
                            </button>
                          </div>

                        {/* Spacer to push buttons to bottom */}
                        <div className="flex-grow"></div>

                        {/* Tab Bar for Customization, Start, and Sound */}
                        <div className="pb-6 px-2">
                          <div
                            className="flex items-center w-full"
                            style={{
                                height: '80px',
                                padding: '0 10px',
                                borderRadius: '10px',
                                background: isDarkMode ? '#2B2B2B' : '#FFFFFF',
                                boxShadow: '0 4px 12px 0 rgba(13, 10, 44, 0.06)'
                              }}
                            >
                            {/* Customization Button */}
                            <button
                              onClick={() => {
                                setShowCustomizationSheet(true);
                              }}
                              className="flex-1 flex flex-col items-center justify-end transition-all"
                              style={{
                                color: isDarkMode ? '#FFFFFF' : '#000000',
                                background: 'transparent',
                                borderRadius: '8px',
                                padding: '10px',
                                gap: '4px',
                                height: '100%',
                                transition: 'filter 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                              onMouseDown={(e) => e.currentTarget.style.filter = 'brightness(0.8)'}
                              onMouseUp={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                            >
                              <svg width="24" height="24" viewBox="0 0 118 118" fill="none" style={{ flexShrink: 0 }}>
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
                              <span className="text-xs font-medium" style={{ flexShrink: 0 }}>Customize</span>
                            </button>

                            {/* Divider */}
                            <div
                              style={{
                                width: '1px',
                                height: '50px',
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                              }}
                            />

                            {/* Start Button */}
                            <button
                              onClick={() => {
                                setShowingInfo(false);
                              }}
                              className="flex-1 flex flex-col items-center justify-end transition-all"
                              style={{
                                color: isDarkMode ? '#FFFFFF' : '#000000',
                                background: 'transparent',
                                borderRadius: '8px',
                                padding: '10px',
                                gap: '4px',
                                height: '100%',
                                transition: 'filter 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                              onMouseDown={(e) => e.currentTarget.style.filter = 'brightness(0.8)'}
                              onMouseUp={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                                <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
                              </svg>
                              <span className="text-xs font-medium" style={{ flexShrink: 0 }}>Start</span>
                            </button>

                            {/* Divider */}
                            <div
                              style={{
                                width: '1px',
                                height: '50px',
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                              }}
                            />

                            {/* Sound Button */}
                            <button
                              onClick={() => {
                                setShowMusicSheet(true);
                              }}
                              className="flex-1 flex flex-col items-center justify-end transition-all"
                              style={{
                                color: isDarkMode ? '#FFFFFF' : '#000000',
                                background: 'transparent',
                                borderRadius: '8px',
                                padding: '10px',
                                gap: '4px',
                                height: '100%',
                                transition: 'filter 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                              onMouseDown={(e) => e.currentTarget.style.filter = 'brightness(0.8)'}
                              onMouseUp={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                            >
                              <svg width="24" height="24" viewBox="-2 -2 22 22" fill="none" style={{ flexShrink: 0 }}>
                                <path d="M17.1884 9.09605C17.1884 8.98559 17.1884 8.87994 17.1836 8.76948C17.1355 7.29029 16.7513 5.89755 16.1078 4.67769C14.6382 1.88741 11.8287 0 8.59658 0C5.36446 0 2.55016 1.88741 1.08058 4.67769C0.437033 5.90235 0.0528329 7.29029 0.00480725 8.76948C4.69011e-06 8.87994 0 8.98559 0 9.09605V13.6201C0 15.6035 1.39754 17.2556 3.26574 17.6542C3.46744 17.8607 3.77482 18 4.12061 18C4.46639 18 4.77375 17.8655 4.97546 17.6542L4.98987 17.6398V9.60032H4.98506C4.78816 9.3842 4.47119 9.24013 4.1158 9.24013C3.76041 9.24013 3.44344 9.3842 3.24654 9.60032H3.24173C2.59819 9.73479 2.01228 10.0277 1.52242 10.4264C1.484 10.46 1.17182 10.7385 1.07577 10.8538V9.01441C1.07577 8.88474 1.18143 8.77428 1.3159 8.77428H1.32551H1.42155C1.58004 4.73052 4.73053 1.5032 8.58698 1.5032C12.4434 1.5032 15.5891 4.73052 15.7476 8.77428H15.8581C15.9925 8.77428 16.0982 8.88474 16.0982 9.01441V10.8538C16.0021 10.7385 15.8917 10.6281 15.7764 10.5368C15.7764 10.5368 15.69 10.46 15.6515 10.4264C15.1617 10.0277 14.5758 9.73959 13.9322 9.60032C13.7305 9.3842 13.4136 9.24013 13.0582 9.24013C12.7028 9.24013 12.3954 9.3746 12.1889 9.59552V17.6494C12.1889 17.6494 12.1937 17.6542 12.1985 17.6542C12.4002 17.8607 12.7124 18 13.0534 18C13.3943 18 13.7065 17.8655 13.9082 17.6542C15.7764 17.2556 17.174 15.6035 17.174 13.6201C17.174 13.3031 17.1355 12.9909 17.0683 12.6932C17.1355 12.9909 17.174 13.2983 17.174 13.6201V9.09605H17.1884Z" fill="currentColor"/>
                              </svg>
                              <span className="text-xs font-medium" style={{ flexShrink: 0 }}>Sound</span>
                            </button>
                          </div>
                        </div>
                      </div>
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
                                    {selectedExercise?.name === 'Box Breathing' && (
                                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24">
                                        {/* Blue circle */}
                                        <circle cx="12" cy="12" r="9" stroke="#067AC3" strokeWidth="2" fill="none" />
                                        {/* Black checkmark */}
                                        <path d="M9 12l2 2 4-4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                    <p>
                                      {item.label && <strong>{item.label}</strong>}{' '}
                                      {selectedExercise?.name === 'Box Breathing' ? formatText(item.text) : item.text}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Close Button */}
                            <button
                              onClick={() => setShowTipsSheet(false)}
                              className="w-full text-base font-bold transition-all hover:brightness-110 active:brightness-90"
                              style={{
                                display: 'flex',
                                height: '59px',
                                padding: '12px 32px 11px 32px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '27px',
                                background: 'rgba(255, 255, 255, 0.7)',
                                color: '#333'
                              }}
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
                              className="w-full text-base font-bold transition-all hover:brightness-110 active:brightness-90"
                              style={{
                                display: 'flex',
                                height: '59px',
                                padding: '12px 32px 11px 32px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '27px',
                                background: 'rgba(255, 255, 255, 0.7)',
                                color: '#333'
                              }}
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
                              className="w-full text-base font-bold transition-all hover:brightness-110 active:brightness-90"
                              style={{
                                display: 'flex',
                                height: '59px',
                                padding: '12px 32px 11px 32px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '27px',
                                background: 'rgba(255, 255, 255, 0.7)',
                                color: '#333'
                              }}
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
                              className="w-full text-base font-bold transition-all hover:brightness-110 active:brightness-90"
                              style={{
                                display: 'flex',
                                height: '59px',
                                padding: '12px 32px 11px 32px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '27px',
                                background: 'rgba(255, 255, 255, 0.7)',
                                color: '#333'
                              }}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}


                    {/* Music Selection Bottom Sheet */}
                    {showMusicSheet && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end"
                        onClick={() => setShowMusicSheet(false)}
                      >
                        <div
                          className="rounded-t-3xl w-full max-h-[70vh] overflow-y-auto animate-slide-up"
                          style={{
                            backgroundColor: isDarkMode ? '#2B2B2B' : '#FFFFFF'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-6">
                            {/* Sheet Handle */}
                            <div
                              className="w-12 h-1 rounded-full mx-auto mb-6"
                              style={{
                                backgroundColor: isDarkMode ? '#555' : '#D1D5DB'
                              }}
                            ></div>

                            {/* Title */}
                            <h2
                              className="text-2xl font-bold mb-4"
                              style={{
                                color: isDarkMode ? '#FFFFFF' : '#000000'
                              }}
                            >
                              Select Music
                            </h2>

                            {/* Music Options */}
                            <div className="space-y-3 mb-6">
                              {/* No Music Option */}
                              <button
                                onClick={() => {
                                  setSelectedMusic(null);
                                  setShowMusicSheet(false);
                                }}
                                className="w-full p-4 rounded-xl text-left transition-all"
                                style={{
                                  backgroundColor: selectedMusic === null
                                    ? '#AD88C6'
                                    : isDarkMode ? '#333' : '#F3F4F6',
                                  color: selectedMusic === null
                                    ? '#FFFFFF'
                                    : isDarkMode ? '#FFFFFF' : '#1F2937'
                                }}
                                onMouseEnter={(e) => {
                                  if (selectedMusic !== null) {
                                    e.currentTarget.style.backgroundColor = isDarkMode ? '#444' : '#E5E7EB';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedMusic !== null) {
                                    e.currentTarget.style.backgroundColor = isDarkMode ? '#333' : '#F3F4F6';
                                  }
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold">No Music</p>
                                    <p className="text-sm opacity-70">Exercise in silence</p>
                                  </div>
                                  {selectedMusic === null && (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                  )}
                                </div>
                              </button>

                              {/* Nature Sounds */}
                              <button
                                onClick={() => {
                                  setSelectedMusic('nature');
                                  setShowMusicSheet(false);
                                }}
                                className="w-full p-4 rounded-xl text-left transition-all"
                                style={{
                                  backgroundColor: selectedMusic === 'nature'
                                    ? '#AD88C6'
                                    : isDarkMode ? '#333' : '#F3F4F6',
                                  color: selectedMusic === 'nature'
                                    ? '#FFFFFF'
                                    : isDarkMode ? '#FFFFFF' : '#1F2937'
                                }}
                                onMouseEnter={(e) => {
                                  if (selectedMusic !== 'nature') {
                                    e.currentTarget.style.backgroundColor = isDarkMode ? '#444' : '#E5E7EB';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedMusic !== 'nature') {
                                    e.currentTarget.style.backgroundColor = isDarkMode ? '#333' : '#F3F4F6';
                                  }
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold">Nature Sounds</p>
                                    <p className="text-sm opacity-70">Calm forest ambience</p>
                                  </div>
                                  {selectedMusic === 'nature' && (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                  )}
                                </div>
                              </button>

                              {/* Ambient Music */}
                              <button
                                onClick={() => {
                                  setSelectedMusic('ambient');
                                  setShowMusicSheet(false);
                                }}
                                className="w-full p-4 rounded-xl text-left transition-all"
                                style={{
                                  backgroundColor: selectedMusic === 'ambient'
                                    ? '#AD88C6'
                                    : isDarkMode ? '#333' : '#F3F4F6',
                                  color: selectedMusic === 'ambient'
                                    ? '#FFFFFF'
                                    : isDarkMode ? '#FFFFFF' : '#1F2937'
                                }}
                                onMouseEnter={(e) => {
                                  if (selectedMusic !== 'ambient') {
                                    e.currentTarget.style.backgroundColor = isDarkMode ? '#444' : '#E5E7EB';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedMusic !== 'ambient') {
                                    e.currentTarget.style.backgroundColor = isDarkMode ? '#333' : '#F3F4F6';
                                  }
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold">Ambient Music</p>
                                    <p className="text-sm opacity-70">Peaceful meditation tones</p>
                                  </div>
                                  {selectedMusic === 'ambient' && (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                  )}
                                </div>
                              </button>

                              {/* Binaural Beats */}
                              <button
                                onClick={() => {
                                  setSelectedMusic('binaural');
                                  setShowMusicSheet(false);
                                }}
                                className="w-full p-4 rounded-xl text-left transition-all"
                                style={{
                                  backgroundColor: selectedMusic === 'binaural'
                                    ? '#AD88C6'
                                    : isDarkMode ? '#333' : '#F3F4F6',
                                  color: selectedMusic === 'binaural'
                                    ? '#FFFFFF'
                                    : isDarkMode ? '#FFFFFF' : '#1F2937'
                                }}
                                onMouseEnter={(e) => {
                                  if (selectedMusic !== 'binaural') {
                                    e.currentTarget.style.backgroundColor = isDarkMode ? '#444' : '#E5E7EB';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedMusic !== 'binaural') {
                                    e.currentTarget.style.backgroundColor = isDarkMode ? '#333' : '#F3F4F6';
                                  }
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold">Binaural Beats</p>
                                    <p className="text-sm opacity-70">Focus and relaxation</p>
                                  </div>
                                  {selectedMusic === 'binaural' && (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                  )}
                                </div>
                              </button>

                              {/* Ocean Waves */}
                              <button
                                onClick={() => {
                                  setSelectedMusic('ocean');
                                  setShowMusicSheet(false);
                                }}
                                className="w-full p-4 rounded-xl text-left transition-all"
                                style={{
                                  backgroundColor: selectedMusic === 'ocean'
                                    ? '#AD88C6'
                                    : isDarkMode ? '#333' : '#F3F4F6',
                                  color: selectedMusic === 'ocean'
                                    ? '#FFFFFF'
                                    : isDarkMode ? '#FFFFFF' : '#1F2937'
                                }}
                                onMouseEnter={(e) => {
                                  if (selectedMusic !== 'ocean') {
                                    e.currentTarget.style.backgroundColor = isDarkMode ? '#444' : '#E5E7EB';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedMusic !== 'ocean') {
                                    e.currentTarget.style.backgroundColor = isDarkMode ? '#333' : '#F3F4F6';
                                  }
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold">Ocean Waves</p>
                                    <p className="text-sm opacity-70">Rhythmic wave sounds</p>
                                  </div>
                                  {selectedMusic === 'ocean' && (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                  )}
                                </div>
                              </button>
                            </div>

                            {/* Done Button */}
                            <div className="flex justify-center">
                              <button
                                onClick={() => setShowMusicSheet(false)}
                                className="text-base font-bold transition-all hover:brightness-110 active:brightness-90"
                                style={{
                                  display: 'flex',
                                  width: '200px',
                                  height: '59px',
                                  padding: '12px 32px 11px 32px',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: '27px',
                                  background: '#7469B6',
                                  boxShadow: 'none',
                                  color: '#FFFFFF'
                                }}
                              >
                                Done
                              </button>
                            </div>
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
                          // Go back to exercise info screen
                          setShowingInfo(true);
                          // Reset exercise state
                          setIsExercising(false);
                          setCountdown(null);
                          setIsPaused(false);
                          setBreathingPhase('inhale');
                          setTimer(0);
                          setCurrentCycle(0);
                          setExerciseCompleted(false);
                          // Reset Coherent breathing customization to defaults
                          setCoherentCycles(6);
                          setCoherentBreathTime(5);
                          // Reset Alternate Nostril customization to defaults
                          setAlternateNostrilCycles(3);
                          setAlternateNostrilBreathTime(5);
                        }}
                        className="flex items-center gap-2 text-sm transition-colors"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span>Back</span>
                      </button>

                      <h3
                        className="text-base font-semibold text-center flex-1 px-4"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                      >
                        {selectedExercise.name}
                      </h3>

                      {/* Spacer to balance layout */}
                      <div className="w-14"></div>
                      </div>
                    </div>

                    {/* Timer Section - 15% */}
                    <div className="flex-[0.15] flex items-center justify-center" style={{ minHeight: '0' }}>
                      {/* Timer Display - Show during all phases for Box Breathing, INHALE and EXHALE for others */}
                      {!exerciseCompleted && isExercising && countdown === null ? (
                        selectedExercise?.name === 'Box Breathing' ? (
                          /* Box Breathing: Show timer for ALL phases including HOLD */
                          <div className="text-center">
                            <div
                              className="font-bold"
                              style={{
                                fontSize: '4.32rem',
                                color: isDarkMode ? '#FFFFFF' : '#000000'
                              }}
                            >
                              {timer}
                            </div>
                          </div>
                        ) : (breathingPhase === 'inhale' || breathingPhase === 'exhale') ? (
                          /* Other exercises: Show timer only during INHALE and EXHALE */
                          <div className="text-center">
                            <div
                              className="font-bold"
                              style={{
                                fontSize: '4.32rem',
                                color: isDarkMode ? '#FFFFFF' : '#000000'
                              }}
                            >
                              {selectedExercise?.name === 'Coherent Breathing'
                                ? (breathingPhase === 'inhale'
                                    ? `${Math.ceil(timer / 10)}s`  // INHALE: 0s to coherentBreathTime (e.g., 0s-5s)
                                    : `${Math.ceil(timer / 10)}s`)  // EXHALE: coherentBreathTime to 0s (e.g., 5s-0s)
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
                      ) : null}
                    </div>

                    {/* Breathing Circles Area - 40% */}
                    <div className="flex-[0.4] rounded-lg flex flex-col items-center justify-center p-4 overflow-visible">
                      {/* Show completion screen when exercise is completed */}
                      {exerciseCompleted ? (
                        <div className="flex flex-col items-center justify-center text-center gap-6">
                          <h2
                            className="font-bold mb-6"
                            style={{
                              fontSize: '1.59rem',
                              color: isDarkMode ? '#FFFFFF' : '#000000'
                            }}
                          >
                            Completed
                          </h2>
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
                              className={(selectedExercise?.name === 'Coherent Breathing' || selectedExercise?.name === 'Box Breathing')
                                ? "font-semibold transition-all hover:brightness-110 active:brightness-90 flex items-center justify-center"
                                : "py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"}
                              style={(selectedExercise?.name === 'Coherent Breathing' || selectedExercise?.name === 'Box Breathing')
                                ? {
                                    width: '100%',
                                    height: '56px',
                                    padding: '0 24px',
                                    borderRadius: '28px',
                                    background: isDarkMode ? '#36393B' : '#FFFFFF',
                                    color: isDarkMode ? '#FFFFFF' : '#000000',
                                    boxShadow: isDarkMode
                                      ? '-6px -6px 12px 0 rgba(255, 255, 255, 0.15), 6px 6px 15px 0 #000'
                                      : '-6px -6px 12px 0 rgba(255, 255, 255, 0.8), 6px 6px 15px 0 rgba(0, 0, 0, 0.15)'
                                  }
                                : {
                                    background: isDarkMode ? '#000000' : '#FFFFFF',
                                    color: isDarkMode ? '#FFFFFF' : '#000000',
                                    border: isDarkMode ? 'none' : '2px solid #000000'
                                  }}
                            >
                              Return to Main Menu
                            </button>
                            <button
                              onClick={() => {
                                setExerciseCompleted(false);
                                setCurrentCycle(0);
                                // Box Breathing starts at timer 1, all other exercises start at 0
                                setTimer(selectedExercise?.name === 'Box Breathing' ? 1 : 0);
                                setBreathingPhase('inhale');
                                setIsExercising(true);
                              }}
                              className={(selectedExercise?.name === 'Coherent Breathing' || selectedExercise?.name === 'Box Breathing')
                                ? "font-semibold transition-all hover:brightness-110 active:brightness-90 flex items-center justify-center"
                                : "py-3 px-6 rounded-lg font-semibold transition-colors"}
                              style={(selectedExercise?.name === 'Coherent Breathing' || selectedExercise?.name === 'Box Breathing')
                                ? {
                                    width: '100%',
                                    height: '56px',
                                    padding: '0 24px',
                                    borderRadius: '28px',
                                    background: isDarkMode ? '#36393B' : '#FFFFFF',
                                    color: isDarkMode ? '#FFFFFF' : '#000000',
                                    boxShadow: isDarkMode
                                      ? '6px 6px 15px 0 #000 inset, -6px -6px 12px 0 rgba(255, 255, 255, 0.15) inset'
                                      : '6px 6px 15px 0 rgba(0, 0, 0, 0.15) inset, -6px -6px 12px 0 rgba(255, 255, 255, 0.8) inset'
                                  }
                                : {
                                    background: isDarkMode ? '#FFFFFF' : '#000000',
                                    color: isDarkMode ? '#000000' : '#FFFFFF',
                                    border: isDarkMode ? '2px solid #000000' : 'none',
                                    hover: { background: isDarkMode ? '#F3F4F6' : '#1F2937' }
                                  }}
                            >
                              Restart
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                      {/* Conditional Animation based on exercise */}
                      {selectedExercise?.name === 'Box Breathing' ? (
                        <>
                          {/* Phase Indicator - 4 Boxes in Square Pattern (Clockwise) */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Neumorphic Container */}
                            <div
                              className="flex items-center justify-center p-4"
                              style={{
                                borderRadius: '13px',
                                background: isDarkMode ? '#333' : '#E8E8E8',
                                boxShadow: isDarkMode
                                  ? '-5px -5px 10px 0 #3C3C3C, 5px 5px 10px 0 #1E1E1E, -4px -4px 8px 0 rgba(77, 77, 77, 0.25) inset, 4px 4px 8px 0 #1E1E1E inset'
                                  : '-10px -10px 20px 0 rgba(255, 255, 255, 0.8), 10px 10px 20px 0 rgba(0, 0, 0, 0.15), -4px -4px 8px 0 rgba(255, 255, 255, 0.5) inset, 4px 4px 8px 0 rgba(0, 0, 0, 0.15) inset',
                                width: '340px',
                                height: '340px'
                              }}
                            >
                              <div className="flex flex-col items-center justify-center gap-3 w-full h-full">
                                {/* Top Row - Breathe In and Hold 1 */}
                                <div className="flex justify-center gap-3 w-full">
                                  {/* Breathe In - Top Left */}
                                  <div
                                    className="flex flex-col items-center justify-center rounded-xl transition-all duration-300"
                                    style={{
                                      backgroundColor: (isExercising && countdown === null && breathingPhase === 'inhale') ? '#746996' : (isDarkMode ? '#444' : '#D0D0D0'),
                                      width: '148px',
                                      height: '148px'
                                    }}
                                  >
                                    <div className={`text-sm font-semibold mb-1 text-center leading-tight ${(isExercising && countdown === null && breathingPhase === 'inhale') ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                                      Breathe In
                                    </div>
                                    <div className={`text-2xl text-center ${(isExercising && countdown === null && breathingPhase === 'inhale') ? 'text-white' : (isDarkMode ? 'text-gray-500' : 'text-gray-700')}`}>
                                      ↑
                                    </div>
                                  </div>

                                  {/* Hold 1 - Top Right */}
                                  <div
                                    className="flex flex-col items-center justify-center rounded-xl transition-all duration-300"
                                    style={{
                                      backgroundColor: (isExercising && countdown === null && breathingPhase === 'hold1') ? '#F6D0EA' : (isDarkMode ? '#444' : '#D0D0D0'),
                                      width: '148px',
                                      height: '148px'
                                    }}
                                  >
                                    <div className={`text-sm font-semibold mb-1 text-center ${(isExercising && countdown === null && breathingPhase === 'hold1') ? 'text-gray-800' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                                      Hold Breath
                                    </div>
                                    <svg
                                      className={`${(isExercising && countdown === null && breathingPhase === 'hold1') ? 'text-gray-800' : (isDarkMode ? 'text-gray-500' : 'text-gray-700')}`}
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
                                <div className="flex justify-center gap-3 w-full">
                                  {/* Hold 2 - Bottom Left */}
                                  <div
                                    className="flex flex-col items-center justify-center rounded-xl transition-all duration-300"
                                    style={{
                                      backgroundColor: (isExercising && countdown === null && breathingPhase === 'hold2') ? '#F6D0EA' : (isDarkMode ? '#444' : '#D0D0D0'),
                                      width: '148px',
                                      height: '148px'
                                    }}
                                  >
                                    <div className={`text-sm font-semibold mb-1 text-center ${(isExercising && countdown === null && breathingPhase === 'hold2') ? 'text-gray-800' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                                      Hold Breath
                                    </div>
                                    <svg
                                      className={`${(isExercising && countdown === null && breathingPhase === 'hold2') ? 'text-gray-800' : (isDarkMode ? 'text-gray-500' : 'text-gray-700')}`}
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
                                    className="flex flex-col items-center justify-center rounded-xl transition-all duration-300"
                                    style={{
                                      backgroundColor: (isExercising && countdown === null && breathingPhase === 'exhale') ? '#AD8FC6' : (isDarkMode ? '#444' : '#D0D0D0'),
                                      width: '148px',
                                      height: '148px'
                                    }}
                                  >
                                    <div className={`text-sm font-semibold mb-1 text-center ${(isExercising && countdown === null && breathingPhase === 'exhale') ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                                      Breathe Out
                                    </div>
                                    <div className={`text-2xl text-center ${(isExercising && countdown === null && breathingPhase === 'exhale') ? 'text-white' : (isDarkMode ? 'text-gray-500' : 'text-gray-700')}`}>
                                      ↓
                                    </div>
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
                            {/* Neumorphic Circular Container */}
                            <div
                              className="rounded-full flex items-center justify-center aspect-square"
                              style={{
                                borderRadius: '50%',
                                background: isDarkMode ? '#333' : '#E8E8E8',
                                boxShadow: isDarkMode
                                  ? '-10px -10px 20px 0 #3C3C3C, 10px 10px 20px 0 #1E1E1E, -4px -4px 8px 0 rgba(77, 77, 77, 0.25) inset, 4px 4px 8px 0 #1E1E1E inset'
                                  : '-10px -10px 20px 0 rgba(255, 255, 255, 0.8), 10px 10px 20px 0 rgba(0, 0, 0, 0.15), -4px -4px 8px 0 rgba(255, 255, 255, 0.5) inset, 4px 4px 8px 0 rgba(0, 0, 0, 0.15) inset',
                                width: '100%',
                                maxWidth: '340px',
                                maxHeight: '340px',
                                position: 'relative'
                              }}
                            >
                              {/* Gray Background Circle - Always visible */}
                              <svg
                                className="absolute"
                                width="300"
                                height="300"
                                style={{ transform: 'rotate(-90deg)' }}
                              >
                                <circle
                                  cx="150"
                                  cy="150"
                                  r="145"
                                  fill="none"
                                  stroke="#4B5563"
                                  strokeWidth="2"
                                />
                              </svg>

                              {/* Blue-Violet Progress Circle - Shows during HOLD phase (7 seconds) */}
                              {breathingPhase === 'hold1' && animationReady && (
                                <svg
                                  className="absolute"
                                  width="300"
                                  height="300"
                                  style={{ transform: 'rotate(-90deg)' }}
                                >
                                  <circle
                                    cx="150"
                                    cy="150"
                                    r="145"
                                    fill="none"
                                    stroke="#7469BB"
                                    strokeWidth="2"
                                    strokeDasharray="911"
                                    strokeDashoffset={911 - (911 * (timer / 10) / 7)}
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
                                    width: `${get478CircleSize() * 0.824}px`,
                                    height: `${get478CircleSize() * 0.824}px`,
                                    background: 'radial-gradient(circle, rgba(116, 105, 187, 1) 0%, rgba(116, 105, 187, 1) 50%, rgba(116, 105, 187, 1) 100%)',
                                    boxShadow: '0 0 30px rgba(116, 105, 187, 0.5)',
                                    transition: 'all 100ms linear'
                                  }}
                                />
                              )}

                              {/* Phase Text - At Center of Circles */}
                              <div className="absolute text-center">
                                <div
                                  className={`text-lg font-semibold uppercase tracking-wider ${
                                    breathingPhase === 'hold1' && animationReady ? 'pulse-hold' : ''
                                  }`}
                                  style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                                >
                                  {breathingPhase === 'inhale' && animationReady && 'Breathe In'}
                                  {breathingPhase === 'hold1' && animationReady && 'HOLD'}
                                  {breathingPhase === 'exhale' && animationReady && 'Breathe Out'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : selectedExercise?.name === 'Coherent Breathing' ? (
                        /* Coherent Breathing Animation */
                        <>
                          {/* Breathing Circle Illustration - Coherent */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Neumorphic Circular Container */}
                            <div
                              className="rounded-full flex items-center justify-center aspect-square"
                              style={{
                                borderRadius: '50%',
                                background: isDarkMode ? '#333' : '#E8E8E8',
                                boxShadow: isDarkMode
                                  ? '-10px -10px 20px 0 #3C3C3C, 10px 10px 20px 0 #1E1E1E, -4px -4px 8px 0 rgba(77, 77, 77, 0.25) inset, 4px 4px 8px 0 #1E1E1E inset'
                                  : '-10px -10px 20px 0 rgba(255, 255, 255, 0.8), 10px 10px 20px 0 rgba(0, 0, 0, 0.15), -4px -4px 8px 0 rgba(255, 255, 255, 0.5) inset, 4px 4px 8px 0 rgba(0, 0, 0, 0.15) inset',
                                width: '100%',
                                maxWidth: '340px',
                                maxHeight: '340px',
                                position: 'relative'
                              }}
                            >
                              {/* Gray Background Circle - Blinks purple at transitions */}
                              <svg
                                className="absolute"
                                width="300"
                                height="300"
                                style={{ transform: 'rotate(-90deg)' }}
                              >
                                <circle
                                  cx="150"
                                  cy="150"
                                  r="145"
                                  fill="none"
                                  stroke="#4B5563"
                                  strokeWidth="2"
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
                                  const intensity = size / 280; // 0 to 1, from empty to full (updated for smaller container)

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

                                  return `radial-gradient(circle, rgba(${r}, ${g}, ${b}, 1) 0%, rgba(${r}, ${g}, ${b}, 1) 50%, rgba(${r}, ${g}, ${b}, 1) 100%)`;
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
                                  className={`text-lg font-semibold uppercase tracking-wider`}
                                  style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                                >
                                  {breathingPhase === 'inhale' && animationReady && 'Breathe In'}
                                  {breathingPhase === 'exhale' && animationReady && 'Breathe Out'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : selectedExercise?.name === 'Physiological Sigh' ? (
                        /* Physiological Sigh Animation - Two-circle expanding effect */
                        <>
                          {/* Breathing Circle Illustration - Physiological Sigh */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Neumorphic Circular Container */}
                            <div
                              className="rounded-full flex items-center justify-center relative aspect-square"
                              style={{
                                borderRadius: '50%',
                                width: '100%',
                                maxWidth: '340px',
                                maxHeight: '340px',
                                background: isDarkMode ? '#333' : '#E8E8E8',
                                boxShadow: isDarkMode
                                  ? '-10px -10px 20px 0 #3C3C3C, 10px 10px 20px 0 #1E1E1E, -4px -4px 8px 0 rgba(77, 77, 77, 0.25) inset, 4px 4px 8px 0 #1E1E1E inset'
                                  : '-10px -10px 20px 0 rgba(255, 255, 255, 0.8), 10px 10px 20px 0 rgba(0, 0, 0, 0.15), -4px -4px 8px 0 rgba(255, 255, 255, 0.5) inset, 4px 4px 8px 0 rgba(0, 0, 0, 0.15) inset'
                              }}
                            >
                              {/* Gray Background Circle */}
                              <svg
                                className="absolute"
                                width="300"
                                height="300"
                                style={{ transform: 'rotate(-90deg)' }}
                              >
                                <circle
                                  cx="150"
                                  cy="150"
                                  r="145"
                                  fill="none"
                                  stroke="#4B5563"
                                  strokeWidth="2"
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
                                          background: 'linear-gradient(135deg, #FFE6E6 0%, #F6D0EA 100%)',
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
                                          background: 'linear-gradient(135deg, #AD88C6 0%, #7469B6 100%)',
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
                                  className={`text-lg font-semibold uppercase tracking-wider`}
                                  style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                                >
                                  {breathingPhase === 'inhale' && animationReady && 'Breathe In'}
                                  {breathingPhase === 'exhale' && animationReady && 'Breathe Out'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : selectedExercise?.name === 'Alternate Nostril' ? (
                        /* Alternate Nostril Animation */
                        <>
                          {/* Breathing Container Illustration - Alternate Nostril */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Neumorphic Square Container */}
                            <div
                              className="flex items-center justify-center p-4"
                              style={{
                                borderRadius: '13px',
                                background: isDarkMode ? '#333' : '#E8E8E8',
                                boxShadow: isDarkMode
                                  ? '-5px -5px 10px 0 #3C3C3C, 5px 5px 10px 0 #1E1E1E, -4px -4px 8px 0 rgba(77, 77, 77, 0.25) inset, 4px 4px 8px 0 #1E1E1E inset'
                                  : '-10px -10px 20px 0 rgba(255, 255, 255, 0.8), 10px 10px 20px 0 rgba(0, 0, 0, 0.15), -4px -4px 8px 0 rgba(255, 255, 255, 0.5) inset, 4px 4px 8px 0 rgba(0, 0, 0, 0.15) inset',
                                width: '340px',
                                height: '340px'
                              }}
                            >
                              {/* Split square markers (50:50 left/right) with 4px gap */}
                              <div className="relative flex" style={{ gap: '4px' }}>
                                {/* Left Container */}
                                <div className="relative" style={{ width: '154px', height: '308px' }}>
                                  {/* Gray outline */}
                                  <svg width="154" height="308">
                                    <rect x="4" y="4" width="146" height="300" rx="13"
                                      fill="none" stroke="#4B5563" strokeWidth="4" />
                                  </svg>

                                  {/* App color spectrum fill - Left Nostril (even cycles: 0, 2, 4...) */}
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
                                    const heightPx = heightPercent * 296;
                                    const isFull = heightPercent >= 0.98; // Consider full at 98%+
                                    return (
                                      <div className="absolute" style={{
                                        bottom: '6px',
                                        left: '6px',
                                        width: '142px',
                                        height: `${heightPx}px`,
                                        background: 'linear-gradient(to top, #7469B6 0%, #AD88C6 25%, #E1AFD1 50%, #F6D0EA 75%, #FFE6E6 100%)',
                                        borderRadius: isFull ? '10px' : '0 0 10px 10px',
                                        transition: 'height 100ms linear'
                                      }} />
                                    );
                                  })()}

                                  {/* Phase Text - Left Nostril */}
                                  {currentCycle % 2 === 0 && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                      <div className="text-lg font-semibold uppercase tracking-wider" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                                        {breathingPhase === 'inhale' && 'Breathe In'}
                                        {breathingPhase === 'exhale' && 'Breathe Out'}
                                      </div>
                                      <div className="text-sm mt-1" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
                                        Left Nostril
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Right Container */}
                                <div className="relative" style={{ width: '154px', height: '308px' }}>
                                  {/* Gray outline */}
                                  <svg width="154" height="308">
                                    <rect x="4" y="4" width="146" height="300" rx="13"
                                      fill="none" stroke="#4B5563" strokeWidth="4" />
                                  </svg>

                                  {/* App color spectrum fill - Right Nostril (odd cycles: 1, 3, 5...) */}
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
                                    const heightPx = heightPercent * 296;
                                    const isFull = heightPercent >= 0.98; // Consider full at 98%+
                                    return (
                                      <div className="absolute" style={{
                                        bottom: '6px',
                                        left: '6px',
                                        width: '142px',
                                        height: `${heightPx}px`,
                                        background: 'linear-gradient(to top, #7469B6 0%, #AD88C6 25%, #E1AFD1 50%, #F6D0EA 75%, #FFE6E6 100%)',
                                        borderRadius: isFull ? '10px' : '0 0 10px 10px',
                                        transition: 'height 100ms linear'
                                      }} />
                                    );
                                  })()}

                                  {/* Phase Text - Right Nostril */}
                                  {currentCycle % 2 === 1 && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                      <div className="text-lg font-semibold uppercase tracking-wider" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                                        {breathingPhase === 'inhale' && 'Breathe In'}
                                        {breathingPhase === 'exhale' && 'Breathe Out'}
                                      </div>
                                      <div className="text-sm mt-1" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
                                        Right Nostril
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : selectedExercise?.name === 'Humming Bee' ? (
                        /* Humming Bee Animation - Similar to Coherent Breathing */
                        <>
                          {/* Breathing Circle Illustration - Humming Bee */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Neumorphic Circular Container */}
                            <div
                              className="rounded-full flex items-center justify-center relative aspect-square"
                              style={{
                                borderRadius: '50%',
                                width: '100%',
                                maxWidth: '340px',
                                maxHeight: '340px',
                                background: isDarkMode ? '#333' : '#E8E8E8',
                                boxShadow: isDarkMode
                                  ? '-10px -10px 20px 0 #3C3C3C, 10px 10px 20px 0 #1E1E1E, -4px -4px 8px 0 rgba(77, 77, 77, 0.25) inset, 4px 4px 8px 0 #1E1E1E inset'
                                  : '-10px -10px 20px 0 rgba(255, 255, 255, 0.8), 10px 10px 20px 0 rgba(0, 0, 0, 0.15), -4px -4px 8px 0 rgba(255, 255, 255, 0.5) inset, 4px 4px 8px 0 rgba(0, 0, 0, 0.15) inset'
                              }}
                            >
                              {/* Gray Background Circle */}
                              <svg
                                className="absolute"
                                width="300"
                                height="300"
                                style={{ transform: 'rotate(-90deg)' }}
                              >
                                <circle
                                  cx="150"
                                  cy="150"
                                  r="145"
                                  fill="none"
                                  stroke="#4B5563"
                                  strokeWidth="2"
                                />
                              </svg>

                              {/* Single Expanding/Compressing Circle - Only show after countdown */}
                              {animationReady && getHummingBeeCircleSize() > 0 && (
                                <div
                                  className="rounded-full absolute"
                                  style={{
                                    width: `${getHummingBeeCircleSize()}px`,
                                    height: `${getHummingBeeCircleSize()}px`,
                                    background: breathingPhase === 'inhale'
                                      ? '#E1AFD1'  // Light Orchid on inhale
                                      : '#AD88C6',  // African Violet on exhale
                                    boxShadow: breathingPhase === 'inhale'
                                      ? '0 0 30px rgba(225, 175, 209, 0.5)'
                                      : '0 0 30px rgba(173, 136, 198, 0.5)',
                                    transition: 'all 100ms linear'
                                  }}
                                />
                              )}

                              {/* Phase Text - At Center of Circle - Only show after countdown */}
                              <div className="absolute text-center">
                                {animationReady && (
                                  breathingPhase === 'inhale' ? (
                                    <div className="text-lg font-semibold uppercase tracking-wider" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                                      Breathe In
                                    </div>
                                  ) : (
                                    <div>
                                      <div className="text-lg font-semibold uppercase tracking-wider" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                                        Breathe Out
                                      </div>
                                      <div className="text-sm mt-1" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                                        With Hum
                                      </div>
                                      {/* Sound Wave Vibration */}
                                      <div className="mt-3 flex items-center justify-center gap-1">
                                        <style>{`
                                          @keyframes softVibrate {
                                            0% { transform: scaleY(1); }
                                            25% { transform: scaleY(1.15); }
                                            50% { transform: scaleY(0.95); }
                                            75% { transform: scaleY(1.08); }
                                            100% { transform: scaleY(1); }
                                          }
                                        `}</style>
                                        {[...Array(30)].map((_, i) => {
                                          const position = i / 29; // 0 to 1
                                          const distanceFromCenter = Math.abs(position - 0.5) * 2; // 0 at center, 1 at edges

                                          // Bell curve: use Gaussian distribution for smooth falloff
                                          const bellCurve = Math.exp(-Math.pow(distanceFromCenter * 2.5, 2));

                                          // Height follows bell curve - tall in center, short at edges
                                          const minHeight = 3;
                                          const maxHeight = 24;
                                          const baseHeight = minHeight + (maxHeight - minHeight) * bellCurve;

                                          // Vibration intensity also follows bell curve
                                          const centerIntensity = bellCurve;

                                          // Fast, subtle vibration
                                          const duration = 0.15 + (Math.random() * 0.05); // Random duration between 0.15-0.2s
                                          const delay = i * 0.01; // Stagger each line slightly

                                          return (
                                            <div
                                              key={i}
                                              style={{
                                                width: '2px',
                                                height: `${baseHeight}px`,
                                                backgroundColor: isDarkMode ? '#FFFFFF' : '#000000',
                                                opacity: 0.8 + (centerIntensity * 0.2),
                                                animation: isPaused ? 'none' : `softVibrate ${duration}s ease-in-out ${delay}s infinite`,
                                                transformOrigin: 'center'
                                              }}
                                            />
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )
                                )}
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
                        </>
                      )}
                    </div>

                    {/* Exercise Starting Section - 15% */}
                    <div className="flex-[0.15] flex items-center justify-center" style={{ minHeight: '0' }}>
                      {/* Countdown Progress Bar - Show during countdown (only on first start, not after completion) */}
                      {countdown !== null && countdown > 0 && !exerciseCompleted ? (
                        <div className="w-full max-w-xs px-4">
                          <span
                            className="text-sm font-medium mb-2 block text-center"
                            style={{
                              color: isDarkMode ? '#FFFFFF' : '#000000'
                            }}
                          >
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
                      ) : (
                        /* Empty div to maintain spacing when countdown is not shown */
                        <div></div>
                      )}

                      {/* Legend for Physiological Sigh - Show after countdown completes with 150ms delay */}
                      {selectedExercise?.name === 'Physiological Sigh' && showLegend && (
                        <div className="flex items-center justify-center gap-6">
                          {/* Circle 2 Legend - Lighter gradient (Misty Rose to Pale Pink) */}
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ background: 'linear-gradient(135deg, #FFE6E6 0%, #F6D0EA 100%)' }}></div>
                            <span className="text-sm font-medium" style={{ color: isDarkMode ? '#9CA3AF' : '#374151' }}>Long breath (0-3s)</span>
                          </div>
                          {/* Circle 1 Legend - Darker gradient (African Violet to Blue Violet) */}
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ background: 'linear-gradient(135deg, #AD88C6 0%, #7469B6 100%)' }}></div>
                            <span className="text-sm font-medium" style={{ color: isDarkMode ? '#9CA3AF' : '#374151' }}>Quick short breath (1s)</span>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Navigation Section - 15% (hide when completed) */}
                    {!exerciseCompleted && (
                    <div className="flex-[0.15] flex flex-col items-center justify-end pb-6">
                      <div className="w-full max-w-md px-4">
                        <div
                          className="flex items-center w-full"
                          style={{
                            height: '80px',
                            padding: '0 10px',
                            borderRadius: '10px',
                            background: isDarkMode ? '#2B2B2B' : '#FFFFFF',
                            boxShadow: '0 4px 12px 0 rgba(13, 10, 44, 0.06)'
                          }}
                        >
                          {/* Customization Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Pause exercise if in progress
                              if (isExercising && !isPaused) {
                                setIsPaused(true);
                              }
                              setShowCustomizationSheet(true);
                            }}
                            className="flex-1 flex flex-col items-center justify-end transition-all"
                            style={{
                              color: isDarkMode ? '#FFFFFF' : '#000000',
                              background: 'transparent',
                              borderRadius: '8px',
                              padding: '10px',
                              gap: '4px',
                              height: '100%',
                              transition: 'filter 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                            onMouseDown={(e) => e.currentTarget.style.filter = 'brightness(0.8)'}
                            onMouseUp={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                          >
                            <svg width="24" height="24" viewBox="0 0 118 118" fill="none" style={{ flexShrink: 0 }}>
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
                            <span className="text-xs font-medium" style={{ flexShrink: 0 }}>Customize</span>
                          </button>

                          {/* Divider */}
                          <div
                            style={{
                              width: '1px',
                              height: '50px',
                              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                            }}
                          />

                          {/* Start/Pause Button */}
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
                            className="flex-1 flex flex-col items-center justify-end transition-all"
                            style={{
                              color: isDarkMode ? '#FFFFFF' : '#000000',
                              background: 'transparent',
                              borderRadius: '8px',
                              padding: '10px',
                              gap: '4px',
                              height: '100%',
                              transition: 'filter 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                            onMouseDown={(e) => e.currentTarget.style.filter = 'brightness(0.8)'}
                            onMouseUp={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                              <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
                            </svg>
                            <span className="text-xs font-medium" style={{ flexShrink: 0 }}>{exerciseCompleted || isPaused ? 'Start' : 'Pause'}</span>
                          </button>

                          {/* Divider */}
                          <div
                            style={{
                              width: '1px',
                              height: '50px',
                              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                            }}
                          />

                          {/* Sound Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Pause exercise if in progress
                              if (isExercising && !isPaused) {
                                setIsPaused(true);
                              }
                              setShowMusicSheet(true);
                            }}
                            className="flex-1 flex flex-col items-center justify-end transition-all"
                            style={{
                              color: isDarkMode ? '#FFFFFF' : '#000000',
                              background: 'transparent',
                              borderRadius: '8px',
                              padding: '10px',
                              gap: '4px',
                              height: '100%',
                              transition: 'filter 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                            onMouseDown={(e) => e.currentTarget.style.filter = 'brightness(0.8)'}
                            onMouseUp={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                          >
                            <svg width="24" height="24" viewBox="-2 -2 22 22" fill="none" style={{ flexShrink: 0 }}>
                              <path d="M17.1884 9.09605C17.1884 8.98559 17.1884 8.87994 17.1836 8.76948C17.1355 7.29029 16.7513 5.89755 16.1078 4.67769C14.6382 1.88741 11.8287 0 8.59658 0C5.36446 0 2.55016 1.88741 1.08058 4.67769C0.437033 5.90235 0.0528329 7.29029 0.00480725 8.76948C4.69011e-06 8.87994 0 8.98559 0 9.09605V13.6201C0 15.6035 1.39754 17.2556 3.26574 17.6542C3.46744 17.8607 3.77482 18 4.12061 18C4.46639 18 4.77375 17.8655 4.97546 17.6542L4.98987 17.6398V9.60032H4.98506C4.78816 9.3842 4.47119 9.24013 4.1158 9.24013C3.76041 9.24013 3.44344 9.3842 3.24654 9.60032H3.24173C2.59819 9.73479 2.01228 10.0277 1.52242 10.4264C1.484 10.46 1.17182 10.7385 1.07577 10.8538V9.01441C1.07577 8.88474 1.18143 8.77428 1.3159 8.77428H1.32551H1.42155C1.58004 4.73052 4.73053 1.5032 8.58698 1.5032C12.4434 1.5032 15.5891 4.73052 15.7476 8.77428H15.8581C15.9925 8.77428 16.0982 8.88474 16.0982 9.01441V10.8538C16.0021 10.7385 15.8917 10.6281 15.7764 10.5368C15.7764 10.5368 15.69 10.46 15.6515 10.4264C15.1617 10.0277 14.5758 9.73959 13.9322 9.60032C13.7305 9.3842 13.4136 9.24013 13.0582 9.24013C12.7028 9.24013 12.3954 9.3746 12.1889 9.59552V17.6494C12.1889 17.6494 12.1937 17.6542 12.1985 17.6542C12.4002 17.8607 12.7124 18 13.0534 18C13.3943 18 13.7065 17.8655 13.9082 17.6542C15.7764 17.2556 17.174 15.6035 17.174 13.6201C17.174 13.3031 17.1355 12.9909 17.0683 12.6932C17.1355 12.9909 17.174 13.2983 17.174 13.6201V9.09605H17.1884Z" fill="currentColor"/>
                            </svg>
                            <span className="text-xs font-medium" style={{ flexShrink: 0 }}>Sound</span>
                          </button>
                        </div>
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
                      <div className="mb-6 flex-shrink-0">
                        <h3 className="font-medium text-2xl" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                          Select a breathing technique
                        </h3>
                      </div>
                    )}
                    {selectedOption === 'breathe' ? (
                      /* Single Column List Layout for Breathing Exercises */
                      <div className="overflow-y-auto flex-1 min-h-0 hide-scrollbar px-4">
                        <div className="flex flex-col gap-3 pb-5">
                          {currentTracks.map((track, index) => {
                            const metadata = getExerciseMetadata(track.name);

                            // Function to render exercise preview icon
                            const renderExerciseIcon = (exerciseName) => {
                              const iconSize = 56;

                              switch(exerciseName) {
                                case 'Box Breathing':
                                  return (
                                    <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" style={{ border: `1px solid ${isDarkMode ? '#666' : '#999'}`, borderRadius: '6px' }}>
                                      <rect x="6" y="6" width="16" height="16" rx="2" fill="#7469B6" />
                                      <rect x="26" y="6" width="16" height="16" rx="2" fill="#AD88C6" />
                                      <rect x="6" y="26" width="16" height="16" rx="2" fill="#E1AFD1" />
                                      <rect x="26" y="26" width="16" height="16" rx="2" fill="#F6D0EA" />
                                    </svg>
                                  );

                                case '4-7-8 Breathing':
                                  return (
                                    <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" style={{ border: `1px solid ${isDarkMode ? '#666' : '#999'}`, borderRadius: '50%' }}>
                                      <defs>
                                        <radialGradient id="gradient-478">
                                          <stop offset="0%" stopColor="rgba(116, 105, 187, 1)" />
                                          <stop offset="50%" stopColor="rgba(116, 105, 187, 0.6)" />
                                          <stop offset="100%" stopColor="rgba(116, 105, 187, 0.2)" />
                                        </radialGradient>
                                      </defs>
                                      <circle cx="24" cy="24" r="20" fill="url(#gradient-478)" />
                                    </svg>
                                  );

                                case 'Coherent Breathing':
                                  return (
                                    <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" style={{ border: `1px solid ${isDarkMode ? '#666' : '#999'}`, borderRadius: '50%' }}>
                                      <defs>
                                        <radialGradient id="gradient-coherent">
                                          <stop offset="0%" stopColor="rgba(255, 230, 230, 0.8)" />
                                          <stop offset="100%" stopColor="rgba(246, 208, 234, 1)" />
                                        </radialGradient>
                                      </defs>
                                      <circle cx="24" cy="24" r="20" fill="url(#gradient-coherent)" />
                                    </svg>
                                  );

                                case 'Physiological Sigh':
                                  return (
                                    <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" style={{ border: `1px solid ${isDarkMode ? '#666' : '#999'}`, borderRadius: '50%' }}>
                                      <defs>
                                        <radialGradient id="gradient-physio-outer">
                                          <stop offset="0%" stopColor="rgba(255, 230, 230, 0.6)" />
                                          <stop offset="100%" stopColor="rgba(246, 208, 234, 0.8)" />
                                        </radialGradient>
                                        <radialGradient id="gradient-physio-inner">
                                          <stop offset="0%" stopColor="rgba(173, 136, 198, 1)" />
                                          <stop offset="100%" stopColor="rgba(116, 105, 182, 0.9)" />
                                        </radialGradient>
                                      </defs>
                                      <circle cx="24" cy="24" r="20" fill="url(#gradient-physio-outer)" />
                                      <circle cx="24" cy="24" r="14" fill="url(#gradient-physio-inner)" />
                                    </svg>
                                  );

                                case 'Alternate Nostril':
                                  return (
                                    <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" style={{ border: `1px solid ${isDarkMode ? '#666' : '#999'}`, borderRadius: '4px' }}>
                                      <defs>
                                        <linearGradient id="gradient-nostril" x1="0%" y1="100%" x2="0%" y2="0%">
                                          <stop offset="0%" stopColor="#7469B6" />
                                          <stop offset="50%" stopColor="#AD88C6" />
                                          <stop offset="100%" stopColor="#FFE6E6" />
                                        </linearGradient>
                                      </defs>
                                      <rect x="6" y="8" width="16" height="32" rx="2" fill="url(#gradient-nostril)" stroke="#4B5563" strokeWidth="1" />
                                      <rect x="26" y="8" width="16" height="32" rx="2" fill="none" stroke="#4B5563" strokeWidth="1" />
                                    </svg>
                                  );

                                case 'Humming Bee':
                                  return (
                                    <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" style={{ border: `1px solid ${isDarkMode ? '#666' : '#999'}`, borderRadius: '50%' }}>
                                      <defs>
                                        <radialGradient id="gradient-humming">
                                          <stop offset="0%" stopColor="rgba(225, 175, 209, 1)" />
                                          <stop offset="100%" stopColor="rgba(225, 175, 209, 0.3)" />
                                        </radialGradient>
                                      </defs>
                                      <circle cx="24" cy="24" r="20" fill="url(#gradient-humming)" />
                                      {/* Vibration lines - 3 parallel vertical lines, middle longest */}
                                      <line x1="20" y1="20" x2="20" y2="28" stroke="#7469B6" strokeWidth="2.5" opacity="1" strokeLinecap="round" />
                                      <line x1="24" y1="17" x2="24" y2="31" stroke="#7469B6" strokeWidth="2.5" opacity="1" strokeLinecap="round" />
                                      <line x1="28" y1="20" x2="28" y2="28" stroke="#7469B6" strokeWidth="2.5" opacity="1" strokeLinecap="round" />
                                    </svg>
                                  );

                                default:
                                  return null;
                              }
                            };

                            return (
                              <button
                                key={track.id}
                                onClick={() => {
                                  setSelectedExercise(track);
                                  setShowingInfo(true);
                                }}
                                className="flex flex-row items-center justify-between p-4 transition-all hover:brightness-110 active:brightness-90"
                                style={{
                                  borderRadius: '13px',
                                  background: isDarkMode ? '#333' : '#F3F4F6'
                                }}
                              >
                                {/* Left Content */}
                                <div className="flex flex-col items-start gap-2 flex-1">
                                  {/* Exercise Name */}
                                  <span className="text-base font-bold text-left leading-tight" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                                    {track.name}
                                  </span>

                                  {/* Difficulty Indicator */}
                                  <DifficultyIndicator level={getDifficultyLevel(track.name)} />

                                  {/* Best For */}
                                  <p className="text-sm text-left" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
                                    {metadata.bestFor}
                                  </p>
                                </div>

                                {/* Right: Preview Icon */}
                                <div className="ml-4 flex-shrink-0">
                                  {renderExerciseIcon(track.name)}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      /* Original List View for Focus/Calm */
                      <div className="overflow-y-auto flex-1 min-h-0 hide-scrollbar">
                        {currentTracks.map((track, index) => (
                        <div
                          key={track.id}
                          className="w-full flex items-start py-4 border-b border-gray-600 hover:bg-gray-700 hover:opacity-70 transition-all group relative"
                      >
                        <button
                          onClick={() => {
                            if (selectedOption === 'breathe') {
                              // Show info screen for breathing exercises
                              setSelectedExercise(track);
                              setShowingInfo(true);
                            }
                          }}
                          className="text-left flex-1 flex items-start"
                        >
                          <div className="flex-1">
                            <p className="text-base font-semibold text-white">{track.name}</p>
                          </div>

                          {/* Right Side - Duration or Chevron */}
                          <span className="text-sm text-gray-500">{track.duration}</span>
                        </button>
                      </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                    {/* Customization Bottom Sheet - Universal for all exercises */}
                    {showCustomizationSheet && selectedExercise && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end"
                        onClick={() => setShowCustomizationSheet(false)}
                      >
                        <div
                          className="rounded-t-3xl w-full max-h-[70vh] overflow-y-auto animate-slide-up"
                          style={{ background: isDarkMode ? '#333' : '#FFFFFF' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-6">
                            {/* Sheet Handle */}
                            <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: '#4B5563' }}></div>

                            {/* Section Title */}
                            <h2 className="text-2xl font-bold mb-6" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Personalize</h2>

                            {/* Cycles Slider */}
                            <div className="mb-8">
                              {/* Time Display */}
                              <div className="text-base font-medium mb-8" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                                <span style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>Exercise Time: </span>
                                {(() => {
                                  let cycleDuration = 0;
                                  let currentCycles = 0;

                                  switch(selectedExercise.name) {
                                    case 'Box Breathing':
                                      cycleDuration = 16; // 4+4+4+4 seconds
                                      currentCycles = selectedCycles;
                                      break;
                                    case '4-7-8 Breathing':
                                      cycleDuration = 19; // 4+7+8 seconds
                                      currentCycles = selectedCycles;
                                      break;
                                    case 'Coherent Breathing':
                                      cycleDuration = coherentBreathTime * 2; // inhale + exhale
                                      currentCycles = coherentCycles;
                                      break;
                                    case 'Physiological Sigh':
                                      cycleDuration = 9; // 4s inhale + 5s exhale
                                      currentCycles = selectedCycles;
                                      break;
                                    case 'Alternate Nostril':
                                      cycleDuration = alternateNostrilBreathTime * 4; // 4 breaths per cycle
                                      currentCycles = alternateNostrilCycles;
                                      break;
                                    case 'Humming Bee':
                                      cycleDuration = 14; // 4s inhale + 10s exhale with hum
                                      currentCycles = selectedCycles;
                                      break;
                                    default:
                                      cycleDuration = 16;
                                      currentCycles = selectedCycles;
                                  }

                                  const totalSeconds = cycleDuration * currentCycles;
                                  const minutes = Math.floor(totalSeconds / 60);
                                  const seconds = totalSeconds % 60;
                                  return (
                                    <>
                                      <span>{minutes} min</span>
                                      {seconds > 0 && <span> {seconds} sec</span>}
                                    </>
                                  );
                                })()}
                              </div>

                              <div className="flex flex-col items-center gap-6">
                                {/* Numeric Display */}
                                <div
                                  className="text-3xl font-bold flex items-center justify-center rounded-full"
                                  style={{
                                    width: '80px',
                                    height: '80px',
                                    color: isDarkMode ? '#FFFFFF' : '#000000',
                                    background: isDarkMode ? '#333' : '#E8E8E8',
                                    boxShadow: isDarkMode
                                      ? '6px 6px 15px 0 #1E1E1E inset, -6px -6px 12px 0 rgba(77, 77, 77, 0.25) inset'
                                      : '-4px -4px 8px 0 rgba(255, 255, 255, 0.5) inset, 4px 4px 8px 0 rgba(0, 0, 0, 0.15) inset'
                                  }}
                                >
                                  {(() => {
                                    if (selectedExercise.name === 'Coherent Breathing') return coherentCycles;
                                    if (selectedExercise.name === 'Alternate Nostril') return alternateNostrilCycles;
                                    return selectedCycles;
                                  })()}
                                </div>

                                <label className="text-base font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Cycles</label>

                                {/* Slider Track */}
                                <div className="w-full px-4">
                                  <div
                                    className="relative h-3 rounded-full mb-10"
                                    style={{
                                      background: isDarkMode ? '#333' : '#E8E8E8',
                                      boxShadow: isDarkMode
                                        ? '4px 4px 10px 0 #1E1E1E inset, -4px -4px 8px 0 rgba(77, 77, 77, 0.25) inset'
                                        : '-4px -4px 8px 0 rgba(255, 255, 255, 0.5) inset, 4px 4px 8px 0 rgba(0, 0, 0, 0.15) inset'
                                    }}
                                  >
                                    {/* Slider Input */}
                                    <input
                                      type="range"
                                      min="3"
                                      max={(() => {
                                        let cycleDuration = 0;
                                        switch(selectedExercise.name) {
                                          case 'Box Breathing':
                                            cycleDuration = 16;
                                            break;
                                          case '4-7-8 Breathing':
                                            cycleDuration = 19;
                                            break;
                                          case 'Coherent Breathing':
                                            cycleDuration = coherentBreathTime * 2;
                                            break;
                                          case 'Physiological Sigh':
                                            cycleDuration = 9;
                                            break;
                                          case 'Alternate Nostril':
                                            cycleDuration = alternateNostrilBreathTime * 4;
                                            break;
                                          case 'Humming Bee':
                                            cycleDuration = 14;
                                            break;
                                          default:
                                            cycleDuration = 16;
                                        }
                                        // Max 20 minutes = 1200 seconds
                                        return Math.floor(1200 / cycleDuration);
                                      })()}
                                      step="3"
                                      value={(() => {
                                        if (selectedExercise.name === 'Coherent Breathing') return coherentCycles;
                                        if (selectedExercise.name === 'Alternate Nostril') return alternateNostrilCycles;
                                        return selectedCycles;
                                      })()}
                                      onChange={(e) => {
                                        const newValue = parseInt(e.target.value);
                                        if (selectedExercise.name === 'Coherent Breathing') {
                                          setCoherentCycles(newValue);
                                          setSelectedCycles(newValue);
                                        } else if (selectedExercise.name === 'Alternate Nostril') {
                                          setAlternateNostrilCycles(newValue);
                                        } else {
                                          setSelectedCycles(newValue);
                                        }
                                        const userId = currentUser?.uid;
                                        trackEvent('cycle_selected', {
                                          exercise: selectedExercise.name,
                                          cycles: newValue
                                        }, userId);
                                      }}
                                      className="absolute w-full h-full opacity-0 cursor-pointer"
                                      style={{ top: 0, left: 0, zIndex: 10 }}
                                    />
                                    {/* Slider Thumb */}
                                    <div
                                      className="absolute rounded-full pointer-events-none transition-all duration-200 ease-out"
                                      style={{
                                        width: '38px',
                                        height: '38px',
                                        top: '50%',
                                        left: `calc(${(() => {
                                          let currentValue, minValue = 3, maxValue;
                                          let cycleDuration = 0;

                                          if (selectedExercise.name === 'Coherent Breathing') {
                                            currentValue = coherentCycles;
                                            cycleDuration = coherentBreathTime * 2;
                                          } else if (selectedExercise.name === 'Alternate Nostril') {
                                            currentValue = alternateNostrilCycles;
                                            cycleDuration = alternateNostrilBreathTime * 4;
                                          } else {
                                            currentValue = selectedCycles;
                                            switch(selectedExercise.name) {
                                              case 'Box Breathing':
                                                cycleDuration = 16;
                                                break;
                                              case '4-7-8 Breathing':
                                                cycleDuration = 19;
                                                break;
                                              case 'Physiological Sigh':
                                                cycleDuration = 9;
                                                break;
                                              case 'Humming Bee':
                                                cycleDuration = 14;
                                                break;
                                              default:
                                                cycleDuration = 16;
                                            }
                                          }

                                          maxValue = Math.floor(1200 / cycleDuration);
                                          return ((currentValue - minValue) / (maxValue - minValue)) * 100;
                                        })()}% - 19px)`,
                                        transform: 'translateY(-50%)',
                                        background: '#AD88C6',
                                        boxShadow: '-6px -6px 12px 0 rgba(255, 255, 255, 0.15), 6px 6px 15px 0 #000'
                                      }}
                                    />
                                  </div>
                                  {/* Tick Marks with Labels - Min and Max only */}
                                  <div className="flex justify-between px-1">
                                    {(() => {
                                      let cycleDuration = 0;
                                      switch(selectedExercise.name) {
                                        case 'Box Breathing':
                                          cycleDuration = 16;
                                          break;
                                        case '4-7-8 Breathing':
                                          cycleDuration = 19;
                                          break;
                                        case 'Coherent Breathing':
                                          cycleDuration = coherentBreathTime * 2;
                                          break;
                                        case 'Physiological Sigh':
                                          cycleDuration = 9;
                                          break;
                                        case 'Alternate Nostril':
                                          cycleDuration = alternateNostrilBreathTime * 4;
                                          break;
                                        case 'Humming Bee':
                                          cycleDuration = 14;
                                          break;
                                        default:
                                          cycleDuration = 16;
                                      }
                                      const minCycles = 3;
                                      const maxCycles = Math.floor(1200 / cycleDuration);

                                      return (
                                        <>
                                          <span className="text-xs font-medium text-gray-400">{minCycles}</span>
                                          <span className="text-xs font-medium text-gray-400">{maxCycles}</span>
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Close Button */}
                            <div className="flex justify-center">
                              <button
                                onClick={() => setShowCustomizationSheet(false)}
                                className="text-base font-bold transition-all hover:brightness-110 active:brightness-90"
                                style={{
                                  display: 'flex',
                                  width: '200px',
                                  height: '59px',
                                  padding: '12px 32px 11px 32px',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: '27px',
                                  background: '#7469B6',
                                  boxShadow: 'none',
                                  color: '#FFFFFF'
                                }}
                              >
                                Done
                              </button>
                            </div>
                          </div>
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
                        <h4 className="font-bold text-lg text-black mb-3">What is this app?</h4>
                        <p className="text-black text-base leading-relaxed">
                          This is a minimal, science-backed breathing app designed to help you detach from the noise of modern life. It offers a clean, distraction-free environment to help you reset—on your terms, in your time. No subscriptions, no gamification, no clutter.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-lg text-black mb-3">Why did you create this app?</h4>
                        <p className="text-black text-base leading-relaxed">
                          We built this because we couldn't find anything like it. Most apps were too noisy, too feature-heavy, or too focused on engagement. We wanted a simple, effective space for stillness—no voiceovers, no upsells, no pressure. Just sound, breath, and choice.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-lg text-black mb-3">Who is this app for?</h4>
                        <p className="text-black text-base leading-relaxed">
                          This is for people who are tired of constant noise—external and internal. If you're looking for a quiet companion that doesn't demand your attention, this is for you. No achievements. No streaks. Just space to breathe.
                        </p>
                      </div>
                    </section>

                    {/* Features Section */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-4">Features</h3>

                      <div className="mb-6">
                        <h4 className="font-bold text-lg text-black mb-3">What breathing exercises are available?</h4>
                        <p className="text-black text-base leading-relaxed">
                          The app offers six distinct breathing exercises, each carefully curated to support different needs—whether you want to calm down, refocus, or simply pause.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-lg text-black mb-3">Can I customize the exercises?</h4>
                        <p className="text-black text-base leading-relaxed">
                          Yes. Every breathing exercise allows you to choose how many cycles you want to complete. In the Coherent Breathing exercise, you can also adjust the inhale and exhale timer to suit your preferences.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-lg text-black mb-3">Does the app include guidance or preparation advice?</h4>
                        <p className="text-gray-700 text-sm leading-relaxed mb-2">
                          Absolutely. Each exercise comes with a curated list of:
                        </p>
                        <ul className="list-disc list-inside text-black text-base leading-relaxed ml-4">
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
                        <h4 className="font-bold text-lg text-black mb-3">What platforms is the app available on?</h4>
                        <p className="text-black text-base leading-relaxed">
                          Currently, the app is available only on the web. If demand continues, we'll explore building native mobile apps for iOS and Android.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-lg text-black mb-3">Do I need to create an account or sign in?</h4>
                        <p className="text-black text-base leading-relaxed">
                          No account required. We intentionally keep things simple and private.
                        </p>
                      </div>
                    </section>

                    {/* Cost & Monetization Section */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-4">Cost & Monetization</h3>

                      <div className="mb-6">
                        <h4 className="font-bold text-lg text-black mb-3">Is the app free?</h4>
                        <p className="text-black text-base leading-relaxed">
                          Yes, the app is 100% free to use. No subscriptions, no hidden fees, no upsells.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-lg text-black mb-3">Are there plans to monetize the app?</h4>
                        <p className="text-black text-base leading-relaxed">
                          We're considering adding an optional donation feature to help support hosting and future improvements. If implemented, it will be entirely optional—no pressure, ever.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-lg text-black mb-3">Will there ever be badges, rewards, or streaks?</h4>
                        <p className="text-black text-base leading-relaxed">
                          No. That's not what this app is about. We don't believe rest should be gamified.
                        </p>
                      </div>
                    </section>

                    {/* Philosophy & Community Section */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-4">Philosophy & Community</h3>

                      <div className="mb-6">
                        <h4 className="font-bold text-lg text-black mb-3">What makes this app different from other wellness apps?</h4>
                        <ul className="list-disc list-inside text-black text-base leading-relaxed ml-4 space-y-2">
                          <li><span className="font-semibold">No distractions:</span> No pop-ups, no guided meditations, no complex dashboards.</li>
                          <li><span className="font-semibold">Evidence-based:</span> Breathing techniques and sound design are grounded in science, not trends.</li>
                          <li><span className="font-semibold">Minimalist design:</span> Built to help you detach, not keep you engaged.</li>
                          <li><span className="font-semibold">No algorithms:</span> We don't track your habits or try to increase "time in app."</li>
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-lg text-black mb-3">Is this part of a larger movement or community?</h4>
                        <p className="text-black text-base leading-relaxed">
                          It's not a movement—it's a mindset. A small collective of people who believe the most radical thing we can do is rest our minds. You're invited to use the app however and whenever you need it.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-lg text-black mb-3">How can I support this project?</h4>
                        <p className="text-black text-base leading-relaxed">
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

                    <p className="text-base text-black leading-relaxed">
                      We respect your privacy. This policy explains how we collect, use, and protect your data when you use our breathing app, currently available via web and powered by Firebase services.
                    </p>

                    {/* 1. Who We Are */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">1. Who We Are</h3>
                      <p className="text-base text-black leading-relaxed">
                        This app is developed and operated by a small independent team based in India. Our mission is to offer a minimal, distraction-free space to breathe—without advertising, upsells, or pressure.
                      </p>
                    </section>

                    {/* 2. What Data We Collect */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">2. What Data We Collect</h3>
                      <p className="text-base text-black leading-relaxed mb-4">
                        We do not collect or store any personal information beyond what is essential for app functionality.
                      </p>
                      <p className="text-base text-black leading-relaxed mb-3">We collect the following data:</p>

                      <div className="ml-4 mb-4">
                        <h4 className="font-bold text-lg text-black mb-3">Authentication Data</h4>
                        <p className="text-base text-black leading-relaxed">
                          When you log in via Google Authentication, Firebase (a Google service) verifies your identity. We do not store your email address or Google profile data in our own databases.
                        </p>
                      </div>

                      <div className="ml-4">
                        <h4 className="font-bold text-lg text-black mb-3">App Activity Data</h4>
                        <p className="text-base text-black leading-relaxed mb-2">
                          We track non-personal, anonymized usage information such as:
                        </p>
                        <ul className="list-disc list-inside text-base text-black leading-relaxed ml-4 mb-2">
                          <li>Exercises started</li>
                          <li>Duration of usage</li>
                          <li>Frequency and timestamps</li>
                          <li>Crashes or errors (via Crashlytics)</li>
                        </ul>
                        <p className="text-base text-black leading-relaxed">
                          This helps us improve the app and understand what features are most helpful.
                        </p>
                      </div>
                    </section>

                    {/* 3. How We Use Your Data */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">3. How We Use Your Data</h3>
                      <p className="text-base text-black leading-relaxed mb-2">
                        We use the above data only for the following purposes:
                      </p>
                      <ul className="list-disc list-inside text-base text-black leading-relaxed ml-4 mb-3">
                        <li>To provide and improve app functionality</li>
                        <li>To monitor app stability and fix issues</li>
                        <li>To understand overall usage patterns</li>
                        <li>To ensure login security via Google Authentication</li>
                      </ul>
                      <p className="text-base text-black leading-relaxed mb-2">We do not:</p>
                      <ul className="list-disc list-inside text-base text-black leading-relaxed ml-4">
                        <li>Sell your data</li>
                        <li>Share your data with advertisers</li>
                        <li>Track you across other sites or apps</li>
                      </ul>
                    </section>

                    {/* 4. Third-Party Services */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">4. Third-Party Services</h3>
                      <p className="text-base text-black leading-relaxed mb-2">
                        We rely on the following third-party services, which may process limited data:
                      </p>
                      <ul className="list-disc list-inside text-base text-black leading-relaxed ml-4 mb-3">
                        <li>Firebase Authentication (Google LLC) – for login via Google</li>
                        <li>Firebase Analytics – for anonymous usage tracking</li>
                        <li>Firebase Crashlytics – for crash/error reporting</li>
                      </ul>
                      <p className="text-base text-black leading-relaxed">
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
                      <h3 className="text-lg font-bold text-black mb-3">5. Your Rights</h3>

                      <div className="mb-4">
                        <p className="text-base font-semibold text-black mb-2">Under GDPR (EU/EEA) and Indian law:</p>
                        <p className="text-base text-black leading-relaxed mb-2">You have the right to:</p>
                        <ul className="list-disc list-inside text-base text-black leading-relaxed ml-4">
                          <li>Request access to the data we hold (limited to app activity logs)</li>
                          <li>Request correction or deletion of your data</li>
                          <li>Withdraw consent at any time (by stopping use of the app)</li>
                        </ul>
                      </div>

                      <div className="mb-4">
                        <p className="text-base font-semibold text-black mb-2">Under California Consumer Privacy Act (CCPA):</p>
                        <p className="text-base text-black leading-relaxed mb-2">You have the right to:</p>
                        <ul className="list-disc list-inside text-base text-black leading-relaxed ml-4">
                          <li>Know what data we collect and how we use it</li>
                          <li>Request deletion of your data</li>
                          <li>Opt-out of the sale of personal data (we do not sell any data)</li>
                        </ul>
                      </div>

                      <p className="text-base text-black leading-relaxed">
                        To exercise your rights, contact us at: <span className="font-semibold">myemail@email.com</span>
                      </p>
                    </section>

                    {/* 6. Data Retention */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">6. Data Retention</h3>
                      <p className="text-base text-black leading-relaxed">
                        We retain activity logs (anonymized) for up to 12 months, to monitor usage patterns and improve functionality. After this, data may be deleted or aggregated.
                      </p>
                    </section>

                    {/* 7. Account Deletion */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">7. Account Deletion</h3>
                      <p className="text-base text-black leading-relaxed">
                        We use Google Authentication for login but do not create standalone user accounts. Therefore, there is no separate "account" to delete. However, if you'd like us to remove your activity data, you may contact us using the email below.
                      </p>
                    </section>

                    {/* 8. Data Storage Location */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">8. Data Storage Location</h3>
                      <p className="text-base text-black leading-relaxed">
                        All data is stored securely using Firebase, hosted on Google Cloud infrastructure. Data may be stored in servers located in the United States, EU, or Asia, subject to Google's data policies.
                      </p>
                    </section>

                    {/* 9. Changes to This Policy */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">9. Changes to This Policy</h3>
                      <p className="text-base text-black leading-relaxed">
                        We may update this Privacy Policy as our app evolves. We will post the updated version with a new "last updated" date. Continued use of the app implies your acceptance of any changes.
                      </p>
                    </section>

                    {/* 10. Contact Us */}
                    <section className="border-t border-gray-300 pt-6">
                      <h3 className="text-lg font-bold text-black mb-3">10. Contact Us</h3>
                      <p className="text-base text-black leading-relaxed mb-2">
                        If you have any questions or concerns about your privacy, contact us at:
                      </p>
                      <p className="text-base text-black leading-relaxed">
                        📧 <span className="font-semibold">myemail@email.com</span>
                      </p>
                    </section>
                  </div>
                ) : currentView === 'terms' ? (
                  <div className="flex flex-col py-6 text-left space-y-6 max-w-3xl mx-auto">
                    <p className="text-xs text-gray-600 italic">Last updated: January 9, 2026</p>

                    <p className="text-base text-black leading-relaxed">
                      Welcome to our breathing app. Please read these Terms and Conditions ("Terms") carefully before using the app. By accessing or using the app, you agree to be bound by these Terms.
                    </p>

                    <p className="text-base text-black leading-relaxed font-semibold">
                      If you do not agree to these Terms, please do not use the app.
                    </p>

                    {/* 1. Who We Are */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">1. Who We Are</h3>
                      <p className="text-base text-black leading-relaxed">
                        This app is developed by a small team based in India, offering a minimalist, free breathing tool. We do not serve ads, offer upsells, or sell your data.
                      </p>
                    </section>

                    {/* 2. Use of the App */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">2. Use of the App</h3>
                      <p className="text-base text-black leading-relaxed mb-2">
                        You may use the app for personal, non-commercial purposes only. You must not:
                      </p>
                      <ul className="list-disc list-inside text-base text-black leading-relaxed ml-4 mb-3">
                        <li>Use the app for unlawful or harmful purposes</li>
                        <li>Attempt to reverse-engineer, copy, or distribute the app or its content</li>
                        <li>Use automated systems to access the app or collect data</li>
                      </ul>
                      <p className="text-base text-black leading-relaxed">
                        We reserve the right to suspend or terminate access if misuse is detected.
                      </p>
                    </section>

                    {/* 3. Google Authentication */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">3. Google Authentication</h3>
                      <p className="text-base text-black leading-relaxed">
                        The app uses Firebase Authentication for Google sign-in. We do not store your email or personal information outside of Firebase. By using the sign-in feature, you also agree to Google's terms and privacy practices.
                      </p>
                    </section>

                    {/* 4. Health Disclaimer */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">4. Health Disclaimer</h3>
                      <p className="text-base text-black leading-relaxed mb-2">
                        This app provides general breathing exercises for relaxation and focus. It is not a substitute for professional medical advice or treatment.
                      </p>
                      <ul className="list-disc list-inside text-base text-black leading-relaxed ml-4">
                        <li>Use at your own risk.</li>
                        <li>If you have respiratory, cardiac, or neurological conditions, consult your doctor before using the app.</li>
                        <li>We are not responsible for any outcomes resulting from the use of the exercises.</li>
                      </ul>
                    </section>

                    {/* 5. Intellectual Property */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">5. Intellectual Property</h3>
                      <p className="text-base text-black leading-relaxed mb-2">
                        All content in the app—including visuals, sound design, and breathing patterns—is owned by the app creators or used with permission.
                      </p>
                      <p className="text-base text-black leading-relaxed">
                        You may not copy, reproduce, distribute, or modify any part of the app without explicit written consent.
                      </p>
                    </section>

                    {/* 6. Limitation of Liability */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">6. Limitation of Liability</h3>
                      <p className="text-base text-black leading-relaxed mb-2">
                        The app is provided "as is" and "as available" without warranties of any kind.
                      </p>
                      <p className="text-base text-black leading-relaxed mb-2">
                        To the fullest extent permitted by law, we disclaim all liability for:
                      </p>
                      <ul className="list-disc list-inside text-base text-black leading-relaxed ml-4">
                        <li>Direct, indirect, incidental, or consequential damages</li>
                        <li>Health-related outcomes</li>
                        <li>Service interruptions or data loss</li>
                      </ul>
                    </section>

                    {/* 7. Privacy */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">7. Privacy</h3>
                      <p className="text-base text-black leading-relaxed">
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
                      <h3 className="text-lg font-bold text-black mb-3">8. Changes to the Terms</h3>
                      <p className="text-base text-black leading-relaxed">
                        We may update these Terms occasionally. Changes will be posted with an updated effective date. Continued use of the app implies your acceptance of the revised Terms.
                      </p>
                    </section>

                    {/* 9. Governing Law */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">9. Governing Law</h3>
                      <p className="text-base text-black leading-relaxed mb-2">
                        These Terms are governed by the laws of India, without regard to conflict of law principles.
                      </p>
                      <p className="text-base text-black leading-relaxed">
                        Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
                      </p>
                    </section>

                    {/* 10. Contact Us */}
                    <section className="border-t border-gray-300 pt-6">
                      <h3 className="text-lg font-bold text-black mb-3">10. Contact Us</h3>
                      <p className="text-base text-black leading-relaxed mb-2">
                        If you have any questions about these Terms, please contact us at:
                      </p>
                      <p className="text-base text-black leading-relaxed">
                        📧 <span className="font-semibold">myemail@email.com</span>
                      </p>
                    </section>
                  </div>
                ) : currentView === 'breathing-info' ? (
                  <div className="flex flex-col py-6 text-left space-y-6 max-w-3xl mx-auto">
                    <p className="text-base text-black leading-relaxed">
                      Our breath is the fastest way to change how you feel—anytime, anywhere.
                    </p>

                    <p className="text-base text-black leading-relaxed">
                      Most of us breathe all day without noticing it. But when you intentionally guide your breath, something powerful happens: your nervous system listens. Heart rate slows. The mind becomes clearer. Stress loosens its grip.
                    </p>

                    <p className="text-base text-black leading-relaxed">
                      That's the promise behind The Hush Initiative—a calm, science-backed space where breathing becomes a daily ally, not another task on your list.
                    </p>

                    {/* Why breathing works */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">Why breathing works (and why you feel it so quickly)</h3>
                      <p className="text-base text-black leading-relaxed mb-3">
                        Slow, rhythmic breathing gently activates your body's natural "rest and restore" response. This helps:
                      </p>
                      <ul className="list-disc list-inside text-base text-black leading-relaxed ml-4 space-y-2">
                        <li>Lower stress and anxiety by signalling safety to the brain</li>
                        <li>Improve focus and decision-making during busy or high-pressure moments</li>
                        <li>Support better sleep by easing your body out of fight-or-flight</li>
                        <li>Build emotional resilience over time, so stress has less staying power</li>
                      </ul>
                      <p className="text-base text-black leading-relaxed mt-3">
                        Even short sessions—just five minutes—can create noticeable shifts. With consistency, those shifts become your new baseline.
                      </p>
                    </section>

                    {/* Techniques */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">Techniques you'll experience inside the app</h3>
                      <p className="text-base text-black leading-relaxed mb-4">
                        The Hush Initiative blends proven breathing techniques with calming visual animations, so your body can follow along effortlessly:
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-lg text-black mb-3">Cyclic Sighing (for mood resets)</h4>
                          <p className="text-base text-black leading-relaxed">
                            A double inhale followed by a long exhale helps release tension quickly—ideal when emotions feel heavy or overwhelming.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-lg text-black mb-3">Box Breathing (for focus)</h4>
                          <p className="text-base text-black leading-relaxed">
                            Equal, steady counts guide you back to clarity before a meeting or challenging task.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-lg text-black mb-3">4-7-8 Breathing (for sleep)</h4>
                          <p className="text-base text-black leading-relaxed">
                            Longer exhales cue deep relaxation, making it easier to fall—and stay—asleep.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-lg text-black mb-3">Alternate Nostril Breathing (for balance)</h4>
                          <p className="text-base text-black leading-relaxed">
                            A gentle rhythm that supports calm, centered energy throughout the day.
                          </p>
                        </div>
                      </div>

                      <p className="text-base text-black leading-relaxed mt-4">
                        The visuals do the counting for you. You simply breathe.
                      </p>
                    </section>

                    {/* Make it a habit */}
                    <section>
                      <h3 className="text-lg font-bold text-black mb-3">Make it a habit, not a chore</h3>
                      <p className="text-base text-black leading-relaxed">
                        Use the app as a pause between moments: morning grounding, a midday reset, or a nighttime wind-down. Pair it with something you already do—coffee brewing, brushing your teeth, setting your alarm—and let repetition work its quiet magic.
                      </p>
                      <p className="text-base text-black leading-relaxed mt-3">
                        The result: fewer reactive moments, more clarity, deeper rest—and a growing sense that calm is something you can access on demand.
                      </p>
                    </section>

                    {/* Closing */}
                    <section className="border-t border-gray-300 pt-6">
                      <p className="text-base text-black leading-relaxed font-semibold mb-2">
                        One breath won't change your life.
                      </p>
                      <p className="text-base text-black leading-relaxed">
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

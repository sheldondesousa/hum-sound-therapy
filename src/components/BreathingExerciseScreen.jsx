import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { trackBreathingExercise } from '../services/analytics';

export default function BreathingExerciseScreen() {
  const navigate = useNavigate();
  const { type } = useParams();
  const location = useLocation();
  const cyclesFromInfo = location.state?.cycles || 5;
  const { currentUser } = useAuth();

  const [countdown, setCountdown] = useState(3);
  const [isExercising, setIsExercising] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [timer, setTimer] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [filledSquares, setFilledSquares] = useState([]);

  // Get exercise title from type
  const getExerciseTitle = () => {
    switch (type) {
      case 'box': return 'Box Breathing';
      case '4-7-8': return '4-7-8 Breathing';
      case 'coherent': return 'Coherent Breathing';
      case 'physiological-sigh': return 'Physiological Sigh';
      case 'alternate-nostril': return 'Alternate Nostril Breathing';
      case 'humming-bee': return 'Humming Bee Breath';
      default: return 'Breathing Exercise';
    }
  };

  // Box Breathing color palette - updated to match specification
  const boxBreathingColors = {
    breatheIn: '#8A2BE2',      // Blue Violet for squares 1-4
    hold: '#E6A8D7',           // Light Orchid for squares 5-8 and 13-16
    breatheOut: '#B284BE'      // African Violet for squares 9-12
  };

  // Auto-start countdown when component mounts
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      // Countdown finished, start exercise
      setCountdown(null);
      setIsExercising(true);
      setBreathingPhase('inhale');
      setTimer(0);
      setCurrentCycle(0);
      setFilledSquares([]);
      const userId = currentUser?.uid;
      trackBreathingExercise(type, 'start', userId, { cycles: cyclesFromInfo });
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, cyclesFromInfo, currentUser, type]);

  // Breathing animation cycle effect
  useEffect(() => {
    if (!isExercising) return;

    // Different interval durations for different exercises
    const intervalDuration = type === 'box' ? 1000 : 100;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        const nextTimer = prevTimer + 1;

        // BOX BREATHING - 4-4-4-4 pattern
        if (type === 'box') {
          if (breathingPhase === 'inhale') {
            if (nextTimer <= 4) {
              setFilledSquares(prev => {
                const newFilled = [...prev];
                if (nextTimer > 0 && !newFilled.includes(nextTimer - 1)) {
                  newFilled.push(nextTimer - 1);
                }
                return newFilled;
              });
              if (nextTimer === 4) {
                setBreathingPhase('hold1');
                return 0;
              }
              return nextTimer;
            }
          } else if (breathingPhase === 'hold1') {
            if (nextTimer <= 4) {
              setFilledSquares(prev => {
                const newFilled = [...prev];
                const squareIndex = 4 + nextTimer - 1;
                if (nextTimer > 0 && !newFilled.includes(squareIndex)) {
                  newFilled.push(squareIndex);
                }
                return newFilled;
              });
              if (nextTimer === 4) {
                setBreathingPhase('exhale');
                return 0;
              }
              return nextTimer;
            }
          } else if (breathingPhase === 'exhale') {
            if (nextTimer <= 4) {
              setFilledSquares(prev => {
                const newFilled = [...prev];
                const squareIndex = 8 + nextTimer - 1;
                if (nextTimer > 0 && !newFilled.includes(squareIndex)) {
                  newFilled.push(squareIndex);
                }
                return newFilled;
              });
              if (nextTimer === 4) {
                setBreathingPhase('hold2');
                return 0;
              }
              return nextTimer;
            }
          } else if (breathingPhase === 'hold2') {
            if (nextTimer <= 4) {
              setFilledSquares(prev => {
                const newFilled = [...prev];
                const squareIndex = 12 + nextTimer - 1;
                if (nextTimer > 0 && !newFilled.includes(squareIndex)) {
                  newFilled.push(squareIndex);
                }
                return newFilled;
              });
              if (nextTimer === 4) {
                // Cycle completed
                const nextCycle = currentCycle + 1;
                if (nextCycle >= cyclesFromInfo) {
                  const userId = currentUser?.uid;
                  trackBreathingExercise(type, 'complete', userId, {
                    completedCycles: nextCycle,
                    totalCycles: cyclesFromInfo
                  });
                  setIsExercising(false);
                  setCurrentCycle(0);
                  setBreathingPhase('inhale');
                  setTimer(0);
                  setFilledSquares([]);
                  return 0;
                } else {
                  setCurrentCycle(nextCycle);
                  setBreathingPhase('inhale');
                  setFilledSquares([]);
                  return 0;
                }
              }
              return nextTimer;
            }
          }
        }
        // 4-7-8 BREATHING
        else if (type === '4-7-8') {
          if (breathingPhase === 'inhale') {
            if (prevTimer < 40) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('hold1');
              return 0;
            }
          } else if (breathingPhase === 'hold1') {
            if (prevTimer < 70) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('exhale');
              return 80;
            }
          } else if (breathingPhase === 'exhale') {
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              const nextCycle = currentCycle + 1;
              if (nextCycle >= cyclesFromInfo) {
                const userId = currentUser?.uid;
                trackBreathingExercise(type, 'complete', userId, {
                  completedCycles: nextCycle,
                  totalCycles: cyclesFromInfo
                });
                setIsExercising(false);
                setCurrentCycle(0);
                setBreathingPhase('inhale');
                return 0;
              } else {
                setCurrentCycle(nextCycle);
                setBreathingPhase('inhale');
                return 0;
              }
            }
          }
        }
        // COHERENT BREATHING
        else if (type === 'coherent') {
          const maxTimer = 50; // 5 seconds at 100ms intervals
          if (breathingPhase === 'inhale') {
            if (prevTimer < maxTimer) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('exhale');
              return maxTimer;
            }
          } else if (breathingPhase === 'exhale') {
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              const nextCycle = currentCycle + 1;
              if (nextCycle >= cyclesFromInfo) {
                const userId = currentUser?.uid;
                trackBreathingExercise(type, 'complete', userId, {
                  completedCycles: nextCycle,
                  totalCycles: cyclesFromInfo
                });
                setIsExercising(false);
                setCurrentCycle(0);
                setBreathingPhase('inhale');
                return 0;
              } else {
                setCurrentCycle(nextCycle);
                setBreathingPhase('inhale');
                return 0;
              }
            }
          }
        }
        // PHYSIOLOGICAL SIGH
        else if (type === 'physiological-sigh') {
          if (breathingPhase === 'inhale') {
            if (prevTimer < 39) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('hold1');
              return 0;
            }
          } else if (breathingPhase === 'hold1') {
            setBreathingPhase('exhale');
            return 79;
          } else if (breathingPhase === 'exhale') {
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              setBreathingPhase('hold2');
              return 0;
            }
          } else if (breathingPhase === 'hold2') {
            const nextCycle = currentCycle + 1;
            if (nextCycle >= cyclesFromInfo) {
              const userId = currentUser?.uid;
              trackBreathingExercise(type, 'complete', userId, {
                completedCycles: nextCycle,
                totalCycles: cyclesFromInfo
              });
              setIsExercising(false);
              setCurrentCycle(0);
              setBreathingPhase('inhale');
              return 0;
            } else {
              setCurrentCycle(nextCycle);
              setBreathingPhase('inhale');
              return 0;
            }
          }
        }
        // ALTERNATE NOSTRIL BREATHING
        else if (type === 'alternate-nostril') {
          const maxTimer = 40; // 4 seconds at 100ms intervals
          if (breathingPhase === 'inhale') {
            if (prevTimer < maxTimer) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('hold1');
              return 0;
            }
          } else if (breathingPhase === 'hold1') {
            if (prevTimer < 10) { // Brief hold
              return prevTimer + 1;
            } else {
              setBreathingPhase('exhale');
              return maxTimer;
            }
          } else if (breathingPhase === 'exhale') {
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              setBreathingPhase('hold2');
              return 0;
            }
          } else if (breathingPhase === 'hold2') {
            if (prevTimer < 10) { // Brief hold
              return prevTimer + 1;
            } else {
              const nextCycle = currentCycle + 1;
              if (nextCycle >= cyclesFromInfo) {
                const userId = currentUser?.uid;
                trackBreathingExercise(type, 'complete', userId, {
                  completedCycles: nextCycle,
                  totalCycles: cyclesFromInfo
                });
                setIsExercising(false);
                setCurrentCycle(0);
                setBreathingPhase('inhale');
                return 0;
              } else {
                setCurrentCycle(nextCycle);
                setBreathingPhase('inhale');
                return 0;
              }
            }
          }
        }
        // HUMMING BEE BREATH
        else if (type === 'humming-bee') {
          if (breathingPhase === 'inhale') {
            if (prevTimer < 40) { // 4 seconds
              return prevTimer + 1;
            } else {
              setBreathingPhase('exhale');
              return 60; // 6 seconds for exhale
            }
          } else if (breathingPhase === 'exhale') {
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              const nextCycle = currentCycle + 1;
              if (nextCycle >= cyclesFromInfo) {
                const userId = currentUser?.uid;
                trackBreathingExercise(type, 'complete', userId, {
                  completedCycles: nextCycle,
                  totalCycles: cyclesFromInfo
                });
                setIsExercising(false);
                setCurrentCycle(0);
                setBreathingPhase('inhale');
                return 0;
              } else {
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
  }, [isExercising, breathingPhase, currentCycle, cyclesFromInfo, currentUser, type]);

  // Get square color for Box Breathing
  const getSquareColor = (index) => {
    if (index < 4) {
      // Top row (Breathe In) - Blue Violet
      return boxBreathingColors.breatheIn;
    } else if (index < 8) {
      // Right column (Hold) - Light Orchid
      return boxBreathingColors.hold;
    } else if (index < 12) {
      // Bottom row (Breathe Out) - African Violet
      return boxBreathingColors.breatheOut;
    } else {
      // Left column (Hold) - Light Orchid
      return boxBreathingColors.hold;
    }
  };

  // Get phase text
  const getPhaseText = () => {
    if (breathingPhase === 'inhale') {
      return 'Breathe In';
    } else if (breathingPhase === 'exhale') {
      return 'Breathe Out';
    } else {
      return 'HOLD';
    }
  };

  // Get timer display
  const getTimerDisplay = () => {
    if (type === 'box') {
      return timer;
    } else if (type === '4-7-8') {
      if (breathingPhase === 'inhale') return Math.floor(timer / 10);
      if (breathingPhase === 'hold1') return Math.floor(timer / 10);
      if (breathingPhase === 'exhale') return Math.floor(timer / 10);
    } else if (type === 'coherent') {
      return Math.floor(timer / 10);
    } else if (type === 'physiological-sigh') {
      if (breathingPhase === 'inhale') return Math.floor(timer / 10);
      if (breathingPhase === 'exhale') return Math.floor(timer / 10);
    } else if (type === 'alternate-nostril') {
      return Math.floor(timer / 10);
    } else if (type === 'humming-bee') {
      return Math.floor(timer / 10);
    }
    return '';
  };

  // Get circle size for non-box exercises
  const getCircleSize = () => {
    const minSize = 100;
    const maxSize = 340;

    if (type === '4-7-8') {
      if (breathingPhase === 'inhale') {
        const progress = timer / 40;
        return minSize + (maxSize - minSize) * progress;
      } else if (breathingPhase === 'hold1') {
        return maxSize;
      } else if (breathingPhase === 'exhale') {
        const progress = timer / 80;
        return minSize + (maxSize - minSize) * progress;
      }
    } else if (type === 'coherent') {
      const maxTimer = 50;
      const progress = timer / maxTimer;
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      return (maxSize * easeProgress);
    } else if (type === 'physiological-sigh') {
      if (breathingPhase === 'inhale') {
        if (timer <= 29) {
          const progress = timer / 29;
          const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          return maxSize * easeProgress;
        } else {
          return maxSize;
        }
      } else if (breathingPhase === 'hold1') {
        return maxSize;
      } else if (breathingPhase === 'exhale') {
        const progress = timer / 79;
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        return maxSize * easeProgress;
      }
    } else if (type === 'alternate-nostril') {
      const maxTimer = 40;
      if (breathingPhase === 'inhale') {
        const progress = timer / maxTimer;
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        return minSize + (maxSize - minSize) * easeProgress;
      } else if (breathingPhase === 'hold1' || breathingPhase === 'hold2') {
        return breathingPhase === 'hold1' ? maxSize : minSize;
      } else if (breathingPhase === 'exhale') {
        const progress = timer / maxTimer;
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        return minSize + (maxSize - minSize) * easeProgress;
      }
    } else if (type === 'humming-bee') {
      if (breathingPhase === 'inhale') {
        const progress = timer / 40;
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        return minSize + (maxSize - minSize) * easeProgress;
      } else if (breathingPhase === 'exhale') {
        const progress = timer / 60;
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        return minSize + (maxSize - minSize) * easeProgress;
      }
    }

    return minSize;
  };

  // Render Box Breathing animation
  const renderBoxBreathingAnimation = () => (
    <div className="flex-1 flex items-center justify-center w-full relative">
      <div className="relative" style={{ width: '340px', height: '340px' }}>
        {/* Top Row - Squares 1,2,3,4 */}
        <div className="absolute top-0 left-0 right-0 flex justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={`top-${i}`}
              className="transition-all duration-300 ease-linear"
              style={{
                width: '70px',
                height: '70px',
                backgroundColor: filledSquares.includes(i) ? getSquareColor(i) : '#E5E7EB',
                borderRadius: '8px'
              }}
            />
          ))}
        </div>

        {/* Right Column - Squares 5,6,7,8 */}
        <div className="absolute top-0 right-0 bottom-0 flex flex-col justify-between">
          {[4, 5, 6, 7].map((i) => (
            <div
              key={`right-${i}`}
              className="transition-all duration-300 ease-linear"
              style={{
                width: '70px',
                height: '70px',
                backgroundColor: filledSquares.includes(i) ? getSquareColor(i) : '#E5E7EB',
                borderRadius: '8px'
              }}
            />
          ))}
        </div>

        {/* Bottom Row - Squares 9,10,11,12 */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between">
          {[8, 9, 10, 11].map((i) => (
            <div
              key={`bottom-${i}`}
              className="transition-all duration-300 ease-linear"
              style={{
                width: '70px',
                height: '70px',
                backgroundColor: filledSquares.includes(i) ? getSquareColor(i) : '#E5E7EB',
                borderRadius: '8px'
              }}
            />
          ))}
        </div>

        {/* Left Column - Squares 13,14,15,16 */}
        <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-between">
          {[12, 13, 14, 15].map((i) => (
            <div
              key={`left-${i}`}
              className="transition-all duration-300 ease-linear"
              style={{
                width: '70px',
                height: '70px',
                backgroundColor: filledSquares.includes(i) ? getSquareColor(i) : '#E5E7EB',
                borderRadius: '8px'
              }}
            />
          ))}
        </div>

        {/* Center Text Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            key={breathingPhase}
            className={`text-3xl font-bold text-gray-900 mb-2 ${
              (breathingPhase === 'hold1' || breathingPhase === 'hold2') ? 'pulse-hold' : 'magnify-enter'
            }`}
          >
            {getPhaseText()}
          </div>
          <div className="text-6xl font-bold text-gray-900">
            {timer}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Circle-based animation for other exercises
  const renderCircleAnimation = () => {
    const circleSize = getCircleSize();
    const circleColor = type === 'physiological-sigh' && breathingPhase === 'inhale' && timer > 29
      ? '#10B981' // Green flash for second inhale
      : '#067AC3'; // Blue for normal breathing

    return (
      <div className="flex-1 flex items-center justify-center w-full relative">
        <div className="relative flex items-center justify-center" style={{ width: '400px', height: '400px' }}>
          {/* Circle */}
          <div
            className="absolute rounded-full transition-all duration-100 ease-out"
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              backgroundColor: circleColor,
              opacity: 0.6,
              filter: 'blur(20px)'
            }}
          />

          {/* Center Text Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              key={breathingPhase}
              className={`text-3xl font-bold text-gray-900 mb-2 ${
                (breathingPhase === 'hold1' || breathingPhase === 'hold2') ? 'pulse-hold' : 'magnify-enter'
              }`}
            >
              {getPhaseText()}
            </div>
            <div className="text-6xl font-bold text-gray-900">
              {getTimerDisplay()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #F4F9FD, #C3DBEA)' }}>
      <style>{`
        @keyframes magnify {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes pulseMagnify {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        .magnify-enter {
          animation: magnify 0.5s ease-out forwards;
        }
        .pulse-hold {
          animation: pulseMagnify 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-[430px] h-[932px] bg-white flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/breathe/${type}/info`)}
            className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            <span className="text-lg">Back</span>
          </button>

          <h3 className="text-xl font-semibold text-black text-center flex-1 px-4">
            {getExerciseTitle()}
          </h3>

          <div className="w-20"></div>
        </div>

        {/* Exercise Animation Area */}
        <div className="flex-1 bg-white rounded-lg flex flex-col items-center justify-center p-4">
          {/* Show Countdown */}
          {countdown !== null && countdown > 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-9xl font-bold text-gray-900 magnify-enter" key={countdown}>
                {countdown}
              </div>
            </div>
          )}

          {/* Show Exercise Animation */}
          {countdown === null && isExercising && (
            type === 'box' ? renderBoxBreathingAnimation() : renderCircleAnimation()
          )}

          {/* Exercise Complete Message */}
          {!isExercising && countdown === null && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-900 mb-4">Exercise Complete!</div>
              <div className="text-xl text-gray-600">Great job!</div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col py-6 gap-6">
          {/* Progress Display */}
          {isExercising && countdown === null && (
            <div className="text-center">
              <span className="text-sm text-gray-600 font-medium">
                Cycle {currentCycle + 1} of {cyclesFromInfo}
              </span>
            </div>
          )}

          {/* Start/Stop Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                const userId = currentUser?.uid;
                if (!isExercising && countdown === null) {
                  setCountdown(3);
                  setBreathingPhase('inhale');
                  setTimer(0);
                  setCurrentCycle(0);
                  setFilledSquares([]);
                } else if (isExercising) {
                  setIsExercising(false);
                  setBreathingPhase('inhale');
                  setTimer(0);
                  setCurrentCycle(0);
                  setFilledSquares([]);
                  trackBreathingExercise(type, 'stop', userId, { currentCycle, totalCycles: cyclesFromInfo });
                }
              }}
              className="px-12 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-lg"
            >
              {isExercising ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

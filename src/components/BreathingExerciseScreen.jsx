import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export default function BreathingExerciseScreen() {
  const navigate = useNavigate();
  const { type } = useParams();
  const location = useLocation();
  const cyclesFromInfo = location.state?.cycles || 5;

  const [isExercising, setIsExercising] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [timer, setTimer] = useState(1);
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
            if (nextCycle >= cyclesFromInfo) {
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
  }, [isExercising, breathingPhase, currentCycle, cyclesFromInfo]);

  // Calculate circle sizes and colors for animation
  const getCirclesData = () => {
    const phase = breathingPhase;
    let scale = 1;

    if (phase === 'inhale') {
      scale = 0.6 + (timer / 4) * 0.4;
    } else if (phase === 'exhale') {
      scale = 1 - (timer / 4) * 0.4;
    } else if (phase === 'hold1' || phase === 'hold2') {
      scale = timer <= 2 ? 1 : 0.6;
    }

    // Linear gradient from #86EDD2 to #15122C (3 circles evenly distributed)
    // Outermost (largest) circle is darkest, innermost (smallest) is lightest
    return [
      { key: 'circle3', size: 363 * scale, color: '#15122C', blur: 30 }, // Darkest (outermost) - 100%
      { key: 'circle2', size: 286 * scale, color: '#4E807F', blur: 25 }, // 50% gradient (middle)
      { key: 'circle1', size: 209 * scale, color: '#86EDD2', blur: 20 }  // Lightest (innermost) - 0%
    ];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <style>{`
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
            Box Breathing
          </h3>

          <div className="w-20"></div>
        </div>

        {/* Exercise Animation Area */}
        <div className="flex-1 bg-white rounded-lg flex flex-col items-center justify-center p-4">
          {/* Breathing Circle Illustration */}
          <div className="flex-1 flex items-center justify-center w-full relative">
            {/* Timeline Progress Ring - Shows during HOLD phases */}
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
                  stroke="#E5E7EB"
                  strokeWidth="4"
                />
                <circle
                  cx="181.5"
                  cy="181.5"
                  r="175"
                  fill="none"
                  stroke="#3B5B63"
                  strokeWidth="4"
                  strokeDasharray="1100"
                  strokeDashoffset={1100 - (1100 * (5 - timer) / 4)}
                  className="transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {/* Breathing Circles */}
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

            {/* Timer Display - Inside Innermost Circle */}
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
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col py-6 gap-6">
          {/* Progress Display */}
          {isExercising && (
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BreatheExercise() {
  const navigate = useNavigate();

  const cycles = [
    { id: '4-7-8', name: '4-7-8 Breathing', description: 'Inhale 4s, Hold 7s, Exhale 8s' },
    { id: 'box', name: 'Box Breathing', description: 'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s' },
    { id: '4-4-6', name: '4-4-6 Breathing', description: 'Inhale 4s, Hold 4s, Exhale 6s' },
  ];

  const timeFrames = [
    { id: '5', name: '5 minutes' },
    { id: '10', name: '10 minutes' },
    { id: '15', name: '15 minutes' },
    { id: '20', name: '20 minutes' },
  ];

  // Default to first option in each selector
  const [selectedCycle, setSelectedCycle] = useState(cycles[0].id);
  const [selectedTime, setSelectedTime] = useState(timeFrames[0].id);

  const isStartEnabled = selectedCycle && selectedTime;

  const handleStartExercise = () => {
    if (isStartEnabled) {
      console.log('Starting Breathe exercise:', { selectedCycle, selectedTime });
      // Navigate to exercise session or implement exercise logic
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden flex flex-col py-8" style={{ maxWidth: '430px', minHeight: '932px' }}>

        {/* Header */}
        <div className="px-6 py-3 flex justify-between items-center">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            <span className="font-medium text-base">Back</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="px-6 pt-8 pb-8 flex-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 80 80" fill="black">
                <circle cx="40" cy="40" r="3" fill="black"/>
                <line x1="40" y1="10" x2="40" y2="25" stroke="black" strokeWidth="2.5"/>
                <line x1="40" y1="70" x2="40" y2="55" stroke="black" strokeWidth="2.5"/>
                <line x1="10" y1="40" x2="25" y2="40" stroke="black" strokeWidth="2.5"/>
                <line x1="70" y1="40" x2="55" y2="40" stroke="black" strokeWidth="2.5"/>
                <line x1="18" y1="18" x2="28" y2="28" stroke="black" strokeWidth="2.5"/>
                <line x1="62" y1="62" x2="52" y2="52" stroke="black" strokeWidth="2.5"/>
                <line x1="62" y1="18" x2="52" y2="28" stroke="black" strokeWidth="2.5"/>
                <line x1="18" y1="62" x2="28" y2="52" stroke="black" strokeWidth="2.5"/>
              </svg>
            </div>
            <h1 className="text-5xl font-semibold text-black" style={{ fontFamily: 'Roboto Serif, serif' }}>
              Breathe
            </h1>
          </div>

          {/* Cycle Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-black mb-4">Select Breathing Cycle</h2>
            <div className="space-y-3">
              {cycles.map((cycle) => (
                <button
                  key={cycle.id}
                  onClick={() => setSelectedCycle(cycle.id)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedCycle === cycle.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold text-lg">{cycle.name}</div>
                  <div className="text-gray-600 text-sm mt-1">{cycle.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Frame Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-black mb-4">Select Duration</h2>
            <div className="grid grid-cols-2 gap-3">
              {timeFrames.map((time) => (
                <button
                  key={time.id}
                  onClick={() => setSelectedTime(time.id)}
                  className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                    selectedTime === time.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {time.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Exercise Button */}
        <div className="px-6 pb-8">
          <button
            onClick={handleStartExercise}
            disabled={!isStartEnabled}
            className={`w-full py-4 rounded-full font-semibold text-lg transition-all ${
              isStartEnabled
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Start Exercise
          </button>
        </div>
      </div>
    </div>
  );
}

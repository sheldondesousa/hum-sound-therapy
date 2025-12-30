import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FocusExercise() {
  const navigate = useNavigate();

  const timeFrames = [
    { id: '15', name: '15 minutes' },
    { id: '30', name: '30 minutes' },
    { id: '45', name: '45 minutes' },
    { id: '60', name: '60 minutes' },
  ];

  // Default to first option
  const [selectedTime, setSelectedTime] = useState(timeFrames[0].id);

  const isStartEnabled = selectedTime;

  const handleStartExercise = () => {
    if (isStartEnabled) {
      console.log('Starting Focus exercise:', { selectedTime });
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
                <circle cx="40" cy="40" r="12" fill="black"/>
                <path d="M40 8 C40 8, 25 25, 25 40 C25 55, 40 72, 40 72 C40 72, 55 55, 55 40 C55 25, 40 8, 40 8" fill="none" stroke="black" strokeWidth="3"/>
              </svg>
            </div>
            <h1 className="text-5xl font-semibold text-black" style={{ fontFamily: 'Roboto Serif, serif' }}>
              Focus
            </h1>
          </div>

          <p className="text-xl text-gray-700 mb-8">
            Enhance your concentration with guided focus sessions.
          </p>

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

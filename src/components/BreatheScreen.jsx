import React from 'react';
import { useNavigate } from 'react-router-dom';

const BreatheScreen = () => {
  const navigate = useNavigate();

  const breathingExercises = [
    {
      id: 'box',
      title: 'Box Breathing',
      subtitle: '4-4-4-4 pattern',
      description: 'Equal counts for inhale, hold, exhale, hold'
    },
    {
      id: '4-7-8',
      title: '4-7-8 Breathing',
      subtitle: 'Relaxing breath pattern',
      description: 'Inhale for 4, hold for 7, exhale for 8'
    },
    {
      id: 'coherent',
      title: 'Coherent Breathing',
      subtitle: '5-5 pattern',
      description: 'Inhale for 5, exhale for 5'
    },
    {
      id: 'physiological-sigh',
      title: 'Physiological Sigh',
      subtitle: 'Stress relief pattern',
      description: 'Double inhale, extended exhale'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-[430px] h-[932px] bg-white flex flex-col p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="mb-6 flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-lg">Back</span>
        </button>

        {/* Title */}
        <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
          Breathe
        </h1>

        <p className="text-xl text-gray-600 mb-8" style={{ fontFamily: "'Roboto Serif', serif" }}>
          Choose your breathing exercise
        </p>

        {/* Breathing Exercise List */}
        <div className="flex-1">
          {breathingExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => navigate(`/breathe/${exercise.id}/info`)}
              className="w-full py-5 flex items-center gap-3 border-b border-gray-300 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex-1 text-left">
                <h2 className="text-4xl font-bold mb-1" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                  {exercise.title}
                </h2>
                <p className="text-xl text-gray-600" style={{ fontFamily: "'Roboto Serif', serif" }}>
                  {exercise.subtitle}
                </p>
              </div>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreatheScreen;

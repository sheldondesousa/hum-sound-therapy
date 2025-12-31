import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CycleSelector from './CycleSelector';

const BreathingInfoScreen = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const [selectedCycles, setSelectedCycles] = useState(5);

  // Exercise data - can be expanded for different types
  const exerciseData = {
    'box': {
      title: 'Box Breathing',
      description: 'Box breathing (4-4-4-4) is a simple, effective relaxation technique where you inhale for 4 counts, hold for 4, exhale for 4, and hold again for 4, creating a pattern to calm the nervous system, reduce stress, and improve focus for important moments.',
      sectionTitle: 'Why it works',
      sectionContent: `Calms your nervous system: Activates the parasympathetic (rest-and-digest) system, counteracting the fight-or-flight response.
Reduces stress & anxiety: Helps lower heart rate and blood pressure, bringing a sense of calm.
Improves focus: Enhances concentration, making it great for high-pressure situations like presentations or exams.`
    },
    '4-7-8': {
      title: '4-7-8 Breathing',
      description: 'The 4-7-8 breathing technique, also known as the "Relaxing Breath," is a rhythmic breathing pattern developed by Dr. Andrew Weil. Rooted in the ancient yogic practice of pranayama, it acts as a "natural tranquilizer" for the nervous system by activating the parasympathetic response.',
      sectionTitle: 'Tips',
      sectionContent: [
        'Breathe in normally through your nose.',
        'Position your tongue: Place the tip of your tongue against the ridge of tissue just behind your upper front teeth and keep it there throughout the entire exercise.',
        'Create sound: Exhale completely through your mouth, making an audible "whoosh" sound as you release the air.'
      ]
    }
  };

  const exercise = exerciseData[type] || exerciseData['box'];

  const handleStartExercise = () => {
    navigate(`/breathe/${type}/exercise`, { state: { cycles: selectedCycles } });
  };

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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Title */}
          <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
            {exercise.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-700 mb-8 leading-relaxed" style={{ fontFamily: "'Roboto Serif', serif" }}>
            {exercise.description}
          </p>

          {/* Section (Why it works / Tips) */}
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
            {exercise.sectionTitle}
          </h2>

          {Array.isArray(exercise.sectionContent) ? (
            <ul className="text-lg text-gray-700 mb-8 leading-relaxed space-y-3" style={{ fontFamily: "'Roboto Serif', serif" }}>
              {exercise.sectionContent.map((tip, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-gray-700 mb-8 leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Roboto Serif', serif" }}>
              {exercise.sectionContent}
            </p>
          )}

          {/* Cycle Selector */}
          <div className="mb-8">
            <CycleSelector selectedCycles={selectedCycles} onSelectCycles={setSelectedCycles} />
          </div>
        </div>

        {/* Skip Button - Fixed at Bottom */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleStartExercise}
            className="w-full py-4 bg-black text-white text-xl font-bold rounded-xl hover:bg-gray-800 transition-colors"
            style={{ fontFamily: "'SF Pro Display', sans-serif" }}
          >
            Start Exercise
          </button>
          <button
            onClick={handleStartExercise}
            className="w-full py-3 text-gray-600 text-lg hover:text-black transition-colors mt-2"
            style={{ fontFamily: "'SF Pro Display', sans-serif" }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreathingInfoScreen;

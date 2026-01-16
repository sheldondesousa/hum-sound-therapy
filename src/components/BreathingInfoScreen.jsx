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
    },
    'coherent': {
      title: 'Coherent Breathing',
      description: 'Coherent breathing is a simple yet powerful technique that involves breathing at a rate of 5 breaths per minute (inhale for 5 seconds, exhale for 5 seconds). This rhythm has been shown to optimize heart rate variability and promote a state of physiological coherence.',
      sectionTitle: 'Why it works',
      sectionContent: `Balances the nervous system: Creates optimal heart rate variability, indicating a balanced autonomic nervous system.
Reduces stress: Helps synchronize heart, breath, and brain rhythms for deep relaxation.
Improves emotional regulation: Regular practice enhances your ability to manage stress and emotions.`
    },
    'physiological-sigh': {
      title: 'Physiological Sigh',
      description: 'The physiological sigh is a breathing pattern that involves two quick inhales through the nose followed by a long exhale through the mouth. This technique rapidly reduces stress and anxiety by reinflating collapsed alveoli in the lungs and activating the parasympathetic nervous system.',
      sectionTitle: 'Why it works',
      sectionContent: `Rapid stress relief: Quickly lowers stress hormones and calms the nervous system.
Improves oxygen exchange: Reinflates collapsed air sacs in the lungs for better breathing.
Evidence-based: Scientifically proven to be one of the fastest ways to reduce physiological stress.`
    },
    'alternate-nostril': {
      title: 'Alternate Nostril Breathing',
      description: 'Alternate nostril breathing (Nadi Shodhana) is an ancient yogic breathing technique that involves breathing through one nostril at a time while closing the other. This practice balances the left and right hemispheres of the brain and promotes mental clarity and calmness.',
      sectionTitle: 'Tips',
      sectionContent: [
        'Sit comfortably with your spine straight and shoulders relaxed.',
        'Use your right thumb to close your right nostril and inhale through the left.',
        'Close your left nostril with your ring finger, release your thumb, and exhale through the right.',
        'Continue alternating nostrils with each breath cycle.'
      ]
    },
    'humming-bee': {
      title: 'Humming Bee Breath',
      description: 'Humming Bee Breath (Bhramari Pranayama) is a calming breathing technique that involves making a humming sound during exhalation. The vibration created by humming has a soothing effect on the nervous system and can help reduce anxiety, anger, and frustration.',
      sectionTitle: 'Why it works',
      sectionContent: `Calms the mind: The humming vibration soothes the nervous system and quiets mental chatter.
Reduces anxiety: Scientifically shown to lower stress hormones and promote relaxation.
Enhances concentration: The auditory feedback helps anchor attention and improve focus.`
    }
  };

  const exercise = exerciseData[type] || exerciseData['box'];

  const handleStartExercise = () => {
    navigate(`/breathe/${type}/exercise`, { state: { cycles: selectedCycles } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #F4F9FD, #C3DBEA)' }}>
      <div className="w-full max-w-[430px] h-[932px] bg-white flex flex-col p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/breathe')}
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

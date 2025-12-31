import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('breathe');
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Exercise content data
  const exerciseContent = {
    'Box Breathing (4-4-4-4)': {
      description: 'Box breathing (4-4-4-4) is a simple, effective relaxation technique where you inhale for 4 counts, hold for 4, exhale for 4, and hold again for 4, creating a pattern to calm the nervous system, reduce stress, and improve focus for important moments.',
      sectionTitle: 'Tips',
      sectionContent: [
        { label: 'Duration:', text: 'If 4 seconds feels too long, start with a 2 or 3-second count and gradually increase it as you become more comfortable.' },
        { label: 'Focus:', text: 'Use "diaphragmatic breathing." Your stomach should rise as you inhale, rather than just your chest.' },
        { label: '', text: 'Start on empty.' },
        { label: '', text: 'Inhale slowly through your nose.' },
        { label: '', text: 'Exhale gently through your mouth or nose.' }
      ],
      preparationTitle: 'Preparation',
      preparationContent: [
        { label: 'Find a Quiet Space:', text: 'Choose a distraction-free environment to help you focus entirely on your breath.' },
        { label: 'Sit Upright:', text: 'Choose a comfortable chair where you can sit with your back supported and feet flat on the floor. This allows for better lung expansion.' },
        { label: 'Relax Your Muscles:', text: 'Before starting, consciously drop your shoulders and release tension in your jaw.' },
        { label: 'Begin on Empty:', text: 'To start correctly, first exhale all the air out of your lungs so you begin with a full, fresh inhale.' }
      ],
      whenToUseTitle: 'Try this when',
      whenToUseContent: [
        { label: 'Before Stressful Events:', text: 'Use it to steady nerves before major tasks like public speaking, exams, or interviews.' },
        { label: 'During a Mid-Day Reset:', text: 'Practice for 5 minutes during a work break or "afternoon slump" to regain focus and concentration.' },
        { label: 'Before Bedtime:', text: 'Perform a few cycles to quiet a racing mind and lower your heart rate for better sleep.' }
      ],
      safetyTitle: 'Safety First',
      safetyContent: [
        { label: 'Don\'t Overdo It:', text: 'Stick to fewer cycles or shorter time ranges initially. Build momentum as you gain experience.' },
        { label: 'Consult Professionals:', text: 'If you have respiratory conditions or cardiovascular issues or a history of hyperventilation, consult a doctor before trying.' },
        { label: 'Avoid Focus Tasks:', text: 'Do not practice this while driving or performing any task that requires your full, alert attention.' },
        { label: 'Listen to Your Body:', text: 'Stop immediately if you feel short of breath or distressed; your comfort dictates the correct pace.' }
      ]
    },
    '4-7-8 Breathing': {
      description: 'The 4-7-8 breathing technique, also known as the "Relaxing Breath," is a rhythmic breathing pattern. Rooted in the ancient yogic practice of pranayama, it acts as a "natural tranquilizer" for the nervous system by activating the parasympathetic response.',
      sectionTitle: 'Tips',
      sectionContent: [
        { label: 'Tongue Placement:', text: 'Keep the tip of your tongue against the ridge of tissue behind your upper front teeth throughout the entire exercise.' },
        { label: 'Consistency:', text: 'Practice at least twice a day to train your nervous system to respond more quickly over time.' },
        { label: 'Exhale Sound:', text: 'Create an audible "whoosh" sound by exhaling through your mouth around your tongue or through pursed lips.' },
        { label: 'Limit Cycles:', text: 'Start with only four breath cycles at a time during your first month of practice before gradually increasing to eight.' }
      ],
      preparationTitle: 'Preparation',
      preparationContent: [
        { label: 'Be Comfortable:', text: 'Sit with your back straight or lie down if you are using the technique to fall asleep.' },
        { label: 'Eliminate Distractions:', text: 'Choose a quiet, private space and consider closing your eyes to focus better.' },
        { label: 'Empty Your Lungs:', text: 'Begin by exhaling completely through your mouth to clear your lungs before starting the first inhale.' },
        { label: 'Relax Your Body:', text: 'Intentionally relax your shoulders, jaw, and brow to prevent tensing during the breath hold.' }
      ],
      whenToUseTitle: 'Try this when',
      whenToUseContent: [
        { label: 'Before Bed:', text: 'Use it as part of a nighttime routine to quiet a racing mind and fall asleep faster.' },
        { label: 'During Acute Stress:', text: 'Practice before reacting to upsetting situations or when feeling internal tension.' },
        { label: 'Anxiety Management:', text: 'Use it to ground yourself during anxiety episodes or panic attacks.' },
        { label: 'To Curb Cravings:', text: 'It can help manage impulsive emotional responses, such as food cravings or anger.' },
        { label: 'Daily Resets:', text: 'Incorporate it into your morning or mid-day routine to maintain a lower baseline stress level.' }
      ],
      safetyTitle: 'Safety First',
      safetyContent: [
        { label: 'Don\'t Overdo It:', text: 'Stick to fewer cycles or shorter time ranges initially. Build momentum as you gain experience.' },
        { label: 'Consult Professionals:', text: 'If you have respiratory conditions or cardiovascular issues or a history of hyperventilation, consult a doctor before trying.' },
        { label: 'Avoid Focus Tasks:', text: 'Do not practice this while driving or performing any task that requires your full, alert attention.' },
        { label: 'Listen to Your Body:', text: 'Stop immediately if you feel short of breath or distressed; your comfort dictates the correct pace.' }
      ]
    },
    'Coherent breathing (5-5)': {
      description: 'Coherent breathing (or resonance breathing) is a slow, rhythmic breathing technique, typically inhaling for 6 seconds and exhaling for 6 seconds (5-6 breaths per minute), designed to sync your heart rate with your breath for optimal nervous system balance, reducing stress and anxiety while promoting calm and focus.',
      sectionTitle: 'Tips',
      sectionContent: [
        { label: 'Focus on the Transition:', text: 'Avoid holding your breath at the top or bottom; make the switch between inhaling and exhaling smooth and continuous.' },
        { label: 'Nasal Breathing:', text: 'Always breathe through your nose to better regulate airflow and filter the air entering your lungs.' },
        { label: 'Stay Relaxed:', text: 'Keep your jaw, shoulders, and face soft; tension in these areas can inhibit deep diaphragmatic movement.' },
        { label: 'Consistency Over Duration:', text: 'Practicing for five minutes every day is more effective for your nervous system than practicing for an hour once a week.' }
      ],
      preparationTitle: 'Preparation',
      preparationContent: [
        { label: 'Find a Quiet Space:', text: 'Choose a location where you won\'t be interrupted for a few minutes.' },
        { label: 'Optimize Posture:', text: 'Sit upright in a chair with feet flat on the floor or lie flat on your back to allow the diaphragm to move freely.' },
        { label: 'Loosen Clothing:', text: 'Ensure your waistband or belt is not restrictive, as your abdomen needs to expand fully.' },
        { label: 'Hand Placement:', text: 'Place one hand on your belly and one on your chest to ensure only the belly hand moves significantly during the breath.' }
      ],
      whenToUseTitle: 'Try this when',
      whenToUseContent: [
        { label: 'Commuting:', text: 'It is an effective "eyes-open" meditation for use on public transit or while sitting in traffic to stay calm.' },
        { label: 'Post-Exercise:', text: 'Use it as part of a workout cool-down to shift the body from an active to a recovery state.' },
        { label: 'Morning Routine:', text: 'Start your day with 5 minutes of practice to set a baseline of emotional stability.' },
        { label: 'Before Sleep:', text: 'Practice while lying in bed to lower your heart rate and prepare the body for deep rest.' }
      ],
      safetyTitle: 'Safety First',
      safetyContent: [
        { label: 'Don\'t Overdo It:', text: 'Stick to fewer cycles or shorter time ranges initially. Build momentum as you gain experience.' },
        { label: 'Consult Professionals:', text: 'If you have respiratory conditions or cardiovascular issues or a history of hyperventilation, consult a doctor before trying.' },
        { label: 'Avoid Focus Tasks:', text: 'Do not practice this while driving or performing any task that requires your full, alert attention.' },
        { label: 'Listen to Your Body:', text: 'Stop immediately if you feel short of breath or distressed; your comfort dictates the correct pace.' }
      ]
    },
    'Physiological Sigh': {
      description: 'The physiological sigh is a science-backed breathing technique featuring a double inhale (1 long, 1 short) followed by a long, slow exhale. It is designed to rapidly offload carbon dioxide and trigger the parasympathetic nervous system for stress relief.\n\nSuggested: Total INHALE of 4 seconds (approx)',
      sectionTitle: 'Tips',
      sectionContent: [
        { label: 'The "Second Sip":', text: 'Make the second inhale short and sharp to fully pop open the tiny air sacs (alveoli) in the lungs.' },
        { label: 'Slow Exhale:', text: 'Exhale through the mouth. Aim to make the exhale roughly twice as long as the combined inhales to maximize the calming effect.' },
        { label: 'Nose for Inhaling:', text: 'Use your nose for both inhales whenever possible to better regulate air intake.' },
        { label: 'Minimal Repetition:', text: 'You typically only need 1 to 3 cycles to feel a noticeable reduction in autonomic arousal.' },
        { label: 'Consistency:', text: 'While effective for immediate relief, practicing for 5 minutes daily can improve long-term mood and respiratory health.' }
      ],
      preparationTitle: 'Preparation',
      preparationContent: [
        { label: 'Find a Quiet Space:', text: 'Choose a distraction-free environment to help you focus entirely on your breath.' },
        { label: 'Sit Upright:', text: 'Choose a comfortable chair where you can sit with your back supported and feet flat on the floor. This allows for better lung expansion.' },
        { label: 'Relax Your Muscles:', text: 'Before starting, consciously drop your shoulders and release tension in your jaw.' },
        { label: 'Begin on Empty:', text: 'To start correctly, first exhale all the air out of your lungs so you begin with a full, fresh inhale.' }
      ],
      whenToUseTitle: 'Try this when',
      whenToUseContent: [
        { label: 'Feeling Stress:', text: 'Use 1-3 cycles when you feel acute stress or tension building to rapidly calm your nervous system.' },
        { label: 'Before Performance:', text: 'Practice right before important presentations, meetings, or high-pressure situations to reduce performance anxiety.' },
        { label: 'Before Sleep:', text: 'Perform a few cycles if your mind is racing at bedtime to help transition into a restful state.' },
        { label: 'Emotional Reset:', text: 'Use it when feeling overwhelmed or emotionally activated to quickly regain composure and clarity.' },
        { label: 'Focus Recovery:', text: 'Practice during work breaks when feeling mentally scattered to restore attention and concentration.' }
      ],
      safetyTitle: 'Safety First',
      safetyContent: [
        { label: 'Limit Cycles:', text: 'Avoid excessive repetition (hyperventilation) by sticking to the recommended 1–3 cycles for immediate relief.' },
        { label: 'Consult Professionals:', text: 'If you have respiratory conditions or cardiovascular issues or a history of hyperventilation, consult a doctor before trying.' },
        { label: 'Avoid Focus Tasks:', text: 'Do not practice this while driving or performing any task that requires your full, alert attention.' },
        { label: 'Listen to Your Body:', text: 'Stop immediately if you feel short of breath or distressed; your comfort dictates the correct pace.' }
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
  const [showPreparationSheet, setShowPreparationSheet] = useState(false); // Track preparation bottom sheet visibility
  const [showWhenToUseSheet, setShowWhenToUseSheet] = useState(false); // Track when to use bottom sheet visibility
  const [showSafetySheet, setShowSafetySheet] = useState(false); // Track safety bottom sheet visibility
  const [exerciseCompleted, setExerciseCompleted] = useState(false); // Track if exercise completed

  // Auto-start countdown when exercise view loads
  useEffect(() => {
    if (selectedOption === 'breathe' && selectedExercise && !showingInfo && countdown === null && !isExercising) {
      setCountdown(3);
    }
  }, [showingInfo, selectedExercise, selectedOption, countdown, isExercising]);

  // Set default time for Coherent Breathing (6 cycles = 1 min)
  useEffect(() => {
    if (selectedExercise?.name === 'Coherent breathing (5-5)' && selectedCycles === 4) {
      setSelectedCycles(6);
    }
  }, [selectedExercise, selectedCycles]);

  // Set default cycles for Physiological Sigh (3 cycles recommended)
  useEffect(() => {
    if (selectedExercise?.name === 'Physiological Sigh' && selectedCycles === 4) {
      setSelectedCycles(3);
    }
  }, [selectedExercise, selectedCycles]);

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
    if (!isExercising || isPaused || exerciseCompleted) return;

    // Exercise-specific timing configurations
    const is478 = selectedExercise?.name === '4-7-8 Breathing';
    const isCoherent = selectedExercise?.name === 'Coherent breathing (5-5)';
    const isPhysiological = selectedExercise?.name === 'Physiological Sigh';

    // Dynamic interval based on breathing phase and exercise type
    let intervalDuration;
    if (is478) {
      // 4-7-8: INHALE=4s (5 counts, 800ms), HOLD=7s (7 counts, 1000ms), EXHALE=8s (8 counts, 1000ms)
      if (breathingPhase === 'inhale') intervalDuration = 800; // 5 counts * 800ms = 4s
      else if (breathingPhase === 'hold1') intervalDuration = 1000; // 7 counts * 1000ms = 7s
      else if (breathingPhase === 'exhale') intervalDuration = 1000; // 8 counts * 1000ms = 8s
      else intervalDuration = 1000;
    } else if (isCoherent) {
      // Coherent: INHALE=5s (50 counts, 100ms), EXHALE=5s (50 counts, 100ms) for smooth animation
      intervalDuration = 100; // 100ms for smooth transitions
    } else if (isPhysiological) {
      // Physiological Sigh: INHALE=5s (0-4, 1000ms), HOLD=200ms, EXHALE=8s (8-0, 1000ms)
      if (breathingPhase === 'hold1') intervalDuration = 200; // 200ms gap
      else intervalDuration = 1000; // 1000ms (1 second) intervals
    } else {
      // Box breathing: all phases use same interval pattern
      // INHALE and EXHALE: 5 counts (0-4) over 4 seconds = 800ms per count
      // HOLD1 and HOLD2: 4 counts (1-4) over 4 seconds = 1000ms per count
      intervalDuration = (breathingPhase === 'inhale' || breathingPhase === 'exhale') ? 800 : 1000;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        // Handle phase transitions and timer logic based on exercise type
        if (isCoherent) {
          // Coherent Breathing pattern (5-5)
          if (breathingPhase === 'inhale') {
            // INHALE: 0-50 (51 counts over 5s)
            if (prevTimer < 50) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('exhale');
              return 50; // Start EXHALE at 50
            }
          } else if (breathingPhase === 'exhale') {
            // EXHALE: 50-0 (51 counts over 5s, descending)
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
        } else if (is478) {
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
            // INHALE: 0-4 (5 counts over 5s, 1s per count)
            if (prevTimer < 4) {
              return prevTimer + 1;
            } else {
              // Transition to 300ms hold
              setBreathingPhase('hold1');
              return 0;
            }
          } else if (breathingPhase === 'hold1') {
            // HOLD: 300ms gap
            setBreathingPhase('exhale');
            return 8; // Start EXHALE at 8
          } else if (breathingPhase === 'exhale') {
            // EXHALE: 8-0 (8 seconds, 1s per count, showing timer value)
            // Slow decrease from 100% to 0%
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
        }
        return prevTimer;
      });
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [isExercising, isPaused, breathingPhase, currentCycle, selectedCycles, selectedExercise, exerciseCompleted]);

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

  // Get box count for Physiological Sigh
  const getVisibleBoxCountPhysiological = () => {
    if (breathingPhase === 'inhale') {
      // INHALE: timer 0-40 (40 counts over 4s, 100ms per count)
      // Smooth progression from 0 to 8 columns
      // At timer 30 (3s): 6 columns (all blue)
      // At timer 40 (4s): 8 columns (6 blue + 2 green)
      const columnCount = Math.floor((timer / 40) * 8);
      return Math.min(columnCount, 8);
    } else if (breathingPhase === 'exhale') {
      // EXHALE: timer 80→0 (80 counts over 8s, 100ms per count)
      // Smooth progression from 8 to 0 columns
      const columnCount = Math.floor((timer / 80) * 8);
      return Math.max(columnCount, 0);
    }
    return 0;
  };

  // Get gradient fill width for Physiological Sigh
  const getPhysiologicalFillWidth = () => {
    if (!isExercising) return 0;

    if (breathingPhase === 'inhale') {
      // INHALE: timer 0-3 (4 seconds, 1s intervals)
      // Timer 0-2: Blue fills to 75%
      // Timer 3: Green fills from 75% to 100%
      const progress = timer / 3; // 0 to 1
      return progress * 100; // 0% to 100%
    } else if (breathingPhase === 'exhale') {
      // EXHALE: timer 8-0 (8 seconds, 1s intervals)
      // Adjust calculation to sync animation with timer display
      // When displaying timer N, container should be at N/8 percentage
      if (timer === 0) return 0; // Ensure 0% at timer 0
      const progress = timer / 8; // 1 to 0
      return progress * 100; // 100% to 0%
    }

    return 0;
  };

  // Get blue gradient height for Physiological Sigh INHALE (0-2 seconds)
  const getPhysiologicalBlueHeight = () => {
    if (!isExercising || breathingPhase !== 'inhale') return 0;

    if (timer < 3) {
      // Fill to 75% of container over first 3 seconds (timer 0,1,2)
      // At timer=0: 25%, timer=1: 50%, timer=2: 75%
      return ((timer + 1) / 3) * 75;
    } else {
      // Stay at 75% while green fills (timer 3)
      return 75;
    }
  };

  // Get green gradient height for Physiological Sigh INHALE (3 seconds)
  const getPhysiologicalGreenHeight = () => {
    if (!isExercising || breathingPhase !== 'inhale') return 0;

    if (timer < 3) {
      return 0; // No green yet (timer 0,1,2)
    } else {
      // Fill to 25% of container at timer 3 (final second)
      return 25;
    }
  };

  // Get green gradient height for Physiological Sigh EXHALE (decrements at 12.5% per second)
  const getPhysiologicalExhaleGreenHeight = () => {
    if (!isExercising || breathingPhase !== 'exhale') return 0;

    if (timer > 6) {
      // Timer 8,7: Green decrements at 12.5% per second
      // Timer 8: 25%, Timer 7: 12.5%, Timer 6: 0%
      return (timer - 6) * 12.5;
    } else {
      return 0; // Green gone by timer 6
    }
  };

  // Get blue gradient height for Physiological Sigh EXHALE (decrements at 12.5% per second)
  const getPhysiologicalExhaleBlueHeight = () => {
    if (!isExercising || breathingPhase !== 'exhale') return 0;

    if (timer > 6) {
      // Timer 8,7: Blue stays at 75% while green decrements
      return 75;
    } else {
      // Timer 6-0: Blue decrements at 12.5% per second
      // Timer 6: 75%, Timer 5: 62.5%, ..., Timer 0: 0%
      return timer * 12.5;
    }
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

  // Get smooth circle data for Coherent Breathing (5-5)
  const getCoherentCircleSize = () => {
    if (!isExercising) return 100;

    // Timer ranges from 0-50 for both inhale and exhale
    const progress = timer / 50; // 0 to 1
    const minSize = 100;
    const maxSize = 340;

    // Calculate current size with smooth easing
    const easeProgress = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const currentSize = minSize + (maxSize - minSize) * easeProgress;

    return currentSize;
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
          {/* Centered Container - Music Player */}
          <div className="flex items-center justify-center max-w-7xl">
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
                    <div className="flex-1 overflow-y-auto px-2">
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
                      {(selectedExercise?.name === 'Box Breathing (4-4-4-4)' || selectedExercise?.name === '4-7-8 Breathing' || selectedExercise?.name === 'Coherent breathing (5-5)' || selectedExercise?.name === 'Physiological Sigh') && (
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
                      {(selectedExercise?.name === 'Box Breathing (4-4-4-4)' || selectedExercise?.name === '4-7-8 Breathing' || selectedExercise?.name === 'Coherent breathing (5-5)' || selectedExercise?.name === 'Physiological Sigh') && (
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
                      {(selectedExercise?.name === 'Box Breathing (4-4-4-4)' || selectedExercise?.name === '4-7-8 Breathing' || selectedExercise?.name === 'Coherent breathing (5-5)' || selectedExercise?.name === 'Physiological Sigh') && (
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
                          <span className="text-sm text-gray-600 font-medium">
                            {selectedExercise?.name === 'Coherent breathing (5-5)' ? 'Select Time' : 'Select Cycles'}
                          </span>
                          <div className="flex gap-3">
                            {selectedExercise?.name === 'Coherent breathing (5-5)' ? (
                              // Time options for Coherent Breathing (1 min = 6 cycles, 2 min = 12 cycles, 3 min = 18 cycles)
                              [
                                { time: '1 min', cycles: 6 },
                                { time: '2 min', cycles: 12 },
                                { time: '3 min', cycles: 18 }
                              ].map((option) => (
                                <button
                                  key={option.cycles}
                                  onClick={() => setSelectedCycles(option.cycles)}
                                  className={`px-4 h-12 rounded-full text-base font-bold transition-all whitespace-nowrap ${
                                    selectedCycles === option.cycles
                                      ? 'bg-black text-white shadow-lg'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  }`}
                                >
                                  {option.time}
                                </button>
                              ))
                            ) : (
                              // Cycle options for other exercises
                              [4, 8, 12].map((cycles) => (
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
                            {selectedExercise?.name === 'Coherent breathing (5-5)'
                              ? Math.floor(timer / 10) // Convert 0-50 to 0-5 for display
                              : timer
                            }
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Breathing Circles Area - 40% */}
                    <div className="flex-[0.4] bg-white rounded-lg flex flex-col items-center justify-center p-4">
                      {/* Show completion screen when exercise is completed */}
                      {exerciseCompleted ? (
                        <div className="flex flex-col items-center justify-center text-center">
                          <h2 className="text-3xl font-bold text-black mb-4">COMPLETE</h2>
                          <p className="text-2xl text-gray-600">You Got This!</p>
                        </div>
                      ) : (
                        <>
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
                      ) : selectedExercise?.name === 'Coherent breathing (5-5)' ? (
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
                                className={timer === 50 || (timer === 0 && currentCycle > 0) ? 'blink-purple' : ''}
                              />
                            </svg>

                            {/* Single Expanding/Compressing Circle with Radial Gradient */}
                            <div
                              className="rounded-full absolute"
                              style={{
                                width: `${getCoherentCircleSize()}px`,
                                height: `${getCoherentCircleSize()}px`,
                                background: 'radial-gradient(circle, rgba(6, 122, 195, 1) 0%, rgba(6, 122, 195, 0.6) 50%, rgba(6, 122, 195, 0.2) 100%)',
                                boxShadow: '0 0 30px rgba(6, 122, 195, 0.5)',
                                transition: 'all 100ms linear'
                              }}
                            />

                            {/* Phase Text - At Center of Circle */}
                            <div className="absolute text-center">
                              <div
                                className={`text-lg font-semibold text-white uppercase tracking-wider`}
                              >
                                {breathingPhase === 'inhale' && 'INHALE'}
                                {breathingPhase === 'exhale' && 'EXHALE'}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : selectedExercise?.name === 'Physiological Sigh' ? (
                        /* Physiological Sigh Dual Container Animation */
                        <>
                          {/* Breathing Box Illustration - Physiological Sigh */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Two containers side by side */}
                            <div className="flex gap-4">
                              {/* First Container - INHALE (fills bottom to top) */}
                              <div className="flex flex-col">
                                <div
                                  className="border-4 border-gray-300 rounded-3xl flex flex-col justify-end overflow-hidden"
                                  style={{ width: '175px', height: '360px', padding: '2px' }}
                                >
                                  {/* Green gradient fill bar (3-4 seconds, top layer) */}
                                  <div
                                    className="w-full"
                                    style={{
                                      height: breathingPhase === 'inhale' ? `${getPhysiologicalGreenHeight()}%` : '0%',
                                      background: `linear-gradient(to top,
                                        #6EE7B7 0%,
                                        #A7F3D0 100%
                                      )`,
                                      transition: breathingPhase === 'inhale' ? 'height 1000ms linear' : 'opacity 400ms ease-out',
                                      opacity: breathingPhase === 'inhale' ? 1 : 0,
                                      borderTopLeftRadius: '20px',
                                      borderTopRightRadius: '20px',
                                      borderBottomLeftRadius: '0',
                                      borderBottomRightRadius: '0'
                                    }}
                                  />
                                  {/* Blue gradient fill bar (0-3 seconds, bottom layer) */}
                                  <div
                                    className="w-full"
                                    style={{
                                      height: breathingPhase === 'inhale' ? `${getPhysiologicalBlueHeight()}%` : '0%',
                                      background: `linear-gradient(to top,
                                        #045a91 0%,
                                        #0568A6 16.67%,
                                        #067AC3 33.33%,
                                        #0892D0 50%,
                                        #3AA8DB 66.67%,
                                        #6EC1E4 83.33%,
                                        #6EC1E4 100%
                                      )`,
                                      transition: breathingPhase === 'inhale' ? 'height 1000ms linear' : 'opacity 400ms ease-out',
                                      opacity: breathingPhase === 'inhale' ? 1 : 0,
                                      borderTopLeftRadius: '0',
                                      borderTopRightRadius: '0',
                                      borderBottomLeftRadius: '20px',
                                      borderBottomRightRadius: '20px'
                                    }}
                                  />
                                </div>
                                {/* INHALE Label */}
                                <div className="text-center mt-4">
                                  <div className="text-lg font-semibold text-gray-800 uppercase tracking-wider">
                                    INHALE
                                  </div>
                                </div>
                              </div>

                              {/* Second Container - EXHALE (empties top to bottom) */}
                              <div className="flex flex-col">
                                <div
                                  className="border-4 border-gray-300 rounded-3xl flex flex-col justify-end overflow-hidden"
                                  style={{ width: '175px', height: '360px', padding: '2px' }}
                                >
                                  {/* Green gradient fill bar (decrements first, top layer) */}
                                  <div
                                    className="w-full"
                                    style={{
                                      height: `${getPhysiologicalExhaleGreenHeight()}%`,
                                      background: `linear-gradient(to top,
                                        #6EE7B7 0%,
                                        #A7F3D0 100%
                                      )`,
                                      transition: `height ${timer === 8 || timer === 0 ? '0ms' : '1000ms'} linear`,
                                      borderTopLeftRadius: '20px',
                                      borderTopRightRadius: '20px',
                                      borderBottomLeftRadius: '0',
                                      borderBottomRightRadius: '0'
                                    }}
                                  />
                                  {/* Blue gradient fill bar (decrements second, bottom layer) */}
                                  <div
                                    className="w-full"
                                    style={{
                                      height: `${getPhysiologicalExhaleBlueHeight()}%`,
                                      background: `linear-gradient(to top,
                                        #045a91 0%,
                                        #0568A6 16.67%,
                                        #067AC3 33.33%,
                                        #0892D0 50%,
                                        #3AA8DB 66.67%,
                                        #6EC1E4 83.33%,
                                        #6EC1E4 100%
                                      )`,
                                      transition: `height ${timer === 8 || timer === 0 ? '0ms' : '1000ms'} linear`,
                                      borderTopLeftRadius: '0',
                                      borderTopRightRadius: '0',
                                      borderBottomLeftRadius: '20px',
                                      borderBottomRightRadius: '20px'
                                    }}
                                  />
                                </div>
                                {/* EXHALE Label */}
                                <div className="text-center mt-4">
                                  <div className="text-lg font-semibold text-gray-800 uppercase tracking-wider">
                                    EXHALE
                                  </div>
                                </div>
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
                    <div className="flex-[0.15] flex items-center justify-center">
                      {/* Countdown Progress Bar - Show during countdown (only on first start, not after completion) */}
                      {countdown !== null && countdown > 0 && !exerciseCompleted && (
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
                          if (exerciseCompleted) {
                            // Restart exercise from beginning with countdown
                            setExerciseCompleted(false);
                            setCountdown(3);
                            setIsPaused(false);
                            setCurrentCycle(0);
                            setBreathingPhase('inhale');
                            setTimer(0);
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
                        className={`px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-medium text-sm border-2 ${
                          isPaused || exerciseCompleted
                            ? 'bg-black text-white border-black'
                            : 'bg-transparent text-black border-black'
                        }`}
                      >
                        {exerciseCompleted || isPaused ? 'Start' : 'Pause'}
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
                ) : selectedOption === 'focus' || selectedOption === 'calm' ? (
                  /* Development Message for Focus and Calm */
                  <div className="flex items-center justify-center py-12 text-center">
                    <p className="text-gray-400 text-sm">Feature is still in development</p>
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

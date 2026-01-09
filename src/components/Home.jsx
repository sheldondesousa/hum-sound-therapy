import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { trackPageView, trackSession, trackBreathingExercise, trackEvent } from '../services/analytics';
import { useUserMetrics } from '../hooks/useUserMetrics';

export default function Home() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const metrics = useUserMetrics(currentUser?.uid);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('breathe');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [currentView, setCurrentView] = useState('interactive'); // 'interactive', 'about', 'support', 'faqs', 'privacy', 'terms', 'breathing-info'
  const completionTrackedRef = useRef(false);

  // Random visual for album art placeholder
  const visuals = ['Visual1.jpeg', 'Visual2.jpeg', 'Visual3.jpeg', 'Visual4.jpeg'];
  const [currentVisual, setCurrentVisual] = useState(() => {
    const randomIndex = Math.floor(Math.random() * visuals.length);
    return visuals[randomIndex];
  });

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
    'Coherent Breathing': {
      description: 'Coherent breathing (or resonance breathing) is a slow, rhythmic breathing technique, typically inhaling for 5-6 seconds and exhaling for 5-6 seconds (5-6 breaths per minute), designed to sync your heart rate with your breath for optimal nervous system balance, reducing stress and anxiety while promoting calm and focus.',
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
    },
    'Alternate Nostril': {
      description: 'Alternate nostril breathing is an ancient yogic practice that involves breathing through one nostril at a time while blocking the other. This technique balances the left and right hemispheres of the brain, calms the nervous system, and enhances mental clarity and focus.',
      sectionTitle: 'Tips',
      sectionContent: [
        { label: 'Hand Position:', text: 'Use your right thumb to close your right nostril and your right ring finger to close your left nostril. Keep your index and middle fingers folded or resting on your forehead.' },
        { label: 'Gentle Pressure:', text: 'Apply gentle pressure when closing each nostril—just enough to block airflow without discomfort.' },
        { label: 'Equal Duration:', text: 'Try to keep your inhales and exhales roughly equal in length for optimal balance.' },
        { label: 'Smooth Transitions:', text: 'Switch nostrils smoothly without pausing between breaths to maintain a continuous flow.' },
        { label: 'Start Slow:', text: 'Begin with 3-5 rounds and gradually increase as you become more comfortable with the pattern.' }
      ],
      preparationTitle: 'Preparation',
      preparationContent: [
        { label: 'Find a Quiet Space:', text: 'Choose a peaceful environment where you can sit undisturbed for several minutes.' },
        { label: 'Sit Comfortably:', text: 'Sit in a cross-legged position on the floor or upright in a chair with your spine straight and shoulders relaxed.' },
        { label: 'Clear Your Nostrils:', text: 'Gently blow your nose before starting to ensure both nostrils are clear.' },
        { label: 'Relax Your Body:', text: 'Take a few natural breaths to settle in and release any tension in your shoulders, jaw, and face.' }
      ],
      whenToUseTitle: 'Try this when',
      whenToUseContent: [
        { label: 'Mental Clarity:', text: 'Practice when you need to enhance focus and concentration before important tasks or study sessions.' },
        { label: 'Stress Relief:', text: 'Use it to calm anxiety and reduce stress during overwhelming moments.' },
        { label: 'Before Meditation:', text: 'Perform a few rounds as a preparatory practice to center yourself before meditation.' },
        { label: 'Better Sleep:', text: 'Practice before bedtime to calm a busy mind and prepare for restful sleep.' },
        { label: 'Energy Balance:', text: 'Use it when feeling mentally foggy or unbalanced to restore equilibrium.' }
      ],
      safetyTitle: 'Safety First',
      safetyContent: [
        { label: 'Nasal Congestion:', text: 'If your nose is congested, postpone this practice until your nasal passages are clear.' },
        { label: 'Consult Professionals:', text: 'If you have respiratory conditions, sinus issues, or cardiovascular concerns, consult a healthcare provider before practicing.' },
        { label: 'Avoid Force:', text: 'Never force the breath—keep it gentle and natural. Stop if you feel dizzy or uncomfortable.' },
        { label: 'Listen to Your Body:', text: 'If you experience discomfort or lightheadedness, pause the practice and return to normal breathing.' }
      ]
    },
    'Humming Bee': {
      description: 'Humming Bee Breath is a calming breathing technique that involves making a gentle humming sound while exhaling. The vibration created by humming stimulates the vagus nerve, reduces stress, and promotes deep relaxation and mental stillness.',
      sectionTitle: 'Tips',
      sectionContent: [
        { label: 'Humming Sound:', text: 'Create a low, steady humming sound like a bee. Focus on feeling the vibration in your head and chest.' },
        { label: 'Cover Your Ears:', text: 'Gently place your index fingers over your ears (or use your thumbs) to amplify the internal vibration and deepen the meditative effect.' },
        { label: 'Slow Exhale:', text: 'Make the humming exhale long and smooth—aim for at least 5-10 seconds per exhale.' },
        { label: 'Natural Inhale:', text: 'Inhale quietly through your nose without rushing. The focus is on the humming exhale.' },
        { label: 'Volume Control:', text: 'Keep the hum soft and comfortable—not too loud. The goal is vibration, not volume.' }
      ],
      preparationTitle: 'Preparation',
      preparationContent: [
        { label: 'Find a Quiet Space:', text: 'Choose a calm environment where you won\'t be disturbed and can focus on the sound of your humming.' },
        { label: 'Sit Upright:', text: 'Sit comfortably with your spine straight, either in a chair or cross-legged on the floor.' },
        { label: 'Close Your Eyes:', text: 'Closing your eyes helps you turn inward and enhances the meditative quality of the practice.' },
        { label: 'Relax Your Face:', text: 'Keep your jaw, tongue, and facial muscles soft and relaxed to allow the humming to resonate freely.' }
      ],
      whenToUseTitle: 'Try this when',
      whenToUseContent: [
        { label: 'Anxiety Relief:', text: 'Use it when feeling anxious or overwhelmed to quickly calm the nervous system.' },
        { label: 'Anger Management:', text: 'Practice when experiencing frustration or anger to cool down and regain composure.' },
        { label: 'Before Sleep:', text: 'Perform a few rounds before bed to quiet a racing mind and promote restful sleep.' },
        { label: 'Meditation Preparation:', text: 'Use it as a gateway practice to deepen meditation and enhance mental stillness.' },
        { label: 'Headache Relief:', text: 'The gentle vibration may help relieve tension headaches and sinus pressure.' }
      ],
      safetyTitle: 'Safety First',
      safetyContent: [
        { label: 'Ear Sensitivity:', text: 'If you have ear infections or are sensitive to sound, skip covering your ears or avoid this practice entirely.' },
        { label: 'Consult Professionals:', text: 'If you have respiratory issues, sinus infections, or cardiovascular conditions, consult a doctor before practicing.' },
        { label: 'Avoid Strain:', text: 'Keep the humming gentle and comfortable. Never strain your voice or breath.' },
        { label: 'Listen to Your Body:', text: 'Stop immediately if you feel dizzy, short of breath, or experience any discomfort.' }
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
  const [showCustomizationSheet, setShowCustomizationSheet] = useState(false); // Track customization bottom sheet visibility
  const [coherentCycles, setCoherentCycles] = useState(6); // Total cycles (default 6)
  const [coherentBreathTime, setCoherentBreathTime] = useState(5); // Inhale-Exhale time in seconds (default 5s)
  const [showLegend, setShowLegend] = useState(false); // Track legend visibility with delay
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
      setTimer(selectedExercise?.name === 'Physiological Sigh' ? 0 : 0);
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
      // Box breathing: all phases use 1000ms interval for second-based counting
      // INHALE: 0→4 (4 seconds), HOLD1: 0→4 (4 seconds), EXHALE: 4→0 (4 seconds), HOLD2: 0→4 (4 seconds)
      intervalDuration = 1000; // 1 second intervals
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
          // Box Breathing pattern (4-4-4-4) - second-based counting
          if (breathingPhase === 'inhale') {
            // INHALE: 0→4 (4 seconds)
            if (prevTimer < 4) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('hold1');
              return 0; // Start HOLD1 at 0
            }
          } else if (breathingPhase === 'hold1') {
            // HOLD1: 0→4 (4 seconds)
            if (prevTimer < 4) {
              return prevTimer + 1;
            } else {
              setBreathingPhase('exhale');
              return 4; // Start EXHALE at 4
            }
          } else if (breathingPhase === 'exhale') {
            // EXHALE: 4→0 (4 seconds, descending)
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              setBreathingPhase('hold2');
              return 0; // Start HOLD2 at 0
            }
          } else if (breathingPhase === 'hold2') {
            // HOLD2: 0→4 (4 seconds)
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
  }, [isExercising, isPaused, breathingPhase, currentCycle, selectedCycles, selectedExercise, exerciseCompleted, coherentCycles, coherentBreathTime, alternateNostrilCycles, alternateNostrilBreathTime]);

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
      { id: 9, name: 'Coherent Breathing', duration: '6:00' },
      { id: 10, name: 'Physiological Sigh', duration: '3:45' },
      { id: 11, name: 'Alternate Nostril', duration: '5:30' },
      { id: 12, name: 'Humming Bee', duration: '4:00' }
    ]
  };

  const currentTracks = selectedOption ? tracksByOption[selectedOption] : [];

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
      // EXHALE: Remove 1 circle per second (timer 8→0 shows 8,7,6,5,4,3,2,1,0 circles)
      return timer;
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
    // Linear gradient from #86EDD2 to #15122C
    const colors = [
      'rgba(6, 122, 195, 1.0)',   // Lightest cyan (innermost) - timer 1 (0%)
      'rgba(6, 122, 195, 0.75)',   // 33% gradient between start and end - timer 2
      'rgba(6, 122, 195, 0.5)',   // 67% gradient between start and end - timer 3
      'rgba(6, 122, 195, 0.25)'    // Darkest navy (outermost) - timer 4 (100%)
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

  // Get smooth circle data for Coherent Breathing (customizable)
  const getCoherentCircleSize = () => {
    if (!isExercising || exerciseCompleted) return 0;

    // Timer ranges from 0 to maxTimer based on custom breath time
    const maxTimer = coherentBreathTime * 10; // Convert seconds to 100ms intervals
    const progress = timer / maxTimer; // 0 to 1
    const minSize = 0; // Start and end at 0 (no circle)
    const maxSize = 340;

    // Calculate current size with smooth easing
    const easeProgress = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const currentSize = minSize + (maxSize - minSize) * easeProgress;

    return currentSize;
  };

  // Get smooth circle size for 4-7-8 Breathing
  const get478CircleSize = () => {
    if (!isExercising) return 100;

    const minSize = 100;
    const maxSize = 340;

    if (breathingPhase === 'inhale') {
      // INHALE: 4 seconds (0-4), linear expansion
      const seconds = timer / 10; // Convert 100ms intervals to seconds
      const progress = seconds / 4; // 0 to 1
      return minSize + (maxSize - minSize) * progress;
    } else if (breathingPhase === 'hold1') {
      // HOLD: stay at max size for 7 seconds
      return maxSize;
    } else if (breathingPhase === 'exhale') {
      // EXHALE: 8 seconds (8-0), linear compression
      const seconds = timer / 10; // Convert 100ms intervals to seconds
      const progress = seconds / 8; // 1 to 0
      return minSize + (maxSize - minSize) * progress;
    }

    return minSize;
  };

  // Get smooth circle size for Humming Bee
  const getHummingBeeCircleSize = () => {
    if (!isExercising) return 100;

    const minSize = 100;
    const maxSize = 340;

    if (breathingPhase === 'inhale') {
      // INHALE: 4 seconds (0-4), linear expansion
      const seconds = timer / 10; // Convert 100ms intervals to seconds
      const progress = seconds / 4; // 0 to 1
      return minSize + (maxSize - minSize) * progress;
    } else if (breathingPhase === 'exhale') {
      // EXHALE: 8 seconds (8-0), linear compression
      const seconds = timer / 10; // Convert 100ms intervals to seconds
      const progress = seconds / 8; // 1 to 0
      return minSize + (maxSize - minSize) * progress;
    }

    return minSize;
  };

  // Get smooth square size for Box Breathing
  const getBoxBreathingSquareSize = () => {
    if (!isExercising) return 0;

    const minSize = 0; // Start from nothing (empty)
    const maxSize = 349; // 355 - 4 (stroke width) - 2 (1px padding each side)

    if (breathingPhase === 'inhale') {
      // INHALE: 0→4 seconds, linear expansion from 0 to max
      const progress = timer / 4; // 0 to 1
      return minSize + (maxSize - minSize) * progress;
    } else if (breathingPhase === 'hold1') {
      // HOLD1: Stay at max size for 4 seconds
      return maxSize;
    } else if (breathingPhase === 'exhale') {
      // EXHALE: 4→0 seconds, linear compression from max to 0
      const progress = timer / 4; // 1 to 0
      return minSize + (maxSize - minSize) * progress;
    } else if (breathingPhase === 'hold2') {
      // HOLD2: Stay at min size (0) for 4 seconds
      return minSize;
    }

    return minSize;
  };

  // Get green circle indicator position for Box Breathing
  const getBoxBreathingIndicatorPosition = () => {
    const size = 355; // Fixed size of gray outer square marker
    const radius = 15; // Border radius of the square
    const centerOffset = 181.5; // Center of the 363px container
    const halfSize = size / 2;

    // Only visible during HOLD phases
    if (breathingPhase === 'hold1' || breathingPhase === 'hold2') {
      // Circle moves clockwise around the perimeter starting from top-left corner
      const progress = timer / 4; // 0 to 1
      const perimeter = (size - 2 * radius) * 4;
      const distance = progress * perimeter;
      const sideLength = size - 2 * radius;

      if (distance <= sideLength) {
        // Top side: left to right
        return {
          x: centerOffset - halfSize + radius + distance,
          y: centerOffset - halfSize + radius
        };
      } else if (distance <= 2 * sideLength) {
        // Right side: top to bottom
        const sideProgress = distance - sideLength;
        return {
          x: centerOffset + halfSize - radius,
          y: centerOffset - halfSize + radius + sideProgress
        };
      } else if (distance <= 3 * sideLength) {
        // Bottom side: right to left
        const sideProgress = distance - 2 * sideLength;
        return {
          x: centerOffset + halfSize - radius - sideProgress,
          y: centerOffset + halfSize - radius
        };
      } else {
        // Left side: bottom to top
        const sideProgress = distance - 3 * sideLength;
        return {
          x: centerOffset - halfSize + radius,
          y: centerOffset + halfSize - radius - sideProgress
        };
      }
    }

    return { x: centerOffset, y: centerOffset };
  };

  // Get smooth circle data for Physiological Sigh
  const getPhysiologicalCircleSize = () => {
    if (!isExercising || exerciseCompleted) return 0;

    const minSize = 0; // Start and end at 0 (no circle)
    const maxSize = 340;

    if (breathingPhase === 'inhale') {
      // INHALE: timer goes from 0-39 (4 seconds total)
      // First 3 seconds (0-29): Blue expands (long breath)
      // Last 1 second (30-39): Blue stays at max, green flash (quick short breath)
      if (timer <= 29) {
        const progress = timer / 29; // 0 to 1 over 3 seconds

        // Calculate current size with smooth easing
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        return minSize + (maxSize - minSize) * easeProgress;
      } else {
        // Last second (30-39): Stay at max for quick short breath
        return maxSize;
      }
    } else if (breathingPhase === 'hold1') {
      // HOLD1: Stay at max size after INHALE completes
      return maxSize;
    } else if (breathingPhase === 'exhale') {
      // EXHALE: timer goes from 79-0 (8 seconds) - shrinks from max to 0
      const progress = timer / 79; // 1 to 0

      // Calculate current size with smooth easing
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      return minSize + (maxSize - minSize) * easeProgress;
    } else if (breathingPhase === 'hold2') {
      // HOLD2: Stay at min size after EXHALE completes - now returns 0
      return 0;
    }

    return 0;
  };

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
  const getDifficultyLevel = (exerciseName) => {
    const difficultyMap = {
      'Box Breathing (4-4-4-4)': 2,
      '4-7-8 Breathing': 3,
      'Coherent Breathing': 3,
      'Physiological Sigh': 2.5,
      'Alternate Nostril': 3,
      'Humming Bee': 2
    };
    return difficultyMap[exerciseName] || 0;
  };

  // Get metadata for each exercise (Best For & Ideal Session)
  const getExerciseMetadata = (exerciseName) => {
    const metadataMap = {
      'Box Breathing (4-4-4-4)': { bestFor: 'Stress & focus', idealSession: '3–10 min' },
      '4-7-8 Breathing': { bestFor: 'Anxiety & sleep', idealSession: '2–5 min' },
      'Coherent Breathing': { bestFor: 'HRV & relaxation', idealSession: '10–20 min' },
      'Physiological Sigh': { bestFor: 'Acute stress relief', idealSession: '1–3 min' },
      'Alternate Nostril': { bestFor: 'Nervous system balance', idealSession: '5–15 min' },
      'Humming Bee': { bestFor: 'Relaxation & sleep', idealSession: '5–10 min' }
    };
    return metadataMap[exerciseName] || { bestFor: '', idealSession: '' };
  };

  // Render difficulty indicator (1-5 circles, supports half-filled for decimals)
  const DifficultyIndicator = ({ level }) => {
    return (
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
                <div className="mb-6">
                  {/* Profile Section */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {currentUser?.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="Profile"
                          className="w-full h-full object-cover"
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
                    Take a deep breath and relax
                  </h1>

                  {/* Metric Cards Grid */}
                  <div className="space-y-3 mb-8">
                    {/* First Row: Active Days & Exercises Complete */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Active Days Card */}
                      <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(to bottom right, #7469B6, #8978C0)' }}>
                        <h3 className="text-xs font-medium mb-1 opacity-90">Active Days</h3>
                        {metrics.loading ? (
                          <p className="text-3xl font-bold">...</p>
                        ) : (
                          <p className="text-3xl font-bold">{metrics.activeDays}</p>
                        )}
                      </div>

                      {/* Exercises Complete Card */}
                      <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(to bottom right, #7469B6, #AB8CC4)' }}>
                        <h3 className="text-xs font-medium mb-1 opacity-90">Exercises Complete</h3>
                        {metrics.loading ? (
                          <p className="text-3xl font-bold">...</p>
                        ) : (
                          <p className="text-3xl font-bold">{metrics.exercisesComplete}</p>
                        )}
                      </div>
                    </div>

                    {/* Second Row: Why Breathing Helps - Full Width with Carousel */}
                    <button
                      onClick={() => setCurrentView('breathing-info')}
                      className="w-full rounded-2xl p-6 text-white text-left hover:opacity-90 transition-opacity relative overflow-hidden"
                      style={{ background: 'linear-gradient(to bottom right, #AB8CC4, #E1AFD1)', minHeight: '144px' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-base font-bold mb-2">Why Intentional Breathing Helps</h3>
                          <p className="text-xs font-light opacity-90">Swipe to learn more</p>
                        </div>
                        <div className="ml-4">
                          {/* White line illustration SVG */}
                          <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Abstract flowing lines representing breath/meditation */}
                            <path d="M10 20 Q 30 10, 50 20 T 10 40" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.9"/>
                            <path d="M15 35 Q 35 25, 55 35 T 15 55" stroke="#F5F5F5" strokeWidth="1.5" fill="none" opacity="0.7"/>
                            <path d="M8 50 Q 28 40, 48 50 T 8 70" stroke="#FAFAFA" strokeWidth="2" fill="none" opacity="0.8"/>
                            <path d="M12 65 Q 32 55, 52 65 T 12 85" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.6"/>
                            {/* Subtle dots */}
                            <circle cx="30" cy="15" r="2" fill="#FFFFFF" opacity="0.5"/>
                            <circle cx="45" cy="30" r="1.5" fill="#F5F5F5" opacity="0.4"/>
                            <circle cx="20" cy="45" r="2" fill="#FFFFFF" opacity="0.6"/>
                            <circle cx="40" cy="60" r="1.5" fill="#FAFAFA" opacity="0.5"/>
                            <circle cx="25" cy="75" r="2" fill="#FFFFFF" opacity="0.4"/>
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Album Art & Info - Show for other options (focus/calm) */}
              {!(selectedOption === 'breathe' && selectedExercise) && selectedOption !== 'breathe' && (
                <div className="mb-6">
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
                      {/* Timer Display - Show during INHALE and EXHALE (hide when completed) */}
                      {!exerciseCompleted && isExercising && (breathingPhase === 'inhale' || breathingPhase === 'exhale') && (
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
                                      ? `${Math.ceil((timer + 1) / 10)}s`  // INHALE: 0-39 → 1s-4s
                                      : `${Math.ceil(timer / 10)}s`)       // EXHALE: 79-0 → 8s-0s
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
                                setTimer(selectedExercise?.name === 'Physiological Sigh' ? 0 : 0);
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
                          {/* Breathing Square Illustration - Box Breathing Only */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Gray Background Square - Always visible */}
                            <svg
                              className="absolute"
                              width="363"
                              height="363"
                            >
                              <rect
                                x="4"
                                y="4"
                                width="355"
                                height="355"
                                rx="15"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="4"
                              />
                            </svg>

                            {/* Blue Progress Line - Shows during HOLD phases, starts from top-left */}
                            {(breathingPhase === 'hold1' || breathingPhase === 'hold2') && (
                              <svg
                                className="absolute"
                                width="363"
                                height="363"
                              >
                                <rect
                                  x="4"
                                  y="4"
                                  width="355"
                                  height="355"
                                  rx="15"
                                  fill="none"
                                  stroke="#067AC3"
                                  strokeWidth="4"
                                  strokeDasharray="1420"
                                  strokeDashoffset={1420 - (1420 * timer / 4)}
                                  style={{ transition: 'stroke-dashoffset 1000ms linear' }}
                                  strokeLinecap="square"
                                />
                              </svg>
                            )}

                            {/* Single Expanding/Compressing Square with Radial Gradient */}
                            <div
                              className="absolute"
                              style={{
                                width: `${getBoxBreathingSquareSize()}px`,
                                height: `${getBoxBreathingSquareSize()}px`,
                                background: 'radial-gradient(circle, rgba(6, 122, 195, 1) 0%, rgba(6, 122, 195, 0.6) 50%, rgba(6, 122, 195, 0.2) 100%)',
                                boxShadow: '0 0 30px rgba(6, 122, 195, 0.5)',
                                borderRadius: '15px',
                                transition: 'all 1000ms linear'
                              }}
                            />

                            {/* Phase Text - At Center of Square */}
                            <div className="absolute text-center">
                              <div
                                className={`text-lg font-semibold text-gray-700 uppercase tracking-wider ${
                                  (breathingPhase === 'hold1' || breathingPhase === 'hold2') ? 'pulse-hold' : ''
                                }`}
                              >
                                {breathingPhase === 'inhale' && 'Breathe In'}
                                {breathingPhase === 'hold1' && 'HOLD'}
                                {breathingPhase === 'exhale' && 'Breathe Out'}
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
                                  strokeDashoffset={1131 - (1131 * (timer / 10) / 7)}
                                  style={{ transition: 'stroke-dashoffset 100ms linear' }}
                                  strokeLinecap="round"
                                />
                              </svg>
                            )}

                            {/* Single Expanding/Compressing Circle with Radial Gradient */}
                            <div
                              className="rounded-full absolute"
                              style={{
                                width: `${get478CircleSize()}px`,
                                height: `${get478CircleSize()}px`,
                                background: 'radial-gradient(circle, rgba(6, 122, 195, 1) 0%, rgba(6, 122, 195, 0.6) 50%, rgba(6, 122, 195, 0.2) 100%)',
                                boxShadow: '0 0 30px rgba(6, 122, 195, 0.5)',
                                transition: 'all 100ms linear'
                              }}
                            />

                            {/* Phase Text - At Center of Circles */}
                            <div className="absolute text-center">
                              <div
                                className={`text-lg font-semibold text-gray-800 uppercase tracking-wider bg-gradient-to-b from-white/85 to-gray-100/80 backdrop-blur-sm px-6 py-3 rounded-xl inline-block ${
                                  breathingPhase === 'hold1' ? 'pulse-hold' : ''
                                }`}
                              >
                                {breathingPhase === 'inhale' && 'Breathe In'}
                                {breathingPhase === 'hold1' && 'HOLD'}
                                {breathingPhase === 'exhale' && 'Breathe Out'}
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
                                background: 'radial-gradient(circle, rgba(6, 122, 195, 1) 0%, rgba(6, 122, 195, 0.6) 50%, rgba(6, 122, 195, 0.2) 100%)',
                                boxShadow: '0 0 30px rgba(6, 122, 195, 0.5)',
                                transition: 'all 100ms linear'
                              }}
                            />

                            {/* Phase Text - At Center of Circle */}
                            <div className="absolute text-center">
                              <div
                                className={`text-lg font-semibold text-black uppercase tracking-wider`}
                              >
                                {breathingPhase === 'inhale' && 'Breathe In'}
                                {breathingPhase === 'exhale' && 'Breathe Out'}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : selectedExercise?.name === 'Physiological Sigh' ? (
                        /* Physiological Sigh Animation - Coherent Style */
                        <>
                          {/* Breathing Circle Illustration - Physiological Sigh */}
                          <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Gray Background Circle - Flashes green during last 1 second of INHALE */}
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
                                className={breathingPhase === 'inhale' && timer === 30 ? 'flash-green' : ''}
                                key={breathingPhase === 'inhale' && timer === 30 ? 'green' : 'gray'}
                              />
                            </svg>

                            {/* Single Expanding/Compressing Circle with Radial Gradient */}
                            <div
                              className="rounded-full absolute"
                              style={{
                                width: `${getPhysiologicalCircleSize()}px`,
                                height: `${getPhysiologicalCircleSize()}px`,
                                background: 'radial-gradient(circle, rgba(6, 122, 195, 1) 0%, rgba(6, 122, 195, 0.6) 50%, rgba(6, 122, 195, 0.2) 100%)',
                                boxShadow: '0 0 30px rgba(6, 122, 195, 0.5)',
                                transition: 'all 100ms linear'
                              }}
                            />

                            {/* Phase Text - At Center of Circle */}
                            <div className="absolute text-center">
                              <div
                                className={`text-lg font-semibold text-black uppercase tracking-wider`}
                              >
                                {breathingPhase === 'inhale' && 'Breathe In'}
                                {breathingPhase === 'exhale' && 'Breathe Out'}
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

                    {/* Pattern Info Section - 5% */}
                    <div className="flex-[0.05] flex items-center justify-center pt-[5px]">
                      {/* Box Breathing Pattern Tabs */}
                      {selectedExercise?.name === 'Box Breathing (4-4-4-4)' && !exerciseCompleted && isExercising && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className={`pb-1 transition-all ${breathingPhase === 'inhale' ? 'border-b-2 border-gray-900 font-medium' : ''}`}>
                            In 4s
                          </div>
                          <div className="text-gray-300">|</div>
                          <div className={`pb-1 transition-all ${breathingPhase === 'hold1' ? 'border-b-2 border-gray-900 font-medium' : ''}`}>
                            Hold 4s
                          </div>
                          <div className="text-gray-300">|</div>
                          <div className={`pb-1 transition-all ${breathingPhase === 'exhale' ? 'border-b-2 border-gray-900 font-medium' : ''}`}>
                            Out 4s
                          </div>
                          <div className="text-gray-300">|</div>
                          <div className={`pb-1 transition-all ${breathingPhase === 'hold2' ? 'border-b-2 border-gray-900 font-medium' : ''}`}>
                            Hold 4s
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Exercise Starting Section - 10% */}
                    <div className="flex-[0.1] flex items-center justify-center">
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

                      {/* Legend for Physiological Sigh - Show after countdown completes with 150ms delay */}
                      {selectedExercise?.name === 'Physiological Sigh' && showLegend && (
                        <div className="flex items-center justify-center gap-6">
                          {/* Blue Legend */}
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(6, 122, 195, 1)' }}></div>
                            <span className="text-sm text-gray-700 font-medium">Long breath</span>
                          </div>
                          {/* Green Legend */}
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#6EE7B7' }}></div>
                            <span className="text-sm text-gray-700 font-medium">Quick short breath</span>
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
                  <>
                    {selectedOption === 'breathe' && (
                      <div className="mt-6 mb-4">
                        <h3 className="font-semibold text-xl text-black">
                          Select from 6 proven techniques
                        </h3>
                      </div>
                    )}
                    <div>
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
                        className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 hover:opacity-70 transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm text-gray-500 w-6">{index + 1}</span>
                        <div className="text-left flex-1">
                          <p className="text-sm font-medium text-black">{track.name}</p>
                          {selectedOption === 'breathe' && (() => {
                            const metadata = getExerciseMetadata(track.name);
                            return (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {metadata.bestFor} · {metadata.idealSession}
                              </p>
                            );
                          })()}
                        </div>
                      </div>
                      {selectedOption === 'breathe' ? (
                        <DifficultyIndicator level={getDifficultyLevel(track.name)} />
                      ) : (
                        <span className="text-sm text-gray-500">{track.duration}</span>
                      )}
                    </button>
                      ))}
                    </div>
                  </>
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

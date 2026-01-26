export const getExerciseMetadata = (exerciseName) => {
  const metadataMap = {
    'Box Breathing': { bestFor: 'Stress & Focus', idealSession: '3–10 min' },
    '4-7-8 Breathing': { bestFor: 'Anxiety & Sleep', idealSession: '2–5 min' },
    'Coherent Breathing': { bestFor: 'HRV & Relaxation', idealSession: '10–20 min' },
    'Physiological Sigh': { bestFor: 'Acute Stress Relief', idealSession: '1–3 min' },
    'Alternate Nostril': { bestFor: 'Nervous System Balance', idealSession: '5–15 min' },
    'Humming Bee': { bestFor: 'Relaxation & Sleep', idealSession: '5–10 min' }
  };
  return metadataMap[exerciseName] || { bestFor: '', idealSession: '' };
};

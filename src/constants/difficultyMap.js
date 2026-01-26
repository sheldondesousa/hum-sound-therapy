export const getDifficultyLevel = (exerciseName) => {
  const difficultyMap = {
    'Box Breathing': 2,
    '4-7-8 Breathing': 3,
    'Coherent Breathing': 3,
    'Physiological Sigh': 2.5,
    'Alternate Nostril': 3,
    'Humming Bee': 2
  };
  return difficultyMap[exerciseName] || 0;
};

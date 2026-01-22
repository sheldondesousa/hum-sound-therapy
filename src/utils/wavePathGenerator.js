// Generate SVG path for 4-7-8 breathing wave visualization
export const generateWavePath478 = () => {
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
export const getDotPosition478 = (breathingPhase, timer) => {
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

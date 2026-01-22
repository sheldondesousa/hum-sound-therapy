import { useState } from 'react';

export const useCarousel = (maxIndex = 4) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && carouselIndex < maxIndex) {
      setCarouselIndex(carouselIndex + 1);
    }
    if (isRightSwipe && carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  const goToPrevCard = () => {
    if (carouselIndex > 0) setCarouselIndex(carouselIndex - 1);
  };

  const goToNextCard = () => {
    if (carouselIndex < maxIndex) setCarouselIndex(carouselIndex + 1);
  };

  return {
    carouselIndex,
    setCarouselIndex,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    goToPrevCard,
    goToNextCard
  };
};

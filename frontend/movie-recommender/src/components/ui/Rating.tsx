import { useCallback } from '@lynx-js/react';

interface RatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function Rating({ value, onChange, readonly = false, size = 'medium' }: RatingProps) {
  const handleRatingClick = useCallback((rating: number) => {
    'background only'
    if (!readonly && onChange) {
      onChange(rating);
    }
  }, [readonly, onChange]);
  
  // Generate an array of 5 stars
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= value;
    
    return (
      <view 
        key={`star-${index}`}
        className={`rating-star ${isFilled ? 'filled' : 'empty'} ${size} ${readonly ? 'readonly' : 'interactive'}`}
        bindtap={() => handleRatingClick(starValue)}
      >
        <text className="rating-star-icon">★</text>
      </view>
    );
  });
  
  return (
    <view className={`rating ${size}`}>
      {stars}
      {!readonly && (
        <text className="rating-value">{value.toFixed(1)}</text>
      )}
    </view>
  );
} 
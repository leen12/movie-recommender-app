import { useCallback } from '@lynx-js/react';
import { TVShow } from '../../services/tvService';
import { getImageUrl, formatRating, getYearFromDate } from '../../utils/helpers';

interface TVShowCardProps {
  tvShow: TVShow;
  onSelect: (tvShow: TVShow) => void;
}

export function TVShowCard({ tvShow, onSelect }: TVShowCardProps) {
  const handleTap = useCallback(() => {
    'background only'
    onSelect(tvShow);
  }, [tvShow, onSelect]);

  return (
    <view className="tv-card" bindtap={handleTap}>
      <view className="tv-card__poster">
        <image 
          src={getImageUrl(tvShow.poster_path)} 
          className="tv-card__image" 
        />
        <view className="tv-card__rating">
          <text className="tv-card__rating-text">{formatRating(tvShow.vote_average)}</text>
        </view>
      </view>
      <view className="tv-card__info">
        <text className="tv-card__title">{tvShow.name}</text>
        <text className="tv-card__year">{getYearFromDate(tvShow.first_air_date)}</text>
      </view>
    </view>
  );
} 
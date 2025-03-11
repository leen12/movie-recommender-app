import { useCallback } from '@lynx-js/react';
import { Movie } from '../../services/movieService';
import { getImageUrl, formatRating, getYearFromDate } from '../../utils/helpers';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export function MovieCard({ movie, onSelect }: MovieCardProps) {
  const handleTap = useCallback(() => {
    'background only'
    onSelect(movie);
  }, [movie, onSelect]);

  return (
    <view className="movie-card" bindtap={handleTap}>
      <view className="movie-card__poster">
        <image 
          src={getImageUrl(movie.poster_path)} 
          className="movie-card__image" 
        />
        <view className="movie-card__rating">
          <text className="movie-card__rating-text">{formatRating(movie.vote_average)}</text>
        </view>
      </view>
      <view className="movie-card__info">
        <text className="movie-card__title">{movie.title}</text>
        <text className="movie-card__year">{getYearFromDate(movie.release_date)}</text>
      </view>
    </view>
  );
} 
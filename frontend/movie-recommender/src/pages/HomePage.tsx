import { useState, useEffect, useCallback } from '@lynx-js/react';
import { Movie } from '../services/movieService';
import { TVShow } from '../services/tvService';
import movieService from '../services/movieService';
import tvService from '../services/tvService';
import { MovieCard } from '../components/movies/MovieCard';
import { TVShowCard } from '../components/tv/TVShowCard';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onMovieSelect: (movie: Movie) => void;
  onTVShowSelect: (tvShow: TVShow) => void;
}

export function HomePage({ onMovieSelect, onTVShowSelect }: HomePageProps) {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  
  // Fetch trending movies and TV shows
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch trending movies
        const moviesResponse = await movieService.getTrending();
        setTrendingMovies(moviesResponse.results);
        
        // Fetch trending TV shows
        const tvShowsResponse = await tvService.getTrending();
        setTrendingTVShows(tvShowsResponse.results);
        
        // Fetch recommended movies if user is logged in
        if (user) {
          const recommendedResponse = await movieService.getPersonalizedRecommendations();
          setRecommendedMovies(recommendedResponse.results);
        }
      } catch (err) {
        console.error('Error fetching trending content:', err);
        setError('Failed to load trending content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrending();
  }, [user]);
  
  const handleMovieSelect = useCallback((movie: Movie) => {
    'background only'
    onMovieSelect(movie);
  }, [onMovieSelect]);
  
  const handleTVShowSelect = useCallback((tvShow: TVShow) => {
    'background only'
    onTVShowSelect(tvShow);
  }, [onTVShowSelect]);
  
  if (loading) {
    return (
      <view className="home-page loading">
        <text className="loading-text">Loading...</text>
      </view>
    );
  }
  
  if (error) {
    return (
      <view className="home-page error">
        <text className="error-text">{error}</text>
        <button className="retry-button" bindtap={() => window.location.reload()}>
          <text>Retry</text>
        </button>
      </view>
    );
  }
  
  return (
    <view className="home-page">
      <view className="section">
        <text className="section-title">Trending Movies</text>
        <scroll className="movie-scroll" direction="horizontal">
          <view className="movie-list">
            {trendingMovies.map((movie) => (
              <MovieCard 
                key={`movie-${movie.id}`} 
                movie={movie} 
                onSelect={handleMovieSelect} 
              />
            ))}
          </view>
        </scroll>
      </view>
      
      <view className="section">
        <text className="section-title">Trending TV Shows</text>
        <scroll className="tv-scroll" direction="horizontal">
          <view className="tv-list">
            {trendingTVShows.map((tvShow) => (
              <TVShowCard 
                key={`tv-${tvShow.id}`} 
                tvShow={tvShow} 
                onSelect={handleTVShowSelect} 
              />
            ))}
          </view>
        </scroll>
      </view>
      
      {user && recommendedMovies.length > 0 && (
        <view className="section">
          <text className="section-title">Recommended For You</text>
          <scroll className="movie-scroll" direction="horizontal">
            <view className="movie-list">
              {recommendedMovies.map((movie) => (
                <MovieCard 
                  key={`recommended-${movie.id}`} 
                  movie={movie} 
                  onSelect={handleMovieSelect} 
                />
              ))}
            </view>
          </scroll>
        </view>
      )}
    </view>
  );
} 
import api from './api';

// Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string;
    }[];
  };
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  similar: {
    results: Movie[];
  };
  recommendations: {
    results: Movie[];
  };
}

export interface SearchParams {
  query?: string;
  page?: number;
  with_genres?: string;
  sort_by?: string;
  primary_release_year?: number;
  with_cast?: string;
  with_crew?: string;
  with_companies?: string;
  with_keywords?: string;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
}

// Movie services
const movieService = {
  // Search movies
  searchMovies: async (params: SearchParams) => {
    const response = await api.get('/movies/search', { params });
    return response.data;
  },

  // Get trending movies
  getTrending: async (timeWindow = 'day', page = 1) => {
    const response = await api.get('/movies/trending', {
      params: { time_window: timeWindow, page },
    });
    return response.data;
  },

  // Get movie details
  getMovieDetails: async (id: number) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  // Get movie genres
  getGenres: async () => {
    const response = await api.get('/movies/genres/list');
    return response.data;
  },

  // Discover movies
  discoverMovies: async (params: SearchParams) => {
    const response = await api.get('/movies/discover', { params });
    return response.data;
  },

  // Get personalized recommendations
  getPersonalizedRecommendations: async () => {
    const response = await api.get('/movies/recommendations/personalized');
    return response.data;
  },
};

export default movieService; 
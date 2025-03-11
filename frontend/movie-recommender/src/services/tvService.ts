import api from './api';
import { SearchParams } from './movieService';

// Types
export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface TVShowDetails extends TVShow {
  genres: { id: number; name: string }[];
  episode_run_time: number[];
  status: string;
  tagline: string;
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    episode_count: number;
  }[];
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
    results: TVShow[];
  };
  recommendations: {
    results: TVShow[];
  };
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  episodes: {
    id: number;
    name: string;
    overview: string;
    still_path: string;
    air_date: string;
    episode_number: number;
    season_number: number;
    runtime: number;
  }[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
  episode_number: number;
  season_number: number;
  runtime: number;
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string;
  }[];
  guest_stars: {
    id: number;
    name: string;
    character: string;
    profile_path: string;
  }[];
}

// TV services
const tvService = {
  // Search TV shows
  searchTVShows: async (params: SearchParams) => {
    const response = await api.get('/tv/search', { params });
    return response.data;
  },

  // Get trending TV shows
  getTrending: async (timeWindow = 'day', page = 1) => {
    const response = await api.get('/tv/trending', {
      params: { time_window: timeWindow, page },
    });
    return response.data;
  },

  // Get TV show details
  getTVShowDetails: async (id: number) => {
    const response = await api.get(`/tv/${id}`);
    return response.data;
  },

  // Get TV show season details
  getSeasonDetails: async (id: number, seasonNumber: number) => {
    const response = await api.get(`/tv/${id}/season/${seasonNumber}`);
    return response.data;
  },

  // Get TV show episode details
  getEpisodeDetails: async (id: number, seasonNumber: number, episodeNumber: number) => {
    const response = await api.get(`/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`);
    return response.data;
  },

  // Get TV show genres
  getGenres: async () => {
    const response = await api.get('/tv/genres/list');
    return response.data;
  },

  // Discover TV shows
  discoverTVShows: async (params: SearchParams) => {
    const response = await api.get('/tv/discover', { params });
    return response.data;
  },
};

export default tvService; 
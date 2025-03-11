import api from './api';

// Types
export interface WatchHistoryItem {
  _id: string;
  user: string;
  contentId: string;
  contentType: 'movie' | 'tv';
  title: string;
  posterPath: string;
  watchedDate: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomListItem {
  contentId: string;
  contentType: 'movie' | 'tv';
  title: string;
  posterPath: string;
  addedAt: string;
}

export interface CustomList {
  _id: string;
  user: string;
  name: string;
  description: string;
  isPublic: boolean;
  items: CustomListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  _id: string;
  user: string;
  contentId: string;
  contentType: 'movie' | 'tv';
  rating: number;
  title: string;
  posterPath: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  contentId: string;
  contentType: 'movie' | 'tv';
  title: string;
  posterPath: string;
  reviewText: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  criteria: {
    type: 'watchCount' | 'listCount' | 'reviewCount' | 'genreWatch';
    value: number;
    genre?: string;
  };
}

// User services
const userService = {
  // Watch History
  addToWatchHistory: async (data: {
    contentId: string;
    contentType: 'movie' | 'tv';
    title: string;
    posterPath: string;
    progress?: number;
  }) => {
    const response = await api.post('/user/watch-history', data);
    return response.data;
  },

  getWatchHistory: async (params?: { page?: number; limit?: number; contentType?: 'movie' | 'tv' }) => {
    const response = await api.get('/user/watch-history', { params });
    return response.data;
  },

  deleteFromWatchHistory: async (id: string) => {
    const response = await api.delete(`/user/watch-history/${id}`);
    return response.data;
  },

  // Custom Lists
  createList: async (data: { name: string; description?: string; isPublic?: boolean }) => {
    const response = await api.post('/user/lists', data);
    return response.data;
  },

  getLists: async () => {
    const response = await api.get('/user/lists');
    return response.data;
  },

  getList: async (id: string) => {
    const response = await api.get(`/user/lists/${id}`);
    return response.data;
  },

  addToList: async (
    listId: string,
    data: { contentId: string; contentType: 'movie' | 'tv'; title: string; posterPath: string }
  ) => {
    const response = await api.post(`/user/lists/${listId}/items`, data);
    return response.data;
  },

  removeFromList: async (listId: string, itemId: string) => {
    const response = await api.delete(`/user/lists/${listId}/items/${itemId}`);
    return response.data;
  },

  deleteList: async (id: string) => {
    const response = await api.delete(`/user/lists/${id}`);
    return response.data;
  },

  // Ratings
  rateContent: async (data: {
    contentId: string;
    contentType: 'movie' | 'tv';
    rating: number;
    title: string;
    posterPath: string;
  }) => {
    const response = await api.post('/user/ratings', data);
    return response.data;
  },

  getRatings: async (params?: { page?: number; limit?: number; contentType?: 'movie' | 'tv' }) => {
    const response = await api.get('/user/ratings', { params });
    return response.data;
  },

  deleteRating: async (id: string) => {
    const response = await api.delete(`/user/ratings/${id}`);
    return response.data;
  },

  // Reviews
  createReview: async (data: {
    contentId: string;
    contentType: 'movie' | 'tv';
    reviewText: string;
    title: string;
    posterPath: string;
  }) => {
    const response = await api.post('/user/reviews', data);
    return response.data;
  },

  getReviews: async (params?: { page?: number; limit?: number; contentType?: 'movie' | 'tv' }) => {
    const response = await api.get('/user/reviews', { params });
    return response.data;
  },

  getContentReviews: async (
    contentId: string,
    params?: { contentType?: 'movie' | 'tv'; page?: number; limit?: number }
  ) => {
    const response = await api.get(`/user/reviews/content/${contentId}`, { params });
    return response.data;
  },

  deleteReview: async (id: string) => {
    const response = await api.delete(`/user/reviews/${id}`);
    return response.data;
  },

  likeReview: async (id: string) => {
    const response = await api.post(`/user/reviews/${id}/like`);
    return response.data;
  },

  // Badges
  getBadges: async () => {
    const response = await api.get('/user/badges');
    return response.data;
  },
};

export default userService; 
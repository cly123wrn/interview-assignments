import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers or other request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access');
          break;
        case 403:
          // Handle forbidden
          console.error('Forbidden access');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        case 500:
          // Handle server error
          console.error('Internal server error');
          break;
        default:
          console.error('API Error:', data?.message || error.message);
      }
    } else if (error.request) {
      console.error('Network error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Articles API
export const articlesAPI = {
  // Get articles with filtering and pagination
  getArticles: (params = {}) => {
    return api.get('/articles', { params });
  },

  // Get trending articles
  getTrending: (limit = 20) => {
    return api.get('/articles/trending', { params: { limit } });
  },

  // Get specific article
  getArticle: (id) => {
    return api.get(`/articles/${id}`);
  },

  // Search articles
  search: (query, params = {}) => {
    return api.get('/search', { params: { q: query, ...params } });
  },

  // Trigger manual scraping
  triggerScrape: () => {
    return api.post('/scrape');
  },
};

// Statistics API
export const statsAPI = {
  // Get overall statistics
  getStats: () => {
    return api.get('/stats');
  },

  // Get trending keywords
  getTrendingKeywords: (limit = 20) => {
    return api.get('/keywords/trending', { params: { limit } });
  },
};

// Users API (for future implementation)
export const usersAPI = {
  // Get user profile
  getProfile: (id) => {
    return api.get(`/users/${id}`);
  },

  // Update user preferences
  updatePreferences: (id, preferences) => {
    return api.put(`/users/${id}/preferences`, preferences);
  },

  // Get user preferences
  getPreferences: (id) => {
    return api.get(`/users/${id}/preferences`);
  },
};

// Helper functions for building query parameters
export const buildArticleQuery = (filters) => {
  const params = {};

  if (filters.selectedSources?.length > 0) {
    params.source = filters.selectedSources.join(',');
  }

  if (filters.selectedCategories?.length > 0) {
    params.category = filters.selectedCategories.join(',');
  }

  if (filters.keywords?.length > 0) {
    params.keyword = filters.keywords.join(',');
  }

  if (filters.minHotness > 0) {
    params.min_hotness = filters.minHotness;
  }

  if (filters.sortBy) {
    params.sort_by = filters.sortBy;
  }

  return params;
};

// React Query helper functions
export const queryKeys = {
  articles: (filters, page = 1) => ['articles', filters, page],
  trending: (limit) => ['trending', limit],
  article: (id) => ['article', id],
  search: (query, filters, page = 1) => ['search', query, filters, page],
  stats: () => ['stats'],
  trendingKeywords: (limit) => ['trending-keywords', limit],
  userProfile: (id) => ['user-profile', id],
  userPreferences: (id) => ['user-preferences', id],
};

// Error handling utilities
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (isNetworkError(error)) {
    return 'Network error. Please check your connection.';
  }
  return error.message || 'An unexpected error occurred.';
};

export default api;
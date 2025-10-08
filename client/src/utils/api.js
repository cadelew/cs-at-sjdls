// API configuration utility
const getApiBaseUrl = () => {
  // Check if we have an environment variable set
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Auto-detect environment
  if (import.meta.env.PROD) {
    // Production: use Render backend
    return 'https://cs-at-sjdls.onrender.com/api';
  } else {
    // Development: use local proxy
    return '/api';
  }
};

export const API_BASE_URL = getApiBaseUrl();

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  
  return fetch(url, { ...defaultOptions, ...options });
};

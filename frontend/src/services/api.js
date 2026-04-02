import axios from 'axios';

// Create instance
const API = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─────────────────────────────────────────
// 🔥 Request Interceptor (optional auth/logging)
// ─────────────────────────────────────────
API.interceptors.request.use(
  (config) => {
    // Example: add token later
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────
// ⚡ Response Interceptor (global error handling)
// ─────────────────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error.message);

    if (error.response) {
      switch (error.response.status) {
        case 404:
          throw new Error("Resource not found");
        case 500:
          throw new Error("Server error");
        default:
          throw new Error(error.response.data?.detail || "Something went wrong");
      }
    }

    throw new Error("Network error. Please check your connection.");
  }
);

// ─────────────────────────────────────────
// 🚀 API Methods
// ─────────────────────────────────────────

export const getRecommendations = async (title, n = 10) => {
  const res = await API.get(`/recommendations/${encodeURIComponent(title)}`, {
    params: { n },
  });
  return res.data;
};

export const searchMovies = async (query, limit = 20) => {
  const res = await API.get('/search', { params: { query, limit } });
  return res.data;
};

export const getMovieDetails = async (title) => {
  const res = await API.get(`/movies/${encodeURIComponent(title)}`);
  return res.data;
};

export const getTrending = async (page = 1) => {
  const res = await API.get('/trending', { params: { page } });
  return res.data;
};

export const getPopular = async (page = 1) => {
  const res = await API.get('/popular', { params: { page } });
  return res.data;
};

export const getTopRated = async (n = 20) => {
  const res = await API.get('/top-rated', { params: { n } });
  return res.data;
};

export default API;
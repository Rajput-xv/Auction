import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Always include credentials
});

export default api;

export const API_CONFIG = {
  USERS_API: 'https://jsonplaceholder.typicode.com/users',
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY',
};

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

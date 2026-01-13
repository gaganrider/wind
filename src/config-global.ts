// Global configuration file
export const CONFIG = {
  site: {
    name: 'YourApp',
    serverUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  },
  api: {
    timeout: 15000,
  },
};

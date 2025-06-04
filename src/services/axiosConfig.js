import axios from 'axios';

// In development, we use the proxy
const BASE_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_API_BASE_URL || 'https://kibou-registry-1.onrender.com';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const authData = localStorage.getItem('klaro_auth');
    if (authData) {
      try {
        const { user } = JSON.parse(authData);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('klaro_auth');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

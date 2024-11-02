import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  //baseURL: 'http://localhost:8080/api',
  baseURL: process.env.REACT_APP_AXIOS_BASE_URL,
});

console.log("App Base URL ->", api.defaults.baseURL);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login on token expiration
    }
    return Promise.reject(error);
  }
);

export default api;
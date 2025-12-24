import axios from 'axios';

// ✅ 반드시 선언
const API_BASE = import.meta.env.VITE_API_BASE ;

const http = axios.create({
  baseURL: API_BASE,
  withCredentials: false, // JWT면 false 권장
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('accessToken');
    }
    return Promise.reject(err);
  }
);

export default http;

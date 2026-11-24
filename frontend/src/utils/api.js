import axios from 'axios';
import { getAccessToken, setTokens, clearTokens } from './auth';
import { mockSummary, mockCompetitors, mockAiInsights } from '../data/mockData';

const isMockMode = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // Tangani 401 Unauthorized dengan refresh token
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const refreshRes = await axios.put(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/authentications`,
            { refreshToken }
          );
          const newAccessToken = refreshRes.data.data.accessToken;
          setTokens({ accessToken: newAccessToken });
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return api.request(error.config);
        }
      } catch (refreshErr) {
        clearTokens();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Wrapper API yang mendukung fallback mock data
export const apiClient = {
  async getSummary(params = {}) {
    if (isMockMode) {
      await new Promise((r) => setTimeout(r, 350));
      let filtered = JSON.parse(JSON.stringify(mockSummary));
      if (params.aspect && filtered.aspectBreakdown[params.aspect]) {
        const asp = filtered.aspectBreakdown[params.aspect];
        filtered.totalReviews = asp.total;
        filtered.positive = asp.positive;
        filtered.negative = asp.negative;
        filtered.positivePercentage = Number(((asp.positive / asp.total) * 100).toFixed(1));
      }
      return { status: 'success', data: filtered };
    }
    try {
      const res = await api.get('/reviews/summary', { params });
      return res.data;
    } catch (err) {
      console.warn('API /reviews/summary failed, using mock data fallback:', err.message);
      return { status: 'success', data: mockSummary };
    }
  },

  async getBenchmarking() {
    if (isMockMode) {
      await new Promise((r) => setTimeout(r, 400));
      return { status: 'success', data: mockCompetitors };
    }
    try {
      const res = await api.get('/competitors/benchmarking');
      return res.data;
    } catch (err) {
      console.warn('API /competitors/benchmarking failed, using mock data fallback:', err.message);
      return { status: 'success', data: mockCompetitors };
    }
  },

  async generateAiInsights(payload = {}) {
    if (isMockMode) {
      await new Promise((r) => setTimeout(r, 1200));
      return { status: 'success', data: mockAiInsights };
    }
    try {
      const res = await api.post('/ai/insights', payload);
      return res.data;
    } catch (err) {
      console.warn('API /ai/insights failed, using mock data fallback:', err.message);
      return { status: 'success', data: mockAiInsights };
    }
  },

  async login(credentials) {
    if (isMockMode) {
      await new Promise((r) => setTimeout(r, 500));
      if (credentials.username === 'owner_lintang' && credentials.password === 'secret_password123') {
        const dummy = {
          accessToken: 'mock_jwt_access_token_' + Date.now(),
          refreshToken: 'mock_jwt_refresh_token_' + Date.now(),
        };
        setTokens(dummy);
        localStorage.setItem('userFullName', 'Pemilik Lintang Bakso');
        localStorage.setItem('username', credentials.username);
        return { status: 'success', data: dummy };
      }
      // Boleh login jika memasukkan demo akun
      if (credentials.username && credentials.password) {
        const dummy = {
          accessToken: 'mock_jwt_access_token_' + Date.now(),
          refreshToken: 'mock_jwt_refresh_token_' + Date.now(),
        };
        setTokens(dummy);
        localStorage.setItem('userFullName', credentials.username);
        localStorage.setItem('username', credentials.username);
        return { status: 'success', data: dummy };
      }
      throw new Error('Kredensial salah. Gunakan username: owner_lintang & password: secret_password123');
    }
    const res = await api.post('/authentications', credentials);
    if (res.data?.data) {
      setTokens(res.data.data);
      localStorage.setItem('username', credentials.username);
    }
    return res.data;
  },

  async logout() {
    if (isMockMode) {
      clearTokens();
      return { status: 'success' };
    }
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.delete('/authentications', { data: { refreshToken } });
    } finally {
      clearTokens();
    }
  },
};

export default api;

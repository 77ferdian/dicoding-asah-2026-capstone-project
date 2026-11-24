# 04 — Frontend React.js (Vite)

**Penanggung Jawab**: Panji Arya Maulana (AIFS)  
**Framework**: React.js v18 + Vite  
**Styling**: Tailwind CSS  
**Chart**: Recharts

---

## Struktur Direktori

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   └── FilterBar.jsx
│   │   ├── charts/
│   │   │   ├── SentimentDonutChart.jsx
│   │   │   ├── AspectBarChart.jsx
│   │   │   └── CompetitorBarChart.jsx
│   │   └── ai/
│   │       └── InsightPanel.jsx
│   ├── contexts/
│   │   └── LocaleContext.jsx         ← i18n ID/EN + useMemo
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── BenchmarkingPage.jsx
│   ├── utils/
│   │   ├── api.js                    ← Axios instance + interceptor
│   │   └── auth.js                   ← localStorage token helpers
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Setup Awal

```bash
# Buat project React dengan Vite
npm create vite@latest frontend -- --template react
cd frontend && npm install

# Install dependencies
npm install react-router-dom axios recharts react-icons prop-types
npm install -D tailwindcss autoprefixer postcss
npx tailwindcss init -p
```

### `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

---

## Implementasi Kode Utama

### `src/utils/auth.js` — Token Manager

```javascript
export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const setTokens = ({ accessToken, refreshToken }) => {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = () => !!getAccessToken();
```

### `src/utils/api.js` — Axios dengan Interceptor

```javascript
import axios from 'axios';
import { getAccessToken, setTokens, clearTokens } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Inject token ke setiap request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh token jika 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.put('/authentications', { refreshToken });
        setTokens({ accessToken: res.data.data.accessToken });
        error.config.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
        return api.request(error.config);
      } catch {
        clearTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### `src/contexts/LocaleContext.jsx`

```jsx
import { createContext, useState, useMemo, useContext } from 'react';

const translations = {
  id: {
    appName:         'Lintang Bakso Analytics',
    dashboard:       'Dasbor',
    benchmarking:    'Perbandingan Kompetitor',
    totalReviews:    'Total Ulasan',
    positive:        'Positif',
    negative:        'Negatif',
    allAspects:      'Semua Aspek',
    generateInsight: 'Generate Strategi AI',
    generating:      'Memproses...',
    executiveSummary:'Ringkasan Eksekutif',
    recommendations: 'Rekomendasi Tindakan',
    logout:          'Keluar',
    loading:         'Memuat data...',
  },
  en: {
    appName:         'Lintang Bakso Analytics',
    dashboard:       'Dashboard',
    benchmarking:    'Competitor Benchmarking',
    totalReviews:    'Total Reviews',
    positive:        'Positive',
    negative:        'Negative',
    allAspects:      'All Aspects',
    generateInsight: 'Generate AI Strategy',
    generating:      'Processing...',
    executiveSummary:'Executive Summary',
    recommendations: 'Action Recommendations',
    logout:          'Logout',
    loading:         'Loading data...',
  },
};

export const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(
    () => localStorage.getItem('locale') || 'id'
  );

  // useMemo mencegah unnecessary re-render pada child components
  const value = useMemo(() => ({
    locale,
    t: translations[locale],
    toggleLocale: () => {
      const next = locale === 'id' ? 'en' : 'id';
      localStorage.setItem('locale', next);
      setLocale(next);
    },
  }), [locale]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
```

### `src/App.jsx` — Router + Protected Routes

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LocaleProvider } from './contexts/LocaleContext';
import LoginPage       from './pages/LoginPage';
import DashboardPage   from './pages/DashboardPage';
import BenchmarkingPage from './pages/BenchmarkingPage';
import Navbar          from './components/common/Navbar';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Navbar />
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/benchmarking" element={
            <ProtectedRoute>
              <Navbar />
              <BenchmarkingPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  );
}
```

### `src/pages/DashboardPage.jsx` — Filter + Data Fetching

```jsx
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import MetricCard         from '../components/common/MetricCard';
import SentimentDonutChart from '../components/charts/SentimentDonutChart';
import AspectBarChart     from '../components/charts/AspectBarChart';
import InsightPanel       from '../components/ai/InsightPanel';
import LoadingSkeleton    from '../components/common/LoadingSkeleton';
import api from '../utils/api';

const ASPECTS = [
  { value: '', label: 'Semua Aspek' },
  { value: 'rasa', label: 'Rasa' },
  { value: 'harga', label: 'Harga' },
  { value: 'pelayanan', label: 'Pelayanan' },
  { value: 'tempat', label: 'Tempat/Lokasi' },
];

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const aspect    = searchParams.get('aspect')    || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate   = searchParams.get('endDate')   || '';

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get('/reviews/summary', { params: { aspect, startDate, endDate } })
      .then(res => setSummary(res.data.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [aspect, startDate, endDate]);

  const setParam = (key, value) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      value ? p.set(key, value) : p.delete(key);
      return p;
    });
  };

  if (loading) return <LoadingSkeleton />;
  if (error)   return <div className="p-6 text-red-500">Error: {error}</div>;

  const positivePercent = summary
    ? ((summary.positive / summary.totalReviews) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl shadow-sm border">
        <FiFilter className="text-gray-400" />
        <select
          value={aspect}
          onChange={e => setParam('aspect', e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm text-gray-700"
        >
          {ASPECTS.map(a => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
        <input type="date" value={startDate}
          onChange={e => setParam('startDate', e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm" />
        <span className="text-gray-400 text-sm">s/d</span>
        <input type="date" value={endDate}
          onChange={e => setParam('endDate', e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Total Ulasan" value={summary?.totalReviews} color="blue" />
        <MetricCard title="Sentimen Positif" value={`${positivePercent}%`} color="green" />
        <MetricCard title="Sentimen Negatif" value={`${(100 - positivePercent).toFixed(1)}%`} color="red" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SentimentDonutChart data={summary} />
        <AspectBarChart data={summary?.aspectBreakdown} />
      </div>

      {/* AI Insight Panel */}
      <InsightPanel aspect={aspect} timeRange={startDate ? 'last_month' : 'all'} />
    </div>
  );
}
```

### `src/components/ai/InsightPanel.jsx`

```jsx
import { useState } from 'react';
import { FiZap } from 'react-icons/fi';
import api from '../../utils/api';
import { useLocale } from '../../contexts/LocaleContext';

export default function InsightPanel({ aspect, timeRange }) {
  const { t } = useLocale();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/ai/insights', { aspect, timeRange });
      setInsight(res.data.data);
    } catch (err) {
      setError('Gagal menghasilkan rekomendasi AI. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm border border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
          <FiZap className="text-indigo-500" />
          {t.generateInsight}
        </h3>
        <button onClick={generate} disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium
                     hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {loading ? `⏳ ${t.generating}` : `✨ ${t.generateInsight}`}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {insight && !loading && (
        <div className="space-y-4 mt-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-700 mb-2">📊 {t.executiveSummary}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{insight.executiveSummary}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-700 mb-3">🎯 {t.recommendations}</h4>
            <ul className="space-y-2">
              {insight.actionableRecommendations?.map((rec, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2 items-start">
                  <span className="text-indigo-500 font-bold mt-0.5">{i + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Variabel Environment Frontend

```dotenv
# frontend/.env
VITE_API_URL=http://localhost:5000
```

```dotenv
# frontend/.env.production
VITE_API_URL=https://api.lintangbakso.com
```

---

> 📅 Last updated: 24 November 2026 | Author: Panji Arya Maulana (AIFS)

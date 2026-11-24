import React, { createContext, useState, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';

const translations = {
  id: {
    brandName: 'Lintang Bakso Analytics',
    tagline: 'Pemetaan Kepuasan Pelanggan & Daya Saing Bisnis Berbasis AI',
    dashboard: 'Dasbor Sentimen',
    benchmarking: 'Komparasi Kompetitor',
    login: 'Masuk ke Sistem',
    logout: 'Keluar',
    username: 'Nama Pengguna',
    password: 'Kata Sandi',
    signIn: 'Masuk Sekarang',
    welcomeBack: 'Selamat Datang Kembali!',
    loginSubtext: 'Akses analitik ulasan digital & insight daya saing bisnis Anda.',
    totalReviews: 'Total Ulasan',
    positiveSentiment: 'Sentimen Positif',
    negativeSentiment: 'Sentimen Negatif',
    aspectBreakdown: 'Distribusi Sentimen per Aspek',
    overallRatio: 'Rasio Sentimen Keseluruhan',
    allAspects: 'Semua Aspek',
    aspectRasa: 'Rasa Makanan',
    aspectHarga: 'Harga & Porsi',
    aspectPelayanan: 'Pelayanan Staf',
    aspectTempat: 'Tempat & Suasana',
    timeRange: 'Rentang Waktu',
    allTime: 'Semua Waktu',
    lastMonth: '1 Bulan Terakhir',
    filterApplied: 'Filter Diterapkan',
    resetFilter: 'Reset Filter',
    aiStrategyTitle: 'AI Executive Insights & Rekomendasi Bisnis',
    aiStrategyDesc: 'Sintesis ulasan terfilter menggunakan model GenAI RAG untuk memberikan ringkasan eksekutif dan rekomendasi tindakan operasional UMKM.',
    btnGenerateAi: 'Generate Strategi AI',
    btnGeneratingAi: 'Menganalisis & Mensintesis Data...',
    executiveSummary: 'Ringkasan Eksekutif',
    actionableRecommendations: 'Rekomendasi Tindakan Strategis',
    competitorTitle: 'Benchmarking Daya Saing Bisnis Kuliner',
    competitorSubtitle: 'Perbandingan performa Lintang Bakso terhadap kompetitor sekitar Surabaya',
    ourBusiness: 'Bisnis Anda',
    competitor: 'Kompetitor',
    rating: 'Rating',
    location: 'Lokasi',
    strengths: 'Kelebihan Utama',
    weaknesses: 'Poin Perlu Perbaikan',
    viewGmaps: 'Buka di Google Maps',
    loadingData: 'Memuat data analitik...',
    errorOccurred: 'Terjadi kesalahan saat memuat data.',
    retry: 'Coba Lagi',
    demoNotice: 'Mode Pratinjau Interaktif Aktif (Mock Data Enabled)',
  },
  en: {
    brandName: 'Lintang Bakso Analytics',
    tagline: 'AI-Powered Customer Satisfaction & Competitive Intelligence Platform',
    dashboard: 'Sentiment Dashboard',
    benchmarking: 'Competitor Benchmarking',
    login: 'Sign In',
    logout: 'Sign Out',
    username: 'Username',
    password: 'Password',
    signIn: 'Sign In Now',
    welcomeBack: 'Welcome Back!',
    loginSubtext: 'Access digital review analytics & business competitive insights.',
    totalReviews: 'Total Reviews',
    positiveSentiment: 'Positive Sentiment',
    negativeSentiment: 'Negative Sentiment',
    aspectBreakdown: 'Sentiment Distribution by Aspect',
    overallRatio: 'Overall Sentiment Ratio',
    allAspects: 'All Aspects',
    aspectRasa: 'Food Taste & Quality',
    aspectHarga: 'Price & Value',
    aspectPelayanan: 'Staff Service',
    aspectTempat: 'Ambience & Location',
    timeRange: 'Time Period',
    allTime: 'All Time',
    lastMonth: 'Last 1 Month',
    filterApplied: 'Filter Applied',
    resetFilter: 'Reset Filter',
    aiStrategyTitle: 'AI Executive Insights & Recommendations',
    aiStrategyDesc: 'Filtered review synthesis powered by GenAI RAG engine providing executive summaries and actionable operational recommendations.',
    btnGenerateAi: 'Generate AI Strategy',
    btnGeneratingAi: 'Analyzing & Synthesizing Data...',
    executiveSummary: 'Executive Summary',
    actionableRecommendations: 'Actionable Strategic Recommendations',
    competitorTitle: 'Culinary Competitive Benchmarking',
    competitorSubtitle: 'Performance benchmark of Lintang Bakso against nearby competitors in Surabaya',
    ourBusiness: 'Your Business',
    competitor: 'Competitor',
    rating: 'Rating',
    location: 'Location',
    strengths: 'Key Strengths',
    weaknesses: 'Areas for Improvement',
    viewGmaps: 'View on Google Maps',
    loadingData: 'Loading analytics data...',
    errorOccurred: 'An error occurred while fetching data.',
    retry: 'Retry',
    demoNotice: 'Interactive Preview Mode Active (Mock Data Enabled)',
  },
};

export const LocaleContext = createContext(null);

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('locale') || 'id';
  });

  const toggleLocale = () => {
    setLocale((prev) => {
      const next = prev === 'id' ? 'en' : 'id';
      localStorage.setItem('locale', next);
      return next;
    });
  };

  // Mengunci referensi memori dengan useMemo untuk mencegah re-render komponen anak yang tidak perlu
  const value = useMemo(() => {
    return {
      locale,
      t: translations[locale] || translations.id,
      toggleLocale,
    };
  }, [locale]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

LocaleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

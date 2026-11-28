import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiMessageSquare, FiSmile, FiFrown, FiTrendingUp } from 'react-icons/fi';
import { useLocale } from '../contexts/LocaleContext';
import { apiClient } from '../utils/api';
import MetricCard from '../components/common/MetricCard';
import FilterBar from '../components/common/FilterBar';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SentimentDonutChart from '../components/charts/SentimentDonutChart';
import AspectBarChart from '../components/charts/AspectBarChart';
import InsightPanel from '../components/ai/InsightPanel';

export default function DashboardPage() {
  const { t } = useLocale();
  const [searchParams] = useSearchParams();

  const aspect = searchParams.get('aspect') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.getSummary({ aspect, startDate, endDate });
      setSummary(res.data);
    } catch (err) {
      setError(err.message || 'Gagal mengambil data analitik.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [aspect, startDate, endDate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="p-8 rounded-3xl bg-white border border-rose-200 max-w-lg mx-auto shadow-sm">
          <p className="text-rose-600 font-bold mb-2">Terjadi Gangguan Data</p>
          <p className="text-sm text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchSummary}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  const positivePercent = summary?.positivePercentage || 0;
  const negativePercent = summary ? (100 - positivePercent).toFixed(1) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dashboard} · Google Maps Reviews
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Ringkasan Persepsi & Sentimen
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Analisis data ulasan digital pelanggan Lintang Bakso Surabaya secara otomatis berbasis AI.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2 shrink-0 self-start sm:self-center">
          <span>✨ Status: Terkoneksi (4 Aspek ABSA Aktif)</span>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar onReset={fetchSummary} />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          title={t.totalReviews}
          value={summary?.totalReviews || 0}
          subtitle="Total ulasan digital yang dianalisis"
          icon={FiMessageSquare}
          color="indigo"
        />
        <MetricCard
          title={t.positiveSentiment}
          value={`${positivePercent}%`}
          subtitle={`${summary?.positive || 0} ulasan pelanggan puas`}
          icon={FiSmile}
          color="emerald"
        />
        <MetricCard
          title={t.negativeSentiment}
          value={`${negativePercent}%`}
          subtitle={`${summary?.negative || 0} ulasan berisi keluhan`}
          icon={FiFrown}
          color="rose"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-3 flex">
          <div className="w-full flex">
            <SentimentDonutChart summary={summary} />
          </div>
        </div>
        <div className="lg:col-span-9 flex">
          <div className="w-full flex">
            <AspectBarChart
              aspect={aspect}
              aspectBreakdown={summary?.aspectBreakdown}
              timeSeries={summary?.timeSeries}
            />
          </div>
        </div>
      </div>

      {/* AI Strategy Insights Panel */}
      <InsightPanel aspect={aspect} timeRange={startDate ? 'custom' : 'all'} />
    </div>
  );
}

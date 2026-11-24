import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiZap, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { useLocale } from '../../contexts/LocaleContext';
import { apiClient } from '../../utils/api';

export default function InsightPanel({ aspect, timeRange }) {
  const { t } = useLocale();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.generateAiInsights({ aspect, timeRange });
      setInsight(res.data);
    } catch (err) {
      setError(err.message || 'Gagal menghasilkan insight AI. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
      {/* Decorative Blur Background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-900 text-2xl shadow-lg shadow-orange-500/30 shrink-0">
              <FiZap />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  {t.aiStrategyTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-bold tracking-wider uppercase border border-indigo-400/30">
                  GenAI / RAG
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-normal leading-relaxed">
                {t.aiStrategyDesc}
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="self-start sm:self-center px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <FiZap className={loading ? 'animate-spin' : ''} />
            <span>{loading ? t.btnGeneratingAi : t.btnGenerateAi}</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 mb-4">
            <FiAlertCircle className="text-base shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* State Awal / Placeholder */}
        {!insight && !loading && (
          <div className="bg-slate-800/60 backdrop-blur-xs rounded-2xl p-6 border border-slate-700/60 text-center">
            <p className="text-sm text-slate-400">
              💡 Tekan tombol <strong className="text-white">"{t.btnGenerateAi}"</strong> untuk memulai sintesis otomatis ulasan pelanggan dan mendapatkan rekomendasi strategi perbaikan operasional untuk Lintang Bakso.
            </p>
          </div>
        )}

        {/* State Loading */}
        {loading && (
          <div className="bg-slate-800/60 backdrop-blur-xs rounded-2xl p-6 border border-slate-700/60 space-y-4 animate-pulse">
            <div className="h-4 bg-slate-700 rounded-md w-1/3"></div>
            <div className="h-16 bg-slate-700/60 rounded-xl"></div>
            <div className="h-4 bg-slate-700 rounded-md w-1/4 mt-4"></div>
            <div className="space-y-2">
              <div className="h-10 bg-slate-700/60 rounded-xl"></div>
              <div className="h-10 bg-slate-700/60 rounded-xl"></div>
            </div>
          </div>
        )}

        {/* State Hasil AI */}
        {insight && !loading && (
          <div className="space-y-4">
            {/* Executive Summary */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
                <span>📊 {t.executiveSummary}</span>
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {insight.executiveSummary}
              </p>
            </div>

            {/* Actionable Recommendations */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                <span>🎯 {t.actionableRecommendations}</span>
              </h4>
              <ul className="space-y-2.5">
                {insight.actionableRecommendations?.map((rec, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cache notice */}
            {insight.cachedAt && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <FiClock />
                <span>Hasil disintesis & di-cache pada: {new Date(insight.cachedAt).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

InsightPanel.propTypes = {
  aspect: PropTypes.string,
  timeRange: PropTypes.string,
};

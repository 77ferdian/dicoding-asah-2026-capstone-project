/**
 * AiInsightPanel.jsx
 * Tombol "Buat Rekomendasi" → useMutation.
 * Menampilkan: Ringkasan, Peluang, Risiko, Langkah verifikasi lapangan.
 * Cooldown 10 detik, tangani 429 dan fallback flag.
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiZap, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { useInsight } from '../hooks/useInsight';

const COOLDOWN_S = 10;

export default function AiInsightPanel({ candidateId, selectedCandidate }) {
  const mutation = useInsight();
  const [insight, setInsight] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((p) => p - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  // Reset saat kandidat berganti
  useEffect(() => {
    setInsight(null);
    setErrorMsg('');
  }, [candidateId]);

  const handleGenerate = async () => {
    if (!candidateId || cooldown > 0 || mutation.isPending) return;
    setErrorMsg('');
    try {
      const result = await mutation.mutateAsync({ candidateId, payload: {} });
      setInsight(result);
      setCooldown(COOLDOWN_S);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 429) {
        setErrorMsg('⏳ Terlalu banyak permintaan. Coba lagi beberapa saat.');
      } else {
        setErrorMsg('Gagal menghasilkan rekomendasi. Coba lagi nanti.');
      }
      setCooldown(COOLDOWN_S);
    }
  };

  if (!candidateId) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center text-xs text-slate-400">
        Pilih kandidat untuk mendapatkan rekomendasi AI.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-indigo-800 flex items-center gap-1.5">
          <FiZap className="text-indigo-500" />
          Rekomendasi AI
        </h3>
        <button
          onClick={handleGenerate}
          disabled={mutation.isPending || cooldown > 0}
          aria-label="Buat rekomendasi AI"
          className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {mutation.isPending ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Memproses…
            </>
          ) : cooldown > 0 ? (
            <>
              <FiRefreshCw className="text-sm" />
              Tunggu {cooldown}s
            </>
          ) : insight ? (
            <>
              <FiRefreshCw className="text-sm" />
              Buat Ulang
            </>
          ) : (
            <>
              <FiZap className="text-sm" />
              Buat Rekomendasi
            </>
          )}
        </button>
      </div>

      {/* Loading skeleton */}
      {mutation.isPending && (
        <div className="space-y-3 animate-pulse">
          {[80, 60, 70, 50].map((w, i) => (
            <div key={i} className="h-3 bg-indigo-200 rounded" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {/* Error */}
      {errorMsg && !mutation.isPending && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
          <FiAlertCircle className="shrink-0 mt-0.5" />
          {errorMsg}
        </div>
      )}

      {/* Hasil rekomendasi */}
      {insight && !mutation.isPending && (
        <div className="space-y-3">
          {insight.fallback && (
            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
              ⚡ Ringkasan otomatis (tanpa AI — kuota LLM penuh)
            </span>
          )}
          {[
            { key: 'summary', icon: '📊', title: 'Ringkasan' },
            { key: 'opportunities', icon: '🌟', title: 'Peluang' },
            { key: 'risks', icon: '⚠️', title: 'Risiko' },
            { key: 'fieldVerification', icon: '🔍', title: 'Verifikasi Lapangan' },
          ].map(({ key, icon, title }) =>
            insight[key] ? (
              <div key={key} className="bg-white rounded-xl p-3 shadow-sm">
                <p className="text-xs font-bold text-slate-700 mb-1">{icon} {title}</p>
                {/* Render sebagai teks biasa untuk mencegah XSS */}
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{insight[key]}</p>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

AiInsightPanel.propTypes = {
  candidateId: PropTypes.number,
  selectedCandidate: PropTypes.object,
};

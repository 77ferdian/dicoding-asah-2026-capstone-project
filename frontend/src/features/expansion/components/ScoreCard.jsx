/**
 * ScoreCard.jsx
 * Menampilkan skor besar 0-100 beserta label & warna sesuai ketentuan implementasi plan.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { getScoreInfo } from '../utils/scoreLabel';

export default function ScoreCard({ score, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center animate-pulse">
        <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4" />
        <div className="h-4 bg-slate-200 rounded mx-auto w-32" />
      </div>
    );
  }

  if (score == null) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-400 text-sm">
        Pilih kandidat dan klik "Analisis" untuk melihat skor.
      </div>
    );
  }

  const info = getScoreInfo(score);

  return (
    <div className={`rounded-2xl border-2 ${info.borderClass} ${info.bgClass} p-6 text-center`}>
      <div
        className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center border-4 ${info.borderClass} bg-white shadow-md`}
        role="img"
        aria-label={`Skor ${score} dari 100 — ${info.label}`}
      >
        <span className={`text-4xl font-black ${info.textClass}`}>{score}</span>
      </div>
      <p className={`mt-4 text-sm font-black uppercase tracking-wider ${info.textClass}`}>{info.label}</p>
      <p className="text-xs text-slate-500 mt-1">Skor Kelayakan Lokasi (0–100)</p>
    </div>
  );
}

ScoreCard.propTypes = {
  score: PropTypes.number,
  loading: PropTypes.bool,
};

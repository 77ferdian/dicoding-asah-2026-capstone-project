/**
 * ScoreBreakdown.jsx
 * Bar horizontal per komponen skor + bobot. Tooltip singkat per bar.
 */
import React from 'react';
import PropTypes from 'prop-types';

export default function ScoreBreakdown({ breakdown, loading }) {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 bg-slate-100 rounded-lg" />
        ))}
      </div>
    );
  }
  if (!breakdown || breakdown.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Rincian Skor per Komponen</p>
      {breakdown.map((item) => (
        <div key={item.key}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-slate-700" title={`Bobot: ${(item.weight * 100).toFixed(0)}%`}>
              {item.label}
              <span className="ml-1 text-slate-400 text-[10px]">({(item.weight * 100).toFixed(0)}%)</span>
            </span>
            <span className="font-bold text-slate-800">{item.score}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5" role="progressbar" aria-valuenow={item.score} aria-valuemin={0} aria-valuemax={100} aria-label={item.label}>
            <div
              className="h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${item.score}%`,
                backgroundColor: item.score >= 75 ? '#22c55e' : item.score >= 60 ? '#84cc16' : item.score >= 40 ? '#eab308' : '#ef4444',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

ScoreBreakdown.propTypes = {
  breakdown: PropTypes.array,
  loading: PropTypes.bool,
};

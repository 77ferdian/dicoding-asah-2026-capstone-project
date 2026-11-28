/**
 * AspectGapChart.jsx
 * Bar berkelompok: Lintang Bakso vs rata-rata kompetitor sekitar per aspek.
 * Menggunakan Recharts (sudah ada di dashboard).
 * Aspek dengan selisih terbesar mendapat label "Peluang".
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';

export default function AspectGapChart({ aspectGap, loading }) {
  if (loading) {
    return <div className="h-48 bg-slate-100 animate-pulse rounded-xl" />;
  }
  if (!aspectGap || aspectGap.length === 0) return null;

  // Temukan aspek dengan selisih terbesar (peluang)
  const maxGapAspect = aspectGap.reduce((best, cur) => {
    const gap = cur.ours - cur.competitors;
    const bestGap = best.ours - best.competitors;
    return gap > bestGap ? cur : best;
  }, aspectGap[0]);

  const data = aspectGap.map((a) => ({
    name: a.label || a.aspect,
    'Lintang Bakso': Math.round(a.ours * 100),
    Kompetitor: Math.round(a.competitors * 100),
    isOpportunity: a.aspect === maxGapAspect.aspect,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Celah Aspek vs Kompetitor</p>
        {maxGapAspect && (
          <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
            🌟 Peluang: {maxGapAspect.label || maxGapAspect.aspect}
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="Lintang Bakso" fill="#f97316" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.isOpportunity ? '#22c55e' : '#f97316'} />
            ))}
          </Bar>
          <Bar dataKey="Kompetitor" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-slate-400 mt-1">* Nilai = % sentimen positif per aspek. Bar hijau = aspek peluang terbesar.</p>
    </div>
  );
}

AspectGapChart.propTypes = {
  aspectGap: PropTypes.array,
  loading: PropTypes.bool,
};

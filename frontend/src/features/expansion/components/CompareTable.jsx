/**
 * CompareTable.jsx
 * Tabel perbandingan 2-5 kandidat. Baris = komponen skor, kolom = kandidat.
 * Sorot nilai tertinggi per baris. Scroll horizontal di mobile.
 */
import React from 'react';
import PropTypes from 'prop-types';

export default function CompareTable({ compareData, loading }) {
  if (loading) {
    return <div className="h-40 bg-slate-100 animate-pulse rounded-xl" />;
  }
  if (!compareData || compareData.length < 2) {
    return (
      <div className="text-center py-8 text-slate-400 text-xs">
        Centang minimal 2 kandidat di panel kiri untuk membandingkan.
      </div>
    );
  }

  // Kumpulkan semua komponen skor dari data pertama yang tersedia
  const components = compareData[0]?.analysis?.breakdown ?? [];

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-xs" aria-label="Tabel perbandingan kandidat">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-4 py-3 font-bold text-slate-600 whitespace-nowrap">Komponen Skor</th>
            {compareData.map((d) => (
              <th key={d.candidate.id} className="px-4 py-3 text-center font-bold text-indigo-700 whitespace-nowrap">
                📍 {d.candidate.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Baris skor total */}
          <tr className="bg-indigo-50 border-b border-indigo-100">
            <td className="px-4 py-3 font-black text-slate-700">🏆 Skor Total</td>
            {compareData.map((d) => {
              const scores = compareData.map((x) => x.analysis?.totalScore ?? 0);
              const isMax = d.analysis?.totalScore === Math.max(...scores);
              return (
                <td key={d.candidate.id} className={`px-4 py-3 text-center font-black text-lg ${isMax ? 'text-green-600' : 'text-slate-700'}`}>
                  {d.analysis?.totalScore ?? '—'}
                  {isMax && <span className="ml-1 text-xs">🥇</span>}
                </td>
              );
            })}
          </tr>

          {/* Baris per komponen */}
          {components.map((comp) => {
            const scores = compareData.map((d) => {
              const c = d.analysis?.breakdown?.find((b) => b.key === comp.key);
              return c?.score ?? 0;
            });
            const max = Math.max(...scores);

            return (
              <tr key={comp.key} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-600 font-medium">
                  {comp.label}
                  <span className="text-slate-400 text-[10px] ml-1">({(comp.weight * 100).toFixed(0)}%)</span>
                </td>
                {compareData.map((d) => {
                  const c = d.analysis?.breakdown?.find((b) => b.key === comp.key);
                  const val = c?.score ?? '—';
                  const isMax = typeof val === 'number' && val === max;
                  return (
                    <td key={d.candidate.id} className={`px-4 py-3 text-center font-semibold ${isMax ? 'text-green-600 font-bold' : 'text-slate-600'}`}>
                      {val}
                      {isMax && <span className="ml-1">↑</span>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

CompareTable.propTypes = {
  compareData: PropTypes.array,
  loading: PropTypes.bool,
};

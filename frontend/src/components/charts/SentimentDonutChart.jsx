import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useLocale } from '../../contexts/LocaleContext';

export default function SentimentDonutChart({ summary }) {
  const { t } = useLocale();

  const positive = summary?.positive || 0;
  const negative = summary?.negative || 0;
  const total = summary?.totalReviews || positive + negative;
  const positiveRatio = total > 0 ? ((positive / total) * 100).toFixed(1) : 0;

  const data = [
    { name: t.positiveSentiment, value: positive, color: '#10b981' }, // emerald-500
    { name: t.negativeSentiment, value: negative, color: '#f43f5e' }, // rose-500
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg">
          <p className="font-bold">{item.name}</p>
          <p className="text-slate-300">
            {item.value} ulasan ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-900">{t.overallRatio}</h3>
        <p className="text-xs text-slate-500 mt-1">Proporsi sentimen ulasan pelanggan Google Maps</p>
      </div>

      <div className="h-64 relative my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-7">
          <span className="text-2xl font-black text-slate-800 tracking-tight">{positiveRatio}%</span>
          <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">{t.positiveSentiment}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-center">
        <div className="p-2 rounded-xl bg-emerald-50/60">
          <span className="text-xs text-slate-500 font-medium">Total Positif</span>
          <p className="text-base font-bold text-emerald-700">{positive}</p>
        </div>
        <div className="p-2 rounded-xl bg-rose-50/60">
          <span className="text-xs text-slate-500 font-medium">Total Negatif</span>
          <p className="text-base font-bold text-rose-700">{negative}</p>
        </div>
      </div>
    </div>
  );
}

SentimentDonutChart.propTypes = {
  summary: PropTypes.shape({
    totalReviews: PropTypes.number,
    positive: PropTypes.number,
    negative: PropTypes.number,
  }),
};

import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useLocale } from '../../contexts/LocaleContext';

export default function CompetitorBarChart({ mainBusiness, competitors = [] }) {
  const { t } = useLocale();

  const allBusinesses = [
    { ...mainBusiness, isMain: true },
    ...competitors.map((c) => ({ ...c, isMain: false })),
  ];

  const chartData = allBusinesses.map((b) => ({
    name: b.name,
    positiveRatio: b.positivePercentage || 0,
    rating: b.rating || 0,
    totalReviews: b.totalReviews || 0,
    isMain: b.isMain,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-lg space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            {data.name} {data.isMain && <span className="text-[10px] text-orange-400 font-semibold">(Lintang Bakso)</span>}
          </p>
          <p className="text-emerald-400">● Kepuasan Positif: {data.positiveRatio}%</p>
          <p className="text-amber-400">★ Rating Google Maps: {data.rating} / 5.0</p>
          <p className="text-slate-300">Total Ulasan: {data.totalReviews}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">Perbandingan Rasio Kepuasan Pelanggan (%)</h3>
        <p className="text-xs text-slate-500 mt-1">Persentase ulasan bernada positif dibandingkan kompetitor kuliner sejenis</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            barCategoryGap={18}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis
              type="number"
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              unit="%"
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={120}
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="positiveRatio" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isMain ? '#ea580c' : '#3b82f6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-xs font-semibold text-slate-600">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-600 inline-block"></span>
          Lintang Bakso (Bisnis Anda)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
          Kompetitor Sekitar
        </span>
      </div>
    </div>
  );
}

CompetitorBarChart.propTypes = {
  mainBusiness: PropTypes.object,
  competitors: PropTypes.array,
};

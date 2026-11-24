import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useLocale } from '../../contexts/LocaleContext';

export default function AspectBarChart({ aspectBreakdown }) {
  const { t } = useLocale();

  const aspectNames = {
    rasa: t.aspectRasa,
    harga: t.aspectHarga,
    pelayanan: t.aspectPelayanan,
    tempat: t.aspectTempat,
  };

  const data = Object.keys(aspectNames).map((key) => {
    const item = aspectBreakdown?.[key] || { positive: 0, negative: 0, total: 0 };
    return {
      aspectKey: key,
      aspect: aspectNames[key],
      positive: item.positive,
      negative: item.negative,
      total: item.total || item.positive + item.negative,
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-lg space-y-1">
          <p className="font-bold text-slate-100">{label}</p>
          <p className="text-emerald-400 font-medium">● Positif: {payload[0]?.value} ulasan</p>
          <p className="text-rose-400 font-medium">● Negatif: {payload[1]?.value} ulasan</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">{t.aspectBreakdown}</h3>
          <p className="text-xs text-slate-500 mt-1">Perbandingan ulasan positif vs negatif pada 4 pilar utama</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
            barCategoryGap={24}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="aspect"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
            />
            <Bar
              name={t.positiveSentiment}
              dataKey="positive"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              name={t.negativeSentiment}
              dataKey="negative"
              fill="#f43f5e"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>💡 Aspek <strong className="text-slate-700">Rasa</strong> memiliki sentimen positif tertinggi (88.9%).</span>
      </div>
    </div>
  );
}

AspectBarChart.propTypes = {
  aspectBreakdown: PropTypes.object,
};

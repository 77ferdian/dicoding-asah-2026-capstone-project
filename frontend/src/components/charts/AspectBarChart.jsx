import React, { useEffect, useState } from 'react';
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

export default function AspectBarChart({ aspectBreakdown, timeSeries }) {
  const { t } = useLocale();
  const [granularity, setGranularity] = useState('monthly');
  const [selectedAspect, setSelectedAspect] = useState('rasa');
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [selectedYear, setSelectedYear] = useState('2026');

  const aspectNames = {
    rasa: t.aspectRasa,
    harga: t.aspectHarga,
    pelayanan: t.aspectPelayanan,
    tempat: t.aspectTempat,
  };

  const formatMonthLabel = (period) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const match = String(period).match(/^(\d{4})-(\d{2})$/);
    if (match) {
      const monthIndex = Number(match[2]) - 1;
      return `${monthNames[monthIndex]} ${match[1]}`;
    }
    return String(period);
  };

  const getMonthKey = (period) => {
    const isoMatch = String(period).match(/^(\d{4})-(\d{2})$/);
    if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}`;

    const monthMap = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04',
      Mei: '05', Jun: '06', Jul: '07', Ags: '08',
      Sep: '09', Okt: '10', Nov: '11', Des: '12',
    };
    const match = String(period).match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (match) return `${match[2]}-${monthMap[match[1]] || '01'}`;
    return '';
  };

  const summaryData = Object.keys(aspectNames).map((key) => {
    const item = aspectBreakdown?.[key] || { positive: 0, negative: 0, total: 0 };
    return {
      aspectKey: key,
      aspect: aspectNames[key],
      positive: item.positive,
      negative: item.negative,
      total: item.total || item.positive + item.negative,
    };
  });
  const selectedSummary = summaryData.find((item) => item.aspectKey === selectedAspect);
  const selectedPercentage = selectedSummary?.total
    ? ((selectedSummary.positive / selectedSummary.total) * 100).toFixed(1)
    : '0.0';

  const fallbackData = {
    daily: [
      { period: '2026-11-01', rasaPositive: 6, rasaNegative: 1, hargaPositive: 4, hargaNegative: 2, pelayananPositive: 3, pelayananNegative: 3, tempatPositive: 2, tempatNegative: 2 },
      { period: '2026-11-02', rasaPositive: 7, rasaNegative: 2, hargaPositive: 5, hargaNegative: 2, pelayananPositive: 4, pelayananNegative: 3, tempatPositive: 3, tempatNegative: 2 },
      { period: '2026-11-03', rasaPositive: 8, rasaNegative: 1, hargaPositive: 5, hargaNegative: 3, pelayananPositive: 4, pelayananNegative: 4, tempatPositive: 3, tempatNegative: 1 },
      { period: '2026-11-04', rasaPositive: 7, rasaNegative: 2, hargaPositive: 6, hargaNegative: 2, pelayananPositive: 5, pelayananNegative: 3, tempatPositive: 4, tempatNegative: 2 },
      { period: '2026-11-05', rasaPositive: 9, rasaNegative: 1, hargaPositive: 6, hargaNegative: 3, pelayananPositive: 5, pelayananNegative: 4, tempatPositive: 3, tempatNegative: 2 },
      { period: '2026-11-06', rasaPositive: 8, rasaNegative: 2, hargaPositive: 7, hargaNegative: 3, pelayananPositive: 4, pelayananNegative: 4, tempatPositive: 4, tempatNegative: 3 },
      { period: '2026-11-07', rasaPositive: 10, rasaNegative: 1, hargaPositive: 6, hargaNegative: 4, pelayananPositive: 5, pelayananNegative: 3, tempatPositive: 4, tempatNegative: 2 },
      { period: '2026-11-08', rasaPositive: 9, rasaNegative: 2, hargaPositive: 7, hargaNegative: 3, pelayananPositive: 6, pelayananNegative: 4, tempatPositive: 5, tempatNegative: 2 },
      { period: '2026-11-09', rasaPositive: 11, rasaNegative: 1, hargaPositive: 7, hargaNegative: 4, pelayananPositive: 6, pelayananNegative: 5, tempatPositive: 4, tempatNegative: 3 },
      { period: '2026-11-10', rasaPositive: 10, rasaNegative: 2, hargaPositive: 8, hargaNegative: 3, pelayananPositive: 5, pelayananNegative: 4, tempatPositive: 5, tempatNegative: 2 },
      { period: '2026-11-11', rasaPositive: 12, rasaNegative: 1, hargaPositive: 8, hargaNegative: 4, pelayananPositive: 7, pelayananNegative: 4, tempatPositive: 5, tempatNegative: 3 },
      { period: '2026-11-12', rasaPositive: 11, rasaNegative: 2, hargaPositive: 7, hargaNegative: 4, pelayananPositive: 6, pelayananNegative: 5, tempatPositive: 4, tempatNegative: 2 },
      { period: '2026-11-13', rasaPositive: 12, rasaNegative: 1, hargaPositive: 9, hargaNegative: 3, pelayananPositive: 7, pelayananNegative: 4, tempatPositive: 6, tempatNegative: 2 },
      { period: '2026-11-14', rasaPositive: 13, rasaNegative: 2, hargaPositive: 8, hargaNegative: 4, pelayananPositive: 6, pelayananNegative: 5, tempatPositive: 5, tempatNegative: 3 },
      { period: '2026-11-15', rasaPositive: 8, rasaNegative: 2, hargaPositive: 5, hargaNegative: 3, pelayananPositive: 4, pelayananNegative: 4, tempatPositive: 3, tempatNegative: 2 },
      { period: '2026-11-16', rasaPositive: 10, rasaNegative: 1, hargaPositive: 6, hargaNegative: 3, pelayananPositive: 5, pelayananNegative: 3, tempatPositive: 4, tempatNegative: 2 },
      { period: '2026-11-17', rasaPositive: 9, rasaNegative: 2, hargaPositive: 7, hargaNegative: 2, pelayananPositive: 5, pelayananNegative: 4, tempatPositive: 3, tempatNegative: 3 },
      { period: '2026-11-18', rasaPositive: 11, rasaNegative: 1, hargaPositive: 6, hargaNegative: 4, pelayananPositive: 6, pelayananNegative: 3, tempatPositive: 4, tempatNegative: 2 },
      { period: '2026-11-19', rasaPositive: 12, rasaNegative: 2, hargaPositive: 8, hargaNegative: 3, pelayananPositive: 7, pelayananNegative: 4, tempatPositive: 5, tempatNegative: 2 },
      { period: '2026-11-20', rasaPositive: 10, rasaNegative: 1, hargaPositive: 7, hargaNegative: 4, pelayananPositive: 6, pelayananNegative: 5, tempatPositive: 4, tempatNegative: 3 },
      { period: '2026-11-21', rasaPositive: 13, rasaNegative: 1, hargaPositive: 9, hargaNegative: 3, pelayananPositive: 7, pelayananNegative: 3, tempatPositive: 6, tempatNegative: 2 },
      { period: '2026-11-22', rasaPositive: 12, rasaNegative: 2, hargaPositive: 8, hargaNegative: 4, pelayananPositive: 8, pelayananNegative: 4, tempatPositive: 5, tempatNegative: 3 },
      { period: '2026-11-23', rasaPositive: 14, rasaNegative: 1, hargaPositive: 9, hargaNegative: 3, pelayananPositive: 7, pelayananNegative: 5, tempatPositive: 6, tempatNegative: 2 },
      { period: '2026-11-24', rasaPositive: 13, rasaNegative: 2, hargaPositive: 8, hargaNegative: 5, pelayananPositive: 8, pelayananNegative: 4, tempatPositive: 5, tempatNegative: 3 },
      { period: '2026-11-25', rasaPositive: 15, rasaNegative: 1, hargaPositive: 10, hargaNegative: 4, pelayananPositive: 8, pelayananNegative: 5, tempatPositive: 6, tempatNegative: 2 },
      { period: '2026-11-26', rasaPositive: 14, rasaNegative: 2, hargaPositive: 9, hargaNegative: 4, pelayananPositive: 7, pelayananNegative: 6, tempatPositive: 6, tempatNegative: 3 },
      { period: '2026-11-27', rasaPositive: 16, rasaNegative: 1, hargaPositive: 10, hargaNegative: 5, pelayananPositive: 9, pelayananNegative: 4, tempatPositive: 7, tempatNegative: 2 },
      { period: '2026-11-28', rasaPositive: 15, rasaNegative: 2, hargaPositive: 9, hargaNegative: 4, pelayananPositive: 8, pelayananNegative: 5, tempatPositive: 6, tempatNegative: 3 },
      { period: '2026-11-29', rasaPositive: 14, rasaNegative: 1, hargaPositive: 10, hargaNegative: 4, pelayananPositive: 9, pelayananNegative: 5, tempatPositive: 7, tempatNegative: 2 },
      { period: '2026-11-30', rasaPositive: 16, rasaNegative: 2, hargaPositive: 11, hargaNegative: 5, pelayananPositive: 9, pelayananNegative: 6, tempatPositive: 7, tempatNegative: 3 },
    ],
    monthly: [
      { period: 'Jun 2026', rasaPositive: 96, rasaNegative: 12, hargaPositive: 62, hargaNegative: 28, pelayananPositive: 51, pelayananNegative: 38, tempatPositive: 38, tempatNegative: 24 },
      { period: 'Jul 2026', rasaPositive: 104, rasaNegative: 14, hargaPositive: 68, hargaNegative: 31, pelayananPositive: 55, pelayananNegative: 42, tempatPositive: 41, tempatNegative: 27 },
      { period: 'Aug 2026', rasaPositive: 112, rasaNegative: 13, hargaPositive: 72, hargaNegative: 35, pelayananPositive: 59, pelayananNegative: 45, tempatPositive: 44, tempatNegative: 29 },
      { period: 'Sep 2026', rasaPositive: 108, rasaNegative: 16, hargaPositive: 75, hargaNegative: 33, pelayananPositive: 61, pelayananNegative: 43, tempatPositive: 46, tempatNegative: 28 },
      { period: 'Oct 2026', rasaPositive: 116, rasaNegative: 14, hargaPositive: 78, hargaNegative: 36, pelayananPositive: 63, pelayananNegative: 47, tempatPositive: 48, tempatNegative: 30 },
      { period: 'Nov 2026', rasaPositive: 120, rasaNegative: 15, hargaPositive: 80, hargaNegative: 40, pelayananPositive: 65, pelayananNegative: 50, tempatPositive: 50, tempatNegative: 30 },
    ],
  };

  const periodData = granularity === 'monthly'
    ? (timeSeries?.monthly || fallbackData.monthly)
    : (timeSeries?.daily || fallbackData.daily);

  const monthlySource = timeSeries?.monthly || fallbackData.monthly;
  const yearOptions = [...new Set(monthlySource
    .map((item) => getMonthKey(item.period).slice(0, 4))
    .filter(Boolean))].sort();

  const monthOptions = [...new Set(
    (timeSeries?.daily || fallbackData.daily)
      .map((item) => String(item.period).slice(0, 7))
      .filter((month) => /^\d{4}-\d{2}/.test(month))
  )].sort();

  useEffect(() => {
    if (yearOptions.length && !yearOptions.includes(selectedYear)) {
      setSelectedYear(yearOptions[yearOptions.length - 1]);
    }
  }, [yearOptions.join(','), selectedYear]);

  const filteredMonthlyData = granularity === 'monthly'
    ? periodData.filter((item) => getMonthKey(item.period).startsWith(selectedYear))
    : [];

  const filteredPeriodData = granularity === 'daily'
    ? periodData.filter((item) => String(item.period).startsWith(selectedMonth))
    : filteredMonthlyData;

  let chartData;
  if (granularity === 'daily') {
    const [year, month] = selectedMonth.split('-').map(Number);
    const dayCount = year && month
      ? new Date(year, month, 0).getDate()
      : 0;
    chartData = Array.from({ length: dayCount }, (_, index) => {
      const day = String(index + 1).padStart(2, '0');
      const date = `${selectedMonth}-${day}`;
      const item = filteredPeriodData.find((period) =>
        String(period.period).slice(0, 10) === date
      );
      return {
        period: day,
        positive: item?.[`${selectedAspect}Positive`] || 0,
        negative: item?.[`${selectedAspect}Negative`] || 0,
      };
    });
  } else {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    chartData = monthNames.map((monthName, index) => {
      const monthKey = `${selectedYear}-${String(index + 1).padStart(2, '0')}`;
      const item = filteredPeriodData.find((entry) => getMonthKey(entry.period) === monthKey);
      return {
        period: monthName,
        monthKey,
        positive: item?.[`${selectedAspect}Positive`] || 0,
        negative: item?.[`${selectedAspect}Negative`] || 0,
      };
    });
  }

  const handleChartClick = (state) => {
    if (granularity !== 'monthly' || !state?.activePayload?.length) return;

    const monthKey = state.activePayload[0]?.payload?.monthKey;
    if (!monthKey) return;

    setSelectedMonth(monthKey);
    setGranularity('daily');
  };

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
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">{t.aspectBreakdown}</h3>
          <p className="text-xs text-slate-500 mt-1">Sentimen ulasan berdasarkan waktu dan aspek</p>
          {granularity === 'monthly' && (
            <p className="text-[11px] text-orange-600 mt-1 font-medium">
              Klik salah satu bulan untuk melihat detail harian
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {granularity === 'daily' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              min={monthOptions[0]}
              max={monthOptions[monthOptions.length - 1]}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              title="Pilih bulan"
            />
          )}
          <select
            value={selectedAspect}
            onChange={(e) => setSelectedAspect(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            {Object.keys(aspectNames).map((key) => (
              <option key={key} value={key}>{aspectNames[key]}</option>
            ))}
          </select>
          <div className="flex rounded-lg bg-slate-100 p-1">
            {granularity === 'daily' && (
              <button
                type="button"
                onClick={() => setGranularity('monthly')}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-600 hover:text-slate-900 transition"
              >
                ← Bulanan
              </button>
            )}
            <button
              type="button"
              onClick={() => setGranularity('daily')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${granularity === 'daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              Harian
            </button>
            <button
              type="button"
              onClick={() => setGranularity('monthly')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${granularity === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              Bulanan
            </button>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 10, left: -20, bottom: granularity === 'monthly' ? 18 : 5 }}
            barCategoryGap={granularity === 'monthly' ? 18 : 28}
            barGap={granularity === 'monthly' ? 4 : 3}
            onClick={handleChartClick}
            className={granularity === 'monthly' ? 'cursor-pointer' : ''}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              interval={0}
              minTickGap={granularity === 'daily' ? 8 : 0}
              tick={{ fill: '#64748b', fontSize: granularity === 'monthly' ? 11 : 10, fontWeight: 600 }}
              angle={granularity === 'monthly' ? -25 : 0}
              textAnchor={granularity === 'monthly' ? 'end' : 'middle'}
              height={granularity === 'monthly' ? 52 : 28}
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
        <span>
          💡 Aspek <strong className="text-slate-700">{aspectNames[selectedAspect]}</strong>
          {' '}memiliki sentimen positif <strong className="text-slate-700">{selectedPercentage}%</strong>.
        </span>
      </div>
    </div>
  );
}

AspectBarChart.propTypes = {
  aspectBreakdown: PropTypes.object,
  timeSeries: PropTypes.shape({
    daily: PropTypes.array,
    monthly: PropTypes.array,
  }),
};

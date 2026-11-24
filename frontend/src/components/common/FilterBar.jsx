import React from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiRotateCcw, FiCalendar } from 'react-icons/fi';
import { useLocale } from '../../contexts/LocaleContext';

export default function FilterBar({ onReset }) {
  const { t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();

  const aspect = searchParams.get('aspect') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const handleAspectChange = (e) => {
    const val = e.target.value;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) next.set('aspect', val);
      else next.delete('aspect');
      return next;
    });
  };

  const handleDateChange = (key, val) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) next.set(key, val);
      else next.delete(key);
      return next;
    });
  };

  const handleReset = () => {
    setSearchParams({});
    if (onReset) onReset();
  };

  const hasFilter = Boolean(aspect || startDate || endDate);

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
        <FiFilter className="text-orange-500 text-base" />
        <span>Filter Data:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Dropdown Aspek */}
        <select
          value={aspect}
          onChange={handleAspectChange}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition cursor-pointer"
        >
          <option value="">🎯 {t.allAspects}</option>
          <option value="rasa">🍜 {t.aspectRasa}</option>
          <option value="harga">💰 {t.aspectHarga}</option>
          <option value="pelayanan">🤝 {t.aspectPelayanan}</option>
          <option value="tempat">📍 {t.aspectTempat}</option>
        </select>

        {/* Date Inputs */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
          <FiCalendar className="text-slate-400 text-xs" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none"
            title="Start Date"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none"
            title="End Date"
          />
        </div>

        {/* Reset Button */}
        {hasFilter && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <FiRotateCcw className="text-xs" />
            <span>{t.resetFilter}</span>
          </button>
        )}
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  onReset: PropTypes.func,
};

/**
 * RadiusSelector.jsx
 * Tombol pilihan radius: 500 m / 1 km / 2 km.
 */
import React from 'react';
import PropTypes from 'prop-types';

const OPTIONS = [
  { value: 500, label: '500 m' },
  { value: 1000, label: '1 km' },
  { value: 2000, label: '2 km' },
];

export default function RadiusSelector({ radius, onChange }) {
  return (
    <div>
      <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Radius Analisis</p>
      <div className="flex gap-2" role="group" aria-label="Pilih radius analisis">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={radius === o.value}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
              radius === o.value
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/30'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

RadiusSelector.propTypes = {
  radius: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

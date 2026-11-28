/**
 * CandidateSearch.jsx
 * Input pencarian alamat dengan debounce 400ms.
 * Memanggil geocodeAddress dari expansionApi (dengan mock fallback).
 */
import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FiSearch, FiMapPin, FiX } from 'react-icons/fi';
import { geocodeAddress } from '../api/expansionApi';

export default function CandidateSearch({ onSelectLocation, candidateCount, maxCandidates }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const search = useCallback((q) => {
    clearTimeout(debounceRef.current);
    if (!q.trim() || q.length < 3) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await geocodeAddress(q);
        setResults(data.slice(0, 5));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  const handleChange = (e) => {
    setQuery(e.target.value);
    search(e.target.value);
  };

  const handleSelect = (item) => {
    onSelectLocation(item);
    setQuery('');
    setResults([]);
  };

  const isFull = candidateCount >= maxCandidates;

  return (
    <div className="relative">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Cari alamat di Surabaya…"
          maxLength={150}
          disabled={isFull}
          aria-label="Cari alamat kandidat lokasi cabang baru"
          className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 transition"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); }}
            aria-label="Hapus pencarian"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <FiX className="text-sm" />
          </button>
        )}
      </div>

      {isFull && (
        <p className="mt-1.5 text-xs text-amber-600 font-medium">
          ⚠️ Maksimal {maxCandidates} kandidat. Hapus salah satu untuk menambah.
        </p>
      )}

      {/* Dropdown hasil */}
      {(loading || results.length > 0) && !isFull && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          {loading && (
            <div className="px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              Mencari lokasi…
            </div>
          )}
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-xs flex items-start gap-2 border-b border-slate-100 last:border-0 transition-colors"
            >
              <FiMapPin className="text-indigo-500 shrink-0 mt-0.5" />
              <span className="text-slate-700">{r.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

CandidateSearch.propTypes = {
  onSelectLocation: PropTypes.func.isRequired,
  candidateCount: PropTypes.number.isRequired,
  maxCandidates: PropTypes.number.isRequired,
};

/**
 * CandidateList.jsx
 * Daftar kandidat lokasi cabang. Mendukung seleksi, hapus, dan checkbox untuk perbandingan.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FiMapPin, FiTrash2, FiCheckSquare, FiSquare } from 'react-icons/fi';

export default function CandidateList({
  candidates,
  selectedId,
  compareIds,
  onSelect,
  onDelete,
  onToggleCompare,
  loading,
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <FiMapPin className="mx-auto text-3xl mb-2 text-indigo-200" />
        <p className="text-xs font-medium">Belum ada kandidat lokasi.</p>
        <p className="text-xs mt-1">Klik peta atau cari alamat untuk menambahkan.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2" role="list" aria-label="Daftar kandidat lokasi">
      {candidates.map((c) => {
        const isSelected = c.id === selectedId;
        const inCompare = compareIds.includes(c.id);
        return (
          <li
            key={c.id}
            className={`rounded-xl border p-3 transition-all ${
              isSelected
                ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-indigo-300'
            }`}
          >
            <div className="flex items-start gap-2">
              {/* Checkbox perbandingan */}
              <button
                onClick={() => onToggleCompare(c.id)}
                aria-label={inCompare ? 'Hapus dari perbandingan' : 'Tambah ke perbandingan'}
                className="mt-0.5 shrink-0 text-indigo-500"
              >
                {inCompare ? <FiCheckSquare className="text-base" /> : <FiSquare className="text-base text-slate-400" />}
              </button>

              {/* Nama & aksi */}
              <button
                className="flex-1 text-left min-w-0"
                onClick={() => onSelect(c.id)}
                aria-pressed={isSelected}
              >
                <p className={`text-xs font-semibold truncate ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                  <FiMapPin className="inline mr-1 text-indigo-400" />
                  {c.label}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                </p>
              </button>

              {/* Hapus */}
              <button
                onClick={() => onDelete(c.id)}
                aria-label={`Hapus kandidat ${c.label}`}
                className="shrink-0 p-1 text-slate-400 hover:text-red-500 transition-colors"
              >
                <FiTrash2 className="text-sm" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

CandidateList.propTypes = {
  candidates: PropTypes.array,
  selectedId: PropTypes.number,
  compareIds: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleCompare: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

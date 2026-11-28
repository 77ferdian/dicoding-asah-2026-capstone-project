/**
 * Disclaimer.jsx
 * Pesan peringatan bahwa skor adalah alat bantu, bukan jaminan hasil.
 */
import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export default function Disclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
      <FiAlertTriangle className="shrink-0 mt-0.5 text-amber-500" />
      <span>
        <strong>Disclaimer:</strong> Skor ini merupakan alat bantu berbasis data publik dan tidak menjamin hasil bisnis. Lakukan <strong>survei lapangan</strong> sebelum mengambil keputusan ekspansi.
      </span>
    </div>
  );
}

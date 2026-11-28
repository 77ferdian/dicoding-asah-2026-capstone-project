/**
 * scoreLabel.js
 * Mengonversi angka skor (0-100) menjadi label teks & kelas warna Tailwind.
 */

export const SCORE_RANGES = [
  { min: 75, label: 'Sangat Potensial', labelEn: 'Highly Potential', color: 'green', bgClass: 'bg-green-100', textClass: 'text-green-700', borderClass: 'border-green-400', barClass: 'bg-green-500' },
  { min: 60, label: 'Potensial', labelEn: 'Potential', color: 'lime', bgClass: 'bg-lime-100', textClass: 'text-lime-700', borderClass: 'border-lime-400', barClass: 'bg-lime-500' },
  { min: 40, label: 'Perlu Pertimbangan', labelEn: 'Needs Consideration', color: 'yellow', bgClass: 'bg-yellow-100', textClass: 'text-yellow-700', borderClass: 'border-yellow-400', barClass: 'bg-yellow-500' },
  { min: 0, label: 'Kurang Disarankan', labelEn: 'Not Recommended', color: 'red', bgClass: 'bg-red-100', textClass: 'text-red-700', borderClass: 'border-red-400', barClass: 'bg-red-500' },
];

export function getScoreInfo(score) {
  for (const range of SCORE_RANGES) {
    if (score >= range.min) return { ...range, score };
  }
  return { ...SCORE_RANGES[SCORE_RANGES.length - 1], score };
}

/**
 * format.js — helper formatting angka dan teks untuk fitur Ekspansi Cabang
 */

export function formatDistance(meters) {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

export function formatRadius(meters) {
  if (meters >= 1000) return `${meters / 1000} km`;
  return `${meters} m`;
}

export function formatPercent(value, digits = 0) {
  return `${(value * 100).toFixed(digits)}%`;
}

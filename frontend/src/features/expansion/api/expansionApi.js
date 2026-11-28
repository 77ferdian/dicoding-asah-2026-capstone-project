/**
 * expansionApi.js
 * Semua pemanggilan endpoint fitur Ekspansi Cabang.
 * Menggunakan instance axios yang sudah ada di utils/api.js.
 * Jika backend belum siap, semua fungsi otomatis jatuh ke mock data.
 */
import api from '../../../utils/api';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_MAP_DATA = {
  mainBusiness: { id: 'lb-main', name: 'Lintang Bakso (Pusat)', lat: -7.2575, lng: 112.7521, rating: 4.5, reviewCount: 312 },
  existingBranches: [],
  competitors: [
    { id: 'c1', name: 'Bakso Malang Cak Eko', lat: -7.2620, lng: 112.7480, rating: 4.1, reviewCount: 189, distanceM: 620 },
    { id: 'c2', name: 'Bakso Solo Pak Budi', lat: -7.2530, lng: 112.7570, rating: 4.3, reviewCount: 274, distanceM: 480 },
    { id: 'c3', name: 'Warung Bakso Pak Jarwo', lat: -7.2600, lng: 112.7560, rating: 3.7, reviewCount: 95, distanceM: 740 },
    { id: 'c4', name: 'Bakso Bakar Surabaya', lat: -7.2510, lng: 112.7490, rating: 4.0, reviewCount: 143, distanceM: 550 },
  ],
};

const MOCK_CANDIDATES = [
  { id: 1, label: 'Jl. Gubeng Raya No. 10', lat: -7.2650, lng: 112.7510, addedAt: '2026-11-24T10:00:00Z' },
  { id: 2, label: 'Jl. Raya Darmo No. 45', lat: -7.2700, lng: 112.7340, addedAt: '2026-11-24T11:00:00Z' },
];

let mockCandidates = [...MOCK_CANDIDATES];
let nextId = 3;

function mockAnalysis(candidateId, radius) {
  const scores = { 1: 72, 2: 55 };
  const base = scores[candidateId] || Math.floor(50 + Math.random() * 30);
  return {
    candidateId,
    radius,
    totalScore: base,
    label: base >= 75 ? 'Sangat Potensial' : base >= 60 ? 'Potensial' : base >= 40 ? 'Perlu Pertimbangan' : 'Kurang Disarankan',
    breakdown: [
      { key: 'demand', label: 'Potensi permintaan', score: Math.min(100, base + 13), weight: 0.30 },
      { key: 'competitorPressure', label: 'Tekanan kompetitor', score: Math.max(0, base - 12), weight: 0.20 },
      { key: 'accessibility', label: 'Aksesibilitas lokasi', score: Math.min(100, base + 5), weight: 0.20 },
      { key: 'demographicMatch', label: 'Kecocokan demografi', score: Math.min(100, base + 8), weight: 0.15 },
      { key: 'marketGap', label: 'Celah pasar', score: Math.min(100, base + 2), weight: 0.15 },
    ],
    aspectGap: [
      { aspect: 'rasa', label: 'Rasa', ours: 0.82, competitors: 0.61 },
      { aspect: 'harga', label: 'Harga', ours: 0.74, competitors: 0.78 },
      { aspect: 'pelayanan', label: 'Pelayanan', ours: 0.78, competitors: 0.52 },
      { aspect: 'tempat', label: 'Tempat', ours: 0.65, competitors: 0.70 },
    ],
    nearbyCompetitors: MOCK_MAP_DATA.competitors.filter((c) => c.distanceM <= radius),
  };
}

function mockInsight(candidateId) {
  return {
    candidateId,
    fallback: false,
    summary: 'Lokasi kandidat ini memiliki potensi pasar yang baik berdasarkan kepadatan populasi dan rendahnya tekanan kompetitor di radius yang dipilih.',
    opportunities: 'Aspek pelayanan Lintang Bakso jauh lebih unggul dari kompetitor sekitar. Ini dapat menjadi diferensiasi kuat untuk menarik pelanggan baru.',
    risks: 'Harga rata-rata kompetitor di area ini sedikit lebih rendah. Perlu strategi harga atau porsi yang kompetitif.',
    fieldVerification: 'Lakukan kunjungan lapangan untuk memverifikasi kepadatan pejalan kaki pada jam makan siang dan malam hari, serta ketersediaan parkir.',
  };
}

// ─── API Functions ────────────────────────────────────────────────────────────

async function safeGet(url, mockFn) {
  try {
    const res = await api.get(url);
    return res.data?.data ?? res.data;
  } catch {
    return mockFn();
  }
}

export async function getMapData() {
  return safeGet('/expansion/map-data', () => MOCK_MAP_DATA);
}

export async function listCandidates() {
  return safeGet('/expansion/candidates', () => [...mockCandidates]);
}

export async function addCandidate(body) {
  try {
    const res = await api.post('/expansion/candidates', body);
    return res.data?.data ?? res.data;
  } catch {
    const newC = { id: nextId++, ...body, addedAt: new Date().toISOString() };
    mockCandidates.push(newC);
    return newC;
  }
}

export async function deleteCandidate(id) {
  try {
    const res = await api.delete(`/expansion/candidates/${id}`);
    return res.data;
  } catch {
    mockCandidates = mockCandidates.filter((c) => c.id !== id);
    return { status: 'success' };
  }
}

export async function analyzeCandidate(id, body) {
  try {
    const res = await api.post(`/expansion/candidates/${id}/analyze`, body);
    return res.data?.data ?? res.data;
  } catch {
    await new Promise((r) => setTimeout(r, 600));
    return mockAnalysis(id, body.radius ?? 1000);
  }
}

export async function compareCandidates(ids) {
  try {
    const res = await api.get(`/expansion/compare?ids=${ids.join(',')}`);
    return res.data?.data ?? res.data;
  } catch {
    return ids.map((id) => ({
      candidate: mockCandidates.find((c) => c.id === id) ?? { id, label: `Kandidat ${id}` },
      analysis: mockAnalysis(id, 1000),
    }));
  }
}

export async function generateInsight(id, body) {
  try {
    const res = await api.post(`/expansion/candidates/${id}/insight`, body);
    return res.data?.data ?? res.data;
  } catch {
    await new Promise((r) => setTimeout(r, 1200));
    return mockInsight(id);
  }
}

export async function geocodeAddress(q) {
  try {
    const res = await api.get('/expansion/geocode', { params: { q } });
    return res.data?.data ?? res.data;
  } catch {
    // Fallback: simulasi 3 hasil geocoding mock
    await new Promise((r) => setTimeout(r, 300));
    return [
      { label: `${q} — Jl. Gubeng, Surabaya`, lat: -7.265 + Math.random() * 0.01, lng: 112.751 + Math.random() * 0.01 },
      { label: `${q} — Jl. Darmo, Surabaya`, lat: -7.270 + Math.random() * 0.01, lng: 112.734 + Math.random() * 0.01 },
      { label: `${q} — Jl. Basuki Rahmat, Surabaya`, lat: -7.258 + Math.random() * 0.01, lng: 112.747 + Math.random() * 0.01 },
    ].filter((_, i) => i < 3);
  }
}

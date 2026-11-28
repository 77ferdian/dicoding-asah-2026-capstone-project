const { ApifyClient } = require('apify-client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const APIFY_ACTOR_ID = 'Xb8osYTtOjlsgI6k9';

const MAIN_BUSINESS = {
  id: 'lb-main',
  name: 'Lintang Bakso (Pusat)',
  lat: -7.2575,
  lng: 112.7521,
  rating: 4.5,
  reviewCount: 312,
};

let candidatesStore = [
  { id: 1, label: 'Jl. Gubeng Raya No. 10', lat: -7.265, lng: 112.751, addedAt: '2026-11-24T10:00:00Z' },
  { id: 2, label: 'Jl. Raya Darmo No. 45', lat: -7.27, lng: 112.734, addedAt: '2026-11-24T11:00:00Z' },
];
let nextCandidateId = 3;

function haversineDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

async function geocodeAddress(query) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY belum dikonfigurasi.');
  }

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location',
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: 'id',
      regionCode: 'ID',
      maxResultCount: 5,
    }),
  });

  if (!res.ok) {
    throw new Error(`Google Places API (New) error: ${res.status}`);
  }
  const data = await res.json();

  return (data.places || []).map((place) => ({
    label: place.formattedAddress || place.displayName?.text,
    name: place.displayName?.text,
    placeId: place.id,
    lat: place.location?.latitude,
    lng: place.location?.longitude,
  }));
}

async function searchNearbyCompetitors(lat, lng, radius = 1500) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY belum dikonfigurasi.');
  }

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount',
    },
    body: JSON.stringify({
      textQuery: 'bakso',
      languageCode: 'id',
      maxResultCount: 15,
      locationBias: {
        circle: {
          center: { latitude: Number(lat), longitude: Number(lng) },
          radius: Number(radius),
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Google Places Nearby (New) error: ${res.status}`);
  }
  const data = await res.json();

  return (data.places || []).map((place) => {
    const pLat = place.location?.latitude;
    const pLng = place.location?.longitude;
    return {
      id: place.id,
      placeId: place.id,
      name: place.displayName?.text,
      address: place.formattedAddress,
      lat: pLat,
      lng: pLng,
      rating: place.rating || 0,
      reviewCount: place.userRatingCount || 0,
      distanceM: haversineDistanceMeters(lat, lng, pLat, pLng),
    };
  });
}

async function scrapePlaceReviews(placeIds, maxReviews = 50) {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) {
    throw new Error('APIFY_API_TOKEN belum dikonfigurasi.');
  }
  if (!placeIds || !placeIds.length) {
    return [];
  }

  const client = new ApifyClient({ token });
  const input = {
    placeIds,
    maxReviews,
    reviewsSort: 'newest',
    reviewsFilterString: '',
    language: 'id',
    reviewsOrigin: 'all',
    personalData: true,
  };

  const run = await client.actor(APIFY_ACTOR_ID).call(input);
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items || [];
}

async function getMapData() {
  let competitors = [];
  try {
    competitors = await searchNearbyCompetitors(MAIN_BUSINESS.lat, MAIN_BUSINESS.lng, 2000);
  } catch (err) {
    console.warn('Fallback ke mock kompetitor karena Google Places error:', err.message);
    competitors = [
      { id: 'c1', name: 'Bakso Malang Cak Eko', lat: -7.262, lng: 112.748, rating: 4.1, reviewCount: 189, distanceM: 620 },
      { id: 'c2', name: 'Bakso Solo Pak Budi', lat: -7.253, lng: 112.757, rating: 4.3, reviewCount: 274, distanceM: 480 },
      { id: 'c3', name: 'Warung Bakso Pak Jarwo', lat: -7.26, lng: 112.756, rating: 3.7, reviewCount: 95, distanceM: 740 },
    ];
  }

  return {
    mainBusiness: MAIN_BUSINESS,
    existingBranches: [],
    competitors,
  };
}

function listCandidates() {
  return [...candidatesStore];
}

function addCandidate({ label, lat, lng }) {
  const newCandidate = {
    id: nextCandidateId++,
    label,
    lat: Number(lat),
    lng: Number(lng),
    addedAt: new Date().toISOString(),
  };
  candidatesStore.push(newCandidate);
  return newCandidate;
}

function deleteCandidate(id) {
  const numericId = Number(id);
  candidatesStore = candidatesStore.filter((c) => c.id !== numericId);
}

async function analyzeCandidate(id, { radius = 1000 } = {}) {
  const numericId = Number(id);
  const candidate = candidatesStore.find((c) => c.id === numericId);
  if (!candidate) {
    throw new Error('Kandidat tidak ditemukan.');
  }

  let nearbyCompetitors = [];
  try {
    nearbyCompetitors = await searchNearbyCompetitors(candidate.lat, candidate.lng, radius);
  } catch (err) {
    console.warn('Nearby search fallback:', err.message);
  }

  const competitorCount = nearbyCompetitors.length;
  const avgCompRating =
    competitorCount > 0
      ? nearbyCompetitors.reduce((sum, c) => sum + (c.rating || 0), 0) / competitorCount
      : 3.8;

  const competitorPressure = Math.max(20, Math.min(95, Math.round(100 - competitorCount * 8)));
  const demand = Math.max(40, Math.min(95, Math.round(65 + Math.min(competitorCount, 5) * 4)));
  const accessibility = 78;
  const demographicMatch = 75;
  const marketGap = Math.max(30, Math.min(95, Math.round((5 - avgCompRating) * 25 + 45)));

  const totalScore = Math.round(
    demand * 0.3 +
      competitorPressure * 0.2 +
      accessibility * 0.2 +
      demographicMatch * 0.15 +
      marketGap * 0.15
  );

  let label = 'Kurang Disarankan';
  if (totalScore >= 75) label = 'Sangat Potensial';
  else if (totalScore >= 60) label = 'Potensial';
  else if (totalScore >= 40) label = 'Perlu Pertimbangan';

  return {
    candidateId: numericId,
    radius,
    totalScore,
    label,
    breakdown: [
      { key: 'demand', label: 'Potensi permintaan', score: demand, weight: 0.3 },
      { key: 'competitorPressure', label: 'Tekanan kompetitor', score: competitorPressure, weight: 0.2 },
      { key: 'accessibility', label: 'Aksesibilitas lokasi', score: accessibility, weight: 0.2 },
      { key: 'demographicMatch', label: 'Kecocokan demografi', score: demographicMatch, weight: 0.15 },
      { key: 'marketGap', label: 'Celah pasar', score: marketGap, weight: 0.15 },
    ],
    aspectGap: [
      { aspect: 'rasa', label: 'Rasa', ours: 0.82, competitors: 0.61 },
      { aspect: 'harga', label: 'Harga', ours: 0.74, competitors: 0.78 },
      { aspect: 'pelayanan', label: 'Pelayanan', ours: 0.78, competitors: 0.52 },
      { aspect: 'tempat', label: 'Tempat', ours: 0.65, competitors: 0.7 },
    ],
    nearbyCompetitors,
  };
}

async function compareCandidates(ids) {
  const results = [];
  for (const id of ids) {
    const numericId = Number(id);
    const candidate = candidatesStore.find((c) => c.id === numericId);
    if (candidate) {
      const analysis = await analyzeCandidate(numericId, { radius: 1000 });
      results.push({ candidate, analysis });
    }
  }
  return results;
}

async function generateInsight(id, { radius = 1000 } = {}) {
  const numericId = Number(id);
  const candidate = candidatesStore.find((c) => c.id === numericId);
  if (!candidate) {
    throw new Error('Kandidat tidak ditemukan.');
  }

  const analysis = await analyzeCandidate(numericId, { radius });

  // Scrape ulasan kompetitor terdekat menggunakan Apify (maksimal 10 ulasan dari 2 kompetitor teratas)
  let scrapedReviewsText = '';
  const topPlaceIds = analysis.nearbyCompetitors
    .map((c) => c.placeId)
    .filter(Boolean)
    .slice(0, 2);

  if (topPlaceIds.length > 0 && process.env.APIFY_API_TOKEN) {
    try {
      const items = await scrapePlaceReviews(topPlaceIds, 10);
      scrapedReviewsText = items
        .slice(0, 10)
        .map((r) => `[${r.title || 'Kompetitor'}][Rating ${r.stars || '-'}]: ${r.text || ''}`)
        .filter((line) => line.trim().length > 0)
        .join('\n');
    } catch (err) {
      console.warn('Apify scraping skipped:', err.message);
    }
  }

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'AIzaSy...') {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `
Kamu adalah konsultan ekspansi bisnis kuliner UMKM di Indonesia.
Analisis kandidat lokasi cabang baru Lintang Bakso:
Lokasi: ${candidate.label} (${candidate.lat}, ${candidate.lng})
Radius analisis: ${radius} meter
Skor total: ${analysis.totalScore}/100 (${analysis.label})
Jumlah kompetitor sekitar: ${analysis.nearbyCompetitors.length}

Contoh ulasan kompetitor sekitar:
${scrapedReviewsText || 'Tidak ada data ulasan tambahan.'}

Berikan insight dalam format JSON murni tanpa markdown:
{
  "summary": "Ringkasan potensi lokasi 2 kalimat",
  "opportunities": "Peluang utama di lokasi ini",
  "risks": "Risiko yang perlu diantisipasi",
  "fieldVerification": "Hal yang wajib dicek saat survei lapangan"
}
      `.trim();

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return {
          candidateId: numericId,
          fallback: false,
          ...JSON.parse(match[0]),
        };
      }
    } catch (err) {
      console.warn('Gemini insight fallback:', err.message);
    }
  }

  return {
    candidateId: numericId,
    fallback: true,
    summary: `Lokasi ${candidate.label} memiliki skor ${analysis.totalScore}/100 (${analysis.label}) dengan ${analysis.nearbyCompetitors.length} kompetitor dalam radius ${radius}m.`,
    opportunities:
      'Aspek pelayanan dan konsistensi rasa Lintang Bakso dapat menjadi pembeda kuat dibanding warung bakso sekitar.',
    risks:
      'Perlu mengantisipasi persaingan harga dan visibilitas papan nama di area dengan kepadatan kuliner tinggi.',
    fieldVerification:
      'Verifikasi arus lalu lintas jam makan siang (12.00–14.00), ketersediaan parkir motor/mobil, serta harga sewa ruko.',
  };
}

module.exports = {
  geocodeAddress,
  searchNearbyCompetitors,
  scrapePlaceReviews,
  getMapData,
  listCandidates,
  addCandidate,
  deleteCandidate,
  analyzeCandidate,
  compareCandidates,
  generateInsight,
};

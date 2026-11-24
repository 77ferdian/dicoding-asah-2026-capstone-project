export const mockSummary = {
  totalReviews: 450,
  positive: 315,
  negative: 135,
  positivePercentage: 70.0,
  aspectBreakdown: {
    rasa: {
      positive: 120,
      negative: 15,
      total: 135,
    },
    harga: {
      positive: 80,
      negative: 40,
      total: 120,
    },
    pelayanan: {
      positive: 65,
      negative: 50,
      total: 115,
    },
    tempat: {
      positive: 50,
      negative: 30,
      total: 80,
    },
  },
};

export const mockCompetitors = {
  mainBusiness: {
    id: 1,
    name: 'Lintang Bakso',
    rating: 4.5,
    totalReviews: 450,
    positivePercentage: 70.0,
    location: {
      lat: -7.2500,
      lng: 112.7500,
      address: 'Jl. Pemuda No. 45, Surabaya Pusat',
    },
    strengths: ['Kelezatan rasa kuah gurih & daging berasa', 'Pilihan bakso urat & keju'],
    weaknesses: ['Area makan terbatas & gerah saat jam makan siang', 'Antrian kasir padat'],
  },
  competitors: [
    {
      id: 2,
      name: 'Bakso Pak Djo',
      rating: 4.2,
      totalReviews: 320,
      positivePercentage: 78.5,
      location: {
        lat: -7.2575,
        lng: 112.7521,
        address: 'Jl. Manyar Kertoarjo No. 12, Surabaya',
      },
      strengths: ['Sistem order QR Code cepat', 'Pelayanan ramah & tanggap'],
      weaknesses: ['Rasa kuah dinilai kurang gurih', 'Porsi lebih sedikit'],
    },
    {
      id: 3,
      name: 'Bakso Solo Roso',
      rating: 4.1,
      totalReviews: 280,
      positivePercentage: 62.0,
      location: {
        lat: -7.2610,
        lng: 112.7480,
        address: 'Jl. Dharmawangsa No. 88, Surabaya',
      },
      strengths: ['Area parkir mobil luas & tempat adem', 'Buka hingga larut malam'],
      weaknesses: ['Harga relatif mahal bagi mahasiswa', 'Penyajian gorengan dingin'],
    },
    {
      id: 4,
      name: 'Bakso Cak Bejo',
      rating: 3.9,
      totalReviews: 190,
      positivePercentage: 55.0,
      location: {
        lat: -7.2630,
        lng: 112.7560,
        address: 'Jl. Ngagel Jaya Selatan, Surabaya',
      },
      strengths: ['Harga sangat murah meriah', 'Es teh jumbo gratis'],
      weaknesses: ['Tempat kurang higienis', 'Stok pentol sering habis sebelum jam 7 malam'],
    },
  ],
};

export const mockAiInsights = {
  executiveSummary: 'Pelanggan Lintang Bakso secara umum sangat puas dengan kualitas rasa bakso (88.9% sentimen positif). Namun, terjadi lonjakan keluhan pelanggan pada aspek Pelayanan (43.5% negatif) akibat waktu tunggu penyajian di jam makan siang sibuk (12.00–14.00) serta suhu ruangan yang terasa panas.',
  actionableRecommendations: [
    'Standarisasi alur penyajian meja di jam sibuk dengan sistem tiket digital atau nomor meja otomatis untuk memangkas waktu tunggu dari 15 menit ke < 7 menit.',
    'Menambah kipas angin industri (blower) atau AC tambahan di area makan utama untuk mengatasi keluhan aspek Tempat/Lokasi.',
    'Mempertimbangkan implementasi sistem pemesanan via QR Code di meja seperti yang berhasil diterapkan oleh kompetitor Bakso Pak Djo (kepuasan pelayanan 78.5%).',
    'Menjaga konsistensi keunggulan utama pada bumbu kaldu dan tekstur pentol kasar yang menjadi alasan utama loyalitas pelanggan saat ini.',
  ],
  cachedAt: new Date().toISOString(),
};

/**
 * ExpansionMap.jsx
 * Peta interaktif menggunakan Google Maps (@react-google-maps/api).
 * Menampilkan: cabang utama, kompetitor (warna rating), kandidat, lingkaran radius.
 * Mode klik peta → tambah kandidat sementara.
 */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
  CircleF,
} from '@react-google-maps/api';

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
};

const DEFAULT_CENTER = {
  lat: -7.2575,
  lng: 112.7521,
};

function createSvgPin(color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24C32 7.163 24.837 0 16 0z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="16" cy="15" r="6" fill="#ffffff"/>
    </svg>
  `.trim();
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const PIN_URLS = {
  main: createSvgPin('#f97316'),
  candidatePending: createSvgPin('#6366f1'),
  candidateSelected: createSvgPin('#7c3aed'),
  candidateDefault: createSvgPin('#94a3b8'),
  competitorGreen: createSvgPin('#22c55e'),
  competitorYellow: createSvgPin('#eab308'),
  competitorRed: createSvgPin('#ef4444'),
};

function getCompetitorPin(rating) {
  if (rating >= 4.3) return PIN_URLS.competitorGreen;
  if (rating >= 3.8) return PIN_URLS.competitorYellow;
  return PIN_URLS.competitorRed;
}

export default function ExpansionMap({
  mapData,
  candidates,
  selectedCandidateId,
  radius,
  addMode,
  pendingLatLng,
  onPick,
  onSelectCandidate,
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const [activeInfo, setActiveInfo] = useState(null);

  const main = mapData?.mainBusiness;
  const competitors = mapData?.competitors ?? [];
  const selectedCandidate = candidates?.find((c) => c.id === selectedCandidateId);

  const handleMapClick = useCallback(
    (e) => {
      if (addMode && e.latLng) {
        onPick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      } else {
        setActiveInfo(null);
      }
    },
    [addMode, onPick]
  );

  if (loadError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 text-sm text-red-600 p-4 text-center">
        Gagal memuat Google Maps. Periksa koneksi atau VITE_GOOGLE_MAPS_API_KEY.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-500">
        Memuat Google Maps...
      </div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {addMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg pointer-events-none">
          🗺️ Klik lokasi di peta untuk menambah kandidat
        </div>
      )}

      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={main ? { lat: main.lat, lng: main.lng } : DEFAULT_CENTER}
        zoom={14}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          draggableCursor: addMode ? 'crosshair' : 'grab',
        }}
      >
        {/* Cabang Utama */}
        {main && (
          <MarkerF
            position={{ lat: main.lat, lng: main.lng }}
            icon={{ url: PIN_URLS.main }}
            onClick={() => setActiveInfo({ type: 'main', data: main })}
          />
        )}

        {/* Kompetitor */}
        {competitors.map((c) => (
          <MarkerF
            key={c.id}
            position={{ lat: c.lat, lng: c.lng }}
            icon={{ url: getCompetitorPin(c.rating) }}
            onClick={() => setActiveInfo({ type: 'competitor', data: c })}
          />
        ))}

        {/* Kandidat yang sudah tersimpan */}
        {candidates?.map((c) => {
          const isSelected = c.id === selectedCandidateId;
          return (
            <MarkerF
              key={c.id}
              position={{ lat: c.lat, lng: c.lng }}
              icon={{
                url: isSelected ? PIN_URLS.candidateSelected : PIN_URLS.candidateDefault,
              }}
              onClick={() => {
                onSelectCandidate(c.id);
                setActiveInfo({ type: 'candidate', data: c });
              }}
            />
          );
        })}

        {/* Lingkaran radius kandidat terpilih */}
        {selectedCandidate && (
          <CircleF
            center={{ lat: selectedCandidate.lat, lng: selectedCandidate.lng }}
            radius={radius}
            options={{
              strokeColor: '#7c3aed',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#a78bfa',
              fillOpacity: 0.14,
            }}
          />
        )}

        {/* Pin sementara saat mode tambah */}
        {pendingLatLng && (
          <MarkerF
            position={{ lat: pendingLatLng.lat, lng: pendingLatLng.lng }}
            icon={{ url: PIN_URLS.candidatePending }}
          />
        )}

        {/* InfoWindow */}
        {activeInfo?.type === 'main' && (
          <InfoWindowF
            position={{ lat: activeInfo.data.lat, lng: activeInfo.data.lng }}
            onCloseClick={() => setActiveInfo(null)}
          >
            <div className="text-xs">
              <strong className="text-orange-600">🍜 {activeInfo.data.name}</strong>
              <br />⭐ {activeInfo.data.rating} · {activeInfo.data.reviewCount} ulasan
              <br />
              <span className="text-slate-500">Cabang Utama</span>
            </div>
          </InfoWindowF>
        )}

        {activeInfo?.type === 'competitor' && (
          <InfoWindowF
            position={{ lat: activeInfo.data.lat, lng: activeInfo.data.lng }}
            onCloseClick={() => setActiveInfo(null)}
          >
            <div className="text-xs">
              <strong>{activeInfo.data.name}</strong>
              <br />⭐ {activeInfo.data.rating} · {activeInfo.data.reviewCount} ulasan
              <br />
              <span className="text-slate-400">
                Jarak: ~{activeInfo.data.distanceM} m dari pusat
              </span>
              <br />
              <span
                className={`font-semibold ${
                  activeInfo.data.rating >= 4.3
                    ? 'text-green-600'
                    : activeInfo.data.rating >= 3.8
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {activeInfo.data.rating >= 4.3
                  ? '● Kompetitor Kuat'
                  : activeInfo.data.rating >= 3.8
                  ? '● Kompetitor Sedang'
                  : '● Kompetitor Lemah'}
              </span>
            </div>
          </InfoWindowF>
        )}

        {activeInfo?.type === 'candidate' && (
          <InfoWindowF
            position={{ lat: activeInfo.data.lat, lng: activeInfo.data.lng }}
            onCloseClick={() => setActiveInfo(null)}
          >
            <div className="text-xs">
              <strong className="text-indigo-600">📍 {activeInfo.data.label}</strong>
              <br />
              <button
                type="button"
                className="mt-1 text-indigo-600 underline"
                onClick={() => onSelectCandidate(activeInfo.data.id)}
              >
                Pilih & Analisis
              </button>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      {/* Legenda */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-[10px] shadow border border-slate-100 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Cabang Utama
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Kompetitor Kuat (≥4.3)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" /> Kompetitor Sedang (3.8-4.2)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Kompetitor Lemah (&lt;3.8)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" /> Kandidat Cabang
        </div>
      </div>
    </div>
  );
}

ExpansionMap.propTypes = {
  mapData: PropTypes.object,
  candidates: PropTypes.array,
  selectedCandidateId: PropTypes.number,
  radius: PropTypes.number.isRequired,
  addMode: PropTypes.bool.isRequired,
  pendingLatLng: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
  onPick: PropTypes.func.isRequired,
  onSelectCandidate: PropTypes.func.isRequired,
};

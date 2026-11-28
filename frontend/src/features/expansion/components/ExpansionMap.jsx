/**
 * ExpansionMap.jsx
 * Peta interaktif menggunakan react-leaflet + OpenStreetMap.
 * Menampilkan: cabang utama, kompetitor (warna rating), kandidat, lingkaran radius.
 * Mode klik peta → tambah kandidat sementara.
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default icon Leaflet (diperlukan saat bundling dengan Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Icon khusus berbasis HTML/div agar tidak perlu file gambar tambahan
function createColorIcon(color, emoji) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;">
             <span style="transform:rotate(45deg);font-size:14px;">${emoji}</span>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

const ICONS = {
  main: createColorIcon('#f97316', '🍜'),
  candidatePending: createColorIcon('#6366f1', '📍'),
  candidateSelected: createColorIcon('#7c3aed', '📌'),
  candidateDefault: createColorIcon('#94a3b8', '📍'),
  competitorGreen: createColorIcon('#22c55e', '🏪'),
  competitorYellow: createColorIcon('#eab308', '🏪'),
  competitorRed: createColorIcon('#ef4444', '🏪'),
};

function competitorIcon(rating) {
  if (rating >= 4.3) return ICONS.competitorGreen;
  if (rating >= 3.8) return ICONS.competitorYellow;
  return ICONS.competitorRed;
}

function ClickToAdd({ enabled, onPick }) {
  useMapEvents({
    click(e) {
      if (enabled) onPick(e.latlng);
    },
  });
  return null;
}

ClickToAdd.propTypes = {
  enabled: PropTypes.bool.isRequired,
  onPick: PropTypes.func.isRequired,
};

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
  const main = mapData?.mainBusiness;
  const competitors = mapData?.competitors ?? [];
  const selectedCandidate = candidates?.find((c) => c.id === selectedCandidateId);

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {addMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg pointer-events-none">
          🗺️ Klik lokasi di peta untuk menambah kandidat
        </div>
      )}
      <MapContainer
        center={[-7.2575, 112.7521]}
        zoom={14}
        className="h-full w-full"
        style={{ cursor: addMode ? 'crosshair' : 'grab' }}
        minZoom={11}
        maxZoom={18}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <ClickToAdd enabled={addMode} onPick={onPick} />

        {/* Cabang Utama */}
        {main && (
          <Marker position={[main.lat, main.lng]} icon={ICONS.main}>
            <Popup>
              <strong className="text-orange-600">🍜 {main.name}</strong>
              <br />⭐ {main.rating} · {main.reviewCount} ulasan
              <br /><span className="text-xs text-slate-500">Cabang Utama</span>
            </Popup>
          </Marker>
        )}

        {/* Kompetitor */}
        {competitors.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={competitorIcon(c.rating)}>
            <Popup>
              <strong>{c.name}</strong>
              <br />⭐ {c.rating} · {c.reviewCount} ulasan
              <br /><span className="text-xs text-slate-400">Jarak: ~{c.distanceM} m dari pusat</span>
              <br />
              <span className={`text-xs font-semibold ${c.rating >= 4.3 ? 'text-green-600' : c.rating >= 3.8 ? 'text-yellow-600' : 'text-red-600'}`}>
                {c.rating >= 4.3 ? '● Kompetitor Kuat' : c.rating >= 3.8 ? '● Kompetitor Sedang' : '● Kompetitor Lemah'}
              </span>
            </Popup>
          </Marker>
        ))}

        {/* Kandidat yang sudah tersimpan */}
        {candidates?.map((c) => {
          const isSelected = c.id === selectedCandidateId;
          return (
            <Marker
              key={c.id}
              position={[c.lat, c.lng]}
              icon={isSelected ? ICONS.candidateSelected : ICONS.candidateDefault}
              eventHandlers={{ click: () => onSelectCandidate(c.id) }}
            >
              <Popup>
                <strong className="text-indigo-600">📍 {c.label}</strong>
                <br />
                <button
                  className="mt-1 text-xs text-indigo-600 underline"
                  onClick={() => onSelectCandidate(c.id)}
                >
                  Pilih & Analisis
                </button>
              </Popup>
            </Marker>
          );
        })}

        {/* Lingkaran radius kandidat terpilih */}
        {selectedCandidate && (
          <Circle
            center={[selectedCandidate.lat, selectedCandidate.lng]}
            radius={radius}
            pathOptions={{ color: '#7c3aed', fillColor: '#a78bfa', fillOpacity: 0.12, weight: 2, dashArray: '6 4' }}
          />
        )}

        {/* Pin sementara saat mode tambah */}
        {pendingLatLng && (
          <Marker position={[pendingLatLng.lat, pendingLatLng.lng]} icon={ICONS.candidatePending}>
            <Popup>Lokasi baru — konfirmasi di panel kiri</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Legenda */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-[10px] shadow border border-slate-100 space-y-0.5">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Cabang Utama</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Kompetitor Kuat (≥4.3)</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" /> Kompetitor Sedang (3.8-4.2)</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Kompetitor Lemah (&lt;3.8)</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" /> Kandidat Cabang</div>
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

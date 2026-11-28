/**
 * ExpansionPage.jsx
 * Layout tiga kolom (desktop) / satu kolom dengan tab (mobile).
 * Panel kiri: cari alamat, daftar kandidat, radius, pendingLatLng confirm.
 * Tengah: peta interaktif.
 * Kanan: ScoreCard, ScoreBreakdown, AspectGapChart, AiInsightPanel, Disclaimer.
 * Tab bawah: Peta | Perbandingan.
 */
import React, { useState } from 'react';
import { FiPlusCircle, FiXCircle, FiBarChart2, FiMap } from 'react-icons/fi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'leaflet/dist/leaflet.css';

import ExpansionMap from '../components/ExpansionMap';
import CandidateSearch from '../components/CandidateSearch';
import CandidateList from '../components/CandidateList';
import RadiusSelector from '../components/RadiusSelector';
import ScoreCard from '../components/ScoreCard';
import ScoreBreakdown from '../components/ScoreBreakdown';
import AspectGapChart from '../components/AspectGapChart';
import AiInsightPanel from '../components/AiInsightPanel';
import CompareTable from '../components/CompareTable';
import Disclaimer from '../components/Disclaimer';

import { useMapData } from '../hooks/useMapData';
import { useCandidates } from '../hooks/useCandidates';
import { useAnalyze } from '../hooks/useAnalyze';
import { useCompare } from '../hooks/useCompare';

import { addCandidate } from '../api/expansionApi';

const MAX_CANDIDATES = 5;

const queryClient = new QueryClient();

function ExpansionPageInner() {
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [radius, setRadius] = useState(1000);
  const [compareIds, setCompareIds] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [pendingLatLng, setPendingLatLng] = useState(null);
  const [pendingLabel, setPendingLabel] = useState('');
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'compare'

  const mapDataQuery = useMapData();
  const candidatesQuery = useCandidates();
  const analysisQuery = useAnalyze(selectedCandidateId, radius);
  const compareQuery = useCompare(compareIds);

  const candidates = candidatesQuery.data ?? [];
  const analysisData = analysisQuery.data;

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleMapPick = (latlng) => {
    if (candidates.length >= MAX_CANDIDATES) return;
    setPendingLatLng(latlng);
    setPendingLabel(`Lat ${latlng.lat.toFixed(4)}, Lng ${latlng.lng.toFixed(4)}`);
  };

  const handleSearchSelect = (item) => {
    if (candidates.length >= MAX_CANDIDATES) return;
    setPendingLatLng({ lat: item.lat, lng: item.lng });
    setPendingLabel(item.label);
  };

  const handleConfirmAdd = async () => {
    if (!pendingLatLng) return;
    await candidatesQuery.add.mutateAsync({
      label: pendingLabel || `Kandidat ${candidates.length + 1}`,
      lat: pendingLatLng.lat,
      lng: pendingLatLng.lng,
    });
    setPendingLatLng(null);
    setPendingLabel('');
    setAddMode(false);
  };

  const handleCancelAdd = () => {
    setPendingLatLng(null);
    setPendingLabel('');
    setAddMode(false);
  };

  const handleDelete = (id) => {
    candidatesQuery.remove.mutate(id);
    if (selectedCandidateId === id) setSelectedCandidateId(null);
    setCompareIds((prev) => prev.filter((x) => x !== id));
  };

  const handleToggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  // ─── Loading / Error states ────────────────────────────────────────────────

  if (mapDataQuery.isError || candidatesQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-600 font-bold mb-2">Gagal memuat data lokasi</p>
        <p className="text-sm text-slate-500 mb-4">Coba periksa koneksi internet Anda.</p>
        <button
          onClick={() => { mapDataQuery.refetch(); candidatesQuery.refetch(); }}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fitur Strategis</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Ekspansi Cabang
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Analisis potensi lokasi cabang baru berdasarkan data ulasan digital dan kompetitor sekitar.
        </p>
      </div>

      {/* Mobile Tab switcher */}
      <div className="flex lg:hidden gap-2">
        {[
          { key: 'map', label: 'Peta & Kandidat', icon: <FiMap /> },
          { key: 'compare', label: 'Perbandingan', icon: <FiBarChart2 /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Layout tiga kolom desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] gap-5 items-start">

        {/* ══ PANEL KIRI ══ */}
        <div className={`space-y-4 ${activeTab !== 'map' && 'hidden lg:block'}`}>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-sm">
            <p className="text-xs font-black text-slate-700 uppercase tracking-wider">📍 Kandidat Lokasi</p>

            {/* Tombol tambah via klik peta */}
            {!pendingLatLng ? (
              <button
                onClick={() => { setAddMode((p) => !p); }}
                disabled={candidates.length >= MAX_CANDIDATES}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  addMode
                    ? 'bg-red-50 text-red-600 border-red-300'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {addMode ? <><FiXCircle /> Batalkan Mode Tambah</> : <><FiPlusCircle /> Tambah via Klik Peta</>}
              </button>
            ) : (
              /* Konfirmasi lokasi pending */
              <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3 space-y-2">
                <p className="text-xs font-bold text-indigo-700">📌 Konfirmasi Lokasi Baru</p>
                <input
                  type="text"
                  value={pendingLabel}
                  onChange={(e) => setPendingLabel(e.target.value)}
                  placeholder="Nama / keterangan lokasi"
                  maxLength={100}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                />
                <p className="text-[10px] text-indigo-500">
                  {pendingLatLng?.lat?.toFixed(5)}, {pendingLatLng?.lng?.toFixed(5)}
                </p>
                <div className="flex gap-2">
                  <button onClick={handleConfirmAdd} className="flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition">
                    ✔ Simpan
                  </button>
                  <button onClick={handleCancelAdd} className="flex-1 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition">
                    ✖ Batal
                  </button>
                </div>
              </div>
            )}

            {/* Pencarian alamat */}
            <CandidateSearch
              onSelectLocation={handleSearchSelect}
              candidateCount={candidates.length}
              maxCandidates={MAX_CANDIDATES}
            />

            {/* Daftar kandidat */}
            <CandidateList
              candidates={candidates}
              selectedId={selectedCandidateId}
              compareIds={compareIds}
              onSelect={setSelectedCandidateId}
              onDelete={handleDelete}
              onToggleCompare={handleToggleCompare}
              loading={candidatesQuery.isLoading}
            />

            {compareIds.length >= 2 && (
              <p className="text-[10px] text-indigo-500 font-medium text-center">
                ✔ {compareIds.length} kandidat dipilih untuk perbandingan
              </p>
            )}
          </div>

          {/* Radius */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <RadiusSelector radius={radius} onChange={setRadius} />
          </div>
        </div>

        {/* ══ PETA ══ */}
        <div className={`h-[480px] lg:h-[640px] ${activeTab !== 'map' && 'hidden lg:block'}`}>
          {mapDataQuery.isLoading ? (
            <div className="h-full rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-sm">
              Memuat data lokasi…
            </div>
          ) : (
            <ExpansionMap
              mapData={mapDataQuery.data}
              candidates={candidates}
              selectedCandidateId={selectedCandidateId}
              radius={radius}
              addMode={addMode}
              pendingLatLng={pendingLatLng}
              onPick={handleMapPick}
              onSelectCandidate={setSelectedCandidateId}
            />
          )}
        </div>

        {/* ══ PANEL KANAN ══ */}
        <div className={`space-y-4 ${activeTab !== 'map' && 'hidden lg:block'}`}>
          <ScoreCard score={analysisData?.totalScore} loading={analysisQuery.isFetching} />
          <ScoreBreakdown breakdown={analysisData?.breakdown} loading={analysisQuery.isFetching} />
          <AspectGapChart aspectGap={analysisData?.aspectGap} loading={analysisQuery.isFetching} />
          <AiInsightPanel candidateId={selectedCandidateId} />
          <Disclaimer />
        </div>
      </div>

      {/* ══ TAB PERBANDINGAN ══ */}
      <div className={`${activeTab !== 'compare' && 'hidden lg:block'}`}>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FiBarChart2 className="text-indigo-500" />
              Perbandingan Kandidat
            </h3>
            {compareIds.length < 2 && (
              <span className="text-xs text-slate-400">Centang minimal 2 kandidat di panel kiri</span>
            )}
          </div>
          <CompareTable compareData={compareQuery.data} loading={compareQuery.isFetching} />
        </div>
      </div>
    </div>
  );
}

export default function ExpansionPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ExpansionPageInner />
    </QueryClientProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { FiMapPin, FiStar, FiThumbsUp, FiAlertTriangle, FiExternalLink } from 'react-icons/fi';
import { useLocale } from '../contexts/LocaleContext';
import { apiClient } from '../utils/api';
import CompetitorBarChart from '../components/charts/CompetitorBarChart';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function BenchmarkingPage() {
  const { t } = useLocale();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getBenchmarking()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  const main = data?.mainBusiness || {};
  const competitors = data?.competitors || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.competitorTitle}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Peta Daya Saing Lintang Bakso
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          {t.competitorSubtitle} untuk mengidentifikasi celah pasar & keunggulan kompetitif.
        </p>
      </div>

      {/* Benchmarking Bar Chart */}
      <CompetitorBarChart mainBusiness={main} competitors={competitors} />

      {/* Cards List: Main Business vs Competitors */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>🏪 Rincian Profil Bisnis & Lokasi Geografis</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Main Business Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-amber-50 border-2 border-orange-500/80 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-orange-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
              Bisnis Anda
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900">{main.name}</h4>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <FiStar className="fill-amber-500 text-amber-500" /> {main.rating} / 5.0
                </span>
                <span>•</span>
                <span className="font-semibold text-emerald-600">
                  {main.positivePercentage}% Positif
                </span>
                <span>•</span>
                <span>{main.totalReviews} ulasan</span>
              </div>

              <div className="mt-4 pt-4 border-t border-orange-200/60 text-xs text-slate-600 flex items-start gap-2">
                <FiMapPin className="text-orange-600 shrink-0 mt-0.5" />
                <span>{main.location?.address}</span>
              </div>

              {main.strengths && (
                <div className="mt-4 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kelebihan:</span>
                  {main.strengths.map((s, i) => (
                    <p key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                      <FiThumbsUp className="text-emerald-500 text-xs shrink-0" />
                      <span>{s}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${main.location?.lat},${main.location?.lng}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition"
            >
              <span>{t.viewGmaps}</span>
              <FiExternalLink />
            </a>
          </div>

          {/* Competitors Cards */}
          {competitors.map((comp) => (
            <div
              key={comp.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="text-lg font-bold text-slate-900">{comp.name}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                    Kompetitor
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <FiStar className="fill-amber-500 text-amber-500" /> {comp.rating} / 5.0
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-blue-600">
                    {comp.positivePercentage}% Positif
                  </span>
                  <span>•</span>
                  <span>{comp.totalReviews} ulasan</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                  <FiMapPin className="text-slate-400 shrink-0 mt-0.5" />
                  <span>{comp.location?.address}</span>
                </div>

                {comp.strengths && (
                  <div className="mt-4 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kelebihan:</span>
                    {comp.strengths.map((s, i) => (
                      <p key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                        <FiThumbsUp className="text-blue-500 text-xs shrink-0" />
                        <span>{s}</span>
                      </p>
                    ))}
                  </div>
                )}

                {comp.weaknesses && (
                  <div className="mt-3 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kelemahan:</span>
                    {comp.weaknesses.map((w, i) => (
                      <p key={i} className="text-xs text-rose-600 flex items-center gap-1.5">
                        <FiAlertTriangle className="text-rose-500 text-xs shrink-0" />
                        <span>{w}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${comp.location?.lat},${comp.location?.lng}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                <span>{t.viewGmaps}</span>
                <FiExternalLink />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

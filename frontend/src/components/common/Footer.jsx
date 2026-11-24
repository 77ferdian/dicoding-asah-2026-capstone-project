import React from 'react';
import { useLocale } from '../../contexts/LocaleContext';

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs text-slate-500 font-medium">
          © 2026 <span className="font-semibold text-slate-700">Lintang Bakso Analytics</span> — Capstone Project Tim A26-CS065 (Asah 2026 by Dicoding & GoTo)
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          {t.tagline}
        </p>
      </div>
    </footer>
  );
}

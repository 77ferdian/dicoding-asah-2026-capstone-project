import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser, FiArrowRight, FiInfo } from 'react-icons/fi';
import { useLocale } from '../contexts/LocaleContext';
import { apiClient } from '../utils/api';

export default function LoginPage() {
  const { t } = useLocale();
  const navigate = useNavigate();

  const [username, setUsername] = useState('owner_lintang');
  const [password, setPassword] = useState('secret_password123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim() || !password) {
      setErrorMessage('Nama pengguna dan kata sandi wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.login({ username, password });
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Login gagal. Periksa username dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600"></div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg shadow-orange-500/30">
            🍜
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Lintang Bakso</h2>
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mt-1">
            Customer Intelligence Platform
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {t.loginSubtext}
          </p>
        </div>

        {/* Demo Hint Banner */}
        <div className="p-3 mb-6 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-900 text-xs flex items-start gap-2">
          <FiInfo className="text-base text-orange-600 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold">Akun Demo Default:</span>
            <br />
            Username: <code className="bg-orange-100 px-1 py-0.5 rounded font-mono">owner_lintang</code> | Password: <code className="bg-orange-100 px-1 py-0.5 rounded font-mono">secret_password123</code>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.username}
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="owner_lintang"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.password}
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Memverifikasi...' : t.signIn}</span>
            <FiArrowRight className="text-base" />
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-400 mt-8">
          A26-CS065 Capstone Project · Asah 2026 Dicoding × GoTo
        </p>
      </div>
    </div>
  );
}

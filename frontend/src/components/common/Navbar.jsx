import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiBarChart2, FiPieChart, FiGlobe, FiLogOut, FiUser, FiMapPin } from 'react-icons/fi';
import { useLocale } from '../../contexts/LocaleContext';
import { getUserInfo } from '../../utils/auth';
import { apiClient } from '../../utils/api';

export default function Navbar() {
  const { t, locale, toggleLocale } = useLocale();
  const navigate = useNavigate();
  const user = getUserInfo();

  const handleLogout = async () => {
    if (window.confirm(locale === 'id' ? 'Apakah Anda yakin ingin keluar?' : 'Are you sure you want to log out?')) {
      await apiClient.logout();
      navigate('/login');
    }
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100'
        : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-orange-500/20">
            🍜
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">Lintang Bakso</h1>
            <p className="text-xs text-slate-500 hidden sm:block font-medium">Customer Intelligence Dashboard</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <NavLink to="/" end className={navClass}>
            <FiPieChart className="text-base" />
            <span className="hidden sm:inline">{t.dashboard}</span>
          </NavLink>
          <NavLink to="/benchmarking" className={navClass}>
            <FiBarChart2 className="text-base" />
            <span className="hidden sm:inline">{t.benchmarking}</span>
          </NavLink>
          <NavLink to="/expansion" className={navClass}>
            <FiMapPin className="text-base" />
            <span className="hidden sm:inline">Ekspansi Cabang</span>
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Toggle Locale */}
          <button
            onClick={toggleLocale}
            title={locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <FiGlobe className="text-slate-500" />
            <span>{locale.toUpperCase()}</span>
          </button>

          {/* User Badge */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-semibold">
              <FiUser />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-800 line-clamp-1">{user.fullName}</p>
              <span className="text-[10px] text-emerald-600 font-medium">● Owner</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title={t.logout}
            className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>
      </div>
    </header>
  );
}

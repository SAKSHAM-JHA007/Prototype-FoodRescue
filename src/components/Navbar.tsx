import React from 'react';
import { Persona } from '../types';
import { 
  HeartHandshake, 
  Truck, 
  Store, 
  ShieldCheck, 
  Bell,
  RefreshCw,
  Globe
} from 'lucide-react';
import { store } from '../services/store';
import { Logo } from './Logo';

interface NavbarProps {
  currentPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  onOpenAuth: () => void;
  urgentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPersona,
  onSelectPersona,
  onOpenAuth,
  urgentCount
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Enhanced Professional Brand Logo */}
          <div onClick={() => onSelectPersona('landing')}>
            <Logo size="md" showSubtitle={true} />
          </div>

          {/* Clean Segmented Navigation (Human, no capsule/pill bubbles) */}
          <nav className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onSelectPersona('landing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentPersona === 'landing'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" /> Public Portal
            </button>

            <button
              onClick={() => onSelectPersona('provider')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentPersona === 'provider'
                  ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200/60 font-bold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Food Provider
            </button>

            <button
              onClick={() => onSelectPersona('ngo')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentPersona === 'ngo'
                  ? 'bg-white text-blue-800 shadow-xs border border-blue-200/60 font-bold'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" /> Recipient NGO
            </button>

            <button
              onClick={() => onSelectPersona('volunteer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentPersona === 'volunteer'
                  ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200/60 font-bold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Volunteer Courier
            </button>

            <button
              onClick={() => onSelectPersona('admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentPersona === 'admin'
                  ? 'bg-white text-amber-900 shadow-xs border border-amber-200/60 font-bold'
                  : 'text-slate-600 hover:text-amber-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Operations
              {urgentCount > 0 && (
                <span className="w-2 h-2 rounded-xs bg-red-600 animate-pulse" />
              )}
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Urgent Notification Bell */}
            <button 
              onClick={() => onSelectPersona('admin')}
              className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              title="Urgent Alerts"
            >
              <Bell className="w-5 h-5" />
              {urgentCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-xs bg-red-600 text-[10px] font-bold text-white shadow-xs">
                  {urgentCount}
                </span>
              )}
            </button>

            {/* Reset Demo State Button */}
            <button
              onClick={() => {
                if (confirm("Reset demo campus database to initial state?")) {
                  store.resetToDemo();
                }
              }}
              className="hidden md:flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200"
              title="Reset initial campus dataset"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>

            {/* Login / Switch Button */}
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Sign In
            </button>
          </div>

        </div>

        {/* Mobile Navigation (No capsule pills) */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => onSelectPersona('landing')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${currentPersona === 'landing' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
          >
            Portal
          </button>
          <button
            onClick={() => onSelectPersona('provider')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${currentPersona === 'provider' ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
          >
            Provider
          </button>
          <button
            onClick={() => onSelectPersona('ngo')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${currentPersona === 'ngo' ? 'bg-blue-700 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
          >
            NGO Dashboard
          </button>
          <button
            onClick={() => onSelectPersona('volunteer')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${currentPersona === 'volunteer' ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
          >
            Volunteer
          </button>
          <button
            onClick={() => onSelectPersona('admin')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${currentPersona === 'admin' ? 'bg-amber-700 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
          >
            Admin Board
          </button>
        </div>

      </div>
    </header>
  );
};

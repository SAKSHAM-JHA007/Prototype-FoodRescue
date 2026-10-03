import React from 'react';
import { Persona } from '../types';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Workflow, 
  HeartHandshake, 
  Truck, 
  Store, 
  BarChart3,
  Bell,
  RefreshCw
} from 'lucide-react';
import { store } from '../services/store';

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => onSelectPersona('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-400 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <span className="text-xl">🌱</span>
            </div>
            <div>
              <span className="text-xl font-bold font-sans tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                FoodRescue
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[11px] font-semibold tracking-wide bg-brand-50 text-brand-700 rounded-full border border-brand-200/60">
                Pilot v2
              </span>
            </div>
          </div>

          {/* Quick Persona Switcher Bar (For testing & pair programming) */}
          <div className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onSelectPersona('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentPersona === 'landing'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🌐</span> Public Landing
            </button>

            <button
              onClick={() => onSelectPersona('provider')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentPersona === 'provider'
                  ? 'bg-white text-brand-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-brand-700'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Food Provider
            </button>

            <button
              onClick={() => onSelectPersona('ngo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentPersona === 'ngo'
                  ? 'bg-white text-brand-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-brand-700'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" /> Recipient NGO
            </button>

            <button
              onClick={() => onSelectPersona('volunteer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentPersona === 'volunteer'
                  ? 'bg-white text-brand-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-brand-700'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Volunteer
            </button>

            <button
              onClick={() => onSelectPersona('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentPersona === 'admin'
                  ? 'bg-white text-amber-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Board
              {urgentCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => onSelectPersona('workflows')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                currentPersona === 'workflows'
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
              title="n8n Workflows Engine"
            >
              <Workflow className="w-3.5 h-3.5" /> n8n
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Urgent Notification Bell */}
            <button 
              onClick={() => onSelectPersona('admin')}
              className="relative p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              title="Urgency Alerts"
            >
              <Bell className="w-5 h-5" />
              {urgentCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
                  {urgentCount}
                </span>
              )}
            </button>

            {/* Reset Demo State Button */}
            <button
              onClick={() => {
                if (confirm("Reset FoodRescue demo database to initial state?")) {
                  store.resetToDemo();
                }
              }}
              className="hidden md:flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-100"
              title="Reset initial campus dataset"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Demo
            </button>

            {/* Login / Switch Button */}
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-brand-700 transition-colors shadow-xs"
            >
              Sign In
            </button>
          </div>

        </div>

        {/* Mobile Persona Navigation */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => onSelectPersona('landing')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${currentPersona === 'landing' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Landing
          </button>
          <button
            onClick={() => onSelectPersona('provider')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${currentPersona === 'provider' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Provider
          </button>
          <button
            onClick={() => onSelectPersona('ngo')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${currentPersona === 'ngo' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            NGO Dashboard
          </button>
          <button
            onClick={() => onSelectPersona('volunteer')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${currentPersona === 'volunteer' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Volunteer
          </button>
          <button
            onClick={() => onSelectPersona('admin')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${currentPersona === 'admin' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Admin At-Risk
          </button>
          <button
            onClick={() => onSelectPersona('workflows')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${currentPersona === 'workflows' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            n8n Automation
          </button>
        </div>

      </div>
    </header>
  );
};

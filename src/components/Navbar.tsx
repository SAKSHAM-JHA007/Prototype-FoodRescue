import React from 'react';
import { Persona, UserRole } from '../types';
import { 
  HeartHandshake, 
  Truck, 
  Store, 
  Bell,
  RefreshCw,
  Globe,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { store } from '../services/store';
import { Logo } from './Logo';

export interface UserAuthData {
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
}

interface NavbarProps {
  currentPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  onOpenAuth: () => void;
  urgentCount: number;
  currentUser?: UserAuthData | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPersona,
  onSelectPersona,
  onOpenAuth,
  urgentCount,
  currentUser,
  onSignOut
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Enhanced Professional Brand Logo */}
          <div onClick={() => onSelectPersona('landing')} className="cursor-pointer">
            <Logo size="md" showSubtitle={true} />
          </div>

          {/* Clean Segmented Navigation (Human, no capsule/pill bubbles) */}
          <nav className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onSelectPersona('landing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentPersona === 'landing'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" /> Public Portal
            </button>

            <button
              onClick={() => onSelectPersona('provider')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentPersona === 'provider'
                  ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200/60 font-bold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Food Provider
            </button>

            <button
              onClick={() => onSelectPersona('ngo')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentPersona === 'ngo'
                  ? 'bg-white text-blue-800 shadow-xs border border-blue-200/60 font-bold'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" /> Recipient NGO
            </button>

            <button
              onClick={() => onSelectPersona('volunteer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentPersona === 'volunteer'
                  ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200/60 font-bold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Volunteer Courier
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Urgent Notification Indicator */}
            <div 
              className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title={urgentCount > 0 ? `${urgentCount} urgent donations live` : 'No urgent alerts'}
              onClick={() => onSelectPersona('ngo')}
            >
              <Bell className="w-5 h-5" />
              {urgentCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-xs bg-red-600 text-[10px] font-bold text-white shadow-xs">
                  {urgentCount}
                </span>
              )}
            </div>

            {/* Reset Demo State Button */}
            <button
              onClick={() => {
                if (confirm("Reset demo campus database to initial state?")) {
                  store.resetToDemo();
                }
              }}
              className="hidden md:flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200 cursor-pointer"
              title="Reset initial campus dataset"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>

            {/* Authenticated User Display vs Sign In Button */}
            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 pl-2.5 pr-2 py-1.5 rounded-xl shadow-2xs transition-all">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 leading-tight max-w-[120px] sm:max-w-[160px] truncate" title={currentUser.name}>
                      {currentUser.name}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-xs bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold capitalize">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className="ml-1 text-[11px] text-slate-400 hover:text-red-600 font-bold px-2 py-1 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer flex items-center gap-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

        </div>

        {/* Mobile Signed-In Banner */}
        {currentUser && (
          <div className="flex lg:hidden items-center justify-between py-2 px-3 bg-emerald-50/70 border-t border-emerald-100 text-xs rounded-b-xl mb-1">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-xs bg-emerald-600 shrink-0" />
              <span className="font-bold text-slate-900 truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-emerald-800 font-bold uppercase bg-emerald-100 px-1.5 py-0.5 rounded">
                {currentUser.role}
              </span>
            </div>
            <button
              onClick={onSignOut}
              className="text-xs text-red-600 font-bold shrink-0 ml-2"
            >
              Sign Out
            </button>
          </div>
        )}

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
        </div>

      </div>
    </header>
  );
};

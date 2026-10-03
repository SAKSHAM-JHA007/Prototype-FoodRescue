import React, { useState } from 'react';
import { UserRole } from '../types';
import { X, Check, Lock, Mail, Phone, User, Store, HeartHandshake, Truck } from 'lucide-react';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSelectRole
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('provider');
  const [email, setEmail] = useState('provider@campus.edu');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Mess Coordinator');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [agreed, setAgreed] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectRole(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-6 animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Logo Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {mode === 'login' ? 'Welcome Back!' : 'Join Campus FoodRescue'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login' 
              ? 'Select your role and sign in to coordinate rescues' 
              : 'Create your account and be part of the change'}
          </p>
        </div>

        {/* Role Selector matching Mockup */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            
            <button
              type="button"
              onClick={() => setSelectedRole('provider')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'provider'
                  ? 'border-brand-600 bg-brand-50/80 text-brand-800 font-bold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="text-lg mb-1">🍲</div>
              <p className="text-xs">Provider</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('ngo')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'ngo'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-800 font-bold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="text-lg mb-1">🏢</div>
              <p className="text-xs">NGO</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('volunteer')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'volunteer'
                  ? 'border-emerald-600 bg-emerald-50/80 text-emerald-800 font-bold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="text-lg mb-1">🚴</div>
              <p className="text-xs">Volunteer</p>
            </button>

          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full text-xs font-medium border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 focus:outline-brand-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@campus.edu"
                className="w-full text-xs font-medium border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 focus:outline-brand-600"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs font-medium border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 focus:outline-brand-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 focus:outline-brand-600"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-500 cursor-pointer">
                I agree to the Terms of Service & Food Safety Protocols
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft transition-all cursor-pointer"
          >
            {mode === 'login' ? `Sign In as ${selectedRole.toUpperCase()}` : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button 
                onClick={() => setMode('signup')}
                className="text-brand-700 font-bold hover:underline"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button 
                onClick={() => setMode('login')}
                className="text-brand-700 font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

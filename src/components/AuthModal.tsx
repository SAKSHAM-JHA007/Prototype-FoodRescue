import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { X, Lock, Mail, Phone, User, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';

export interface UserAuthData {
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (user: UserAuthData) => void;
  defaultRole?: UserRole;
  currentUserName?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  defaultRole = 'provider',
  currentUserName = ''
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [name, setName] = useState(currentUserName || 'Ramesh Sharma');
  const [email, setEmail] = useState('provider@campus.edu');
  const [password, setPassword] = useState('demo1234');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [agreed, setAgreed] = useState(true);

  // Sync role defaults when role changes if user hasn't typed custom name
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'provider') {
      setEmail('provider@campus.edu');
      setName(prev => (prev === 'Sunita Rao' || prev === 'Alex Johnson' || !prev) ? 'Ramesh Sharma' : prev);
    } else if (role === 'ngo') {
      setEmail('ngo@helpinghands.org');
      setName(prev => (prev === 'Ramesh Sharma' || prev === 'Alex Johnson' || !prev) ? 'Sunita Rao' : prev);
    } else if (role === 'volunteer') {
      setEmail('volunteer@campus.edu');
      setName(prev => (prev === 'Ramesh Sharma' || prev === 'Sunita Rao' || !prev) ? 'Alex Johnson' : prev);
    }
  };

  useEffect(() => {
    if (currentUserName) {
      setName(currentUserName);
    }
  }, [currentUserName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || (selectedRole === 'provider' ? 'Mess Coordinator' : selectedRole === 'ngo' ? 'NGO Representative' : 'Campus Volunteer');
    onSignIn({
      name: finalName,
      role: selectedRole,
      email: email.trim(),
      phone: phone.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-6 animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Logo Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Sign In to FoodRescue' : 'Create Your Account'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login' 
              ? 'Enter your name and role to coordinate campus food recovery' 
              : 'Join as a provider, recipient shelter, or student courier'}
          </p>
        </div>

        {/* Role Selector (Human, no capsule/pill shapes) */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            
            <button
              type="button"
              onClick={() => handleRoleSelect('provider')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'provider'
                  ? 'border-brand-600 bg-brand-50 text-brand-800 font-bold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="text-lg mb-1">🍲</div>
              <p className="text-xs">Food Provider</p>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('ngo')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'ngo'
                  ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="text-lg mb-1">🏢</div>
              <p className="text-xs">Recipient NGO</p>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('volunteer')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'volunteer'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="text-lg mb-1">🚴</div>
              <p className="text-xs">Volunteer</p>
            </button>

          </div>
        </div>

        {/* Sign In / Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Ask for Name in both Login & Signup */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Full Name / Coordinator Name <span className="text-emerald-700 font-bold">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ramesh Sharma or Alex Johnson"
                className="w-full text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 focus:outline-brand-600 bg-slate-50/50 focus:bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              This name will be displayed on your dashboard, delivery dispatches, and verification logs.
            </p>
          </div>

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
            className="w-full mt-2 py-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>
              {mode === 'login' ? `Sign In as ${name || selectedRole}` : 'Create Account'}
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button 
                onClick={() => setMode('signup')}
                className="text-brand-700 font-bold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button 
                onClick={() => setMode('login')}
                className="text-brand-700 font-bold hover:underline cursor-pointer"
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

import React from 'react';
import { Persona } from '../types';
import { 
  ArrowRight, 
  UtensilsCrossed, 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Truck, 
  BarChart3,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onSelectPersona: (persona: Persona) => void;
  onOpenCreateDonation: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPersona,
  onOpenCreateDonation
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100 bg-gradient-to-b from-brand-50/60 via-white to-white">
        
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-100/40 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-semibold tracking-wide shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                Reducing Food Waste • Nourishing Communities
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Good Food Should Reach <span className="text-brand-600 underline decoration-brand-300 decoration-wavy decoration-from-font">People,</span> Not Bins.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
                FoodRescue connects food providers with verified NGOs and campus volunteers to rescue surplus cooked food <strong className="text-slate-800 font-semibold">while it is still safe to eat</strong>.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    onSelectPersona('provider');
                    setTimeout(() => onOpenCreateDonation(), 150);
                  }}
                  className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-soft hover:shadow-glow flex items-center gap-2.5 transition-all group cursor-pointer"
                >
                  <span>List Surplus Food</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onSelectPersona('ngo')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/80 font-semibold text-base shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Claim as NGO</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => onSelectPersona('volunteer')}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Truck className="w-4 h-4 text-brand-600" /> Volunteer Pickup
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" /> Under 60-second listing
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" /> FSSAI food-safety compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" /> QR-code verified handover
                </span>
              </div>

            </div>

            {/* Right Column: Visual Showcase matching Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Food Dish Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
                    alt="Fresh surplus meal"
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="px-2.5 py-1 text-xs font-bold bg-brand-500 text-white rounded-md mb-2 inline-block">
                      100% Safe Surplus
                    </span>
                    <h3 className="text-xl font-bold">Nutritious Hot Meals Rescued Daily</h3>
                    <p className="text-xs text-slate-300 mt-1">Connecting student messes, canteens & restaurants directly to shelters.</p>
                  </div>
                </div>

                {/* Floating Callout Badges (as in the mockup!) */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-card border border-slate-200/60 flex items-center gap-2.5 animate-bounce-subtle">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">
                    🍲
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">Surplus Food</p>
                    <p className="text-[10px] text-slate-500">From campus providers</p>
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-card border border-slate-200/60 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                    ✨
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">Rescued & Delivered</p>
                    <p className="text-[10px] text-brand-600 font-semibold">Zero Double Accepts</p>
                  </div>
                </div>

                <div className="absolute -bottom-4 right-6 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-card border border-slate-200/60 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                    ❤️
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">Nourishing Communities</p>
                    <p className="text-[10px] text-slate-500">Shelters & Night Homes</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Quick Impact Stats (Directly from Mockup) */}
      <section className="bg-slate-50 py-10 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-extrabold text-slate-900">12,480</p>
                <p className="text-xs text-slate-500 font-medium">Meals Rescued</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-extrabold text-slate-900">8,920</p>
                <p className="text-xs text-slate-500 font-medium">People Served</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-extrabold text-slate-900">42</p>
                <p className="text-xs text-slate-500 font-medium">Active NGOs</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-extrabold text-slate-900">1,284</p>
                <p className="text-xs text-slate-500 font-medium">Successful Pickups</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* "How It Works" 4-Step Process Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Simple 4-Step Loop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              How It Works
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              A time-boxed, verified coordination workflow engineered to close the rescue loop before the safe-until deadline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:bg-brand-50/40 hover:border-brand-200 transition-all">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center mb-4 text-sm group-hover:bg-brand-600 transition-colors">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">List Surplus Food</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Providers list surplus in under 60 seconds with servings, dietary tags, allergens, and safe-until window.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:bg-brand-50/40 hover:border-brand-200 transition-all">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center mb-4 text-sm group-hover:bg-brand-600 transition-colors">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rule-based algorithm hard-filters dietary and capacity fit, then notifies the top verified nearby NGOs in seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:bg-brand-50/40 hover:border-brand-200 transition-all">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center mb-4 text-sm group-hover:bg-brand-600 transition-colors">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pickup & Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                NGO collects directly or dispatches a campus volunteer. Handover verified via 4-digit security code.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:bg-brand-50/40 hover:border-brand-200 transition-all">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center mb-4 text-sm group-hover:bg-brand-600 transition-colors">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Impact Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Confirmed meal counts record real rescue metrics and CO2 greenhouse gas emissions avoided.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive Role Selector for Fast Exploration */}
      <section className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Experience the Prototype Personas</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Switch roles to experience each critical touchpoint of the pilot workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div 
              onClick={() => onSelectPersona('provider')}
              className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer hover:border-brand-500 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-lg mb-3">
                🍲
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-brand-400 transition-colors">
                Food Provider
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Student mess, cafeteria, restaurant. Create donation in 60s, view notified NGOs, and give pickup code.
              </p>
              <div className="mt-4 text-xs font-semibold text-brand-400 flex items-center gap-1">
                Launch Provider <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div 
              onClick={() => onSelectPersona('ngo')}
              className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer hover:border-blue-500 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-3">
                🏢
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                Recipient NGO
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Shelter or community kitchen. Interactive Leaflet map, 1-tap claim, choose self-collect or volunteer.
              </p>
              <div className="mt-4 text-xs font-semibold text-blue-400 flex items-center gap-1">
                Launch NGO <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div 
              onClick={() => onSelectPersona('volunteer')}
              className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer hover:border-emerald-500 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-3">
                🚴
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                Campus Volunteer
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Student pickup tasks with radius filters, step-by-step navigation, and secure QR/code handoff.
              </p>
              <div className="mt-4 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                Launch Volunteer <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div 
              onClick={() => onSelectPersona('admin')}
              className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer hover:border-amber-500 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-3">
                🛡️
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                Admin At-Risk Board
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Live monitoring of donations near expiry, broadcast radius escalations, and audit logs.
              </p>
              <div className="mt-4 text-xs font-semibold text-amber-400 flex items-center gap-1">
                Launch Admin <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700">FoodRescue Pilot v2 • Single-Campus Prototype</p>
          <p className="mt-1">Built with React, Vite, TypeScript, Tailwind CSS, Leaflet & n8n Automation Engine.</p>
        </div>
      </footer>

    </div>
  );
};

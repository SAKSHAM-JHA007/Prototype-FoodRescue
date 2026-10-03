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
  ChevronRight,
  Building2,
  Users
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
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200 bg-gradient-to-b from-emerald-50/50 via-white to-white">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/30 rounded-3xl blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Human Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold tracking-tight">
                <span className="w-2 h-2 rounded-xs bg-emerald-600" />
                Single-Campus Food Rescue Pilot
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Good food should reach <span className="text-emerald-700 underline decoration-emerald-300 decoration-2 underline-offset-4">people,</span> not bins.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
                FoodRescue connects student messes, caterers, and restaurants with verified shelters and campus volunteers to rescue surplus cooked meals <strong className="text-slate-900 font-semibold">while they are still safe and nutritious to eat</strong>.
              </p>

              {/* Action Buttons (Human, rounded-xl, no capsule pills) */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => {
                    onSelectPersona('provider');
                    setTimeout(() => onOpenCreateDonation(), 150);
                  }}
                  className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm hover:shadow flex items-center gap-2.5 transition-all group cursor-pointer"
                >
                  <span>List Surplus Food</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onSelectPersona('ngo')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Claim as NGO</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => onSelectPersona('volunteer')}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-emerald-700" /> Volunteer Courier
                </button>
              </div>

              {/* Trust Checkpoints */}
              <div className="pt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Under 60-second listing
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> FSSAI food-safety compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> QR-code verified handoff
                </span>
              </div>

            </div>

            {/* Right Column: Visual Showcase matching Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 group">
                  <img
                    src="/hero-rescue.png"
                    alt="Community volunteers passing surplus meal to person in need"
                    className="w-full h-[400px] object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                  
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white rounded-md mb-2 inline-block">
                      Hand-to-Hand Rescue
                    </span>
                    <h3 className="text-xl font-bold">Surplus Meals Delivered with Care</h3>
                    <p className="text-xs text-slate-300 mt-1">Connecting cafeteria surplus directly to individuals and families across the community.</p>
                  </div>
                </div>

                {/* Human Editorial Note Cards (No capsule bubbles) */}
                <div className="absolute -top-3 -left-3 bg-white px-3.5 py-2.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                    🍲
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Surplus Food</p>
                    <p className="text-[11px] text-slate-500">From campus providers</p>
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 bg-white px-3.5 py-2.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Rescued & Delivered</p>
                    <p className="text-[11px] text-emerald-700 font-medium">Atomic acceptance</p>
                  </div>
                </div>

                <div className="absolute -bottom-3 right-6 bg-white px-3.5 py-2.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-sm">
                    ❤️
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Nourishing Communities</p>
                    <p className="text-[11px] text-slate-500">Shelters & Night Homes</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Quick Impact Stats (Clean Human Cards, No Capsule Pills) */}
      <section className="bg-slate-50 py-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-100">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-extrabold text-slate-900">12,480</p>
                <p className="text-xs text-slate-500 font-medium">Meals Rescued</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 border border-teal-100">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-extrabold text-slate-900">8,920</p>
                <p className="text-xs text-slate-500 font-medium">People Served</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 border border-blue-100">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-extrabold text-slate-900">42</p>
                <p className="text-xs text-slate-500 font-medium">Active NGOs</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-100">
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
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              Coordinated Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              How It Works
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              A time-boxed, verified coordination workflow engineered to close the rescue loop before the safe-until deadline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
              <span className="text-xs font-mono font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 inline-block shadow-2xs">
                STEP 01
              </span>
              <h3 className="text-base font-bold text-slate-900">List Surplus Food</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Providers list surplus in under 60 seconds with servings, dietary tags, allergens, and safe-until window.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
              <span className="text-xs font-mono font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 inline-block shadow-2xs">
                STEP 02
              </span>
              <h3 className="text-base font-bold text-slate-900">Smart Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rule-based algorithm hard-filters dietary and capacity fit, then notifies the top verified nearby NGOs in seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
              <span className="text-xs font-mono font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 inline-block shadow-2xs">
                STEP 03
              </span>
              <h3 className="text-base font-bold text-slate-900">Pickup & Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                NGO collects directly or dispatches a campus volunteer. Handover verified via 4-digit security code.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
              <span className="text-xs font-mono font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 inline-block shadow-2xs">
                STEP 04
              </span>
              <h3 className="text-base font-bold text-slate-900">Impact Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Confirmed meal counts record real rescue metrics and CO2 greenhouse gas emissions avoided.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Human Role Selector */}
      <section className="bg-slate-900 text-white py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Explore The Platform Roles</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
              Experience the workflow designed for each campus stakeholder.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div 
              onClick={() => onSelectPersona('provider')}
              className="p-6 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 cursor-pointer hover:border-emerald-500 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-3">
                🍲
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                Food Provider
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Student mess, cafeteria, restaurant. Create donation in 60s, view notified NGOs, and give pickup code.
              </p>
              <div className="mt-4 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                Open Provider <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div 
              onClick={() => onSelectPersona('ngo')}
              className="p-6 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 cursor-pointer hover:border-blue-500 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg mb-3">
                🏢
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                Recipient NGO
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Shelter or community kitchen. Interactive Leaflet map, 1-tap claim, choose self-collect or volunteer.
              </p>
              <div className="mt-4 text-xs font-semibold text-blue-400 flex items-center gap-1">
                Open NGO <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div 
              onClick={() => onSelectPersona('volunteer')}
              className="p-6 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 cursor-pointer hover:border-emerald-500 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-3">
                🚴
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                Campus Volunteer
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Student pickup tasks with radius filters, step-by-step navigation, and secure QR/code handoff.
              </p>
              <div className="mt-4 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                Open Volunteer <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-800">FoodRescue Pilot v2</p>
          <p className="text-slate-500">Empowering campus dining halls and local shelters to eliminate hunger and food waste.</p>
        </div>
      </footer>

    </div>
  );
};

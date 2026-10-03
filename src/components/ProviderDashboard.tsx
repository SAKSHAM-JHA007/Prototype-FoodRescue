import React, { useState } from 'react';
import { Donation, Organization, DietaryType } from '../types';
import { store } from '../services/store';
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  QrCode, 
  Sparkles, 
  Utensils, 
  X,
  Share2,
  Copy,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface ProviderDashboardProps {
  donations: Donation[];
  organizations: Organization[];
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  donations,
  organizations,
  isCreateModalOpen,
  setIsCreateModalOpen,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'past' | 'analytics'>('active');
  const [selectedDonationForView, setSelectedDonationForView] = useState<Donation | null>(null);
  const [createdDonationSuccess, setCreatedDonationSuccess] = useState<Donation | null>(null);
  const [showPickupCodeModal, setShowPickupCodeModal] = useState<Donation | null>(null);

  // Form State
  const [foodName, setFoodName] = useState('Rajma Chawal, Roti & Salad');
  const [quantityMeals, setQuantityMeals] = useState<number>(45);
  const [foodCategory, setFoodCategory] = useState<DietaryType>('Vegetarian');
  const [allergens, setAllergens] = useState<string[]>(['Dairy']);
  const [packaging, setPackaging] = useState('Insulated Packed Containers');
  const [safeHoursFromNow, setSafeHoursFromNow] = useState(2.5);
  const [notes, setNotes] = useState('Freshly prepared afternoon mess surplus. Kept in warm insulated food containers.');
  const [providerOrgId, setProviderOrgId] = useState(organizations[0]?.id || 'org-mit-mess');
  const [fssaiAccepted, setFssaiAccepted] = useState(true);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);

  // Active provider donations
  const activeDonations = donations.filter(d => 
    d.status === 'OPEN' || d.status === 'ACCEPTED' || d.status === 'PICKUP_PENDING' || d.status === 'IN_TRANSIT'
  );
  const pastDonations = donations.filter(d => d.status === 'DELIVERED' || d.status === 'CANCELLED' || d.status === 'EXPIRED');

  const totalMealsAvailable = activeDonations.reduce((sum, d) => sum + d.servingsListed, 0);

  // Quick AI Assistant Autofill feature (PRD Section 11.6)
  const handleAiAutoSuggest = () => {
    setIsAiSuggesting(true);
    setTimeout(() => {
      setFoodName('Paneer Butter Masala, Jeera Rice & Dal Tadka');
      setQuantityMeals(65);
      setFoodCategory('Vegetarian');
      setAllergens(['Dairy']);
      setPackaging('Bulk Sealed Trays');
      setSafeHoursFromNow(2.0);
      setNotes('Dinner banquet buffet extra. High quality, blast chilled and stored in hygienic steel dispensers.');
      setIsAiSuggesting(false);
    }, 500);
  };

  const handleCreateDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fssaiAccepted) {
      alert("Please confirm the FSSAI food-safety declaration before publishing.");
      return;
    }

    const safeUntil = new Date(Date.now() + safeHoursFromNow * 60 * 60 * 1000).toISOString();

    const created = store.createDonation({
      providerOrgId,
      foodName,
      servingsListed: Number(quantityMeals),
      dietaryType: foodCategory,
      allergens,
      packaging,
      safeUntil,
      notes,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
    });

    setIsCreateModalOpen(false);
    setCreatedDonationSuccess(created);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner matching Mockup */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Provider Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            List your surplus food and help it reach verified community kitchens while still fresh.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-soft hover:shadow-glow flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Donation
        </button>
      </div>

      {/* Stats Cards Row matching Mockup */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Donations</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 text-sm">🍲</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{activeDonations.length}</p>
          <p className="text-xs text-slate-400 mt-1">Live on campus</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Meals Available</span>
            <span className="p-2 rounded-xl bg-brand-50 text-brand-600 text-sm">🥗</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalMealsAvailable}</p>
          <p className="text-xs text-brand-600 font-semibold mt-1">Servings ready now</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Picked Up Today</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 text-sm">🚚</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">4</p>
          <p className="text-xs text-slate-400 mt-1">Completed handovers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Success Rate</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm">✓</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">98%</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Zero wasted batches</p>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'active' 
              ? 'border-brand-600 text-brand-700 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Donations ({activeDonations.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'past' 
              ? 'border-brand-600 text-brand-700 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Past Donations ({pastDonations.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'analytics' 
              ? 'border-brand-600 text-brand-700 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Analytics & Impact
        </button>
      </div>

      {/* Tab 1: Active Donations */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeDonations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No active donations right now</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Got leftover mess or event food? Click Create Donation to notify nearby NGOs in under 60 seconds.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700"
              >
                Create Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeDonations.map(donation => {
                const safeTime = new Date(donation.safeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const isUrgent = donation.urgency === 'URGENT' || donation.urgency === 'CRITICAL';

                return (
                  <div 
                    key={donation.id} 
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image + Badges */}
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        <img 
                          src={donation.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'} 
                          alt={donation.foodName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shadow-xs ${
                            donation.status === 'OPEN' 
                              ? 'bg-amber-500 text-white animate-pulse'
                              : donation.status === 'ACCEPTED'
                              ? 'bg-blue-600 text-white'
                              : donation.status === 'IN_TRANSIT'
                              ? 'bg-purple-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {donation.status === 'OPEN' ? '⚡ Matching NGOs...' : donation.status}
                          </span>
                        </div>

                        {/* Urgency Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg shadow-xs ${
                            donation.urgency === 'CRITICAL' 
                              ? 'bg-red-600 text-white animate-bounce'
                              : donation.urgency === 'URGENT'
                              ? 'bg-amber-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {donation.urgency}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 text-white">
                          <p className="text-xs font-medium text-slate-200">{donation.providerName}</p>
                          <h4 className="text-base font-bold truncate max-w-xs">{donation.foodName}</h4>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                            {donation.servingsListed} meals
                          </span>
                          <span className="text-slate-600 font-medium">
                            {donation.dietaryType}
                          </span>
                          <span className="text-slate-500">
                            {donation.packaging}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" /> Safe until:
                            </span>
                            <strong className="text-slate-900 font-semibold">{safeTime}</strong>
                          </div>

                          {donation.acceptedByOrgName && (
                            <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                              <span>Claimed by:</span>
                              <strong className="text-blue-700 font-bold">{donation.acceptedByOrgName}</strong>
                            </div>
                          )}

                          {donation.volunteerName && (
                            <div className="flex items-center justify-between text-slate-600">
                              <span>Volunteer:</span>
                              <strong className="text-brand-700">{donation.volunteerName}</strong>
                            </div>
                          )}
                        </div>

                        {donation.notes && (
                          <p className="text-xs text-slate-500 line-clamp-2 italic">
                            "{donation.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-4 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => setShowPickupCodeModal(donation)}
                        className="flex-1 py-2 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-brand-200 transition-colors cursor-pointer"
                        title="Show verification code for courier pickup"
                      >
                        <QrCode className="w-3.5 h-3.5" /> Pickup Code
                      </button>

                      <button
                        onClick={() => setSelectedDonationForView(donation)}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Past Donations */}
      {activeTab === 'past' && (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {pastDonations.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-500">No past donations yet.</p>
          ) : (
            pastDonations.map(d => (
              <div key={d.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{d.foodName}</h4>
                  <p className="text-xs text-slate-500">
                    {d.servingsListed} meals • {d.acceptedByOrgName || 'N/A'} • {new Date(d.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    d.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {d.status === 'DELIVERED' ? '✓ Rescued' : d.status}
                  </span>
                  <button
                    onClick={() => {
                      setFoodName(d.foodName);
                      setQuantityMeals(d.servingsListed);
                      setFoodCategory(d.dietaryType);
                      setIsCreateModalOpen(true);
                    }}
                    className="p-1.5 text-xs text-brand-700 hover:bg-brand-50 rounded-lg flex items-center gap-1 border border-brand-200"
                    title="Repeat this listing in 1 tap"
                  >
                    <RotateCcw className="w-3 h-3" /> Repeat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Campus Waste Diversion Metrics</h3>
            <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
              MIT Campus Pilot
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500">Rescue Rate (Confirmed / Listed)</span>
              <p className="text-2xl font-extrabold text-brand-700 mt-1">94.2%</p>
              <p className="text-[11px] text-slate-400 mt-1">Surpasses 60% pilot baseline goal</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500">Avg Time to Recipient Match</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">8.5 mins</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Zero double accepts</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500">CO2 Equivalent Diverted</span>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">820 kg CO2e</p>
              <p className="text-[11px] text-slate-400 mt-1">Based on 2.5kg CO2 per kg food</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: Create New Donation (Matching Panel 5 in Mockup) */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                  <span>⏱️</span> Under 60s Listing
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Create New Donation</h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Assistant Quick Pill */}
            <div className="mt-4 p-3 bg-gradient-to-r from-brand-50 via-emerald-50 to-teal-50 rounded-2xl border border-brand-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-semibold text-brand-900">
                  Auto-fill from today's cafeteria menu?
                </span>
              </div>
              <button
                type="button"
                onClick={handleAiAutoSuggest}
                disabled={isAiSuggesting}
                className="px-3 py-1 bg-white hover:bg-brand-50 text-brand-700 font-bold text-xs rounded-xl border border-brand-300 shadow-2xs transition-all"
              >
                {isAiSuggesting ? 'Thinking...' : '✨ Auto-Fill'}
              </button>
            </div>

            <form onSubmit={handleCreateDonationSubmit} className="mt-4 space-y-4">
              
              {/* Provider Location Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Food Provider Facility *
                </label>
                <select
                  value={providerOrgId}
                  onChange={e => setProviderOrgId(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-brand-600"
                >
                  {organizations.filter(o => o.type !== 'ngo' && o.type !== 'shelter').map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.address})
                    </option>
                  ))}
                </select>
              </div>

              {/* Food Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Food Name *
                </label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={e => setFoodName(e.target.value)}
                  placeholder="e.g. Rice, Dal, Paneer"
                  className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-brand-600"
                />
              </div>

              {/* Servings & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quantity (Servings / Meals) *
                  </label>
                  <input
                    type="number"
                    min={5}
                    required
                    value={quantityMeals}
                    onChange={e => setQuantityMeals(Number(e.target.value))}
                    className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Food Category *
                  </label>
                  <select
                    value={foodCategory}
                    onChange={e => setFoodCategory(e.target.value as DietaryType)}
                    className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:outline-brand-600"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-veg">Non-veg</option>
                    <option value="Egg">Egg</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              </div>

              {/* Packaging & Safe Until */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Packaging Type
                  </label>
                  <select
                    value={packaging}
                    onChange={e => setPackaging(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:outline-brand-600"
                  >
                    <option value="Insulated Packed Containers">Insulated Packed Containers</option>
                    <option value="Individual Meal Boxes">Individual Meal Boxes</option>
                    <option value="Bulk Sealed Trays">Bulk Sealed Trays</option>
                    <option value="Catering Utensils">Catering Utensils</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Safe-Until Deadline *
                  </label>
                  <select
                    value={safeHoursFromNow}
                    onChange={e => setSafeHoursFromNow(Number(e.target.value))}
                    className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:outline-brand-600"
                  >
                    <option value={1.0}>1 Hour from now (Urgent)</option>
                    <option value={2.0}>2 Hours from now (Recommended)</option>
                    <option value={3.0}>3 Hours from now</option>
                    <option value={4.0}>4 Hours from now (Max Cooked Limit)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Storage Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any details on dietary flags or special pickup instructions..."
                  className="w-full text-xs font-medium border border-slate-300 rounded-xl p-3 focus:outline-brand-600"
                />
              </div>

              {/* Food Safety & Trust Declaration (PRD Section 10) */}
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="fssai"
                  checked={fssaiAccepted}
                  onChange={e => setFssaiAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <label htmlFor="fssai" className="text-[11px] text-amber-900 leading-tight cursor-pointer">
                  <strong>Food Safety Declaration:</strong> I confirm this surplus food was cooked hygienically, stored appropriately at safe temperatures, and has not been served/partially consumed.
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-soft hover:shadow-glow cursor-pointer"
                >
                  Create Donation & Notify NGOs
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: "Donation Sent!" Success (Panel 6 in Mockup)      */}
      {/* ========================================================= */}
      {createdDonationSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 text-center animate-fade-in">
            
            {/* Green Animated Success Circle */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border-2 border-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900">Donation Sent!</h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto">
              Your food donation has been listed and nearby NGOs have been notified in real time.
            </p>

            {/* Donation Quick Card */}
            <div className="my-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left flex items-center gap-3">
              <img
                src={createdDonationSuccess.imageUrl}
                alt={createdDonationSuccess.foodName}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-slate-900 truncate">
                  {createdDonationSuccess.foodName}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {createdDonationSuccess.servingsListed} meals • {createdDonationSuccess.dietaryType}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">
                    Pickup before {new Date(createdDonationSuccess.safeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {/* List of Notified NGOs (From Mockup Panel 6!) */}
            <div className="text-left space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Notified 5 nearby NGOs
              </span>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {createdDonationSuccess.matchedNgos?.map((ngo, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between bg-white hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <p className="font-semibold text-slate-800 text-[11px]">{ngo.name}</p>
                        <p className="text-[10px] text-slate-400">{ngo.distanceKm} km away</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Notified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dismiss CTA */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => {
                  setShowPickupCodeModal(createdDonationSuccess);
                  setCreatedDonationSuccess(null);
                }}
                className="w-1/2 py-2.5 rounded-xl border border-brand-300 bg-brand-50 text-brand-700 text-xs font-bold hover:bg-brand-100"
              >
                View Pickup Code
              </button>
              <button
                onClick={() => setCreatedDonationSuccess(null)}
                className="w-1/2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-soft"
              >
                Back to Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: Courier / Volunteer Pickup Handoff Code          */}
      {/* ========================================================= */}
      {showPickupCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Pickup Verification Code</h3>
              <button 
                onClick={() => setShowPickupCodeModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Give this 4-digit code to the courier or volunteer when they arrive to hand over the food.
            </p>

            {/* Large Code Badge */}
            <div className="my-6 p-4 rounded-2xl bg-slate-900 text-white inline-block shadow-lg">
              <span className="text-4xl font-extrabold tracking-widest font-mono text-emerald-400">
                {showPickupCodeModal.pickupCode}
              </span>
            </div>

            <div className="p-3 bg-brand-50 rounded-xl border border-brand-200 text-xs text-brand-800 text-left">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" /> Secure Chain of Custody
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                The volunteer cannot mark this food as In-Transit without verifying this code. Prevents food diversion.
              </p>
            </div>

            <button
              onClick={() => setShowPickupCodeModal(null)}
              className="mt-6 w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: Full Details Viewer                             */}
      {/* ========================================================= */}
      {selectedDonationForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Donation Status & Audit Trail</h3>
              <button onClick={() => setSelectedDonationForView(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-lg">{selectedDonationForView.foodName}</h4>
              <p className="text-xs text-slate-500">{selectedDonationForView.providerName} • {selectedDonationForView.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">CURRENT STATE</span>
                <span className="font-bold text-brand-700">{selectedDonationForView.status}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">URGENCY LEVEL</span>
                <span className="font-bold text-amber-700">{selectedDonationForView.urgency}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">PICKUP CODE</span>
                <span className="font-mono font-bold text-slate-900">{selectedDonationForView.pickupCode}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">DELIVERY CODE</span>
                <span className="font-mono font-bold text-slate-900">{selectedDonationForView.deliveryCode}</span>
              </div>
            </div>

            {selectedDonationForView.notes && (
              <div className="text-xs p-3 bg-slate-50 rounded-xl text-slate-600">
                <span className="font-bold block text-slate-800 mb-0.5">Handling Notes:</span>
                {selectedDonationForView.notes}
              </div>
            )}

            <button
              onClick={() => setSelectedDonationForView(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

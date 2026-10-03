import React, { useState } from 'react';
import { Donation, Organization, VolunteerProfile } from '../types';
import { store } from '../services/store';
import { MapComponent } from './MapComponent';
import { 
  HeartHandshake, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  X, 
  Truck, 
  ShieldCheck, 
  Filter, 
  ArrowUpDown,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NgoDashboardProps {
  donations: Donation[];
  organizations: Organization[];
  volunteer: VolunteerProfile;
}

export const NgoDashboard: React.FC<NgoDashboardProps> = ({
  donations,
  organizations,
  volunteer
}) => {
  const [selectedDonationToAccept, setSelectedDonationToAccept] = useState<Donation | null>(null);
  const [selectedDonationToDecline, setSelectedDonationToDecline] = useState<Donation | null>(null);
  const [selectedDonationToConfirmDelivery, setSelectedDonationToConfirmDelivery] = useState<Donation | null>(null);
  const [declineReason, setDeclineReason] = useState('Already at full storage capacity today');
  const [pickupMode, setPickupMode] = useState<'self' | 'volunteer'>('volunteer');
  const [deliveryCodeInput, setDeliveryCodeInput] = useState('');
  const [actualServingsInput, setActualServingsInput] = useState<number>(0);
  const [deliveryError, setDeliveryError] = useState('');
  const [filterDietary, setFilterDietary] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'urgency'>('urgency');

  // Active NGO ID (Helping Hands NGO from initial mock dataset)
  const currentNgo = organizations.find(o => o.id === 'ngo-helping-hands') || organizations[4];

  // Available open donations for nearby NGOs
  const openDonations = donations.filter(d => d.status === 'OPEN');
  const myClaimedDonations = donations.filter(d => d.acceptedByOrgId === currentNgo.id);

  // Filter & Sort
  const filteredDonations = openDonations.filter(d => {
    if (filterDietary === 'all') return true;
    return d.dietaryType.toLowerCase() === filterDietary.toLowerCase();
  }).sort((a, b) => {
    if (sortBy === 'urgency') {
      const order = { CRITICAL: 0, URGENT: 1, MEDIUM: 2, NORMAL: 3 };
      return order[a.urgency] - order[b.urgency];
    }
    return 0;
  });

  const totalMealsNearby = openDonations.reduce((sum, d) => sum + d.servingsListed, 0);

  // Handle Accept
  const handleConfirmAccept = () => {
    if (!selectedDonationToAccept) return;
    const res = store.acceptDonation(selectedDonationToAccept.id, currentNgo.id, pickupMode);
    if (!res.success) {
      alert(res.message);
    }
    setSelectedDonationToAccept(null);
  };

  // Handle Decline
  const handleConfirmDecline = () => {
    if (!selectedDonationToDecline) return;
    store.declineDonation(selectedDonationToDecline.id, currentNgo.id, declineReason);
    setSelectedDonationToDecline(null);
  };

  // Handle Delivery Code Confirmation
  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonationToConfirmDelivery) return;
    setDeliveryError('');

    const res = store.confirmDelivery(
      selectedDonationToConfirmDelivery.id, 
      deliveryCodeInput, 
      actualServingsInput || selectedDonationToConfirmDelivery.servingsListed
    );

    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setSelectedDonationToConfirmDelivery(null);
      setDeliveryCodeInput('');
    } else {
      setDeliveryError(res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header matching Mockup */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
              {currentNgo.name}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              ✓ Verified Partner
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            NGO Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Discover nearby food donations and coordinate rescues before expiry.
          </p>
        </div>

        {/* Quick Delivery Code Button if any claimed donation is in transit */}
        {myClaimedDonations.some(d => d.status === 'IN_TRANSIT') && (
          <button
            onClick={() => {
              const inTransit = myClaimedDonations.find(d => d.status === 'IN_TRANSIT');
              if (inTransit) {
                setSelectedDonationToConfirmDelivery(inTransit);
                setActualServingsInput(inTransit.servingsListed);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft flex items-center gap-2 animate-bounce-subtle"
          >
            <CheckCircle2 className="w-4 h-4" /> Incoming Food Arrived? Confirm Delivery
          </button>
        )}
      </div>

      {/* Stat Cards matching Mockup */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available Near You</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm">📍</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{openDonations.length}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Within 5km radius</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Meals Available</span>
            <span className="p-2 rounded-xl bg-brand-50 text-brand-600 text-sm">🍲</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalMealsNearby}</p>
          <p className="text-xs text-slate-400 mt-1">Servings ready for pickup</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Pickups</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 text-sm">🚚</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{myClaimedDonations.length}</p>
          <p className="text-xs text-blue-600 font-semibold mt-1">In progress</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">People Helped Today</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 text-sm">👥</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">148</p>
          <p className="text-xs text-slate-400 mt-1">Community kitchens served</p>
        </div>

      </div>

      {/* Interactive Leaflet Campus Map View */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> Live Campus Rescue Map
            </h3>
            <p className="text-xs text-slate-500">
              Real-time locations of student messes, donor restaurants, and community drop-off points.
            </p>
          </div>
        </div>

        <div className="h-[340px] w-full">
          <MapComponent 
            organizations={organizations} 
            donations={donations} 
            volunteer={volunteer}
          />
        </div>
      </div>

      {/* Nearby Food Donations Section matching Mockup Panel 2 */}
      <div className="space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Nearby Food Donations</h2>
            <p className="text-xs text-slate-500">1-tap atomic claim to prevent double booking.</p>
          </div>

          {/* Filters & Sorting */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterDietary}
                onChange={e => setFilterDietary(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="all">All Dietary</option>
                <option value="Vegetarian">Vegetarian Only</option>
                <option value="Non-veg">Non-veg Only</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="urgency">Sort: Most Urgent First</option>
                <option value="distance">Sort: Distance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Donation Feed */}
        {filteredDonations.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No surplus donations available right now</p>
            <p className="text-xs text-slate-400 mt-1">We will notify you immediately via push/Telegram when a food provider lists surplus.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDonations.map(donation => {
              const safeTime = new Date(donation.safeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isCritical = donation.urgency === 'CRITICAL';
              const isUrgent = donation.urgency === 'URGENT';

              return (
                <div 
                  key={donation.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={donation.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'}
                      alt={donation.foodName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                            {donation.providerName}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {donation.address}
                          </p>
                        </div>

                        {/* Urgency Badge */}
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg shrink-0 ${
                          isCritical 
                            ? 'bg-red-100 text-red-700 animate-pulse' 
                            : isUrgent 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {donation.urgency}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-brand-700 mt-2">
                        {donation.foodName}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          {donation.servingsListed} meals
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {donation.dietaryType}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                          {donation.packaging}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pickup deadline timer banner */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Pickup Deadline:
                    </span>
                    <span className="font-bold text-slate-900">
                      Before {safeTime}
                    </span>
                  </div>

                  {/* Accept / Decline Action Buttons matching Mockup */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelectedDonationToAccept(donation)}
                      className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-soft hover:shadow-glow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Donation
                    </button>

                    <button
                      onClick={() => setSelectedDonationToDecline(donation)}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl transition-all"
                    >
                      Decline
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: Accept Donation (Choose Self-Collect vs Volunteer) */}
      {/* ========================================================= */}
      {selectedDonationToAccept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-fade-in">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Accept Donation</h3>
                <p className="text-xs text-slate-500">{selectedDonationToAccept.foodName}</p>
              </div>
              <button onClick={() => setSelectedDonationToAccept(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-3 bg-brand-50 rounded-2xl border border-brand-200 text-xs">
              <span className="font-bold text-brand-900 block">{selectedDonationToAccept.servingsListed} Meals Available</span>
              <p className="text-slate-600 mt-0.5">Location: {selectedDonationToAccept.address}</p>
            </div>

            {/* Transport Mode Selection (PRD Section 5 & 11.2) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                How will you collect this food?
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPickupMode('volunteer')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    pickupMode === 'volunteer' 
                      ? 'border-brand-600 bg-brand-50/80 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm mb-2">
                    🚴
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Request Volunteer</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Broadcasts to campus student couriers</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPickupMode('self')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    pickupMode === 'self' 
                      ? 'border-blue-600 bg-blue-50/80 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-2">
                    🚚
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Self Collect</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">We have our own vehicle & driver</p>
                </button>
              </div>
            </div>

            {/* Atomic Commitment Note */}
            <div className="text-[11px] text-slate-500 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              ⚠️ <strong>Commitment Notice:</strong> Accepting locks this donation atomically. Please ensure your team is ready to distribute before safe-until.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDonationToAccept(null)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                className="w-2/3 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-soft"
              >
                Confirm Acceptance
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: Decline with Reason (PRD Section 5)                */}
      {/* ========================================================= */}
      {selectedDonationToDecline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Decline Donation Offer</h3>
            <p className="text-xs text-slate-500">
              Reasons help optimize future matching ranking and prevent redundant alerts.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for declining:</label>
              <select
                value={declineReason}
                onChange={e => setDeclineReason(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5"
              >
                <option value="Already at full storage capacity today">Already at full storage capacity today</option>
                <option value="No transport / vehicle unavailable right now">No transport / vehicle unavailable right now</option>
                <option value="Dietary restriction mismatch with beneficiaries">Dietary restriction mismatch with beneficiaries</option>
                <option value="Kitchen facility closed at this hour">Kitchen facility closed at this hour</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedDonationToDecline(null)}
                className="w-1/2 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecline}
                className="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
              >
                Submit Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: Confirm Delivery with 4-Digit Code                 */}
      {/* ========================================================= */}
      {selectedDonationToConfirmDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Confirm Food Delivery (Rescued)</h3>
              <button onClick={() => setSelectedDonationToConfirmDelivery(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Enter the 4-digit code provided on this delivery to confirm receipt and record verified impact.
            </p>

            <form onSubmit={handleConfirmDelivery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4-Digit Delivery Code *
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={deliveryCodeInput}
                  onChange={e => setDeliveryCodeInput(e.target.value)}
                  placeholder="e.g. 9041"
                  className="w-full text-center text-2xl font-mono font-bold tracking-widest border border-slate-300 rounded-xl p-3 focus:outline-brand-600"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  (Demo Hint: Delivery code is <code className="font-mono font-bold">{selectedDonationToConfirmDelivery.deliveryCode}</code>)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Actual Servings Received & Verified
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={actualServingsInput}
                  onChange={e => setActualServingsInput(Number(e.target.value))}
                  className="w-full text-xs font-medium border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              {deliveryError && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
                  {deliveryError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-soft"
              >
                Confirm Receipt & Record Impact
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

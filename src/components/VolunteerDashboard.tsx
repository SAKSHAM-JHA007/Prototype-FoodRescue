import React, { useState } from 'react';
import { Donation, Organization, VolunteerProfile } from '../types';
import { store } from '../services/store';
import { MapComponent } from './MapComponent';
import { UserAuthData } from './Navbar';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  QrCode, 
  ArrowRight, 
  Navigation,
  Compass,
  Phone,
  Award,
  Power,
  Sparkles,
  XCircle,
  PackageCheck,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VolunteerDashboardProps {
  donations: Donation[];
  organizations: Organization[];
  volunteer: VolunteerProfile;
  currentUser?: UserAuthData | null;
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({
  donations,
  organizations,
  volunteer,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'available' | 'impact'>('mission');
  const [pickupCodeInput, setPickupCodeInput] = useState('');
  const [pickupError, setPickupError] = useState('');
  const [isVerifyingPickup, setIsVerifyingPickup] = useState(false);

  const [deliveryCodeInput, setDeliveryCodeInput] = useState('');
  const [deliveredServingsInput, setDeliveredServingsInput] = useState<number | ''>('');
  const [deliveryError, setDeliveryError] = useState('');
  const [isVerifyingDelivery, setIsVerifyingDelivery] = useState(false);
  const [isReleasingTask, setIsReleasingTask] = useState(false);

  // Active task the volunteer has accepted or is working on
  const activeTask = donations.find(d => 
    d.volunteerId === volunteer.id && (d.status === 'PICKUP_PENDING' || d.status === 'IN_TRANSIT' || d.status === 'ACCEPTED')
  );

  // Available rescue tasks waiting for a courier (PICKUP_PENDING without an active courier, or self-claimable)
  const availableTasks = donations.filter(d => 
    (d.status === 'PICKUP_PENDING' && (!d.volunteerId || d.volunteerId === '')) ||
    (d.status === 'ACCEPTED' && d.pickupMode === 'volunteer' && !d.volunteerId)
  );

  // Completed rescues
  const completedRescues = donations.filter(d => d.status === 'DELIVERED');

  const handleToggleAvailability = () => {
    store.updateVolunteerAvailability(!volunteer.available);
  };

  const handleDistanceChange = (km: number) => {
    store.updateVolunteerAvailability(volunteer.available, km);
  };

  const handleAcceptTask = (donationId: string) => {
    const success = store.volunteerAcceptTask(donationId);
    if (success) {
      setActiveTab('mission');
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  const handleReleaseTask = () => {
    if (!activeTask) return;
    store.volunteerCancelTask(activeTask.id);
    setIsReleasingTask(false);
  };

  const handleVerifyPickup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    setPickupError('');

    const res = store.confirmPickup(activeTask.id, pickupCodeInput);
    if (res.success) {
      setIsVerifyingPickup(false);
      setPickupCodeInput('');
      confetti({ particleCount: 50, spread: 60 });
    } else {
      setPickupError(res.message);
    }
  };

  const handleVerifyDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    setDeliveryError('');

    const servings = typeof deliveredServingsInput === 'number' ? deliveredServingsInput : activeTask.servingsListed;
    const res = store.confirmDelivery(activeTask.id, deliveryCodeInput, servings);
    if (res.success) {
      setIsVerifyingDelivery(false);
      setDeliveryCodeInput('');
      setDeliveredServingsInput('');
      confetti({ particleCount: 80, spread: 80 });
    } else {
      setDeliveryError(res.message);
    }
  };

  const handleCreateDemoTask = () => {
    store.createDemoVolunteerTask();
    confetti({ particleCount: 30, spread: 40 });
  };

  // Find org entities for active task
  const activeProvider = activeTask ? organizations.find(o => o.id === activeTask.providerOrgId) : null;
  const activeNgo = activeTask ? organizations.find(o => o.id === activeTask.acceptedByOrgId) : null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-4 space-y-3.5">
      
      {/* Top Header & Compact Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-xs ${volunteer.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Campus Courier & Rescue Network
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Volunteer Transport Hub
          </h1>
        </div>

        {/* Compact Right Control Bar */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Availability Toggle */}
          <button
            onClick={handleToggleAvailability}
            className={`px-3 py-1.5 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
              volunteer.available
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Power className={`w-3.5 h-3.5 ${volunteer.available ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{volunteer.available ? 'Online (Active)' : 'Offline (Break)'}</span>
          </button>

          {/* Radius Selector */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Radius:</span>
            <select
              value={volunteer.maxDistanceKm}
              onChange={e => handleDistanceChange(Number(e.target.value))}
              aria-label="Volunteer pickup radius in kilometers"
              className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value={2}>2 km</option>
              <option value={4}>4 km</option>
              <option value={6}>6 km</option>
              <option value={10}>10 km</option>
            </select>
          </div>

          {/* Volunteer Mini Chip */}
          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            <div className="w-6 h-6 rounded-md bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
              🚴
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[120px]">
                {currentUser?.name || volunteer.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                {volunteer.completedRescues} Runs • {Math.round(volunteer.reliabilityScore * 100)}%
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Offline Alert Strip (Compact) */}
      {!volunteer.available && (
        <div className="py-2 px-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-2 text-amber-900 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-semibold text-[11px]">
              You are marked offline. Pickup broadcasts are paused until you switch back online.
            </span>
          </div>
          <button
            onClick={handleToggleAvailability}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md text-[11px] shrink-0 cursor-pointer"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Navigation Tabs (Compact) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('mission')}
            className={`py-1.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'mission'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Active Mission</span>
            {activeTask && (
              <span className="px-1.5 py-0.2 bg-brand-600 text-white text-[10px] font-extrabold rounded-md">
                1 Active
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('available')}
            className={`py-1.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'available'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Available Runs</span>
            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
              {availableTasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`py-1.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'impact'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Impact & Badges</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
              {volunteer.completedRescues} Rescues
            </span>
          </button>
        </div>

        {/* Quick Demo Simulator Trigger */}
        <button
          onClick={handleCreateDemoTask}
          className="text-[11px] font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
          title="Create a simulated food pickup run to test the flow"
        >
          <Sparkles className="w-3 h-3 text-brand-600" />
          <span>+ Demo Run</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACTIVE MISSION (COMPACT SIDE-BY-SIDE LAYOUT FOR SCREENSHOTS) */}
      {/* ========================================================================= */}
      {activeTab === 'mission' && (
        <div>
          {activeTask ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
              
              {/* Left Column: Mission Controls & Steps (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-lg border border-slate-800 flex flex-col justify-between space-y-3.5">
                
                {/* Mission Header */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-black uppercase tracking-wide">
                        ACTIVE RUN
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {activeTask.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px]">
                      <span className={`w-2 h-2 rounded-xs ${activeTask.status === 'IN_TRANSIT' ? 'bg-blue-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span className="font-bold text-emerald-400">
                        {activeTask.status === 'IN_TRANSIT' ? 'En Route to Drop-off' : 'Awaiting Mess Pickup'}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-base sm:text-lg font-black text-white mt-1 leading-snug truncate">
                    {activeTask.foodName}
                  </h2>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    <strong>{activeTask.servingsListed} meals</strong> • {activeTask.packaging} • Safe until {new Date(activeTask.safeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Compact Milestone Stepper (Horizontal) */}
                <div className="grid grid-cols-4 gap-1.5 py-1">
                  <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700 text-center">
                    <p className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Claimed
                    </p>
                  </div>

                  <div className={`p-1.5 rounded-lg border text-center ${
                    activeTask.status === 'IN_TRANSIT'
                      ? 'bg-slate-800 border-slate-700 text-emerald-400'
                      : 'bg-brand-900/60 border-brand-500 text-white'
                  }`}>
                    <p className="text-[10px] font-bold flex items-center justify-center gap-0.5">
                      {activeTask.status === 'IN_TRANSIT' ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-xs bg-amber-400 animate-ping inline-block" />} Pickup
                    </p>
                  </div>

                  <div className={`p-1.5 rounded-lg border text-center ${
                    activeTask.status === 'IN_TRANSIT'
                      ? 'bg-brand-900/60 border-brand-500 text-white'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400'
                  }`}>
                    <p className="text-[10px] font-bold flex items-center justify-center gap-0.5">
                      <Navigation className="w-2.5 h-2.5" /> Transit
                    </p>
                  </div>

                  <div className="p-1.5 bg-slate-800/40 rounded-lg border border-slate-700 text-center text-slate-400">
                    <p className="text-[10px] font-bold flex items-center justify-center gap-0.5">
                      <PackageCheck className="w-2.5 h-2.5" /> Handover
                    </p>
                  </div>
                </div>

                {/* 2-Step Action Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* Step 1: Provider Pickup */}
                  <div className={`p-3 rounded-lg border text-xs flex flex-col justify-between space-y-2 ${
                    activeTask.status === 'IN_TRANSIT'
                      ? 'bg-slate-800/50 border-emerald-600/40'
                      : 'bg-slate-800 border-slate-700'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wide">
                          1. From Provider
                        </span>
                        {activeTask.status === 'IN_TRANSIT' ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        ) : (
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                            Action
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-xs truncate">{activeTask.providerName}</h4>
                      <p className="text-[11px] text-slate-300 truncate">{activeTask.address}</p>
                    </div>

                    {activeTask.status !== 'IN_TRANSIT' ? (
                      <div className="space-y-1">
                        <button
                          onClick={() => setIsVerifyingPickup(true)}
                          className="w-full py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-md flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <QrCode className="w-3.5 h-3.5" /> Verify Pickup Code
                        </button>
                        <span className="text-[10px] text-slate-400 block text-center">
                          Demo Code: <code className="text-emerald-300 font-mono font-bold">{activeTask.pickupCode}</code>
                        </span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Food collected safely
                      </div>
                    )}
                  </div>

                  {/* Step 2: Recipient NGO Handover */}
                  <div className={`p-3 rounded-lg border text-xs flex flex-col justify-between space-y-2 ${
                    activeTask.status === 'IN_TRANSIT'
                      ? 'bg-slate-800 border-blue-500/50 shadow-xs'
                      : 'bg-slate-800/40 border-slate-700'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-wide">
                          2. To Recipient NGO
                        </span>
                        {activeTask.status === 'IN_TRANSIT' && (
                          <span className="text-[9px] bg-blue-500 text-white font-bold px-1.5 py-0.2 rounded animate-pulse">
                            En Route
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-xs truncate">{activeTask.acceptedByOrgName || 'Helping Hands NGO'}</h4>
                      <p className="text-[11px] text-slate-300 truncate">{activeNgo?.address || 'Kasturba Nagar (~1.2 km)'}</p>
                    </div>

                    {activeTask.status === 'IN_TRANSIT' ? (
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setDeliveredServingsInput(activeTask.servingsListed);
                            setIsVerifyingDelivery(true);
                          }}
                          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-md flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <PackageCheck className="w-3.5 h-3.5" /> Handover & Deliver
                        </button>
                        <span className="text-[10px] text-slate-400 block text-center">
                          Delivery Code: <code className="text-blue-300 font-mono font-bold">{activeTask.deliveryCode}</code>
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500">
                        Unlock drop-off after Step 1 pickup.
                      </p>
                    )}
                  </div>

                </div>

                {/* Bottom Bar: Contact & Emergency Release */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>In-charge: {activeProvider?.contactPerson || 'Ramesh S.'} ({activeProvider?.phone || '9876543210'})</span>
                  </span>
                  <button
                    onClick={() => setIsReleasingTask(true)}
                    className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-0.5 cursor-pointer"
                  >
                    <XCircle className="w-3 h-3" /> Release Task
                  </button>
                </div>

              </div>

              {/* Right Column: Live Interactive Map (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Live Campus Transport Route
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Est: ~10 mins (1.2 km)
                  </span>
                </div>
                
                {/* Map Component with optimal screenshot height */}
                <div className="h-[260px] sm:h-[280px] w-full relative">
                  <MapComponent
                    donations={[activeTask]}
                    organizations={organizations}
                    volunteer={volunteer}
                    selectedDonationId={activeTask.id}
                  />
                </div>

                {/* Live Route Summary Bar */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-200 grid grid-cols-3 text-center divide-x divide-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">FROM</span>
                    <span className="font-bold text-slate-800 truncate block text-[11px]">{activeTask.providerName || 'BMSIT Mess'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">VIA</span>
                    <span className="font-bold text-orange-600 truncate block text-[11px]">Volunteer 🚴</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">TO</span>
                    <span className="font-bold text-blue-700 truncate block text-[11px]">Helping Hands</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Compact Empty Mission State */
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-xl font-bold">
                🚴
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900">No Active Mission</h3>
                <p className="text-xs text-slate-500">
                  Ready to rescue food? Claim an open request from available runs or generate a fast demo run to test the workflow.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => setActiveTab('available')}
                  className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Available Runs ({availableTasks.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCreateDemoTask}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Simulate Instant Rescue</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AVAILABLE RUNS FEED (COMPACT CARDS) */}
      {/* ========================================================================= */}
      {activeTab === 'available' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Surplus Batches in Your Zone ({availableTasks.length})
            </h2>
            <button
              onClick={handleCreateDemoTask}
              className="text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-md border border-brand-200 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" /> + Add Demo Run
            </button>
          </div>

          {availableTasks.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-xl border border-slate-200 space-y-2">
              <Truck className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">All current runs are covered!</p>
              <button
                onClick={handleCreateDemoTask}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg shadow-2xs inline-flex items-center gap-1 cursor-pointer mt-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Simulate New Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableTasks.map(task => {
                const safeTime = new Date(task.safeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div 
                    key={task.id}
                    className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-card transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {task.servingsListed} Meals
                        </span>
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Safe until {safeTime}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 mt-2 truncate">{task.foodName}</h4>

                      {/* Route Details */}
                      <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] space-y-1.5">
                        <div className="flex items-start gap-1.5">
                          <span className="w-2 h-2 rounded-xs bg-emerald-600 mt-0.5 shrink-0" />
                          <div className="truncate">
                            <span className="text-slate-400 font-bold block text-[9px] uppercase">From</span>
                            <span className="font-semibold text-slate-800 truncate block">{task.providerName}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-1.5 pt-1 border-t border-slate-200/60">
                          <span className="w-2 h-2 rounded-xs bg-blue-600 mt-0.5 shrink-0" />
                          <div className="truncate">
                            <span className="text-slate-400 font-bold block text-[9px] uppercase">To</span>
                            <span className="font-semibold text-slate-800 truncate block">{task.acceptedByOrgName || 'Partner NGO'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptTask(task.id)}
                      className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Accept Run</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: IMPACT & BADGES (COMPACT METRICS) */}
      {/* ========================================================================= */}
      {activeTab === 'impact' && (
        <div className="space-y-3.5">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Completed Runs</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{volunteer.completedRescues}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">100% On-time</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Meals Rescued</span>
              <p className="text-2xl font-black text-brand-600 mt-0.5">{volunteer.completedRescues * 45}</p>
              <p className="text-[10px] text-slate-500">Diverted from waste</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">CO₂ Averted</span>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">
                {(volunteer.completedRescues * 45 * 2.5).toFixed(0)} kg
              </p>
              <p className="text-[10px] text-slate-500">Clean emissions</p>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Courier Recognition Badges</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-base block">🏆</span>
                <h4 className="text-[11px] font-bold text-amber-900">Campus Hero</h4>
                <p className="text-[10px] text-amber-700">25+ Rescues</p>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-base block">⚡</span>
                <h4 className="text-[11px] font-bold text-emerald-900">Rapid Delivery</h4>
                <p className="text-[10px] text-emerald-700">&lt;15 min ETA</p>
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-base block">🛡️</span>
                <h4 className="text-[11px] font-bold text-blue-900">Verified Courier</h4>
                <p className="text-[10px] text-blue-700">100% Quality</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ENTER PROVIDER PICKUP CODE */}
      {/* ========================================================================= */}
      {isVerifyingPickup && activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Verify Provider Pickup</h3>
              <button 
                onClick={() => setIsVerifyingPickup(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Ask <strong>{activeTask.providerName}</strong> staff for their 4-digit code.
            </p>

            <form onSubmit={handleVerifyPickup} className="space-y-3">
              <div>
                <input
                  type="text"
                  maxLength={4}
                  required
                  autoFocus
                  value={pickupCodeInput}
                  onChange={e => setPickupCodeInput(e.target.value)}
                  placeholder="e.g. 8492"
                  className="w-full text-center text-2xl font-mono font-black tracking-widest border border-slate-300 rounded-lg p-2.5 focus:outline-brand-600 text-slate-900"
                />
                
                {/* 1-Tap Auto-fill Helper */}
                <div className="mt-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => setPickupCodeInput(activeTask.pickupCode)}
                    className="text-[10px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-2 py-0.5 rounded cursor-pointer border border-brand-200"
                  >
                    Auto-fill Demo Code ({activeTask.pickupCode})
                  </button>
                </div>
              </div>

              {pickupError && (
                <div className="p-2 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
                  {pickupError}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsVerifyingPickup(false)}
                  className="w-1/3 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer"
                >
                  Confirm Pickup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: COMPLETE DELIVERY & HANDOVER CODE */}
      {/* ========================================================================= */}
      {isVerifyingDelivery && activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Confirm Delivery Handover</h3>
              <button 
                onClick={() => setIsVerifyingDelivery(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Arrived at <strong>{activeTask.acceptedByOrgName || 'Recipient NGO'}</strong>? Enter handover code.
            </p>

            <form onSubmit={handleVerifyDelivery} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">
                  Recipient 4-Digit Handover Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  autoFocus
                  value={deliveryCodeInput}
                  onChange={e => setDeliveryCodeInput(e.target.value)}
                  placeholder="e.g. 9041"
                  className="w-full text-center text-2xl font-mono font-black tracking-widest border border-slate-300 rounded-lg p-2.5 focus:outline-brand-600 text-slate-900"
                />
                
                {/* 1-Tap Auto-fill Helper */}
                <div className="mt-1 text-center">
                  <button
                    type="button"
                    onClick={() => setDeliveryCodeInput(activeTask.deliveryCode)}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded cursor-pointer border border-emerald-200"
                  >
                    Auto-fill Demo Code ({activeTask.deliveryCode})
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">
                  Delivered Meals Count
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={deliveredServingsInput}
                  onChange={e => setDeliveredServingsInput(Number(e.target.value))}
                  placeholder={`${activeTask.servingsListed}`}
                  className="w-full text-center text-base font-bold border border-slate-300 rounded-lg p-2 focus:outline-brand-600 text-slate-900"
                />
              </div>

              {deliveryError && (
                <div className="p-2 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
                  {deliveryError}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsVerifyingDelivery(false)}
                  className="w-1/3 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer"
                >
                  Confirm Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: RELEASE TASK CONFIRMATION */}
      {/* ========================================================================= */}
      {isReleasingTask && activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Release Task to Pool?</h3>
            <p className="text-xs text-slate-500">
              Unable to complete this delivery? It will be re-listed for other campus couriers immediately.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsReleasingTask(false)}
                className="w-1/2 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg"
              >
                Keep Task
              </button>
              <button
                type="button"
                onClick={handleReleaseTask}
                className="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-2xs"
              >
                Release
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

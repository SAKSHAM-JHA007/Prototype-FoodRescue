import React, { useState } from 'react';
import { Donation, Organization, VolunteerProfile } from '../types';
import { store } from '../services/store';
import { MapComponent } from './MapComponent';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  QrCode, 
  ArrowRight, 
  ShieldCheck, 
  Navigation,
  Compass,
  AlertCircle,
  Phone,
  ExternalLink,
  Award,
  Power,
  Sparkles,
  RefreshCw,
  XCircle,
  PackageCheck,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAuthData } from './Navbar';

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

  // Completed rescues by this volunteer or across the campus
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
      confetti({ particleCount: 60, spread: 70 });
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
      confetti({ particleCount: 100, spread: 90 });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Profile Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-xs ${volunteer.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Campus Courier & Rescue Network
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Volunteer Transport Hub
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Collect verified cooked meal containers from student dining halls and deliver them to community shelters.
          </p>
        </div>

        {/* Status Card & Availability Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Availability Toggle */}
          <button
            onClick={handleToggleAvailability}
            className={`px-3.5 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-2.5 transition-all shadow-2xs cursor-pointer ${
              volunteer.available
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Power className={`w-4 h-4 ${volunteer.available ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{volunteer.available ? 'Status: Online (Active)' : 'Status: Offline (Break)'}</span>
          </button>

          {/* Radius Selector */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Radius:</span>
            <select
              value={volunteer.maxDistanceKm}
              onChange={e => handleDistanceChange(Number(e.target.value))}
              aria-label="Volunteer pickup radius in kilometers"
              className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value={2}>2 km (Walking)</option>
              <option value={4}>4 km (Bicycle)</option>
              <option value={6}>6 km (Scooter)</option>
              <option value={10}>10 km (Zone)</option>
            </select>
          </div>

          {/* Volunteer Mini Profile */}
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-base">
              🚴
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{currentUser?.name || volunteer.name}</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {volunteer.completedRescues} Runs • {Math.round(volunteer.reliabilityScore * 100)}% Rating
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Offline Alert Banner */}
      {!volunteer.available && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-amber-900 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">
              You are currently marked as offline. New pickup broadcasts will not notify your device until you go online.
            </span>
          </div>
          <button
            onClick={handleToggleAvailability}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer"
          >
            Turn Online
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('mission')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'mission'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Active Mission</span>
          {activeTask && (
            <span className="px-1.5 py-0.5 bg-brand-600 text-white text-[10px] font-extrabold rounded-md">
              1 Active
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'available'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Available Runs</span>
          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
            {availableTasks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('impact')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'impact'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Impact & Badges</span>
          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
            {volunteer.completedRescues} Rescues
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACTIVE MISSION */}
      {/* ========================================================================= */}
      {activeTab === 'mission' && (
        <div className="space-y-6">
          {activeTask ? (
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
              
              {/* Mission Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-md text-[11px] font-bold tracking-wide">
                      RESCUE IN PROGRESS
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Task ID: {activeTask.id}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black mt-2 text-white">
                    {activeTask.foodName}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    {activeTask.servingsListed} meals • {activeTask.packaging} • Safe until: {new Date(activeTask.safeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="text-xs text-slate-400 font-medium">Mission Phase</span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-xs ${activeTask.status === 'IN_TRANSIT' ? 'bg-blue-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span className="text-sm font-bold text-emerald-400">
                      {activeTask.status === 'IN_TRANSIT' ? 'En Route to Drop-off' : 'Heading to Mess for Pickup'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-1">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 1. Accepted
                  </div>
                  <p className="text-[11px] text-slate-300">Courier assigned</p>
                </div>

                <div className={`p-3 rounded-xl border text-xs ${
                  activeTask.status === 'IN_TRANSIT' || activeTask.status === 'DELIVERED'
                    ? 'bg-slate-800/80 border-slate-700 text-emerald-400'
                    : 'bg-brand-900/50 border-brand-500 text-white'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {activeTask.status === 'IN_TRANSIT' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-xs bg-amber-400 animate-ping" />
                    )}
                    <span>2. Provider Pickup</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {activeTask.status === 'IN_TRANSIT' ? 'Custody confirmed' : 'Requires 4-digit code'}
                  </p>
                </div>

                <div className={`p-3 rounded-xl border text-xs ${
                  activeTask.status === 'IN_TRANSIT'
                    ? 'bg-brand-900/50 border-brand-500 text-white'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Navigation className="w-3.5 h-3.5" /> 3. Transit to NGO
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {activeTask.status === 'IN_TRANSIT' ? 'On delivery route' : 'Pending pickup'}
                  </p>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <PackageCheck className="w-3.5 h-3.5" /> 4. Handover
                  </div>
                  <p className="text-[11px] text-slate-400">Confirm delivery code</p>
                </div>
              </div>

              {/* Live Interactive Map for this active mission */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Live Campus Courier Route
                  </span>
                  <span>Estimated transit: ~12 minutes</span>
                </div>
                <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-700">
                  <MapComponent
                    donations={[activeTask]}
                    organizations={organizations}
                    volunteer={volunteer}
                    selectedDonationId={activeTask.id}
                  />
                </div>
              </div>

              {/* Two Column Action Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                
                {/* Step 1: Mess Pickup Card */}
                <div className={`p-5 rounded-xl border transition-all ${
                  activeTask.status === 'IN_TRANSIT'
                    ? 'bg-slate-800/40 border-emerald-600/40'
                    : 'bg-slate-800 border-white/20 shadow-md'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black tracking-wider text-emerald-400">
                      STEP 1: PICKUP FOOD
                    </span>
                    {activeTask.status === 'IN_TRANSIT' ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-700/50">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                      </span>
                    ) : (
                      <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-md">
                        Action Required
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{activeTask.providerName}</h3>
                  <p className="text-xs text-slate-300 mt-1 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{activeTask.address}</span>
                  </p>

                  {/* Provider Contact details */}
                  <div className="mt-3 pt-3 border-t border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400">Mess In-charge:</span>
                    <a
                      href={`tel:${activeProvider?.phone || '9876543210'}`}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {activeProvider?.contactPerson || 'Ramesh Sharma'} ({activeProvider?.phone || '+91 98765 43210'})
                    </a>
                  </div>

                  {activeTask.status !== 'IN_TRANSIT' ? (
                    <div className="mt-4 pt-3 border-t border-slate-700 space-y-2">
                      <button
                        onClick={() => setIsVerifyingPickup(true)}
                        className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <QrCode className="w-4 h-4" /> Enter Provider Pickup Code
                      </button>
                      <p className="text-[11px] text-slate-400 text-center">
                        (Demo Mess Code is: <code className="text-emerald-300 font-mono font-bold">{activeTask.pickupCode}</code>)
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-400/90 mt-4 pt-3 border-t border-slate-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Containers collected from kitchen staff safely.
                    </p>
                  )}
                </div>

                {/* Step 2: Recipient NGO Dropoff Card */}
                <div className={`p-5 rounded-xl border transition-all ${
                  activeTask.status === 'IN_TRANSIT'
                    ? 'bg-slate-800 border-white/20 shadow-md'
                    : 'bg-slate-800/40 border-slate-700'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black tracking-wider text-blue-400">
                      STEP 2: DROP-OFF DELIVERY
                    </span>
                    {activeTask.status === 'IN_TRANSIT' ? (
                      <span className="text-xs bg-blue-500 text-white font-bold px-2 py-0.5 rounded-md animate-pulse">
                        Active Destination
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">
                        Awaiting Pickup
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{activeTask.acceptedByOrgName || 'Helping Hands NGO'}</h3>
                  <p className="text-xs text-slate-300 mt-1 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{activeNgo?.address || 'Kasturba Nagar, Manipal (~1.2 km)'}</span>
                  </p>

                  {/* NGO Contact details */}
                  <div className="mt-3 pt-3 border-t border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400">NGO Coordinator:</span>
                    <a
                      href={`tel:${activeNgo?.phone || '9811223344'}`}
                      className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {activeNgo?.contactPerson || 'Sunita Rao'} ({activeNgo?.phone || '+91 98112 23344'})
                    </a>
                  </div>

                  {activeTask.status === 'IN_TRANSIT' ? (
                    <div className="mt-4 pt-3 border-t border-slate-700 space-y-2">
                      <button
                        onClick={() => {
                          setDeliveredServingsInput(activeTask.servingsListed);
                          setIsVerifyingDelivery(true);
                        }}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <PackageCheck className="w-4 h-4" /> Handover & Complete Delivery
                      </button>
                      <p className="text-[11px] text-slate-400 text-center">
                        (Demo Delivery Code is: <code className="text-blue-300 font-mono font-bold">{activeTask.deliveryCode}</code>)
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-700">
                      Complete Step 1 pickup verification to unlock drop-off handover.
                    </p>
                  )}
                </div>

              </div>

              {/* Emergency / Release Option */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Need to release this task due to flat tyre or schedule conflict?</span>
                <button
                  onClick={() => setIsReleasingTask(true)}
                  className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" /> Release Task to Pool
                </button>
              </div>

            </div>
          ) : (
            /* Empty Active Task State */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-soft">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-2xl font-bold">
                🚴
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No Active Mission Assigned</h3>
                <p className="text-xs text-slate-500">
                  You are currently available for courier runs. Select any open batch from the available feed or generate a quick simulated run to test the flow.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('available')}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-soft flex items-center gap-2 cursor-pointer"
                >
                  <span>Browse Available Runs ({availableTasks.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCreateDemoTask}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span>Simulate Instant Rescue Run</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AVAILABLE RUNS FEED */}
      {/* ========================================================================= */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Available Campus Runs</h2>
              <p className="text-xs text-slate-500">
                Surplus food batches within your {volunteer.maxDistanceKm}km zone waiting for volunteer transport.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateDemoTask}
                className="px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl border border-brand-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>+ Simulate New Run</span>
              </button>
              <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 rounded-xl text-slate-700 border border-slate-200">
                {availableTasks.length} Available
              </span>
            </div>
          </div>

          {availableTasks.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-4">
              <Truck className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="max-w-sm mx-auto">
                <h4 className="text-base font-bold text-slate-800">All current runs are covered!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  There are no pending volunteer pickups at this moment. You can click below to simulate an incoming dining hall surplus.
                </p>
              </div>
              <button
                onClick={handleCreateDemoTask}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-soft inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulate Demo Rescue Task</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableTasks.map(task => {
                const safeTime = new Date(task.safeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div 
                    key={task.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          {task.servingsListed} Meals
                        </span>
                        <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Deadline: {safeTime}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-base text-slate-900 mt-3">{task.foodName}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.notes || 'Packed surplus ready for transport.'}</p>

                      {/* Route Details */}
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup From</p>
                            <p className="font-bold text-slate-800">{task.providerName}</p>
                            <p className="text-[11px] text-slate-500">{task.address}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 pt-2 border-t border-slate-200">
                          <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Deliver To</p>
                            <p className="font-bold text-slate-800">{task.acceptedByOrgName || 'Partner Community NGO'}</p>
                            <p className="text-[11px] text-slate-500">~1.4 km distance</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptTask(task.id)}
                      className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-soft flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Commit to Rescue Run</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: IMPACT & BADGES */}
      {/* ========================================================================= */}
      {activeTab === 'impact' && (
        <div className="space-y-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Completed Runs</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{volunteer.completedRescues}</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">100% On-time delivery</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-xs font-bold text-slate-400 uppercase">Estimated Meals Rescued</span>
              <p className="text-3xl font-black text-brand-600 mt-1">{volunteer.completedRescues * 45}</p>
              <p className="text-xs text-slate-500 mt-1">Diverted from campus compost</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-xs font-bold text-slate-400 uppercase">CO₂ Emissions Diverted</span>
              <p className="text-3xl font-black text-emerald-600 mt-1">
                {(volunteer.completedRescues * 45 * 2.5).toFixed(0)} kg
              </p>
              <p className="text-xs text-slate-500 mt-1">Calculated via FoodWaste GHG index</p>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Volunteer Achievements & Recognition</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <span className="text-xl">🏆</span>
                <h4 className="text-xs font-bold text-amber-900">Campus Food Hero</h4>
                <p className="text-[11px] text-amber-800">Completed more than 25 successful meal transports.</p>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-xl">⚡</span>
                <h4 className="text-xs font-bold text-emerald-900">Rapid Responder</h4>
                <p className="text-[11px] text-emerald-800">Average response time under 15 minutes.</p>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                <span className="text-xl">🛡️</span>
                <h4 className="text-xs font-bold text-blue-900">Quality Custodian</h4>
                <p className="text-[11px] text-blue-800">100% verified temperature & code transfers.</p>
              </div>
            </div>
          </div>

          {/* Completed History List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Campus Delivery Log</h3>

            {completedRescues.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No delivered rescues recorded yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {completedRescues.map(item => (
                  <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-800">{item.foodName}</h4>
                      <p className="text-slate-400 text-[11px]">
                        {item.providerName} → {item.acceptedByOrgName || 'Recipient NGO'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {item.servingsDelivered || item.servingsListed} meals delivered
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        ✓ Confirmed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ENTER PROVIDER PICKUP CODE */}
      {/* ========================================================================= */}
      {isVerifyingPickup && activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Verify Food Pickup</h3>
              <button 
                onClick={() => setIsVerifyingPickup(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Ask the kitchen supervisor at <strong>{activeTask.providerName}</strong> for their 4-digit security pickup code to confirm custody handoff.
            </p>

            <form onSubmit={handleVerifyPickup} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={4}
                  required
                  autoFocus
                  value={pickupCodeInput}
                  onChange={e => setPickupCodeInput(e.target.value)}
                  placeholder="e.g. 8492"
                  className="w-full text-center text-3xl font-mono font-black tracking-widest border border-slate-300 rounded-xl p-3 focus:outline-brand-600 text-slate-900"
                />
                
                {/* 1-Tap Auto-fill Helper */}
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setPickupCodeInput(activeTask.pickupCode)}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md cursor-pointer border border-brand-200"
                  >
                    Auto-fill Demo Code ({activeTask.pickupCode})
                  </button>
                </div>
              </div>

              {pickupError && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
                  {pickupError}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsVerifyingPickup(false)}
                  className="w-1/3 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-soft cursor-pointer"
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
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Confirm NGO Delivery</h3>
              <button 
                onClick={() => setIsVerifyingDelivery(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Arrived at <strong>{activeTask.acceptedByOrgName || 'Recipient NGO'}</strong>? Enter the recipient manager's 4-digit handover code and verify meal count.
            </p>

            <form onSubmit={handleVerifyDelivery} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
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
                  className="w-full text-center text-3xl font-mono font-black tracking-widest border border-slate-300 rounded-xl p-3 focus:outline-brand-600 text-slate-900"
                />
                
                {/* 1-Tap Auto-fill Helper */}
                <div className="mt-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => setDeliveryCodeInput(activeTask.deliveryCode)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md cursor-pointer border border-emerald-200"
                  >
                    Auto-fill Demo Code ({activeTask.deliveryCode})
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Actual Servings Handed Over
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={deliveredServingsInput}
                  onChange={e => setDeliveredServingsInput(Number(e.target.value))}
                  placeholder={`${activeTask.servingsListed}`}
                  className="w-full text-center text-lg font-bold border border-slate-300 rounded-xl p-2.5 focus:outline-brand-600 text-slate-900"
                />
              </div>

              {deliveryError && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
                  {deliveryError}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsVerifyingDelivery(false)}
                  className="w-1/3 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-soft cursor-pointer"
                >
                  Mark Rescued & Complete
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
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Release Task to Pool?</h3>
            <p className="text-xs text-slate-500">
              Are you unable to complete this delivery run? Releasing it puts it back on the campus board immediately so another courier can take over before food cools down.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReleasingTask(false)}
                className="w-1/2 py-2.5 text-xs font-semibold text-slate-600 border border-slate-300 rounded-xl"
              >
                Keep Task
              </button>
              <button
                type="button"
                onClick={handleReleaseTask}
                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-soft"
              >
                Yes, Release
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

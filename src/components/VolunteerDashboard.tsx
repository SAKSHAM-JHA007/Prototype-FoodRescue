import React, { useState } from 'react';
import { Donation, Organization, VolunteerProfile } from '../types';
import { store } from '../services/store';
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
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VolunteerDashboardProps {
  donations: Donation[];
  organizations: Organization[];
  volunteer: VolunteerProfile;
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({
  donations,
  organizations,
  volunteer
}) => {
  const [pickupCodeInput, setPickupCodeInput] = useState('');
  const [pickupError, setPickupError] = useState('');
  const [isVerifyingPickup, setIsVerifyingPickup] = useState(false);

  // Donations needing a volunteer (PICKUP_PENDING)
  const availableTasks = donations.filter(d => 
    d.status === 'PICKUP_PENDING' && (!d.volunteerId || d.volunteerId === volunteer.id)
  );

  // Active task the volunteer has accepted
  const activeTask = donations.find(d => 
    d.volunteerId === volunteer.id && (d.status === 'PICKUP_PENDING' || d.status === 'IN_TRANSIT')
  );

  const handleAcceptTask = (donationId: string) => {
    store.volunteerAcceptTask(donationId);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
              Campus Rescue Network
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Volunteer Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Pick up surplus batches from student cafeterias and deliver them to local community centers.
          </p>
        </div>

        {/* Profile Pill */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
            🚴
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">{volunteer.name}</h4>
            <p className="text-[11px] text-slate-500">
              {volunteer.completedRescues} Rescues • {Math.round(volunteer.reliabilityScore * 100)}% Reliability
            </p>
          </div>
        </div>
      </div>

      {/* Active Task in Progress Banner */}
      {activeTask && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white p-6 sm:p-7 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="px-3 py-1 bg-brand-500 text-white rounded-full text-xs font-bold tracking-wide">
                ACTIVE RESCUE MISSION
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-2">
                {activeTask.foodName} ({activeTask.servingsListed} meals)
              </h3>
            </div>
            
            <div className="text-right sm:text-left">
              <span className="text-xs text-slate-300">Status</span>
              <p className="text-sm font-bold text-emerald-400">
                {activeTask.status === 'IN_TRANSIT' ? '🚚 In Transit to Drop-off' : '📍 Awaiting Pickup from Provider'}
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Step 1: Provider Pickup */}
            <div className={`p-4 rounded-2xl border transition-all ${
              activeTask.status === 'IN_TRANSIT' 
                ? 'bg-slate-800/50 border-emerald-500/50' 
                : 'bg-white/10 border-white/20'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400">STEP 1: PICKUP</span>
                {activeTask.status === 'IN_TRANSIT' ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Picked Up
                  </span>
                ) : (
                  <span className="text-xs bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-bold">
                    Action Needed
                  </span>
                )}
              </div>

              <h4 className="font-bold text-sm text-white">{activeTask.providerName}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{activeTask.address}</p>

              {activeTask.status === 'PICKUP_PENDING' && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setIsVerifyingPickup(true)}
                    className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-soft"
                  >
                    <QrCode className="w-4 h-4" /> Enter Provider's Pickup Code
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-1.5">
                    (Ask the mess manager for their 4-digit code: demo code is <code className="text-white font-mono">{activeTask.pickupCode}</code>)
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Destination NGO */}
            <div className={`p-4 rounded-2xl border ${
              activeTask.status === 'IN_TRANSIT' 
                ? 'bg-brand-900/30 border-brand-500/40' 
                : 'bg-slate-800/30 border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">STEP 2: DROP-OFF</span>
                {activeTask.status === 'IN_TRANSIT' && (
                  <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded font-bold animate-pulse">
                    En Route Now
                  </span>
                )}
              </div>

              <h4 className="font-bold text-sm text-white">{activeTask.acceptedByOrgName || 'Recipient NGO'}</h4>
              <p className="text-xs text-slate-300 mt-0.5">Community Kitchen & Distribution Hub</p>

              {activeTask.status === 'IN_TRANSIT' ? (
                <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
                  <p className="text-emerald-300 font-semibold flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" /> Navigate to NGO location
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    When you arrive, the NGO manager will verify delivery on their dashboard using code: <strong className="font-mono text-white">{activeTask.deliveryCode}</strong>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-4">
                  Complete pickup step first to unlock drop-off routing.
                </p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Available Volunteer Runs Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Available Rescue Runs</h2>
            <p className="text-xs text-slate-500">Tasks in your 4km campus zone needing transport.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
            {availableTasks.length} Ready for Assignment
          </span>
        </div>

        {availableTasks.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">All current deliveries are covered!</p>
            <p className="text-xs text-slate-400 mt-1">
              New pickup requests will automatically pop up when NGOs request volunteer help.
            </p>
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
                      <span className="text-xs font-bold text-slate-900 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                        {task.servingsListed} Servings
                      </span>
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        Deadline: {safeTime}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900 mt-3">{task.foodName}</h4>

                    {/* Route Info */}
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">FROM PROVIDER</p>
                          <p className="font-semibold text-slate-800">{task.providerName}</p>
                          <p className="text-[11px] text-slate-500">{task.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 pt-2 border-t border-slate-200/60">
                        <span className="w-2 h-2 rounded-full bg-blue-600 mt-1" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">TO RECIPIENT NGO</p>
                          <p className="font-semibold text-slate-800">{task.acceptedByOrgName || 'Helping Hands NGO'}</p>
                          <p className="text-[11px] text-slate-500">~1.8 km distance</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAcceptTask(task.id)}
                    className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-soft flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Accept Rescue Task</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pickup Code Verification Modal */}
      {isVerifyingPickup && activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Enter Provider Pickup Code</h3>
            <p className="text-xs text-slate-500">
              The food provider ({activeTask.providerName}) displays a 4-digit security code. Enter it to confirm custody transfer.
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
                  className="w-full text-center text-3xl font-mono font-extrabold tracking-widest border border-slate-300 rounded-xl p-3 focus:outline-brand-600"
                />
                <span className="text-[11px] text-slate-400 block text-center mt-1">
                  (Demo Code: <code className="font-bold text-slate-800">{activeTask.pickupCode}</code>)
                </span>
              </div>

              {pickupError && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
                  {pickupError}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsVerifyingPickup(false)}
                  className="w-1/3 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-soft"
                >
                  Verify Pickup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

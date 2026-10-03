import React, { useState } from 'react';
import { Donation, Organization, MatchingWeights, StatusHistoryEntry } from '../types';
import { store } from '../services/store';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  PhoneCall, 
  XCircle, 
  Sliders, 
  History, 
  RefreshCw,
  Clock,
  Sparkles,
  Users,
  CheckCircle2
} from 'lucide-react';

interface AdminDashboardProps {
  donations: Donation[];
  organizations: Organization[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  donations,
  organizations
}) => {
  const [activeTab, setActiveTab] = useState<'at-risk' | 'weights' | 'audit'>('at-risk');
  const [weights, setWeights] = useState<MatchingWeights>(store.getMatchingWeights());
  const history = store.getHistory();

  // At-risk donations: OPEN or PICKUP_PENDING near safe-until (< 2 hours or CRITICAL/URGENT)
  const atRiskDonations = donations.filter(d => 
    (d.status === 'OPEN' || d.status === 'PICKUP_PENDING') &&
    (d.urgency === 'CRITICAL' || d.urgency === 'URGENT' || d.urgency === 'MEDIUM')
  );

  const handleWidenRadius = (donationId: string) => {
    store.adminIntervene(donationId, 'widen_radius');
    alert("Radius widened to 15km and critical alerts dispatched to all regional community kitchens.");
  };

  const handleCancelDonation = (donationId: string) => {
    if (confirm("Mark this surplus batch as expired/cancelled due to safety timeout?")) {
      store.adminIntervene(donationId, 'cancel', 'Admin food safety expiry enforcement');
    }
  };

  const handleWeightChange = (key: keyof MatchingWeights, value: number) => {
    const updated = { ...weights, [key]: value };
    setWeights(updated);
    store.updateMatchingWeights(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-600 animate-pulse" />
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
              Campus Operations Command
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Admin At-Risk & Quality Board
          </h1>
          <p className="text-sm text-slate-500">
            Monitor donations near expiry, calibrate matching weights, and audit state machine transitions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-2 rounded-2xl border border-amber-200 text-amber-900 text-xs font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>{atRiskDonations.length} At-Risk Batches Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('at-risk')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'at-risk' 
              ? 'border-amber-600 text-amber-700 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🚨 At-Risk Live Board ({atRiskDonations.length})
        </button>

        <button
          onClick={() => setActiveTab('weights')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'weights' 
              ? 'border-amber-600 text-amber-700 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          ⚙️ Matching Algorithm Weights
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'audit' 
              ? 'border-amber-600 text-amber-700 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          📜 State Audit Trail ({history.length})
        </button>
      </div>

      {/* Tab 1: At-Risk Board */}
      {activeTab === 'at-risk' && (
        <div className="space-y-4">
          {atRiskDonations.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-base">All donations are on schedule!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No items are currently lagging or nearing expiry without pickup.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {atRiskDonations.map(donation => {
                const safeTime = new Date(donation.safeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const isCritical = donation.urgency === 'CRITICAL';

                return (
                  <div 
                    key={donation.id}
                    className={`bg-white rounded-2xl border p-5 shadow-soft transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                      isCritical ? 'border-red-300 ring-2 ring-red-100' : 'border-amber-200'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-md ${
                          isCritical ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-500 text-white'
                        }`}>
                          {donation.urgency} TIMEOUT RISK
                        </span>
                        <span className="text-xs font-mono text-slate-400 font-bold">{donation.id}</span>
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          Status: {donation.status}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900">
                        {donation.foodName} ({donation.servingsListed} meals)
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>Provider: <strong className="text-slate-700">{donation.providerName}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-red-600 font-bold">
                          <Clock className="w-3.5 h-3.5" /> Expiry Deadline: {safeTime}
                        </span>
                        <span>•</span>
                        <span>Allergens: {donation.allergens.join(', ') || 'None'}</span>
                      </div>
                    </div>

                    {/* Admin Action Buttons (PRD Section 11.4 & 6.2) */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleWidenRadius(donation.id)}
                        className="flex-1 md:flex-none px-3.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Broadcast offer to larger 15km radius"
                      >
                        <Radio className="w-3.5 h-3.5" /> Widen Radius (15km)
                      </button>

                      <a
                        href="tel:+919876543210"
                        className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call Mess
                      </a>

                      <button
                        onClick={() => handleCancelDonation(donation.id)}
                        className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel Batch
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Matching Weights Calibrator (PRD Section 7) */}
      {activeTab === 'weights' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Matching & Ranking Weights (PRD Section 7)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Adjust the multi-factor scoring formula used to rank recipient NGOs when a provider creates a listing.
            </p>
          </div>

          <div className="space-y-6 max-w-2xl">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Distance / Travel Time Weight</span>
                <span className="font-mono text-brand-700">{Math.round(weights.distanceWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.05"
                value={weights.distanceWeight}
                onChange={e => handleWeightChange('distanceWeight', parseFloat(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Prioritizes shelters within closer proximity to minimize transit time.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Capacity Fit Weight</span>
                <span className="font-mono text-brand-700">{Math.round(weights.capacityWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={weights.capacityWeight}
                onChange={e => handleWeightChange('capacityWeight', parseFloat(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Prefers organizations whose stated daily capacity can absorb the full batch.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Historical Reliability Score</span>
                <span className="font-mono text-brand-700">{Math.round(weights.reliabilityWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.05"
                value={weights.reliabilityWeight}
                onChange={e => handleWeightChange('reliabilityWeight', parseFloat(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Rates NGOs by past accept-to-delivered confirmation percentage.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Fairness & Distribution Factor</span>
                <span className="font-mono text-brand-700">{Math.round(weights.fairnessWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.30"
                step="0.05"
                value={weights.fairnessWeight}
                onChange={e => handleWeightChange('fairnessWeight', parseFloat(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Rotates top offers to prevent the same single large NGO always winning first.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: State Machine Audit Trail (PRD Section 8.2 & 14) */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Append-Only Status History Log</h3>
              <p className="text-xs text-slate-500">Every state transition validated server-side and recorded with who, when, and why.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {history.map(entry => (
              <div key={entry.id} className="p-4 hover:bg-slate-50 flex items-start justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{entry.donationId}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-600">{entry.fromStatus}</span>
                    <span>→</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 font-bold text-emerald-800">{entry.toStatus}</span>
                  </div>
                  <p className="text-slate-600">
                    Actor: <strong className="text-slate-800">{entry.actor}</strong> • Reason: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">{entry.reasonCode}</code>
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

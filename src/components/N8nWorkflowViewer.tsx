import React, { useState } from 'react';
import { AutomationLog } from '../types';
import { store } from '../services/store';
import { 
  Workflow, 
  Terminal, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  Bell, 
  Clock, 
  Copy, 
  ExternalLink,
  Cpu
} from 'lucide-react';

interface N8nWorkflowViewerProps {
  logs: AutomationLog[];
}

export const N8nWorkflowViewer: React.FC<N8nWorkflowViewerProps> = ({ logs }) => {
  const [copied, setCopied] = useState(false);

  const sampleWorkflowJson = {
    name: "FoodRescue Pilot — Urgent Notification & Escalation Fanout",
    nodes: [
      {
        parameters: { httpMethod: "POST", path: "foodrescue-donation-event" },
        name: "Webhook: donation.created",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [250, 300]
      },
      {
        parameters: {
          conditions: {
            string: [{ value1: "={{$json.body.urgency}}", value2: "CRITICAL" }]
          }
        },
        name: "Filter: Is Critical (<1h)",
        type: "n8n-nodes-base.if",
        position: [480, 300]
      },
      {
        parameters: {
          message: "🚨 CRITICAL FOOD RESCUE ALERT: {{$json.body.servings}} servings from {{$json.body.provider}} require urgent pickup before {{$json.body.safeUntil}}!",
          channel: "telegram-campus-responders"
        },
        name: "Broadcast Telegram Push",
        type: "n8n-nodes-base.telegram",
        position: [720, 200]
      },
      {
        parameters: {
          title: "Surplus Food Offered",
          body: "{{$json.body.servings}} meals available near you.",
          topic: "nearby_verified_ngos"
        },
        name: "FCM Push Notifications",
        type: "n8n-nodes-base.firebaseCloudMessaging",
        position: [720, 400]
      }
    ]
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleWorkflowJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-600 animate-pulse" />
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">
              Side-Effect Automation Orchestration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            n8n Automation Engine
          </h1>
          <p className="text-sm text-slate-500">
            Per PRD Section 13: The backend owns state & business logic; n8n orchestrates side effects, retries, and multi-channel notifications.
          </p>
        </div>

        <button
          onClick={handleCopyJson}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-soft"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? 'Copied JSON!' : 'Copy Workflow JSON'}
        </button>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Workflow className="w-5 h-5 text-purple-600" />
          Active Orchestration Pipeline (Idempotent Webhooks)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                TRIGGER
              </span>
              <span className="text-xs">⚡</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900">Backend Webhook Event</h4>
            <p className="text-[11px] text-slate-600">
              <code>POST /webhook/donation.created</code> fired with donation ID, urgency, and matched NGOs list.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
                STEP 2
              </span>
              <span className="text-xs">🔍</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900">Urgency & Radius Routing</h4>
            <p className="text-[11px] text-slate-600">
              Evaluates actionable time window. Normal donations queue sequentially; Critical (&lt;1h) broadcast simultaneously.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">
                STEP 3
              </span>
              <span className="text-xs">📲</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900">Multi-Channel Fan-Out</h4>
            <p className="text-[11px] text-slate-600">
              Dispatches web push (FCM) + Telegram/WhatsApp broadcast to verified community kitchens.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold bg-amber-200 text-amber-800 px-2 py-0.5 rounded">
                STEP 4
              </span>
              <span className="text-xs">⏱️</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900">Scheduled Escalation Cron</h4>
            <p className="text-[11px] text-slate-600">
              Every 5 minutes, monitors unaccepted items, auto-widens radius, and alerts campus emergency coordinators.
            </p>
          </div>

        </div>
      </div>

      {/* Live Webhook Execution Console */}
      <div className="bg-slate-950 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-4 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-300">Live n8n Webhook Stream ({logs.length} events logged)</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Orchestration Active
          </span>
        </div>

        <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto space-y-2 text-xs">
          {logs.map((log) => (
            <div key={log.id} className="pt-3 pb-2 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-purple-400 font-bold">{log.workflow}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-emerald-400 text-xs">
                &gt; {log.trigger}
              </p>
              <p className="text-slate-300 text-[11px] font-sans">
                {log.payloadSummary}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

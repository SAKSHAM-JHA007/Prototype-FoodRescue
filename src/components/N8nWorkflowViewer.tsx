import React, { useState, useEffect } from 'react';
import { AutomationLog } from '../types';
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
  Cpu,
  RefreshCw,
  AlertCircle,
  Radio,
  Send
} from 'lucide-react';

interface N8nWorkflowViewerProps {
  logs: AutomationLog[];
}

export const N8nWorkflowViewer: React.FC<N8nWorkflowViewerProps> = ({ logs }) => {
  const [copied, setCopied] = useState(false);
  const [isN8nOnline, setIsN8nOnline] = useState<boolean | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingResult, setLastPingResult] = useState<any>(null);
  const [recentDispatches, setRecentDispatches] = useState<any[]>([]);

  // Check n8n server connectivity via Express backend
  const checkN8nStatus = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/n8n/status');
      if (res.ok) {
        const data = await res.json();
        setIsN8nOnline(data.isOnline);
        if (data.recentDispatches) {
          setRecentDispatches(data.recentDispatches);
        }
      } else {
        setIsN8nOnline(false);
      }
    } catch {
      setIsN8nOnline(false);
    }
  };

  useEffect(() => {
    checkN8nStatus();
    const interval = setInterval(checkN8nStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fire live webhook test to n8n
  const handleTestPing = async () => {
    setIsPinging(true);
    try {
      const res = await fetch('http://localhost:5000/api/n8n/dispatch-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setLastPingResult(data);
      checkN8nStatus();
    } catch (err: any) {
      setLastPingResult({ success: false, error: err.message });
    } finally {
      setIsPinging(false);
    }
  };

  const sampleWorkflowJson = {
    id: "FRWf001UrgentEsc",
    name: "FoodRescue — Urgent Notification & Expiry Escalation",
    nodes: [
      {
        parameters: { httpMethod: "POST", path: "donation-event" },
        name: "Webhook: donation.created",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [240, 300]
      },
      {
        parameters: {
          conditions: {
            string: [{ value1: "={{$json[\"body\"][\"urgency\"]}}", value2: "CRITICAL" }]
          }
        },
        name: "Check Urgency",
        type: "n8n-nodes-base.if",
        position: [480, 300]
      },
      {
        parameters: {
          message: "🚨 CRITICAL FOOD RESCUE ALERT: {{$json[\"body\"][\"servingsListed\"]}} servings from {{$json[\"body\"][\"providerName\"]}} require urgent pickup!",
          channel: "telegram-campus-responders"
        },
        name: "Broadcast Telegram Push",
        type: "n8n-nodes-base.telegram",
        position: [740, 180]
      },
      {
        parameters: {
          title: "Surplus Food Offered",
          body: "{{$json[\"body\"][\"servingsListed\"]}} meals available near you.",
          topic: "nearby_ngos"
        },
        name: "FCM Push to Matched NGOs",
        type: "n8n-nodes-base.firebaseCloudMessaging",
        position: [740, 420]
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
            <span className={`w-3 h-3 rounded-full ${isN8nOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-xs font-bold uppercase tracking-wide ${isN8nOnline ? 'text-emerald-700' : 'text-red-700'}`}>
              {isN8nOnline ? 'n8n Instance Connected (Port 5678)' : 'Connecting to n8n...'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            n8n Automation Engine & Workflows
          </h1>
          <p className="text-sm text-slate-500">
            Per PRD Section 13: The backend owns state & business logic; n8n orchestrates side effects, retries, and multi-channel notifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="http://localhost:5678"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-soft"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open n8n UI (Port 5678)
          </a>

          <button
            onClick={handleCopyJson}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Copy Workflow JSON'}
          </button>
        </div>
      </div>

      {/* Connection & Live Ping Tester Card */}
      <div className="p-6 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-950 rounded-3xl text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-400/20 text-purple-300 border border-purple-400/30">
                LIVE DISPATCHER
              </span>
              <span className="text-xs text-slate-300">Target: <code className="text-emerald-400 font-mono">http://localhost:5678/webhook/donation-event</code></span>
            </div>
            <h3 className="text-xl font-bold">
              FoodRescue ↔ n8n Webhook Bridge
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Imported Workflow: <strong className="text-white">FoodRescue — Urgent Notification & Expiry Escalation</strong> (ID: <code className="text-purple-300">FRWf001UrgentEsc</code>).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestPing}
              disabled={isPinging}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-2xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {isPinging ? 'Firing Webhook...' : 'Fire Live Webhook to n8n'}
            </button>
          </div>
        </div>

        {/* Last Ping Output */}
        {lastPingResult && (
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Last Outbound Webhook Result:</span>
            <pre className="text-emerald-300 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(lastPingResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Visual Pipeline Flow */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Workflow className="w-5 h-5 text-purple-600" />
            Active Orchestration Pipeline (Idempotent Webhooks)
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
            PRD Section 13 Contract
          </span>
        </div>

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
              <code>POST /webhook/donation-event</code> fired when donation is created, accepted, or delivered.
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
              Every 5 minutes, queries <code>/api/donations/at-risk</code>, auto-widens radius, and alerts campus emergency coordinators.
            </p>
          </div>

        </div>
      </div>

      {/* Live Webhook Execution Console */}
      <div className="bg-slate-950 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-4 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-300">Live n8n Webhook Stream ({logs.length} in-app + {recentDispatches.length} HTTP dispatches)</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Orchestration Active
          </span>
        </div>

        <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto space-y-2 text-xs">
          {recentDispatches.length > 0 && recentDispatches.map((disp, idx) => (
            <div key={idx} className="pt-2 pb-2 space-y-0.5">
              <div className="flex items-center justify-between text-[11px] text-purple-300">
                <span className="font-bold">HTTP Outbound Dispatch ({disp.event})</span>
                <span className="text-slate-400">{new Date(disp.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-emerald-400 text-xs font-mono">&gt; POST {disp.targetUrl}</p>
              <p className="text-slate-300 text-[11px]">
                Status: <strong className={disp.status === 'delivered' ? 'text-emerald-400' : 'text-amber-400'}>{disp.status.toUpperCase()}</strong> • {disp.note || disp.payloadSummary}
              </p>
            </div>
          ))}

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

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
const N8N_URL = process.env.N8N_URL || 'http://localhost:5678';
const N8N_WEBHOOK_PATH = process.env.N8N_WEBHOOK_PATH || '/webhook/donation-event';
const N8N_TEST_WEBHOOK_PATH = process.env.N8N_TEST_WEBHOOK_PATH || '/webhook-test/donation-event';

app.use(cors());
app.use(express.json());

// In-memory backing state for Node/Express layer
let donations = [
  {
    id: 'DON-101',
    providerName: 'MIT Hostel Mess',
    foodName: 'Rice, Dal, Mixed Veg & Paneer Curry',
    servingsListed: 120,
    dietaryType: 'Vegetarian',
    status: 'OPEN',
    urgency: 'URGENT',
    safeUntil: new Date(Date.now() + 1.2 * 3600000).toISOString(),
    pickupCode: '8492',
    deliveryCode: '3104'
  },
  {
    id: 'DON-102',
    providerName: 'Food Court 1',
    foodName: 'Veg Hakka Noodles & Fried Rice',
    servingsListed: 50,
    dietaryType: 'Vegetarian',
    status: 'ACCEPTED',
    urgency: 'MEDIUM',
    safeUntil: new Date(Date.now() + 2.5 * 3600000).toISOString(),
    acceptedByOrgName: 'Helping Hands NGO',
    pickupCode: '5719',
    deliveryCode: '9041'
  }
];

let auditLogs = [];
let n8nDispatchLogs = [];

// Helper: Dispatch webhook event to local or cloud n8n
async function dispatchToN8n(event, payload) {
  const webhookBody = {
    event,
    timestamp: new Date().toISOString(),
    body: payload
  };

  const dispatchRecord = {
    id: `DISP-${Date.now()}`,
    event,
    targetUrl: `${N8N_URL}${N8N_WEBHOOK_PATH}`,
    status: 'pending',
    timestamp: new Date().toISOString(),
    payloadSummary: `${event} -> ${payload.foodName || payload.id || 'system'}`
  };

  try {
    // Try production webhook first, fallback to test webhook if test mode
    let target = `${N8N_URL}${N8N_WEBHOOK_PATH}`;
    let resp = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookBody)
    }).catch(() => null);

    if (!resp || !resp.ok) {
      // Try test webhook endpoint commonly used in n8n canvas test mode
      target = `${N8N_URL}${N8N_TEST_WEBHOOK_PATH}`;
      resp = await fetch(target, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookBody)
      }).catch(() => null);
    }

    if (resp && resp.ok) {
      dispatchRecord.status = 'delivered';
      dispatchRecord.statusCode = resp.status;
      console.log(`[n8n Dispatch SUCCESS] ${event} sent to ${target}`);
    } else {
      dispatchRecord.status = 'queued';
      dispatchRecord.note = resp ? `HTTP ${resp.status}` : 'n8n webhook awaiting workflow activation';
      console.log(`[n8n Dispatch QUEUED] ${event} (workflow may be paused or listening on canvas)`);
    }
  } catch (err) {
    dispatchRecord.status = 'failed';
    dispatchRecord.error = err.message;
  }

  n8nDispatchLogs.unshift(dispatchRecord);
  if (n8nDispatchLogs.length > 50) n8nDispatchLogs.pop();
  return dispatchRecord;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FoodRescue Backend API', version: '2.0-pilot' });
});

// 2. n8n Connectivity Status & Health
app.get('/api/n8n/status', async (req, res) => {
  let isOnline = false;
  try {
    const check = await fetch(`${N8N_URL}/healthz`).catch(() => null);
    if (check && (check.status === 200 || check.status === 401)) {
      isOnline = true;
    } else {
      // Alternative check
      const rootCheck = await fetch(`${N8N_URL}`).catch(() => null);
      if (rootCheck) isOnline = true;
    }
  } catch {
    isOnline = false;
  }

  res.json({
    success: true,
    n8nUrl: N8N_URL,
    isOnline,
    webhookEndpoint: `${N8N_URL}${N8N_WEBHOOK_PATH}`,
    testWebhookEndpoint: `${N8N_URL}${N8N_TEST_WEBHOOK_PATH}`,
    workflowId: 'FRWf001UrgentEsc',
    workflowName: 'FoodRescue — Urgent Notification & Expiry Escalation',
    recentDispatches: n8nDispatchLogs
  });
});

// 3. Manual Ping / Test Dispatch to n8n
app.post('/api/n8n/dispatch-test', async (req, res) => {
  const sampleDonation = donations[0] || {
    id: 'DON-TEST',
    providerName: 'MIT Hostel Mess',
    foodName: 'Hot Lunch Surplus (Paneer & Rice)',
    servingsListed: 80,
    urgency: 'CRITICAL',
    safeUntil: new Date(Date.now() + 3600000).toISOString()
  };

  const result = await dispatchToN8n('test.ping', sampleDonation);
  res.json({
    success: true,
    message: 'Test webhook event fired toward n8n',
    dispatch: result
  });
});

// 4. Get All Donations
app.get('/api/donations', (req, res) => {
  res.json({ success: true, count: donations.length, data: donations });
});

// 5. At-Risk Query (Queried by n8n scheduled cron trigger!)
app.get('/api/donations/at-risk', (req, res) => {
  const atRisk = donations.filter(d => 
    d.status === 'OPEN' && (d.urgency === 'CRITICAL' || d.urgency === 'URGENT')
  );
  res.json({ success: true, count: atRisk.length, data: atRisk });
});

// 6. Create Donation (fires n8n webhook)
app.post('/api/donations', async (req, res) => {
  const { foodName, servingsListed, dietaryType, safeUntil, providerName, urgency } = req.body;
  if (!foodName || !servingsListed) {
    return res.status(400).json({ success: false, message: 'foodName and servingsListed are required.' });
  }

  const newDonation = {
    id: `DON-${Math.floor(100 + Math.random() * 900)}`,
    providerName: providerName || 'MIT Hostel Mess',
    foodName,
    servingsListed: Number(servingsListed),
    dietaryType: dietaryType || 'Vegetarian',
    status: 'OPEN',
    urgency: urgency || 'URGENT',
    safeUntil: safeUntil || new Date(Date.now() + 2 * 3600000).toISOString(),
    pickupCode: Math.floor(1000 + Math.random() * 9000).toString(),
    deliveryCode: Math.floor(1000 + Math.random() * 9000).toString(),
    createdAt: new Date().toISOString()
  };

  donations.unshift(newDonation);
  auditLogs.push({
    event: 'DONATION_CREATED',
    donationId: newDonation.id,
    timestamp: new Date().toISOString()
  });

  // Outbound notification to n8n!
  dispatchToN8n('donation.created', newDonation);

  res.status(201).json({ success: true, data: newDonation });
});

// 7. Atomic Acceptance Endpoint (fires n8n volunteer alert if needed)
app.post('/api/donations/:id/accept', (req, res) => {
  const { id } = req.params;
  const { recipientOrgName, pickupMode } = req.body;

  const donation = donations.find(d => d.id === id);
  if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });

  if (donation.status !== 'OPEN') {
    return res.status(409).json({ 
      success: false, 
      message: `Donation is already claimed or closed. Current status: ${donation.status}` 
    });
  }

  donation.status = pickupMode === 'self' ? 'ACCEPTED' : 'PICKUP_PENDING';
  donation.acceptedByOrgName = recipientOrgName || 'Verified Partner NGO';
  donation.pickupMode = pickupMode || 'volunteer';

  auditLogs.push({
    event: 'DONATION_ACCEPTED',
    donationId: donation.id,
    acceptedBy: donation.acceptedByOrgName,
    timestamp: new Date().toISOString()
  });

  // Outbound notification to n8n!
  dispatchToN8n(
    pickupMode === 'self' ? 'donation.accepted_self_pickup' : 'donation.accepted_need_volunteer',
    donation
  );

  res.json({ success: true, message: 'Donation accepted atomically.', data: donation });
});

// 8. Pickup Verification (Handoff from Provider to Courier/Volunteer)
app.post('/api/donations/:id/pickup', (req, res) => {
  const { id } = req.params;
  const { code } = req.body;

  const donation = donations.find(d => d.id === id);
  if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });

  if (donation.pickupCode !== String(code).trim()) {
    return res.status(400).json({ success: false, message: 'Invalid 4-digit pickup security code.' });
  }

  donation.status = 'IN_TRANSIT';
  dispatchToN8n('donation.in_transit', donation);

  res.json({ success: true, message: 'Pickup code verified. Status updated to IN_TRANSIT.', data: donation });
});

// 9. Delivery Confirmation (Handover to Recipient NGO)
app.post('/api/donations/:id/deliver', (req, res) => {
  const { id } = req.params;
  const { code, servingsDelivered } = req.body;

  const donation = donations.find(d => d.id === id);
  if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });

  if (donation.deliveryCode !== String(code).trim()) {
    return res.status(400).json({ success: false, message: 'Invalid 4-digit delivery security code.' });
  }

  donation.status = 'DELIVERED';
  donation.servingsDelivered = Number(servingsDelivered) || donation.servingsListed;

  dispatchToN8n('donation.delivered', donation);

  res.json({ 
    success: true, 
    message: 'Delivery confirmed! Impact recorded.', 
    data: donation 
  });
});

// 10. n8n Inbound Webhook Receiver
app.post('/api/webhooks/n8n', (req, res) => {
  const payload = req.body;
  console.log(`[Inbound n8n Webhook]`, payload);
  res.json({ success: true, acknowledgedAt: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[FoodRescue API] Running on http://localhost:${PORT}`);
  console.log(`[n8n Integration] Configured target: ${N8N_URL}${N8N_WEBHOOK_PATH}`);
});

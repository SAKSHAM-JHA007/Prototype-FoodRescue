import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

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

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FoodRescue Backend API', version: '2.0-pilot' });
});

// 2. Get All Donations
app.get('/api/donations', (req, res) => {
  res.json({ success: true, count: donations.length, data: donations });
});

// 3. At-Risk Query (Queried by n8n scheduled cron trigger!)
app.get('/api/donations/at-risk', (req, res) => {
  const atRisk = donations.filter(d => 
    d.status === 'OPEN' && (d.urgency === 'CRITICAL' || d.urgency === 'URGENT')
  );
  res.json({ success: true, count: atRisk.length, data: atRisk });
});

// 4. Create Donation
app.post('/api/donations', (req, res) => {
  const { foodName, servingsListed, dietaryType, safeUntil, providerName } = req.body;
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
    urgency: 'URGENT',
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

  res.status(201).json({ success: true, data: newDonation });
});

// 5. Atomic Acceptance Endpoint (PRD Section 8.2 & 13)
app.post('/api/donations/:id/accept', (req, res) => {
  const { id } = req.params;
  const { recipientOrgName, pickupMode } = req.body;

  const donation = donations.find(d => d.id === id);
  if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });

  // Atomic state guard: Zero double-accepts
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

  res.json({ success: true, message: 'Donation accepted atomically.', data: donation });
});

// 6. Pickup Verification (Handoff from Provider to Courier/Volunteer)
app.post('/api/donations/:id/pickup', (req, res) => {
  const { id } = req.params;
  const { code } = req.body;

  const donation = donations.find(d => d.id === id);
  if (!donation) return res.status(404).json({ success: false, message: 'Donation not found.' });

  if (donation.pickupCode !== String(code).trim()) {
    return res.status(400).json({ success: false, message: 'Invalid 4-digit pickup security code.' });
  }

  donation.status = 'IN_TRANSIT';
  res.json({ success: true, message: 'Pickup code verified. Status updated to IN_TRANSIT.', data: donation });
});

// 7. Delivery Confirmation (Handover to Recipient NGO)
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

  res.json({ 
    success: true, 
    message: 'Delivery confirmed! Impact recorded.', 
    data: donation 
  });
});

// 8. n8n Outbound/Inbound Webhook Receiver
app.post('/api/webhooks/n8n', (req, res) => {
  const payload = req.body;
  console.log(`[n8n Webhook Received]`, payload);
  res.json({ success: true, acknowledgedAt: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[FoodRescue API] Running on http://localhost:${PORT}`);
});

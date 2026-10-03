import { 
  Donation, 
  DonationStatus, 
  Organization, 
  UrgencyLevel, 
  StatusHistoryEntry, 
  AutomationLog,
  VolunteerProfile,
  MatchingWeights,
  MatchedNgo
} from '../types';

const INITIAL_ORGS: Organization[] = [
  {
    id: 'org-mit-mess',
    name: 'MIT Hostel Mess',
    type: 'mess',
    address: 'MIT Campus, Block 5, Manipal',
    lat: 13.3525,
    lng: 74.7928,
    verified: true,
    contactPerson: 'Ramesh Sharma',
    phone: '+91 98765 43210'
  },
  {
    id: 'org-food-court',
    name: 'Food Court 1',
    type: 'canteen',
    address: 'Student Plaza, Campus Hub, Manipal',
    lat: 13.3512,
    lng: 74.7905,
    verified: true,
    contactPerson: 'Priya Nayak',
    phone: '+91 98451 12345'
  },
  {
    id: 'org-city-rest',
    name: 'City Restaurant',
    type: 'restaurant',
    address: 'Tiger Circle Road, Manipal',
    lat: 13.3570,
    lng: 74.7870,
    verified: true,
    contactPerson: 'Vikram Sethi',
    phone: '+91 97400 98765'
  },
  {
    id: 'org-hotel-sapphire',
    name: 'Hotel Sapphire',
    type: 'restaurant',
    address: 'Udupi-Manipal Main Highway',
    lat: 13.3460,
    lng: 74.7950,
    verified: true,
    contactPerson: 'Anand Rao',
    phone: '+91 98860 55443'
  },
  // Recipient NGOs
  {
    id: 'ngo-helping-hands',
    name: 'Helping Hands NGO',
    type: 'ngo',
    address: 'Kasturba Nagar, Manipal',
    lat: 13.3540,
    lng: 74.7990,
    capacityServings: 150,
    operatingRadiusKm: 5,
    dietaryRules: ['Vegetarian', 'Non-veg', 'Egg', 'Vegan'],
    verified: true,
    reliabilityScore: 0.98,
    contactPerson: 'Sunita Rao',
    phone: '+91 98112 23344'
  },
  {
    id: 'ngo-manipal-foodbank',
    name: 'Manipal Food Bank',
    type: 'ngo',
    address: 'Eshwar Nagar, Manipal',
    lat: 13.3610,
    lng: 74.7930,
    capacityServings: 200,
    operatingRadiusKm: 6,
    dietaryRules: ['Vegetarian', 'Egg', 'Vegan'],
    verified: true,
    reliabilityScore: 0.95,
    contactPerson: 'Kiran Kumar',
    phone: '+91 98223 34455'
  },
  {
    id: 'ngo-annapoorna',
    name: 'Annapoorna Trust',
    type: 'ngo',
    address: 'Near DC Office, Manipal',
    lat: 13.3440,
    lng: 74.7890,
    capacityServings: 120,
    operatingRadiusKm: 4,
    dietaryRules: ['Vegetarian', 'Vegan'],
    verified: true,
    reliabilityScore: 0.96,
    contactPerson: 'Venkatesh Iyer',
    phone: '+91 98334 45566'
  },
  {
    id: 'ngo-green-plate',
    name: 'Green Plate Foundation',
    type: 'ngo',
    address: 'Vidyaratna Nagar, Manipal',
    lat: 13.3490,
    lng: 74.8040,
    capacityServings: 80,
    operatingRadiusKm: 5,
    dietaryRules: ['Vegetarian', 'Non-veg', 'Egg', 'Vegan'],
    verified: true,
    reliabilityScore: 0.91,
    contactPerson: 'Farhan Akhtar',
    phone: '+91 98445 56677'
  },
  {
    id: 'ngo-hope-shelter',
    name: 'Hope Shelter & Kitchen',
    type: 'shelter',
    address: 'Indrali Station Link Rd, Udupi',
    lat: 13.3590,
    lng: 74.7800,
    capacityServings: 90,
    operatingRadiusKm: 7,
    dietaryRules: ['Vegetarian', 'Non-veg'],
    verified: true,
    reliabilityScore: 0.89,
    contactPerson: 'Sister Mary',
    phone: '+91 98556 67788'
  }
];

const INITIAL_VOLUNTEER: VolunteerProfile = {
  id: 'vol-1',
  userId: 'user-vol-1',
  name: 'Alex Johnson (Student Volunteer)',
  phone: '+91 98765 99999',
  lat: 13.3530,
  lng: 74.7920,
  maxDistanceKm: 4,
  available: true,
  completedRescues: 28,
  reliabilityScore: 0.96
};

// Calculate initial times
const now = new Date();
const in1Hour = new Date(now.getTime() + 1.2 * 60 * 60 * 1000).toISOString();
const in2Hours = new Date(now.getTime() + 2.5 * 60 * 60 * 1000).toISOString();
const in4Hours = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString();
const in50Mins = new Date(now.getTime() + 50 * 60 * 1000).toISOString();
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();

const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'DON-101',
    providerOrgId: 'org-mit-mess',
    providerName: 'MIT Hostel Mess',
    foodName: 'Rice, Dal, Mixed Veg & Paneer Curry',
    servingsListed: 120,
    dietaryType: 'Vegetarian',
    allergens: ['Dairy'],
    packaging: 'Packed Containers',
    preparedAt: twoHoursAgo,
    safeUntil: in1Hour,
    lat: 13.3525,
    lng: 74.7928,
    address: 'MIT Campus, Block 5, Manipal',
    status: 'OPEN',
    urgency: 'URGENT',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    notes: 'Hot and freshly prepared lunch surplus. Pre-portioned into 4 insulated food grade catering containers.',
    createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    pickupCode: '8492',
    deliveryCode: '3104',
    matchedNgos: [
      { orgId: 'ngo-helping-hands', name: 'Helping Hands NGO', distanceKm: 1.2, etaMinutes: 8, capacityFit: true, dietaryFit: true, score: 94, notified: true, status: 'pending' },
      { orgId: 'ngo-manipal-foodbank', name: 'Manipal Food Bank', distanceKm: 2.1, etaMinutes: 12, capacityFit: true, dietaryFit: true, score: 88, notified: true, status: 'pending' },
      { orgId: 'ngo-annapoorna', name: 'Annapoorna Trust', distanceKm: 2.4, etaMinutes: 14, capacityFit: true, dietaryFit: true, score: 85, notified: true, status: 'pending' },
      { orgId: 'ngo-green-plate', name: 'Green Plate Foundation', distanceKm: 3.0, etaMinutes: 18, capacityFit: false, dietaryFit: true, score: 72, notified: true, status: 'pending' },
      { orgId: 'ngo-hope-shelter', name: 'Hope Shelter', distanceKm: 3.5, etaMinutes: 20, capacityFit: false, dietaryFit: true, score: 68, notified: true, status: 'pending' }
    ]
  },
  {
    id: 'DON-102',
    providerOrgId: 'org-food-court',
    providerName: 'Food Court 1',
    foodName: 'Veg Hakka Noodles & Fried Rice',
    servingsListed: 50,
    dietaryType: 'Vegetarian',
    allergens: ['Soy'],
    packaging: 'Bulk Thermal Trays',
    preparedAt: new Date(now.getTime() - 1.5 * 60 * 60 * 1000).toISOString(),
    safeUntil: in2Hours,
    lat: 13.3512,
    lng: 74.7905,
    address: 'Student Plaza, Campus Hub, Manipal',
    status: 'ACCEPTED',
    urgency: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    notes: 'Kept in warming tray. Great for immediate distribution.',
    createdAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
    acceptedByOrgId: 'ngo-helping-hands',
    acceptedByOrgName: 'Helping Hands NGO',
    pickupMode: 'volunteer',
    volunteerId: 'vol-1',
    volunteerName: 'Alex Johnson (Student Volunteer)',
    pickupCode: '5719',
    deliveryCode: '9041'
  },
  {
    id: 'DON-103',
    providerOrgId: 'org-city-rest',
    providerName: 'City Restaurant',
    foodName: 'Chicken Biryani & Cucumber Raita',
    servingsListed: 35,
    dietaryType: 'Non-veg',
    allergens: ['Dairy'],
    packaging: 'Packed Meal Boxes',
    preparedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    safeUntil: in4Hours,
    lat: 13.3570,
    lng: 74.7870,
    address: 'Tiger Circle Road, Manipal',
    status: 'IN_TRANSIT',
    urgency: 'NORMAL',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    notes: 'Individually packed meal boxes with spoon and napkin.',
    createdAt: new Date(now.getTime() - 75 * 60 * 1000).toISOString(),
    acceptedByOrgId: 'ngo-hope-shelter',
    acceptedByOrgName: 'Hope Shelter & Kitchen',
    pickupMode: 'self',
    pickupCode: '4281',
    deliveryCode: '6179'
  },
  {
    id: 'DON-104',
    providerOrgId: 'org-hotel-sapphire',
    providerName: 'Hotel Sapphire',
    foodName: 'Assorted Breads, Pastries & Fruit Salad',
    servingsListed: 80,
    dietaryType: 'Vegetarian',
    allergens: ['Gluten', 'Dairy'],
    packaging: 'Sealed Bakery Crates',
    preparedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    safeUntil: in50Mins,
    lat: 13.3460,
    lng: 74.7950,
    address: 'Udupi-Manipal Main Highway',
    status: 'OPEN',
    urgency: 'CRITICAL',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    notes: 'Breakfast banquet surplus. Needs quick collection within 50 minutes!',
    createdAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
    pickupCode: '1903',
    deliveryCode: '7721'
  }
];

const INITIAL_HISTORY: StatusHistoryEntry[] = [
  {
    id: 'HIST-1',
    donationId: 'DON-101',
    fromStatus: 'DRAFT',
    toStatus: 'OPEN',
    actor: 'MIT Hostel Mess (Provider)',
    reasonCode: 'PUBLISHED',
    timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'HIST-2',
    donationId: 'DON-102',
    fromStatus: 'OPEN',
    toStatus: 'ACCEPTED',
    actor: 'Helping Hands NGO',
    reasonCode: 'ACCEPTED_BY_RECIPIENT',
    timestamp: new Date(now.getTime() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'HIST-3',
    donationId: 'DON-103',
    fromStatus: 'PICKUP_PENDING',
    toStatus: 'IN_TRANSIT',
    actor: 'Hope Shelter Driver',
    reasonCode: 'PICKUP_VERIFIED_BY_CODE',
    timestamp: new Date(now.getTime() - 10 * 60 * 1000).toISOString()
  }
];

const INITIAL_AUTOMATION_LOGS: AutomationLog[] = [
  {
    id: 'N8N-901',
    workflow: 'WF-01: Urgent Offer Dispatcher',
    trigger: 'Webhook: donation.created (DON-101)',
    donationId: 'DON-101',
    payloadSummary: 'Calculated actionable time: 1.2h. Fan-out push notifications dispatched to 5 nearby verified NGOs.',
    status: 'success',
    timestamp: new Date(now.getTime() - 29 * 60 * 1000).toISOString()
  },
  {
    id: 'N8N-902',
    workflow: 'WF-02: Volunteer Coordination',
    trigger: 'Webhook: donation.accepted_with_volunteer (DON-102)',
    donationId: 'DON-102',
    payloadSummary: 'Broadcasted pickup task to 3 active campus volunteers within 3km.',
    status: 'success',
    timestamp: new Date(now.getTime() - 24 * 60 * 1000).toISOString()
  },
  {
    id: 'N8N-903',
    workflow: 'WF-03: Expiry Escalation Engine',
    trigger: 'Cron: Scheduled check (*/5 * * * *)',
    donationId: 'DON-104',
    payloadSummary: 'Flagged DON-104 as CRITICAL (<1h actionable time). Widened search radius to 8km and alerted Campus Admin.',
    status: 'success',
    timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString()
  }
];

// Distance calculation using Haversine formula (km)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Compute urgency based on actionable time: safe_until - now - travel_buffer
export function deriveUrgency(safeUntilIso: string, travelBufferMinutes = 30): UrgencyLevel {
  const safeUntil = new Date(safeUntilIso).getTime();
  const current = Date.now();
  const actionableMs = safeUntil - current - (travelBufferMinutes * 60 * 1000);
  const actionableHours = actionableMs / (1000 * 60 * 60);

  if (actionableHours <= 1) return 'CRITICAL';
  if (actionableHours <= 2.5) return 'URGENT';
  if (actionableHours <= 4) return 'MEDIUM';
  return 'NORMAL';
}

// Generate 4-digit verification code
function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export class FoodRescueStore {
  private donations: Donation[] = [];
  private orgs: Organization[] = [];
  private volunteer: VolunteerProfile = INITIAL_VOLUNTEER;
  private history: StatusHistoryEntry[] = [];
  private automationLogs: AutomationLog[] = [];
  private weights: MatchingWeights = {
    distanceWeight: 0.35,
    capacityWeight: 0.25,
    reliabilityWeight: 0.20,
    responseSpeedWeight: 0.10,
    fairnessWeight: 0.10
  };
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedDonations = localStorage.getItem('foodrescue_donations');
      const savedOrgs = localStorage.getItem('foodrescue_orgs');
      const savedHistory = localStorage.getItem('foodrescue_history');
      const savedLogs = localStorage.getItem('foodrescue_n8n_logs');

      this.donations = savedDonations ? JSON.parse(savedDonations) : INITIAL_DONATIONS;
      this.orgs = savedOrgs ? JSON.parse(savedOrgs) : INITIAL_ORGS;
      this.history = savedHistory ? JSON.parse(savedHistory) : INITIAL_HISTORY;
      this.automationLogs = savedLogs ? JSON.parse(savedLogs) : INITIAL_AUTOMATION_LOGS;
    } catch {
      this.donations = INITIAL_DONATIONS;
      this.orgs = INITIAL_ORGS;
      this.history = INITIAL_HISTORY;
      this.automationLogs = INITIAL_AUTOMATION_LOGS;
    }
  }

  private saveState() {
    try {
      localStorage.setItem('foodrescue_donations', JSON.stringify(this.donations));
      localStorage.setItem('foodrescue_orgs', JSON.stringify(this.orgs));
      localStorage.setItem('foodrescue_history', JSON.stringify(this.history));
      localStorage.setItem('foodrescue_n8n_logs', JSON.stringify(this.automationLogs));
    } catch (e) {
      console.error("Storage error:", e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // Getters
  public getDonations(): Donation[] {
    return [...this.donations];
  }

  public getOrganizations(): Organization[] {
    return [...this.orgs];
  }

  public getVolunteer(): VolunteerProfile {
    return { ...this.volunteer };
  }

  public getHistory(donationId?: string): StatusHistoryEntry[] {
    if (donationId) {
      return this.history.filter(h => h.donationId === donationId);
    }
    return [...this.history].reverse();
  }

  public getAutomationLogs(): AutomationLog[] {
    return [...this.automationLogs].reverse();
  }

  public getMatchingWeights(): MatchingWeights {
    return { ...this.weights };
  }

  public updateMatchingWeights(weights: Partial<MatchingWeights>) {
    this.weights = { ...this.weights, ...weights };
    this.notify();
  }

  // Rule-based matching and ranking algorithm per PRD Section 7
  public rankNgosForDonation(
    donationLat: number, 
    donationLng: number, 
    servings: number, 
    dietaryType: string
  ): MatchedNgo[] {
    const ngos = this.orgs.filter(o => o.type === 'ngo' || o.type === 'shelter');
    
    return ngos.map(ngo => {
      const distanceKm = calculateDistance(donationLat, donationLng, ngo.lat, ngo.lng);
      const etaMinutes = Math.round(distanceKm * 4 + 3); // rough speed estimate

      // Hard filters
      const withinRadius = distanceKm <= (ngo.operatingRadiusKm || 6);
      const capacityFit = (ngo.capacityServings || 100) >= servings * 0.7;
      const dietaryFit = ngo.dietaryRules ? ngo.dietaryRules.includes(dietaryType) : true;
      const verified = ngo.verified;

      // Ranking score calculation (0 - 100)
      const distanceScore = Math.max(0, 100 - (distanceKm * 15));
      const capacityScore = capacityFit ? 100 : 50;
      const reliabilityScore = (ngo.reliabilityScore || 0.85) * 100;
      const responseSpeedScore = 85;
      const fairnessScore = 90; // Rotate preference

      let totalScore = (
        distanceScore * this.weights.distanceWeight +
        capacityScore * this.weights.capacityWeight +
        reliabilityScore * this.weights.reliabilityWeight +
        responseSpeedScore * this.weights.responseSpeedWeight +
        fairnessScore * this.weights.fairnessWeight
      );

      if (!withinRadius || !verified || !dietaryFit) {
        totalScore = Math.floor(totalScore * 0.4); // penalized if hard filter fails
      }

      return {
        orgId: ngo.id,
        name: ngo.name,
        distanceKm,
        etaMinutes,
        capacityFit,
        dietaryFit,
        score: Math.round(totalScore),
        notified: true,
        status: 'pending' as const
      };
    }).sort((a, b) => b.score - a.score);
  }

  // Create Donation (Provider Flow)
  public createDonation(data: {
    providerOrgId: string;
    foodName: string;
    servingsListed: number;
    dietaryType: 'Vegetarian' | 'Non-veg' | 'Egg' | 'Vegan';
    allergens: string[];
    packaging: string;
    safeUntil: string;
    notes?: string;
    imageUrl?: string;
  }): Donation {
    const providerOrg = this.orgs.find(o => o.id === data.providerOrgId) || this.orgs[0];
    const urgency = deriveUrgency(data.safeUntil);
    const newId = `DON-${Math.floor(100 + Math.random() * 900)}`;

    // Rank matching NGOs
    const matchedNgos = this.rankNgosForDonation(
      providerOrg.lat,
      providerOrg.lng,
      data.servingsListed,
      data.dietaryType
    );

    const newDonation: Donation = {
      id: newId,
      providerOrgId: providerOrg.id,
      providerName: providerOrg.name,
      foodName: data.foodName,
      servingsListed: data.servingsListed,
      dietaryType: data.dietaryType,
      allergens: data.allergens,
      packaging: data.packaging,
      preparedAt: new Date().toISOString(),
      safeUntil: data.safeUntil,
      lat: providerOrg.lat,
      lng: providerOrg.lng,
      address: providerOrg.address,
      status: 'OPEN',
      urgency,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      pickupCode: generateCode(),
      deliveryCode: generateCode(),
      matchedNgos
    };

    this.donations.unshift(newDonation);

    // Audit Log
    this.history.push({
      id: `HIST-${Date.now()}`,
      donationId: newId,
      fromStatus: 'DRAFT',
      toStatus: 'OPEN',
      actor: `${providerOrg.name} (Provider)`,
      reasonCode: 'NEW_DONATION_PUBLISHED',
      timestamp: new Date().toISOString()
    });

    // Simulated n8n Webhook Side Effect Trigger (PRD Section 13)
    this.triggerN8nWebhook('donation.created', newDonation, 
      `Matched ${matchedNgos.length} NGOs. Urgency: ${urgency}. Push alerts & Telegram alerts dispatched.`
    );

    this.saveState();
    return newDonation;
  }

  // Accept Donation (NGO Flow - Atomic)
  public acceptDonation(
    donationId: string, 
    ngoOrgId: string, 
    pickupMode: 'self' | 'volunteer' = 'volunteer'
  ): { success: boolean; message: string } {
    const donation = this.donations.find(d => d.id === donationId);
    if (!donation) return { success: false, message: 'Donation not found' };

    // Atomic check: Only OPEN donations can be accepted
    if (donation.status !== 'OPEN') {
      return { success: false, message: `This donation is no longer available (current status: ${donation.status}).` };
    }

    const ngo = this.orgs.find(o => o.id === ngoOrgId);
    const nextStatus: DonationStatus = pickupMode === 'self' ? 'ACCEPTED' : 'PICKUP_PENDING';

    donation.status = nextStatus;
    donation.acceptedByOrgId = ngoOrgId;
    donation.acceptedByOrgName = ngo?.name || 'Partner NGO';
    donation.pickupMode = pickupMode;

    if (pickupMode === 'volunteer') {
      donation.volunteerId = this.volunteer.id;
      donation.volunteerName = this.volunteer.name;
    }

    // Update matched NGO statuses
    if (donation.matchedNgos) {
      donation.matchedNgos.forEach(m => {
        if (m.orgId === ngoOrgId) {
          m.status = 'accepted';
        } else {
          m.status = 'declined';
          m.declineReason = 'Claimed by another recipient';
        }
      });
    }

    // Audit Log
    this.history.push({
      id: `HIST-${Date.now()}`,
      donationId: donation.id,
      fromStatus: 'OPEN',
      toStatus: nextStatus,
      actor: `${ngo?.name || 'NGO'} (${pickupMode === 'self' ? 'Self Collect' : 'Requested Volunteer'})`,
      reasonCode: 'ATOMIC_ACCEPTANCE',
      timestamp: new Date().toISOString()
    });

    // Trigger n8n Automation
    this.triggerN8nWebhook(
      pickupMode === 'self' ? 'donation.accepted_self_pickup' : 'donation.accepted_need_volunteer',
      donation,
      `Accepted by ${ngo?.name}. ${pickupMode === 'volunteer' ? 'Dispatched task to volunteer network.' : 'Recipient arranged self-transport.'}`
    );

    this.saveState();
    return { success: true, message: 'Donation successfully claimed!' };
  }

  // Decline Donation with Reason (NGO Flow)
  public declineDonation(donationId: string, ngoOrgId: string, reason: string) {
    const donation = this.donations.find(d => d.id === donationId);
    if (!donation || !donation.matchedNgos) return;

    const match = donation.matchedNgos.find(m => m.orgId === ngoOrgId);
    if (match) {
      match.status = 'declined';
      match.declineReason = reason;
    }

    this.saveState();
  }

  // Volunteer Accepts Task (Volunteer Flow)
  public volunteerAcceptTask(donationId: string): boolean {
    const donation = this.donations.find(d => d.id === donationId);
    if (!donation || donation.status !== 'PICKUP_PENDING') return false;

    donation.volunteerId = this.volunteer.id;
    donation.volunteerName = this.volunteer.name;
    this.volunteer.activeTaskId = donationId;

    this.history.push({
      id: `HIST-${Date.now()}`,
      donationId: donation.id,
      fromStatus: 'PICKUP_PENDING',
      toStatus: 'PICKUP_PENDING',
      actor: this.volunteer.name,
      reasonCode: 'VOLUNTEER_TASK_COMMITTED',
      timestamp: new Date().toISOString()
    });

    this.triggerN8nWebhook('volunteer.task_accepted', donation, `Volunteer ${this.volunteer.name} accepted pickup route.`);
    this.saveState();
    return true;
  }

  // Confirm Pickup with Verification Code (Provider & Volunteer/Driver handoff)
  public confirmPickup(donationId: string, enteredCode: string): { success: boolean; message: string } {
    const donation = this.donations.find(d => d.id === donationId);
    if (!donation) return { success: false, message: 'Donation not found' };

    if (donation.status !== 'ACCEPTED' && donation.status !== 'PICKUP_PENDING') {
      return { success: false, message: `Invalid state for pickup: ${donation.status}` };
    }

    if (donation.pickupCode !== enteredCode.trim()) {
      return { success: false, message: 'Incorrect 4-digit pickup code. Please check with food provider.' };
    }

    donation.status = 'IN_TRANSIT';

    this.history.push({
      id: `HIST-${Date.now()}`,
      donationId: donation.id,
      fromStatus: 'PICKUP_PENDING',
      toStatus: 'IN_TRANSIT',
      actor: donation.volunteerName || donation.acceptedByOrgName || 'Courier',
      reasonCode: 'PICKUP_CODE_VERIFIED',
      timestamp: new Date().toISOString()
    });

    this.triggerN8nWebhook('donation.in_transit', donation, 'Food collected safely from provider. In transit to destination.');
    this.saveState();
    return { success: true, message: 'Pickup confirmed! Food is now in transit.' };
  }

  // Confirm Delivery with Verification Code + Actual Servings (Delivery to NGO)
  public confirmDelivery(donationId: string, enteredCode: string, actualServings?: number): { success: boolean; message: string } {
    const donation = this.donations.find(d => d.id === donationId);
    if (!donation) return { success: false, message: 'Donation not found' };

    if (donation.status !== 'IN_TRANSIT') {
      return { success: false, message: `Donation is not in transit: ${donation.status}` };
    }

    if (donation.deliveryCode !== enteredCode.trim()) {
      return { success: false, message: 'Incorrect 4-digit delivery code. Provided by recipient NGO.' };
    }

    donation.status = 'DELIVERED';
    donation.servingsDelivered = actualServings || donation.servingsListed;
    if (this.volunteer.activeTaskId === donationId) {
      this.volunteer.activeTaskId = undefined;
      this.volunteer.completedRescues += 1;
    }

    this.history.push({
      id: `HIST-${Date.now()}`,
      donationId: donation.id,
      fromStatus: 'IN_TRANSIT',
      toStatus: 'DELIVERED',
      actor: `${donation.acceptedByOrgName || 'Recipient NGO'} (Delivered)`,
      reasonCode: 'DELIVERY_CONFIRMED_RESCUED',
      timestamp: new Date().toISOString()
    });

    this.triggerN8nWebhook(
      'donation.delivered', 
      donation, 
      `Successfully delivered ${donation.servingsDelivered} servings! Impact recorded: ~${((donation.servingsDelivered || 0) * 2.5).toFixed(1)} kg CO2 diverted.`
    );

    this.saveState();
    return { success: true, message: `Awesome! ${donation.servingsDelivered} meals successfully rescued and confirmed.` };
  }

  // Admin Intervention (PRD Section 11.4 & 6.2)
  public adminIntervene(donationId: string, action: 'escalate' | 'widen_radius' | 'cancel' | 'reassign', payload?: string) {
    const donation = this.donations.find(d => d.id === donationId);
    if (!donation) return;

    if (action === 'widen_radius') {
      donation.urgency = 'CRITICAL';
      // Widen search to include all NGOs
      if (donation.matchedNgos) {
        donation.matchedNgos.forEach(m => m.notified = true);
      }
      this.history.push({
        id: `HIST-${Date.now()}`,
        donationId: donation.id,
        fromStatus: donation.status,
        toStatus: donation.status,
        actor: 'Campus Admin',
        reasonCode: 'ADMIN_WIDENED_RADIUS_URGENT',
        timestamp: new Date().toISOString()
      });
      this.triggerN8nWebhook('admin.widen_radius', donation, 'Admin escalated search radius to 15km; urgent broadcasts dispatched.');
    } else if (action === 'cancel') {
      donation.status = 'CANCELLED';
      donation.failureReason = payload || 'Cancelled by Admin';
      this.history.push({
        id: `HIST-${Date.now()}`,
        donationId: donation.id,
        fromStatus: donation.status,
        toStatus: 'CANCELLED',
        actor: 'Campus Admin',
        reasonCode: 'ADMIN_CANCELLED',
        timestamp: new Date().toISOString()
      });
    }

    this.saveState();
  }

  // n8n Webhook side-effect simulation
  private triggerN8nWebhook(event: string, donation: Donation, summary: string) {
    const log: AutomationLog = {
      id: `N8N-${Math.floor(100 + Math.random() * 900)}`,
      workflow: `WF: ${event.toUpperCase()}`,
      trigger: `Webhook: ${event} (${donation.id})`,
      donationId: donation.id,
      payloadSummary: summary,
      status: 'success',
      timestamp: new Date().toISOString()
    };
    this.automationLogs.unshift(log);
    if (this.automationLogs.length > 50) this.automationLogs.pop();
  }

  // Reset to initial demo state
  public resetToDemo() {
    this.donations = INITIAL_DONATIONS;
    this.orgs = INITIAL_ORGS;
    this.history = INITIAL_HISTORY;
    this.automationLogs = INITIAL_AUTOMATION_LOGS;
    this.volunteer = INITIAL_VOLUNTEER;
    this.saveState();
  }
}

export const store = new FoodRescueStore();

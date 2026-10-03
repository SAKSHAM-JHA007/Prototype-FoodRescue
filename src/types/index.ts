export type Persona = 'landing' | 'provider' | 'ngo' | 'volunteer' | 'admin' | 'impact' | 'workflows';

export type UserRole = 'provider' | 'ngo' | 'volunteer' | 'admin';

export type DonationStatus = 
  | 'DRAFT' 
  | 'OPEN' 
  | 'ACCEPTED' 
  | 'PICKUP_PENDING' 
  | 'IN_TRANSIT' 
  | 'DELIVERED' 
  | 'EXPIRED' 
  | 'CANCELLED' 
  | 'FAILED';

export type UrgencyLevel = 'NORMAL' | 'MEDIUM' | 'URGENT' | 'CRITICAL';

export type DietaryType = 'Vegetarian' | 'Non-veg' | 'Egg' | 'Vegan';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  orgId?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'mess' | 'hostel' | 'restaurant' | 'canteen' | 'ngo' | 'shelter';
  address: string;
  lat: number;
  lng: number;
  capacityServings?: number;
  operatingRadiusKm?: number;
  dietaryRules?: string[];
  verified: boolean;
  reliabilityScore?: number;
  contactPerson?: string;
  phone?: string;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  lat: number;
  lng: number;
  maxDistanceKm: number;
  available: boolean;
  activeTaskId?: string;
  completedRescues: number;
  reliabilityScore: number;
}

export interface MatchedNgo {
  orgId: string;
  name: string;
  distanceKm: number;
  etaMinutes: number;
  capacityFit: boolean;
  dietaryFit: boolean;
  score: number;
  notified: boolean;
  status: 'pending' | 'accepted' | 'declined';
  declineReason?: string;
}

export interface Donation {
  id: string;
  providerOrgId: string;
  providerName: string;
  foodName: string;
  servingsListed: number;
  dietaryType: DietaryType;
  allergens: string[];
  packaging: string;
  preparedAt: string; // ISO
  safeUntil: string;  // ISO
  lat: number;
  lng: number;
  address: string;
  status: DonationStatus;
  urgency: UrgencyLevel;
  imageUrl?: string;
  notes?: string;
  createdAt: string;

  // Matching & Fulfillment
  matchedNgos?: MatchedNgo[];
  acceptedByOrgId?: string;
  acceptedByOrgName?: string;
  pickupMode?: 'self' | 'volunteer';
  volunteerId?: string;
  volunteerName?: string;
  pickupCode: string;
  deliveryCode: string;
  servingsDelivered?: number;
  failureReason?: string;
}

export interface StatusHistoryEntry {
  id: string;
  donationId: string;
  fromStatus: DonationStatus;
  toStatus: DonationStatus;
  actor: string;
  reasonCode?: string;
  timestamp: string;
}

export interface AutomationLog {
  id: string;
  workflow: string;
  trigger: string;
  donationId: string;
  payloadSummary: string;
  status: 'success' | 'running' | 'retrying';
  timestamp: string;
}

export interface MatchingWeights {
  distanceWeight: number;
  capacityWeight: number;
  reliabilityWeight: number;
  responseSpeedWeight: number;
  fairnessWeight: number;
}

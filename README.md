# FoodRescue (Pilot v2)

> **Time-boxed, trackable food rescue coordination platform** connecting food providers (student messes, hostels, cafeterias, restaurants) with verified NGOs and volunteers to rescue surplus cooked food while it is still safe to eat.

Built according to [FoodRescue PRD v2.md](file:///c:/Users/Saksham%20Jha/OneDrive/Desktop/foodrescue/Prototype-FoodRescue/FoodRescue%20PRD%20v2.md) and the [FoodRescue Mockup](file:///c:/Users/Saksham%20Jha/OneDrive/Desktop/foodrescue/Prototype-FoodRescue/FoodRescue%20Impact%20Dashboard%20Mockup.png).

---

## 🛠️ Architecture & Tech Stack

```
FRONTEND
React.js 19 + Vite + TypeScript + Tailwind CSS (PWA-ready)
              ↓
BACKEND
Node.js + Express.js REST API
              ↓
     ┌────────┼─────────┐
     ↓        ↓         ↓
DATABASE     AI        n8n
Supabase   FastAPI   Automation
PostgreSQL (Vision)  Workflows
(PostGIS)
     ↓        ↓         ↓
     └────────┼─────────┘
              ↓
      EXTERNAL SERVICES
 Leaflet Maps | Web Push (FCM) | Telegram/SMS
```

---

## 🚀 Running the Prototype

### 1. Frontend Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 2. Express Backend API
```bash
npm run server
```
Runs the Express API at **[http://localhost:5000/](http://localhost:5000/)**.

---

## 🌟 Implemented Personas & Flows

1. **🌐 Public Landing & Impact Showcase**
   - Value proposition & hero presentation matching the mockup.
   - Live verified impact metrics: Meals Rescued, People Served, Active NGOs, Pickups.
   - 4-Step process walkthrough: Listing, Smart Matching, Pickup & Delivery, Impact Tracking.

2. **🍲 Food Provider Dashboard (Messes, Caterers & Restaurants)**
   - Create surplus listing in under 60 seconds with servings, dietary tags, packaging, and safe-until window.
   - Built-in FSSAI Food Safety declaration checkpoint (PRD Section 10).
   - "✨ Auto-Fill" AI assistant button simulating Vision/menu proposal.
   - Real-time "Donation Sent!" modal showing 5 notified nearby NGOs with distances.
   - Provider Pickup Verification Code (`pickupCode`) modal for courier handoff.

3. **🏢 Recipient NGO Dashboard (Shelters & Community Kitchens)**
   - Interactive Leaflet campus map showing providers, NGOs, and active volunteer couriers.
   - Nearby donations feed sorted by distance or urgency level (Critical, Urgent, Medium, Normal).
   - 1-Tap atomic acceptance (Zero double-accepts guaranteed).
   - Modal choice: *"Request a Volunteer"* vs *"Self-Collect with own vehicle"*.
   - Decline modal with reason recording (capacity, radius, dietary mismatch) to calibrate matching algorithms.
   - Delivery Confirmation modal requiring 4-digit security code + actual servings verification.

4. **🚴 Campus Volunteer Dashboard**
   - Nearby pickup run tasks feed with route distance and time deadlines.
   - 2-Step mission execution:
     - Step 1: Arrive at Provider -> Enter Provider's 4-digit pickup code -> status becomes `IN_TRANSIT`.
     - Step 2: Deliver to NGO -> NGO verifies delivery code -> status becomes `DELIVERED` (Rescued).

5. **🛡️ Campus Admin Operations Command**
   - Live **At-Risk Board**: Identifies batches approaching expiry (<1h) or pending acceptance.
   - Action buttons: Widen search radius (to 15km), trigger hotline call, or enforce safe cancellation.
   - **Matching Algorithm Weights Calibrator**: Live sliders for Distance, Capacity, Reliability, Response Speed, and Fairness weights.
   - **Append-Only Status History Log**: Complete audit trail (who, when, why) for all state transitions.

6. **⚡ n8n Automation Engine Viewer**
   - Flow diagram of idempotent side-effect triggers (`donation.created`, `donation.accepted`, `donation.delivered`).
   - Live execution stream showing push notification fan-outs and escalation broadcasts.
   - Version-controlled workflow exported in `n8n-workflows/urgent-notification-escalation.json`.

7. **🗄️ Database & Schema**
   - Production PostgreSQL + PostGIS schema in `supabase/schema.sql` with geospatial indexes and Row Level Security policies.

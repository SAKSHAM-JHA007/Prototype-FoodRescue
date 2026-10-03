# FoodRescue — Product Requirements Document (v2)

**Status:** Draft for pilot · **Scope of this version:** Single-campus pilot (MVP), with a path to multi-campus/city

---

## 1. Summary

FoodRescue is a real-time coordination platform that connects food providers (college messes, hostels, caterers, restaurants) with verified NGOs and volunteers so that surplus cooked food reaches people **while it is still safe to eat**.

**One-line positioning:** Time-boxed, trackable food rescue, not a donation website.

**Core loop (MVP):** Provider lists surplus → system ranks nearby verified recipients → recipient accepts → pickup is arranged → delivery is confirmed → impact is recorded.

---

## 2. Problem

Surplus cooked food has a short safe-consumption window (typically a few hours). Today, donation depends on phone calls and WhatsApp groups, which causes:

1. Providers don't know who can take food right now.
2. NGOs don't know food is available, or can't verify its quality and quantity.
3. Transport is ad hoc; volunteers are hard to coordinate.
4. Nobody can reliably measure how much listed food was actually rescued.

**Key insight:** The hard problem is not listing food. It is *closing the loop before the safe-until time*. Every product decision should be judged against that.

---

## 3. Goals and Non-Goals

### Goals (MVP)

- A provider can list surplus in **under 60 seconds** (target: 3 taps for a repeat listing).
- A donation reaches suitable recipients **immediately** after listing.
- Every donation has a clear owner and next action at every moment.
- Every rescued meal is **confirmed at delivery**, not assumed.

### Non-Goals (MVP)

- Not a marketplace for selling discounted food.
- Not a replacement for provider or NGO food-safety procedures.
- No packaged/raw food donations (cooked and ready-to-eat only, to start).
- No automated route optimisation, IoT, or CSR reporting.

---

## 4. Users and Personas

| Persona | Who | Primary need | Key pain today |
| --- | --- | --- | --- |
| **Provider** | Mess manager, hostel warden, caterer | Dispose of surplus responsibly, quickly, with no hassle | Doesn't know who to call; fear of liability |
| **Recipient (NGO)** | Shelter, community kitchen | Know about food early enough to collect and distribute it | Short notice; uncertain quantity/quality |
| **Volunteer** | Student, local resident | Small, clear, low-risk pickup tasks | Unclear task details; safety/trust concerns |
| **Admin** | Platform team / campus coordinator | Verify orgs, resolve failures | No visibility; manual follow-up |

---

## 5. Key User Stories and Acceptance Criteria

**Provider**

- *As a provider, I can create a donation with food, servings, dietary type, allergens, prepared time, and safe-until time.*
  - AC: Cannot submit without dietary type (veg / non-veg / egg / contains-allergen flags) and safe-until time.
  - AC: Safe-until defaults from food category (editable, with a hard cap per category set by Admin).
- *As a provider, I can repeat a previous donation in one tap.* (Messes surplus on a predictable schedule.)
- *As a provider, I can cancel or edit until a recipient accepts; after acceptance, changes require recipient notification.*

**Recipient**

- *As an NGO, I receive an offer only for donations within my radius, capacity, and dietary rules.*
  - AC: Offer shows servings, dietary type, allergens, safe-until, distance, and whether pickup help is needed.
- *As an NGO, I can choose "I'll collect it myself" or "Request a volunteer."*
- *As an NGO, I can accept or decline with one tap; declines require a reason (used to improve matching).*

**Volunteer**

- *As a volunteer, I see only tasks that fit my availability and distance, with full pickup and drop details after accepting.*
- *As a volunteer, I can confirm pickup and delivery using a code/QR.*

**Admin**

- *As an admin, I see all donations at risk of expiring and can intervene (reassign, call, cancel).*

---

## 6. Core Flows

### 6.1 Donation flow

1. Provider creates donation (manual, or AI-assisted draft the provider must review).
2. System validates and computes **time-to-safe-expiry**.
3. **Hard filters** remove ineligible recipients (unverified, outside radius, over capacity, dietary mismatch, not operating at that hour).
4. Remaining recipients are **ranked** and offered the donation (see 7).
5. First valid acceptance wins (atomic; see 8.2).
6. Pickup arranged (recipient self-collect, or volunteer assigned).
7. Pickup verified at provider (code/QR), delivery verified at recipient (code/QR + confirmed servings).
8. Donation marked RESCUED; impact updated.

### 6.2 Failure paths (must be designed, not afterthoughts)

- No recipient accepts within N minutes → widen radius, re-notify, escalate to Admin.
- Recipient accepts but no volunteer found → notify recipient to self-collect, re-broadcast, escalate to Admin.
- Volunteer accepts but doesn't pick up → reminder → reassign → escalate.
- Food quantity or quality differs from listing at pickup → recipient can **reject at pickup with reason**; recorded for provider quality score.
- Safe-until time reached → auto-expire and notify all parties.

---

## 7. Matching

**MVP approach: rule-based filtering plus a transparent weighted score.** No ML is required at launch; explainability matters more than sophistication.

**Hard filters (pass/fail):**

- Verified organisation, active, within operating hours
- Within recipient's operating radius and estimated travel time \< time remaining minus buffer
- Remaining capacity ≥ minimum servings (partial acceptance allowed)
- Dietary/allergen compatibility with recipient's stated rules

**Ranking score (weights configurable by Admin):**

- Distance / travel time
- Capacity fit
- Historical reliability (accept → delivered rate)
- Response speed
- Fairness factor (avoid always offering to the same NGO first)

**Offer strategy:** Offer to top-K recipients simultaneously (K = 3 default) for Urgent/Critical donations, or sequentially with timeouts for Normal donations. Parameters configurable.

**Safety principle:** The score ranks recipients. It never determines whether food is safe. Safe-until is set by the provider under their food-safety procedures, bounded by Admin-defined category limits.

---

## 8. Donation State Model

### 8.1 States

| State | Meaning | Who/what moves it |
| --- | --- | --- |
| DRAFT | Being created / AI draft awaiting review | Provider |
| OPEN | Published, offers being sent | System |
| ACCEPTED | A recipient has committed | Recipient |
| PICKUP_PENDING | Volunteer needed or assigned, not yet picked up | System / Volunteer |
| IN_TRANSIT | Picked up, verified at provider | Volunteer / Recipient |
| DELIVERED | Delivery confirmed by recipient with actual servings | Recipient |
| CANCELLED | Cancelled by provider | Provider |
| EXPIRED | Safe-until passed without pickup | System |
| FAILED | Accepted but not completed (with reason code) | System / Admin |

"RESCUED" is a **reporting label** for DELIVERED donations, not a separate state. "Urgency" is a **derived attribute** (not a state).

### 8.2 Rules

- Transitions are validated server-side; invalid transitions are rejected.
- **Acceptance is atomic.** Only one recipient (or recipient per partial allocation) may win; others receive "no longer available."
- Every transition writes to an **append-only status history** (who, when, why).
- FAILED must carry a reason code (no volunteer, no-show, quality rejection, quantity mismatch, other).

---

## 9. Urgency

Urgency is based on **actionable time**, not just the deadline:

`actionable_time = safe_until − now − expected_travel_buffer`

| Level | Condition (default, configurable) | Behaviour |
| --- | --- | --- |
| Normal | > 3 h actionable | Standard notifications |
| Urgent | 1–3 h | Wider radius, push notifications |
| Critical | \< 1 h | Simultaneous offers, SMS/WhatsApp, Admin visibility |

---

## 10. Food Safety, Trust and Compliance

*This section was missing from v1 and is a launch blocker.*

- **Regulatory review (India):** Confirm obligations under FSSAI regulations for recovery and distribution of surplus food (including registration/licensing expectations for recipients and food handling requirements) before pilot launch.
- **Provider declaration:** Provider confirms at listing that food was prepared hygienically, stored appropriately, and has not been served/partially consumed.
- **Handling info captured:** Prepared time, storage method, packaging type, vegetarian/non-vegetarian, common allergens.
- **Terms of use:** Clear liability and responsibility terms for providers, recipients, and volunteers; legal review required.
- **Recipient verification:** Document-based verification (registration, address, contact person) plus Admin approval; periodic re-verification.
- **Volunteer trust:** Phone-verified identity; for campus pilot, institutional ID; handoff by code so food cannot be diverted undetected; volunteers see exact addresses only after accepting.
- **Reporting:** Any party can flag a food-quality or conduct incident; Admin can suspend accounts.
- **Privacy:** Minimise collected personal data; volunteer live location only during active tasks; comply with applicable data-protection law (India's DPDP Act).

---

## 11. Feature Requirements

### 11.1 Provider

- Dashboard: active donations (with countdown to safe-until), history, impact.
- Create donation: required fields: food name, servings, dietary type, allergens, prepared time, safe-until, pickup location, packaging; optional: photo, notes.
- Repeat/clone previous donation; saved templates for recurring items.
- Edit/cancel rules per 5.
- View matched recipient and live status.

### 11.2 Recipient (NGO)

- Profile: capacity, operating hours, radius, dietary rules, vehicle availability, contact persons.
- Offers inbox with accept / partial accept / decline (with reason).
- Choose self-collect or request volunteer.
- Confirm delivery with actual servings received.

### 11.3 Volunteer

- Availability toggle, home area, and max distance.
- Task list with distance, time window, and weight/volume estimate.
- Navigation deep-link to Maps; pickup and drop confirmation.

### 11.4 Admin

- Verification queue (orgs, volunteers).
- **"At-risk" board:** donations approaching expiry without acceptance or pickup.
- Intervention actions: reassign, re-broadcast, cancel, contact parties.
- Configuration: category safe-until limits, urgency thresholds, matching weights.
- Audit log viewer.

### 11.5 Map

- Leaflet + OpenStreetMap. Layers: active donations, recipients, pickup tasks. Critical donations visually prominent.
- Map is secondary to list views in the MVP; list-first is faster on mobile.

### 11.6 AI-assisted listing (optional in MVP, **not** on the critical path)

- Provider can type or photo-describe surplus; the system proposes items and servings.
- Estimated servings from photos are low-reliability. Always editable, always labelled "estimate."
- Success measured by edit rate (how often providers change AI output).

### 11.7 Surplus prediction (post-MVP)

- Requires ≥ 6–8 weeks of listing data per provider before output is meaningful.
- Initial version can be a simple per-provider, per-weekday average, with no ML.

---

## 12. Notifications

| Event | Recipient | Channel (priority order) |
| --- | --- | --- |
| New offer | NGO | Push → SMS (Critical: + WhatsApp) |
| Accepted | Provider | Push / in-app |
| Volunteer request | Volunteers in range | Push |
| Pickup reminder | Volunteer | Push → SMS |
| At-risk escalation | Admin | Push / email |
| Delivered | Provider, NGO | In-app / email |

- Rules: one notification per event per user, quiet-hours respected for non-critical items, throttling for volunteers to avoid fatigue.
- Note: SMS in India requires regulatory sender/template registration; WhatsApp requires business API approval. Plan lead time or use push + in-app for the pilot.

---

## 13. Automation (n8n) — Architecture Principle

**The backend owns state and business-critical logic. n8n orchestrates side effects.**

| Belongs in backend | Belongs in n8n |
| --- | --- |
| State transitions, acceptance atomicity | Notification fan-out and retries |
| Matching/ranking | Scheduled reminders and escalations |
| Authorisation, validation | Daily reports, admin digests |
| Impact calculations | Integrations (WhatsApp/email/SMS providers) |

**Requirements:**

- All workflows are **idempotent** (keyed by donation_id + event + attempt).
- Backend does not block on n8n; failures are retried with backoff and surfaced in an Admin "failed jobs" view.
- Expiry/urgency uses a scheduled job querying the database, not event-by-event waits.
- Workflows are version-controlled (exported JSON in repo).

---

## 14. Data Model (expanded)

- **users** (id, name, email, phone, auth_provider, status, created_at)
- **user_roles** (user_id, role) — allows one person to hold multiple roles
- **organizations** (id, owner_user_id, name, type, address, geo_point, capacity_servings, operating_radius_km, operating_hours, dietary_rules, has_vehicle, verification_status, verified_by, verified_at)
- **volunteer_profiles** (user_id, home_geo, max_distance_km, availability, reliability_score)
- **donations** (id, provider_org_id, food_name, servings_listed, dietary_type, allergens\[\], packaging, prepared_at, safe_until, geo_point, status, urgency_cache, image_url, notes, created_at)
- **donation_offers** (id, donation_id, org_id, rank, score, offered_at, responded_at, response, decline_reason)
- **pickups** (id, donation_id, recipient_org_id, volunteer_id NULLABLE, mode \[self/volunteer\], assigned_at, picked_up_at, delivered_at, servings_delivered, pickup_code_hash, delivery_code_hash, status)
- **donation_status_history** (id, donation_id, from_status, to_status, actor, reason_code, created_at)
- **notifications** (id, user_id, type, channel, payload, sent_at, status)
- **incidents / reports** (id, donation_id, reporter_id, type, details, status)
- **config** (key, value) — thresholds, weights, safe-until limits

**Notes:** Use PostGIS (available on Supabase) for geospatial queries. Store timestamps in UTC; display in local time. Apply Row Level Security by role.

---

## 15. Technology (simplified for MVP)

| Layer | Recommendation | Rationale |
| --- | --- | --- |
| Frontend | React + Vite + Tailwind, built as an installable **PWA** | Mobile-first; volunteers and NGOs will mostly use phones |
| Backend / DB / Auth | **Supabase** (Postgres + PostGIS, Auth, Realtime, Storage) with a thin Node/Express or edge-function layer for business logic | One platform for auth + data + realtime; avoid running two auth systems |
| Automation | n8n (self-hosted or Cloud) | See 13 |
| Maps | Leaflet + OpenStreetMap; routing via OSRM/OpenRouteService | Free, adequate for MVP |
| Push | Firebase Cloud Messaging only (not auth) | Standard for web push |
| AI (optional) | Direct vision/LLM API call from the backend | A separate Python/FastAPI + OpenCV service is not justified until a trained model exists |
| Hosting | Vercel (frontend), Supabase, a backend host **without cold starts** | Free-tier cold starts break time-critical flows |

**Open question:** Phone OTP via Supabase requires a paid SMS provider. Decide email/Google-only for pilot versus budgeting for OTP.

---

## 16. Non-Functional Requirements (measurable)

| Area | Target |
| --- | --- |
| Donation creation | p95 \< 3 s submit; \< 60 s end-to-end for the user |
| Offer delivery | First notifications sent \< 30 s after publish |
| Status consistency | Zero double-accepts; all transitions audited |
| Availability | ≥ 99% during meal-surplus windows (e.g., 7–11 PM) |
| Low connectivity | Core volunteer actions (view task, confirm pickup) usable on poor networks; queue and retry |
| Security | RLS per role, rate limiting, signed URLs for images, secrets management |
| Localisation | English at launch; architecture ready for Hindi/regional languages |
| Accessibility | WCAG AA basics; large tap targets for volunteers using phones one-handed |

---

## 17. Metrics

**North Star:** Meals delivered and confirmed per week.

**Primary KPI:** *Rescue rate* = servings DELIVERED ÷ servings listed (over donations whose safe-until has passed), measured weekly.

**Supporting metrics**

- Time to first offer; time to acceptance; time to pickup; time to delivery
- Offer acceptance rate; decline reasons
- Fail/expiry rate with reason breakdown
- Listed vs delivered servings variance (data quality)
- Repeat listing rate (provider retention)
- Active recipients and volunteers per week; volunteer no-show rate
- Admin interventions per 100 donations (how much is still manual)

**Definitions (to avoid inflated impact):**

- *Meals rescued* = servings confirmed delivered, not listed.
- *People served* is **not** reported unless recipients enter actual counts; otherwise it is shown as an estimate, labelled as such.

**Pilot targets (to validate with stakeholders):** e.g., ≥ 60% rescue rate, median time to acceptance \< 15 min, ≥ 3 active recipients and ≥ 10 active volunteers per campus. *These are placeholders, set baselines in the first 2–3 weeks.*

---

## 18. Release Plan

| Phase | Scope | Exit criteria |
| --- | --- | --- |
| **0 – Validate** | Interview 5 providers, 5 NGOs; confirm legal/food-safety requirements; concierge test with a WhatsApp + Google Form for 2 weeks | Provider and NGO commitment; safe-until policy agreed |
| **1 – MVP pilot (1 campus)** | Auth, provider/NGO/volunteer flows, state machine, matching (rule-based), push + in-app, admin at-risk board, impact dashboard v1 | ≥ 50 donations, rescue rate baseline set, no double-accept bugs |
| **2 – Hardening** | SMS/WhatsApp, ratings/reliability, templates, reports, better maps | Admin interventions trend down |
| **3 – Expansion** | Multi-campus/city, surplus prediction, route batching, CSR analytics | Network density per area |

---

## 19. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Food-safety incident | Severe | Provider declaration, safe-until caps, quality-rejection at pickup, incident process, legal review |
| Cold start: too few NGOs/volunteers | Platform feels dead | Onboard recipients and volunteers *before* providers; pilot on one dense campus area |
| Notification fatigue | Users mute app | Throttling, relevance filters, digest for non-urgent |
| Volunteer no-shows | Failed rescues | Self-collect option, reminders, auto-reassign, reliability score |
| Providers stop listing (extra work) | No supply | One-tap repeat, templates, minimal required fields |
| n8n/outage during peak | Missed offers | Backend-owned core logic, retries, admin failed-jobs view |
| Misuse / fake NGOs | Trust loss | Document verification, Admin approval, reporting and suspension |
| Data privacy | Legal/trust | Data minimisation, RLS, consent, retention policy |

---

## 20. Open Questions

1. Who legally bears responsibility for food quality after handover (provider, recipient, platform)? Legal input needed.
2. Is partial acceptance (splitting one donation across NGOs) in MVP or not?
3. Will recipients have their own transport often enough to make volunteers optional?
4. What is the pickup window logic for recurring providers (e.g., pre-notify every night at 9 PM)?
5. SMS/WhatsApp budget and registration timeline: pilot with push only?
6. Who is the campus admin, and what is their SLA to resolve at-risk donations?

---

## 21. Appendix — Changes from v1

- Added: personas, user stories with acceptance criteria, failure paths, food-safety/compliance, risks, open questions, phased release plan, measurable NFRs.
- Changed: state model simplified and made rule-driven; urgency now uses actionable time; matching is rule-based and explainable; n8n scoped to orchestration; stack reduced (single auth/data platform, no separate AI service at launch).
- Metrics redefined to avoid counting unconfirmed meals.
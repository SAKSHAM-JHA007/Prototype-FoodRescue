-- ========================================================
-- FoodRescue (Pilot v2) — Database Schema & DDL
-- Platform: Supabase / PostgreSQL with PostGIS
-- ========================================================

-- Enable PostGIS extension for accurate geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Roles (Allows multiple roles per user e.g. provider + volunteer)
CREATE TYPE user_role_enum AS ENUM ('provider', 'ngo', 'volunteer', 'admin');

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL,
    UNIQUE(user_id, role)
);

-- 3. Organizations (Messes, Restaurants, Caterers, NGOs, Shelters)
CREATE TYPE org_type_enum AS ENUM ('mess', 'hostel', 'restaurant', 'canteen', 'caterer', 'ngo', 'shelter');

CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID REFERENCES public.users(id),
    name TEXT NOT NULL,
    type org_type_enum NOT NULL,
    address TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    capacity_servings INT DEFAULT 100,
    operating_radius_km NUMERIC DEFAULT 6.0,
    operating_hours JSONB,
    dietary_rules TEXT[] DEFAULT '{}',
    has_vehicle BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    reliability_score NUMERIC DEFAULT 0.95,
    contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_location ON public.organizations USING GIST (location);

-- 4. Volunteer Profiles
CREATE TABLE IF NOT EXISTS public.volunteer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    home_location GEOGRAPHY(POINT, 4326),
    max_distance_km NUMERIC DEFAULT 5.0,
    is_available BOOLEAN DEFAULT TRUE,
    reliability_score NUMERIC DEFAULT 0.95,
    completed_rescues INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Donations
CREATE TYPE donation_status_enum AS ENUM (
    'DRAFT', 
    'OPEN', 
    'ACCEPTED', 
    'PICKUP_PENDING', 
    'IN_TRANSIT', 
    'DELIVERED', 
    'EXPIRED', 
    'CANCELLED', 
    'FAILED'
);

CREATE TYPE urgency_level_enum AS ENUM ('NORMAL', 'MEDIUM', 'URGENT', 'CRITICAL');

CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_org_id UUID REFERENCES public.organizations(id) ON DELETE RESTRICT,
    food_name TEXT NOT NULL,
    servings_listed INT NOT NULL CHECK (servings_listed > 0),
    dietary_type TEXT NOT NULL,
    allergens TEXT[] DEFAULT '{}',
    packaging TEXT NOT NULL,
    prepared_at TIMESTAMPTZ NOT NULL,
    safe_until TIMESTAMPTZ NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address TEXT NOT NULL,
    status donation_status_enum DEFAULT 'OPEN',
    urgency urgency_level_enum DEFAULT 'NORMAL',
    image_url TEXT,
    notes TEXT,
    pickup_code_hash TEXT NOT NULL,
    delivery_code_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donations_location ON public.donations USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);

-- 6. Pickups & Deliveries
CREATE TABLE IF NOT EXISTS public.pickups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
    recipient_org_id UUID REFERENCES public.organizations(id),
    volunteer_id UUID REFERENCES public.volunteer_profiles(id),
    mode TEXT CHECK (mode IN ('self', 'volunteer')),
    servings_delivered INT,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    status TEXT DEFAULT 'assigned',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Append-Only Status History (PRD Section 8.2)
CREATE TABLE IF NOT EXISTS public.donation_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
    from_status donation_status_enum NOT NULL,
    to_status donation_status_enum NOT NULL,
    actor TEXT NOT NULL,
    reason_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Spatial Function: Find nearby verified NGOs for a donation
CREATE OR REPLACE FUNCTION get_nearby_recipient_ngos(
    p_lat DOUBLE PRECISION,
    p_lng DOUBLE PRECISION,
    p_radius_meters DOUBLE PRECISION DEFAULT 6000
)
RETURNS TABLE (
    org_id UUID,
    org_name TEXT,
    distance_meters DOUBLE PRECISION,
    capacity_servings INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.name,
        ST_Distance(o.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography) AS distance_meters,
        o.capacity_servings
    FROM public.organizations o
    WHERE o.type IN ('ngo', 'shelter')
      AND o.verified = TRUE
      AND ST_DWithin(o.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography, p_radius_meters)
    ORDER BY distance_meters ASC;
END;
$$ LANGUAGE plpgsql;

-- 9. Row Level Security Policies (RLS)
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for active donations"
    ON public.donations FOR SELECT
    USING (status IN ('OPEN', 'ACCEPTED', 'PICKUP_PENDING', 'IN_TRANSIT', 'DELIVERED'));

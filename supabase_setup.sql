-- ==========================================
-- EUROVENTURE SUPABASE SCHEMABUILDER SCRIPT
-- Copy and paste this directly in your Supabase SQL Editor
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Countries Table (uses ISO 2-letter code as primary key for map integrations)
create table if not exists public.countries (
    code varchar(2) primary key, -- e.g., 'FR', 'IT', 'CH'
    name text not null,
    status text not null check (status in ('visited', 'current', 'planned', 'not_visited')),
    favorite_memory text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Trips Table
create table if not exists public.trips (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    start_date date not null,
    end_date date,
    description text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Cities Table
create table if not exists public.cities (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    country_code varchar(2) not null references public.countries(code) on delete cascade,
    latitude double precision not null,
    longitude double precision not null,
    visited_date date,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Journal Entries Table
create table if not exists public.journal_entries (
    id uuid default gen_random_uuid() primary key,
    trip_id uuid references public.trips(id) on delete cascade,
    city_id uuid references public.cities(id) on delete set null,
    title text not null,
    content text not null,
    date date not null,
    is_favorite boolean default false not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Expenses Table
create table if not exists public.expenses (
    id uuid default gen_random_uuid() primary key,
    trip_id uuid references public.trips(id) on delete cascade,
    city_id uuid references public.cities(id) on delete set null,
    amount numeric(10, 2) not null,
    currency varchar(3) default 'EUR' not null,
    category text not null check (category in ('accommodation', 'food', 'transport', 'activities', 'other')),
    description text,
    date date not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Transport Table
create table if not exists public.transport (
    id uuid default gen_random_uuid() primary key,
    trip_id uuid references public.trips(id) on delete cascade,
    type text not null check (type in ('flight', 'train', 'bus', 'car', 'walking', 'other')),
    departure_city_id uuid references public.cities(id) on delete set null,
    arrival_city_id uuid references public.cities(id) on delete set null,
    distance_km numeric(10, 2) not null,
    date date not null,
    cost numeric(10, 2),
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Photos Table
create table if not exists public.photos (
    id uuid default gen_random_uuid() primary key,
    trip_id uuid references public.trips(id) on delete cascade,
    city_id uuid references public.cities(id) on delete set null,
    country_code varchar(2) references public.countries(code) on delete set null,
    url text not null,
    caption text,
    storage_path text,
    taken_at date not null,
    is_favorite boolean default false not null,
    category text check (category in ('food', 'architecture', 'nature', 'other')),
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Locations Table (Interests / Sights)
create table if not exists public.locations (
    id uuid default gen_random_uuid() primary key,
    trip_id uuid references public.trips(id) on delete cascade,
    city_id uuid references public.cities(id) on delete set null,
    latitude double precision not null,
    longitude double precision not null,
    name text not null,
    description text,
    category text check (category in ('restaurant', 'accommodation', 'sight', 'other')),
    is_favorite boolean default false not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Favorite Places Table
create table if not exists public.favorite_places (
    id uuid default gen_random_uuid() primary key,
    city_id uuid references public.cities(id) on delete cascade,
    name text not null,
    latitude double precision not null,
    longitude double precision not null,
    description text,
    category text check (category in ('restaurant', 'accommodation', 'sight', 'other')),
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Statistics Table
create table if not exists public.statistics (
    id uuid default gen_random_uuid() primary key,
    key text unique not null,
    value numeric(12, 2) not null,
    label text not null,
    category text default 'general' not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ==========================================
-- ROW LEVEL SECURITY CONFIGURATION
-- ==========================================

-- Enable RLS for all tables
alter table public.countries enable row level security;
alter table public.trips enable row level security;
alter table public.cities enable row level security;
alter table public.journal_entries enable row level security;
alter table public.expenses enable row level security;
alter table public.transport enable row level security;
alter table public.photos enable row level security;
alter table public.locations enable row level security;
alter table public.favorite_places enable row level security;
alter table public.statistics enable row level security;

-- Drop existing policies if any to avoid clash
drop policy if exists "Allow public read-only access on countries" on public.countries;
drop policy if exists "Allow public read-only access on trips" on public.trips;
drop policy if exists "Allow public read-only access on cities" on public.cities;
drop policy if exists "Allow public read-only access on journal_entries" on public.journal_entries;
drop policy if exists "Allow public read-only access on expenses" on public.expenses;
drop policy if exists "Allow public read-only access on transport" on public.transport;
drop policy if exists "Allow public read-only access on photos" on public.photos;
drop policy if exists "Allow public read-only access on locations" on public.locations;
drop policy if exists "Allow public read-only access on favorite_places" on public.favorite_places;
drop policy if exists "Allow public read-only access on statistics" on public.statistics;

drop policy if exists "Allow admin write access on countries" on public.countries;
drop policy if exists "Allow admin write access on trips" on public.trips;
drop policy if exists "Allow admin write access on cities" on public.cities;
drop policy if exists "Allow admin write access on journal_entries" on public.journal_entries;
drop policy if exists "Allow admin write access on expenses" on public.expenses;
drop policy if exists "Allow admin write access on transport" on public.transport;
drop policy if exists "Allow admin write access on photos" on public.photos;
drop policy if exists "Allow admin write access on locations" on public.locations;
drop policy if exists "Allow admin write access on favorite_places" on public.favorite_places;
drop policy if exists "Allow admin write access on statistics" on public.statistics;

-- Policies: Anonymous read-only access for all tables
create policy "Allow public read-only access on countries" on public.countries for select using (true);
create policy "Allow public read-only access on trips" on public.trips for select using (true);
create policy "Allow public read-only access on cities" on public.cities for select using (true);
create policy "Allow public read-only access on journal_entries" on public.journal_entries for select using (true);
create policy "Allow public read-only access on expenses" on public.expenses for select using (true);
create policy "Allow public read-only access on transport" on public.transport for select using (true);
create policy "Allow public read-only access on photos" on public.photos for select using (true);
create policy "Allow public read-only access on locations" on public.locations for select using (true);
create policy "Allow public read-only access on favorite_places" on public.favorite_places for select using (true);
create policy "Allow public read-only access on statistics" on public.statistics for select using (true);

-- Policies: Authenticated Admin write access for all tables (create, update, delete)
create policy "Allow admin write access on countries" on public.countries for all using (auth.role() = 'authenticated');
create policy "Allow admin write access on trips" on public.trips for all using (auth.role() = 'authenticated');
create policy "Allow admin write access on cities" on public.cities for all using (auth.role() = 'authenticated');
create policy "Allow admin write access on journal_entries" on public.journal_entries for all using (auth.role() = 'authenticated');
create policy "Allow admin write access on expenses" on public.expenses for all using (auth.role() = 'authenticated');
create policy "Allow admin write access on transport" on public.transport for all using (auth.role() = 'authenticated');
create policy "Allow admin write access on photos" on public.photos for all using (auth.role() = 'authenticated');
create policy "Allow admin write access on locations" on public.locations for all using (auth.role() = 'authenticated');
create policy "Allow admin write access on favorite_places" on public.favorite_places for all using (auth.role() = 'authenticated');
create policy "Allow admin write access on statistics" on public.statistics for all using (auth.role() = 'authenticated');

-- ==========================================
-- INDEXES FOR READ PERFORMANCE
-- ==========================================
create index if not exists idx_cities_country_code on public.cities(country_code);
create index if not exists idx_journal_trip_id on public.journal_entries(trip_id);
create index if not exists idx_journal_city_id on public.journal_entries(city_id);
create index if not exists idx_expenses_trip_id on public.expenses(trip_id);
create index if not exists idx_transport_trip_id on public.transport(trip_id);
create index if not exists idx_photos_country_code on public.photos(country_code);
create index if not exists idx_photos_trip_id on public.photos(trip_id);
create index if not exists idx_locations_trip_id on public.locations(trip_id);

-- ==========================================
-- STORAGE BUCKETS SETUP
-- ==========================================
-- Note: Go to Supabase Storage in your dashboard:
-- 1. Create a public bucket named 'photos'.
-- 2. Add a Storage Policy allowing authenticated users to upload and manage files.

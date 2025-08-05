-- Updated SideGames Golf Database Schema
-- Tours and Locations are persistent, only Events have specific dates

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    about TEXT,
    image_url TEXT,
    first_name TEXT,
    last_name TEXT,
    address TEXT,
    apartment TEXT,
    country TEXT,
    region TEXT,
    postal_code TEXT,
    phone TEXT,
    tour_league TEXT,
    location TEXT,
    profile_picture_url TEXT,
    show_email BOOLEAN DEFAULT false,
    show_first_name BOOLEAN DEFAULT false,
    show_last_name BOOLEAN DEFAULT false,
    show_phone BOOLEAN DEFAULT false,
    make_private BOOLEAN DEFAULT false,
    enable_notifications BOOLEAN DEFAULT true,
    allow_sms BOOLEAN DEFAULT false,
    allow_email BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tours table (persistent, no year)
CREATE TABLE IF NOT EXISTS public.tours (
    tour_id SERIAL PRIMARY KEY,
    label TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table (persistent, no tour_id)
CREATE TABLE IF NOT EXISTS public.locations (
    location_id SERIAL PRIMARY KEY,
    label TEXT NOT NULL UNIQUE,
    state TEXT,
    country TEXT DEFAULT 'USA',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table (has specific date, links to tour and location)
CREATE TABLE IF NOT EXISTS public.events (
    event_id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES public.tours(tour_id) ON DELETE CASCADE,
    location_id INTEGER REFERENCES public.locations(location_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    course TEXT NOT NULL,
    course_address TEXT,
    event_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create side_games table
CREATE TABLE IF NOT EXISTS public.side_games (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    key TEXT UNIQUE NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES public.events(event_id) ON DELETE CASCADE,
    side_games_data JSONB NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'completed'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_events_tour_id ON public.events(tour_id);
CREATE INDEX IF NOT EXISTS idx_events_location_id ON public.events(location_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_event_id ON public.purchases(event_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.side_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Tours: Public read access
CREATE POLICY "Anyone can view tours" ON public.tours
    FOR SELECT USING (true);

-- Locations: Public read access
CREATE POLICY "Anyone can view locations" ON public.locations
    FOR SELECT USING (true);

-- Events: Public read access
CREATE POLICY "Anyone can view events" ON public.events
    FOR SELECT USING (true);

-- Side games: Public read access
CREATE POLICY "Anyone can view side games" ON public.side_games
    FOR SELECT USING (true);

-- Purchases: Users can view their own purchases
CREATE POLICY "Users can view own purchases" ON public.purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases" ON public.purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample data

-- Sample tours (persistent)
INSERT INTO public.tours (label, description) VALUES
    ('PGA Tour', 'Professional Golfers Association Tour'),
    ('LPGA Tour', 'Ladies Professional Golf Association Tour'),
    ('Champions Tour', 'PGA Tour Champions for players 50+')
ON CONFLICT (label) DO NOTHING;

-- Sample locations (persistent)
INSERT INTO public.locations (label, state, country) VALUES
    ('Florida', 'FL', 'USA'),
    ('California', 'CA', 'USA'),
    ('Texas', 'TX', 'USA'),
    ('Arizona', 'AZ', 'USA'),
    ('Hawaii', 'HI', 'USA')
ON CONFLICT (label) DO NOTHING;

-- Sample side games
INSERT INTO public.side_games (name, key, value, description) VALUES
    ('Net', 'Net', 25.00, 'Net score competition'),
    ('Division A', 'Division A', 30.00, 'Division A competition'),
    ('Division B', 'Division B', 30.00, 'Division B competition'),
    ('Super Skins', 'Super Skins', 50.00, 'Super skins game')
ON CONFLICT (key) DO NOTHING;

-- Sample events (with specific dates)
INSERT INTO public.events (tour_id, location_id, name, course, course_address, event_date) VALUES
    ((SELECT tour_id FROM public.tours WHERE label = 'PGA Tour'), 
     (SELECT location_id FROM public.locations WHERE label = 'Florida'), 
     'The Players Championship', 'TPC Sawgrass', '110 Championship Way, Ponte Vedra Beach, FL', '2024-03-14'),
    ((SELECT tour_id FROM public.tours WHERE label = 'PGA Tour'), 
     (SELECT location_id FROM public.locations WHERE label = 'California'), 
     'Genesis Invitational', 'Riviera Country Club', '1250 Capri Dr, Pacific Palisades, CA', '2024-02-15'),
    ((SELECT tour_id FROM public.tours WHERE label = 'LPGA Tour'), 
     (SELECT location_id FROM public.locations WHERE label = 'Hawaii'), 
     'Hilton Grand Vacations Tournament of Champions', 'Lake Nona Golf & Country Club', '9800 Lake Nona Blvd, Orlando, FL', '2024-01-18')
ON CONFLICT DO NOTHING;

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'displayName');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 
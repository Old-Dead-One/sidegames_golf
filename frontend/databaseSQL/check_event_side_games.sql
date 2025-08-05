-- Check if event_side_games table exists and create it if it doesn't
-- Run this in Supabase SQL Editor

-- First, check if the table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'event_side_games'
) as table_exists;

-- If the table doesn't exist, create it
CREATE TABLE IF NOT EXISTS public.event_side_games (
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    open_net BOOLEAN DEFAULT false,
    open_net_fee DECIMAL(10,2),
    sr_net BOOLEAN DEFAULT false,
    sr_net_fee DECIMAL(10,2),
    super_skins BOOLEAN DEFAULT false,
    super_skins_fee DECIMAL(10,2),
    d1_skins BOOLEAN DEFAULT false,
    d1_skins_fee DECIMAL(10,2),
    d2_skins BOOLEAN DEFAULT false,
    d2_skins_fee DECIMAL(10,2),
    d3_skins BOOLEAN DEFAULT false,
    d3_skins_fee DECIMAL(10,2),
    d4_skins BOOLEAN DEFAULT false,
    d4_skins_fee DECIMAL(10,2),
    d5_skins BOOLEAN DEFAULT false,
    d5_skins_fee DECIMAL(10,2),
    ctp BOOLEAN DEFAULT false,
    ctp_fee DECIMAL(10,2),
    long_drive BOOLEAN DEFAULT false,
    long_drive_fee DECIMAL(10,2),
    best_drive BOOLEAN DEFAULT false,
    best_drive_fee DECIMAL(10,2),
    nassau BOOLEAN DEFAULT false,
    nassau_fee DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (event_id)
);

-- Check the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'event_side_games'
ORDER BY ordinal_position;

-- Check if there's any data in the table
SELECT COUNT(*) as row_count FROM public.event_side_games;

-- Show a sample of the data if it exists
SELECT * FROM public.event_side_games LIMIT 5; 
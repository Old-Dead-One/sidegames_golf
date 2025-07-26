-- Get complete schema for all tables
-- Run this in Supabase SQL Editor to see all table structures

-- Profiles table (main user data)
SELECT 
    'profiles' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Tours table
SELECT 
    'tours' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'tours'
ORDER BY ordinal_position;

-- Locations table
SELECT 
    'locations' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'locations'
ORDER BY ordinal_position;

-- Events table
SELECT 
    'events' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'events'
ORDER BY ordinal_position;

-- Side games table
SELECT 
    'side_games' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'side_games'
ORDER BY ordinal_position;

-- Purchases table
SELECT 
    'purchases' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'purchases'
ORDER BY ordinal_position;

-- User tours table
SELECT 
    'user_tours' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'user_tours'
ORDER BY ordinal_position;

-- Tour locations table
SELECT 
    'tour_locations' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'tour_locations'
ORDER BY ordinal_position;

-- Get all table names for reference
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name; 
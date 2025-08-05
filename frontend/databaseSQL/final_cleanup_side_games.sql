-- Final cleanup of the side_games table
-- Run this in Supabase SQL Editor

-- First, let's see exactly what we have
SELECT id, name, key, value, description FROM public.side_games ORDER BY name, key;

-- Delete ALL entries and start fresh
DELETE FROM public.side_games;

-- Insert the correct side games with clean keys
INSERT INTO public.side_games (name, key, value, description) VALUES
    ('Open Net', 'Open Net', 40.00, 'Open Net competition'),
    ('Senior Net', 'Sr Net', 40.00, 'Senior Net competition'),
    ('Super Skins', 'Super Skins', 20.00, 'Super Skins game'),
    ('Division 1', 'D1 Skins', 20.00, 'Division 1 Skins game'),
    ('Division 2', 'D2 Skins', 20.00, 'Division 2 Skins game'),
    ('Division 3', 'D3 Skins', 20.00, 'Division 3 Skins game'),
    ('Division 4', 'D4 Skins', 20.00, 'Division 4 Skins game'),
    ('Division 5', 'D5 Skins', 20.00, 'Division 5 Skins game'),
    ('Closest to the Pin', 'Closest to the Pin', 10.00, 'Closest to the Pin competition'),
    ('Long Drive', 'Long Drive', 10.00, 'Long Drive competition'),
    ('Best Drive', 'Best Drive', 10.00, 'Best Drive competition'),
    ('Nassau', 'Nassau', 15.00, 'Nassau game');

-- Show the final result
SELECT id, name, key, value, description FROM public.side_games ORDER BY name;

-- Verify D5 Skins is present
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ D5 Skins found with correct key and value'
        ELSE '❌ D5 Skins missing'
    END as d5_skins_status,
    COUNT(*) as count
FROM public.side_games 
WHERE key = 'D5 Skins' AND value = 20.00; 
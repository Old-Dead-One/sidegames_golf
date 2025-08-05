-- Clean up the side_games table by removing duplicates and ensuring correct keys
-- Run this in Supabase SQL Editor

-- First, let's see the current state
SELECT * FROM public.side_games ORDER BY name, key;

-- Remove the duplicate entries with numbered prefixes, keeping only the clean keys
DELETE FROM public.side_games 
WHERE key IN (
    '01_Sr Net',
    '02_Open Net', 
    '03_Super Skins',
    '04_D1 Skins',
    '05_D2 Skins',
    '06_D3 Skins',
    '07_D4 Skins',
    '08_D5 Skins',
    '09_CTP',
    '10_Long Drive',
    '11_Best Drive',
    '12_Nassau'
);

-- Show the cleaned up table
SELECT * FROM public.side_games ORDER BY name, key;

-- Verify we have all the required side games with correct keys
SELECT 
    CASE 
        WHEN key = 'D5 Skins' THEN '✅ D5 Skins found'
        ELSE '❌ D5 Skins missing'
    END as d5_skins_check,
    CASE 
        WHEN key = 'Open Net' THEN '✅ Open Net found'
        ELSE '❌ Open Net missing'
    END as open_net_check,
    CASE 
        WHEN key = 'Super Skins' THEN '✅ Super Skins found'
        ELSE '❌ Super Skins missing'
    END as super_skins_check
FROM public.side_games 
WHERE key IN ('D5 Skins', 'Open Net', 'Super Skins'); 
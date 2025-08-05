-- Tour-Location Relationship Setup Guide
-- =====================================================
-- 
-- CURRENT DATABASE STRUCTURE:
-- 
-- 1. tours table: Contains tour definitions (PGA Tour, LPGA Tour, etc.)
-- 2. locations table: Contains location definitions (Atlanta, Chicago, etc.)
-- 3. events table: Links tours + locations + specific event details
-- 
-- RELATIONSHIP FLOW:
-- Tour → Event → Location
-- 
-- This means:
-- - A tour can have multiple events
-- - An event belongs to one tour and one location
-- - A location can be used by multiple events across different tours
-- =====================================================

-- STEP 1: Check Current Data
-- =====================================================

-- Check what tours exist
SELECT 'TOURS' as table_name, tour_id, label, description FROM public.tours ORDER BY tour_id;

-- Check what locations exist  
SELECT 'LOCATIONS' as table_name, location_id, label, state, country FROM public.locations ORDER BY location_id;

-- Check what events exist (if any)
SELECT 'EVENTS' as table_name, event_id, tour_id, location_id, name, event_date FROM public.events ORDER BY event_id;

-- =====================================================
-- STEP 2: Insert Sample Tours (if needed)
-- =====================================================

-- Insert the Amateur Players Tour if it doesn't exist
INSERT INTO public.tours (label, description) VALUES
    ('Amateur Players Tour 2025', 'Amateur golf tour for 2025 season')
ON CONFLICT (label) DO NOTHING;

-- Insert other common tours
INSERT INTO public.tours (label, description) VALUES
    ('PGA Tour', 'Professional Golfers Association Tour'),
    ('LPGA Tour', 'Ladies Professional Golf Association Tour'),
    ('Champions Tour', 'PGA Tour Champions for players 50+'),
    ('Korn Ferry Tour', 'PGA Tour developmental series')
ON CONFLICT (label) DO NOTHING;

-- =====================================================
-- STEP 3: Verify Locations from insert_locations.sql
-- =====================================================

-- The locations should already be in the database from insert_locations.sql
-- Let's verify they're there:
SELECT COUNT(*) as total_locations FROM public.locations;

-- Show a sample of locations
SELECT location_id, label, state, country FROM public.locations ORDER BY label LIMIT 10;

-- =====================================================
-- STEP 4: Create Sample Events (Tour-Location Relationships)
-- =====================================================

-- Example: Create some sample events linking tours and locations
-- This shows how tours and locations are connected through events

-- Get tour IDs for reference
SELECT tour_id, label FROM public.tours WHERE label LIKE '%Amateur%';

-- Get location IDs for reference  
SELECT location_id, label FROM public.locations WHERE label IN ('Atlanta', 'Chicago', 'Dallas/Fort Worth', 'Houston') ORDER BY label;

-- Create sample events (uncomment and modify as needed)
/*
INSERT INTO public.events (tour_id, location_id, name, course, event_date) VALUES
    (1, 3, 'Atlanta Spring Classic', 'Atlanta Golf Club', '2025-03-15'),
    (1, 12, 'Chicago Championship', 'Chicago Golf Links', '2025-04-20'),
    (1, 15, 'Dallas Open', 'Dallas Country Club', '2025-05-10'),
    (1, 17, 'Houston Masters', 'Houston Golf Course', '2025-06-05');
*/

-- =====================================================
-- STEP 5: Query Examples for Tour-Location Relationships
-- =====================================================

-- Show all events with tour and location details
SELECT 
    e.event_id,
    t.label as tour_name,
    l.label as location_name,
    e.name as event_name,
    e.course,
    e.event_date
FROM public.events e
JOIN public.tours t ON e.tour_id = t.tour_id
JOIN public.locations l ON e.location_id = l.location_id
ORDER BY e.event_date;

-- Show which locations are available for each tour
SELECT 
    t.label as tour_name,
    COUNT(DISTINCT e.location_id) as locations_used,
    STRING_AGG(DISTINCT l.label, ', ') as location_list
FROM public.tours t
LEFT JOIN public.events e ON t.tour_id = e.tour_id
LEFT JOIN public.locations l ON e.location_id = l.location_id
GROUP BY t.tour_id, t.label
ORDER BY t.label;

-- Show all available locations for a specific tour
SELECT 
    l.location_id,
    l.label as location_name,
    l.state,
    CASE 
        WHEN e.event_id IS NOT NULL THEN 'Used in events'
        ELSE 'Available for new events'
    END as status
FROM public.locations l
LEFT JOIN public.events e ON l.location_id = e.location_id 
    AND e.tour_id = 1  -- Replace with your tour_id
ORDER BY l.label;

-- =====================================================
-- STEP 6: How to Add New Tour-Location Relationships
-- =====================================================

-- To create a new event (which links a tour and location):

/*
INSERT INTO public.events (tour_id, location_id, name, course, event_date) VALUES
    (tour_id_here, location_id_here, 'Event Name', 'Course Name', 'YYYY-MM-DD');
*/

-- Example:
/*
INSERT INTO public.events (tour_id, location_id, name, course, event_date) VALUES
    (1, 5, 'Birmingham Classic', 'Birmingham Golf Club', '2025-07-15');
*/

-- =====================================================
-- SUMMARY
-- =====================================================

-- ✅ Tours and Locations are independent tables
-- ✅ Events create the relationship between tours and locations
-- ✅ One tour can have events in multiple locations
-- ✅ One location can host events for multiple tours
-- ✅ To add a tour-location relationship, create an event

-- The key insight: You don't directly link tours to locations.
-- Instead, you create events that reference both a tour and a location. 
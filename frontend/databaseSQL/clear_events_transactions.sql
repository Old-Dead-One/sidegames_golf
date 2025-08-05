-- Clear Events and Transactions Script
-- This script safely removes all events and purchase transactions
-- while preserving core data (tours, locations, side games, profiles)

-- =====================================================
-- STEP 1: Clear Purchase Transactions (Dependent on Events)
-- =====================================================

-- First, clear all purchase transactions
-- This is safe because purchases reference events via foreign key
DELETE FROM public.purchases;

-- Verify purchases are cleared
SELECT COUNT(*) as remaining_purchases FROM public.purchases;

-- =====================================================
-- STEP 2: Clear Events (Independent table)
-- =====================================================

-- Clear all events
DELETE FROM public.events;

-- Verify events are cleared
SELECT COUNT(*) as remaining_events FROM public.events;

-- =====================================================
-- STEP 3: Clear Admin Privileges (if they exist)
-- =====================================================

-- Clear admin privileges (these are tied to events/tours)
-- Note: This will only work if the admin_privileges table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_privileges') THEN
        DELETE FROM public.admin_privileges;
        RAISE NOTICE 'Admin privileges table cleared';
    ELSE
        RAISE NOTICE 'Admin privileges table does not exist - skipping';
    END IF;
END $$;

-- =====================================================
-- STEP 4: Verification Queries
-- =====================================================

-- Show what remains in the database
SELECT 'Profiles' as table_name, COUNT(*) as record_count FROM public.profiles
UNION ALL
SELECT 'Tours' as table_name, COUNT(*) as record_count FROM public.tours
UNION ALL
SELECT 'Locations' as table_name, COUNT(*) as record_count FROM public.locations
UNION ALL
SELECT 'Side Games' as table_name, COUNT(*) as record_count FROM public.side_games
UNION ALL
SELECT 'Events' as table_name, COUNT(*) as record_count FROM public.events
UNION ALL
SELECT 'Purchases' as table_name, COUNT(*) as record_count FROM public.purchases;

-- =====================================================
-- OPTIONAL: Reset Auto-increment Sequences
-- =====================================================

-- Reset the auto-increment sequences for clean IDs
-- Uncomment these lines if you want to reset the ID sequences

-- ALTER SEQUENCE public.events_event_id_seq RESTART WITH 1;
-- ALTER SEQUENCE public.purchases_id_seq RESTART WITH 1;

-- =====================================================
-- SUMMARY
-- =====================================================

-- This script has cleared:
-- ✅ All purchase transactions
-- ✅ All events
-- ✅ All admin privileges (if table exists)
--
-- Preserved:
-- ✅ User profiles
-- ✅ Tours
-- ✅ Locations  
-- ✅ Side games
-- ✅ Database structure and relationships

-- The database is now clean and ready for fresh events and transactions! 
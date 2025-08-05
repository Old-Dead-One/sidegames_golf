-- Remove year column from locations table
-- Since locations are geographic areas and don't need years

-- First, let's check if there are any dependencies or constraints
-- Then safely remove the year column

-- Remove the year column from locations table
ALTER TABLE public.locations DROP COLUMN IF EXISTS year;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'locations' 
AND table_schema = 'public'
ORDER BY ordinal_position; 
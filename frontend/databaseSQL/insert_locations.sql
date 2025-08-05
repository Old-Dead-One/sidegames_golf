-- Insert Locations from locations.json
-- This script inserts all locations for the Amateur Players Tour into the locations table

-- First, let's clear any existing locations to avoid duplicates
-- (Uncomment the line below if you want to clear existing data)
-- DELETE FROM public.locations;

-- Insert all locations from the Amateur Players Tour
INSERT INTO public.locations (name, created_at, updated_at) VALUES
('Amateur Players Tour', NOW(), NOW()),
('Arkansas', NOW(), NOW()),
('Atlanta', NOW(), NOW()),
('Augusta', NOW(), NOW()),
('Birmingham', NOW(), NOW()),
('Carolina East', NOW(), NOW()),
('Carolina Triad', NOW(), NOW()),
('Central Illinois', NOW(), NOW()),
('Central Pennsylvania', NOW(), NOW()),
('Charleston', NOW(), NOW()),
('Charlotte', NOW(), NOW()),
('Chicago', NOW(), NOW()),
('Cincinnati/Dayton', NOW(), NOW()),
('Columbus', NOW(), NOW()),
('Dallas/Fort Worth', NOW(), NOW()),
('Denver', NOW(), NOW()),
('Florida Gulf Coast', NOW(), NOW()),
('Georgia Central', NOW(), NOW()),
('Houston', NOW(), NOW()),
('Indianapolis', NOW(), NOW()),
('Iowa Tri-State', NOW(), NOW()),
('Kansas City', NOW(), NOW()),
('Kentucky', NOW(), NOW()),
('Las Vegas', NOW(), NOW()),
('Maryland', NOW(), NOW()),
('Memphis', NOW(), NOW()),
('Minneapolis', NOW(), NOW()),
('Myrtle Beach', NOW(), NOW()),
('Nashville', NOW(), NOW()),
('New England', NOW(), NOW()),
('New Jersey-Philadelphia', NOW(), NOW()),
('New York Metro', NOW(), NOW()),
('Northern California', NOW(), NOW()),
('Oklahoma City', NOW(), NOW()),
('Ontario', NOW(), NOW()),
('Phoenix', NOW(), NOW()),
('Portland', NOW(), NOW()),
('Seattle', NOW(), NOW()),
('Southern California', NOW(), NOW()),
('Southwest Florida', NOW(), NOW()),
('St. Louis, MO', NOW(), NOW()),
('Tennessee East', NOW(), NOW()),
('Tulsa', NOW(), NOW()),
('Upstate South Carolina', NOW(), NOW()),
('Utah', NOW(), NOW()),
('Virginia Capital', NOW(), NOW()),

-- Verify the insertions
SELECT COUNT(*) as total_locations_inserted FROM public.locations;

-- Show all inserted locations
SELECT id, name, created_at FROM public.locations ORDER BY name; 
-- Fix cart table structure for SideGames Golf
-- Run this in Supabase SQL Editor

-- Add missing timestamp columns if they don't exist
ALTER TABLE public.cart 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing rows to have timestamps
UPDATE public.cart 
SET created_at = NOW(), updated_at = NOW() 
WHERE created_at IS NULL OR updated_at IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'cart'
ORDER BY ordinal_position; 
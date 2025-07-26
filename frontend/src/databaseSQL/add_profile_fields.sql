-- Add missing profile fields for profile picture and visibility settings
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS show_email BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_first_name BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_last_name BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_phone BOOLEAN DEFAULT false;

-- Create storage bucket for avatars if it doesn't exist
-- Note: This needs to be run in Supabase dashboard or via Supabase CLI
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage policy for avatars
-- Note: This needs to be run in Supabase dashboard or via Supabase CLI
-- CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
--     FOR SELECT USING (bucket_id = 'avatars');

-- CREATE POLICY "Users can upload their own avatar" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can update their own avatar" ON storage.objects
--     FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete their own avatar" ON storage.objects
--     FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]); 
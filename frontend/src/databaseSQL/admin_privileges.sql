-- Admin Privileges Table
-- This table tracks which users have admin privileges for specific tours

CREATE TABLE IF NOT EXISTS public.admin_privileges (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tour_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_privileges_user_id ON public.admin_privileges(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_privileges_tour_id ON public.admin_privileges(tour_id);

-- Enable Row Level Security
ALTER TABLE public.admin_privileges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own admin privileges
CREATE POLICY "Users can view their own admin privileges" ON public.admin_privileges
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own admin privileges (for demo purposes)
CREATE POLICY "Users can insert their own admin privileges" ON public.admin_privileges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own admin privileges
CREATE POLICY "Users can update their own admin privileges" ON public.admin_privileges
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own admin privileges
CREATE POLICY "Users can delete their own admin privileges" ON public.admin_privileges
    FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.admin_privileges TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.admin_privileges_id_seq TO authenticated; 
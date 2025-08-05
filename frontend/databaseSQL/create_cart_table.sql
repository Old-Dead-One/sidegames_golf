-- Create cart table for SideGames Golf
-- Run this in Supabase SQL Editor

-- Create cart table
CREATE TABLE IF NOT EXISTS public.cart (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    cartItems JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cart
CREATE POLICY "Users can view own cart" ON public.cart
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own cart" ON public.cart
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own cart" ON public.cart
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.cart(id); 
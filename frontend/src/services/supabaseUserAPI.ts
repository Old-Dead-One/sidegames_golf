import { supabase } from './supabaseClient';
import { User } from '../types';

export const createUserProfile = async (profileData: User) => {
    const { data, error } = await supabase
        .from('profiles')
        .insert([profileData]);
    if (error) throw error;
    return data;
};

export const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data;
};

export const updateUserProfile = async (userId: string, profileData: Partial<User>) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);
    if (error) throw error;
    return data;
};

export const deleteUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
    if (error) throw error;
    return data;
};

// Upload a profile picture to Supabase Storage and return the public URL
export const uploadProfilePicture = async (userId: string, file: File) => {
    try {
        const fileExt = file.name.split('.').pop();
        const filePath = `avatars/${userId}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error(`Failed to upload file: ${uploadError.message}`);
        }

        // Get public URL
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (error) {
        console.error('Profile picture upload error:', error);
        throw error;
    }
};

// Get all tours for a user
export const getUserTours = async (userId: string) => {
    const { data, error } = await supabase
        .from('user_tours')
        .select('tour_id')
        .eq('user_id', userId);
    if (error) throw error;
    return data ? data.map((row: { tour_id: string }) => row.tour_id) : [];
};

// Add a tour for a user
export const addUserTour = async (userId: string, tourId: string) => {
    const { error } = await supabase
        .from('user_tours')
        .insert([{ user_id: userId, tour_id: tourId }]);
    if (error) throw error;
};

// Remove a tour for a user
export const removeUserTour = async (userId: string, tourId: string) => {
    const { error } = await supabase
        .from('user_tours')
        .delete()
        .eq('user_id', userId)
        .eq('tour_id', tourId);
    if (error) throw error;
};
import { supabase } from './supabaseClient';
import { User } from '../components/Types';

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
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('../config/environment', () => ({
    config: {
        supabase: {
            url: 'https://test.supabase.co',
            anonKey: 'test-key',
        },
        app: {
            name: 'Test App',
            version: '1.0.0',
            environment: 'test',
        },
        features: {
            analytics: false,
            debugMode: false,
        },
        validate: vi.fn(),
    },
}));

// Mock Supabase
vi.mock('../services/supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            signUp: vi.fn(),
            signInWithPassword: vi.fn(),
            signOut: vi.fn(),
            updateUser: vi.fn(),
        },
        from: vi.fn(() => ({
            select: vi.fn(),
            insert: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            eq: vi.fn(),
        })),
    },
    handleSupabaseError: vi.fn(),
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
    },
    ToastContainer: vi.fn(() => null),
})); 
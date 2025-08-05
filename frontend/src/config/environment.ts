export const config = {
    // Supabase Configuration
    supabase: {
        url: import.meta.env.VITE_SUPABASE_URL,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },

    // App Configuration
    app: {
        name: import.meta.env.VITE_APP_NAME || 'SideGames Golf',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        environment: import.meta.env.MODE || 'development',
    },

    // Feature Flags
    features: {
        analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
    },

    // Validation
    validate: () => {
        if (!config.supabase.url || !config.supabase.anonKey) {
            console.warn('Missing required Supabase environment variables - app may not function properly');
            // Don't throw error for demo purposes
        }
    },
};

// Validate configuration on import
config.validate(); 
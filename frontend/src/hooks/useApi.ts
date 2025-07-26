import { useState, useCallback } from 'react';
import { ApiResponse } from '../types';
import { handleSupabaseError } from '../services/supabaseClient';

export function useApi<T>() {
    const [state, setState] = useState<ApiResponse<T>>({
        data: null,
        error: null,
        loading: false,
    });

    const execute = useCallback(async (apiCall: () => Promise<T>) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const data = await apiCall();
            setState({ data, error: null, loading: false });
            return data;
        } catch (error) {
            const errorMessage = handleSupabaseError(error, 'API Error');
            setState({ data: null, error: errorMessage, loading: false });
            throw error;
        }
    }, []);

    const reset = useCallback(() => {
        setState({ data: null, error: null, loading: false });
    }, []);

    return {
        ...state,
        execute,
        reset,
    };
} 
// lib/fetchWithAuth.js
import store from '@/store'; // Adjust path to your store

export async function fetchWithAuth(url, options = {}) {
    const state = store.getState();
    const accessToken = state.auth.accessToken;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Always include cookies
    });

    // If token expired, try to refresh
    if (response.status === 401) {
        try {
            const refreshResponse = await fetch(
                'https://diplomatic-mindfulness-production-621b.up.railway.app/auth/refresh',
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                store.dispatch(setAccessToken(data.access_token));
                
                // Retry original request with new token
                return fetchWithAuth(url, options);
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }
    }

    return response;
}
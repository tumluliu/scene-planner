// API Configuration
interface ApiConfig {
    baseUrl: string;
}

// Default configuration
const defaultConfig: ApiConfig = {
    baseUrl: `http://localhost:3001`
};

// Get configuration from environment variables (for Vite)
const getConfig = (): ApiConfig => {
    // Try to get from environment variables first
    const envBaseUrl = import.meta.env.VITE_API_BASE_URL;

    if (envBaseUrl) {
        return {
            baseUrl: envBaseUrl
        };
    }

    // Fallback: try to construct from current location (development mode)
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        // Default to localhost for development, but allow override
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return {
                baseUrl: `http://${hostname}:3001`
            };
        }
        // For other hostnames, assume same host different port
        return {
            baseUrl: `http://${hostname}:3001`
        };
    }

    // Final fallback
    return defaultConfig;
};

export const config = getConfig();

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${config.baseUrl}${cleanEndpoint}`;
}; 
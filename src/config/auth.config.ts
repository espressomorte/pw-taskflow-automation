/**
 * Authentication configuration
 * Centralized constants for auth-related settings
 */
export const AUTH_CONFIG = {
    STORAGE_STATE_PATH: 'auth.json',
    LOGIN_TIMEOUT: 15000,
    SUCCESS_URL_PATTERN: '**/boards*',
} as const;

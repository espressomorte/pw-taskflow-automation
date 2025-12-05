import * as fs from 'fs';
import { AUTH_CONFIG } from '../config/auth.config';

interface Cookie {
    name: string;
    value: string;
    expires: number;
    domain: string;
}

interface StorageState {
    cookies: Cookie[];
}

/**
 * Check if stored session is still valid based on cookie expiry
 * Uses the 'loggedIn' cookie expiry timestamp for accurate validation
 * @returns true if session file exists and loggedIn cookie is not expired
 */
export function isSessionValid(): boolean {
    const storagePath = AUTH_CONFIG.STORAGE_STATE_PATH;

    if (!fs.existsSync(storagePath)) {
        console.log('No session file found, login required');
        return false;
    }

    try {
        const content = fs.readFileSync(storagePath, 'utf-8');
        const session: StorageState = JSON.parse(content);

        if (!session.cookies || session.cookies.length === 0) {
            console.log('Session has no cookies, login required');
            return false;
        }

        // Find the loggedIn cookie from Trello
        const loggedInCookie = session.cookies.find(
            cookie => cookie.name === 'loggedIn' && cookie.domain.includes('trello.com')
        );

        if (!loggedInCookie) {
            console.log('No loggedIn cookie found, login required');
            return false;
        }

        // Cookie expires is in seconds, Date.now() is in milliseconds
        const nowInSeconds = Date.now() / 1000;
        const expiresAt = loggedInCookie.expires;

        if (expiresAt <= nowInSeconds) {
            console.log('Session cookie expired, login required');
            return false;
        }

        // Calculate remaining time for logging
        const remainingHours = ((expiresAt - nowInSeconds) / 3600).toFixed(1);
        console.log(`Valid session found (expires in ${remainingHours}h), reusing`);
        return true;

    } catch {
        console.log('Session file corrupted, login required');
        return false;
    }
}

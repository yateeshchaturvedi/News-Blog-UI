import { login as apiLogin } from './api';

export async function loginUser(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
        // Calls the API and gets a response
        const response = await apiLogin({ username, password });

        if (response && response.token) {
            // Returns the token to the caller (the Server Action)
            return { success: true, token: response.token };
        }

        // Handle cases where login is successful but no token is returned
        return { success: false, error: 'Login successful, but no token received.' };

    } catch (error) {
        // Handle API errors (e.g., invalid credentials)
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

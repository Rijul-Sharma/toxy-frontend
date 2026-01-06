import _fetch from '../fetch.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const authService = {
    /**
     * Login with email and password
     * Sets JWT tokens in HttpOnly cookies
     */
    login: async (email, password) => {
        try {
            const response = await _fetch(`${BACKEND_URL}/auth/login`, 'POST', {
                email,
                password
            });

            if (response.status === 200) {
                return {
                    success: true,
                    message: 'Login successful'
                };
            } else {
                const error = await response.json();
                return {
                    success: false,
                    error: error.error || 'Login failed',
                    statusCode: response.status
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'An error occurred during login'
            };
        }
    },

    /**
     * Signup with email, name, and password
     * Sets JWT tokens in HttpOnly cookies
     */
    signup: async (email, name, password) => {
        try {
            const response = await _fetch(`${BACKEND_URL}/auth/signup`, 'POST', {
                email,
                name,
                password
            });

            if (response.status === 200) {
                return {
                    success: true,
                    message: 'Signup successful'
                };
            } else {
                const error = await response.json();
                return {
                    success: false,
                    error: error.error || 'Signup failed'
                };
            }
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                error: 'An error occurred during signup'
            };
        }
    },

    /**
     * Get current user profile
     * Protected endpoint - requires valid access token in cookies
     */
    getCurrentUser: async () => {
        try {
            const response = await _fetch(`${BACKEND_URL}/auth/me`, 'GET');

            if (response.status === 200) {
                const user = await response.json();
                return {
                    success: true,
                    user
                };
            } else if (response.status === 401) {
                return {
                    success: false,
                    error: 'Unauthorized',
                    statusCode: 401
                };
            } else {
                const error = await response.json();
                return {
                    success: false,
                    error: error.error || 'Failed to fetch user'
                };
            }
        } catch (error) {
            console.error('GetCurrentUser error:', error);
            return {
                success: false,
                error: 'An error occurred while fetching user'
            };
        }
    },

    /**
     * Refresh access token using refresh token
     * Reads refresh token from cookies, issues new access token
     */
    refreshToken: async () => {
        try {
            const response = await _fetch(`${BACKEND_URL}/auth/refresh`, 'POST', {});

            if (response.status === 200) {
                return {
                    success: true,
                    message: 'Token refreshed successfully'
                };
            } else if (response.status === 401) {
                return {
                    success: false,
                    error: 'Refresh token expired',
                    statusCode: 401
                };
            } else {
                const error = await response.json();
                return {
                    success: false,
                    error: error.error || 'Token refresh failed'
                };
            }
        } catch (error) {
            console.error('RefreshToken error:', error);
            return {
                success: false,
                error: 'An error occurred while refreshing token'
            };
        }
    },

    /**
     * Logout - clears both access and refresh cookies
     */
    logout: async () => {
        try {
            const response = await _fetch(`${BACKEND_URL}/auth/logout`, 'POST', {});

            if (response.status === 200) {
                return {
                    success: true,
                    message: 'Logout successful'
                };
            } else {
                const error = await response.json();
                return {
                    success: false,
                    error: error.error || 'Logout failed'
                };
            }
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                error: 'An error occurred during logout'
            };
        }
    }
};

export default authService;

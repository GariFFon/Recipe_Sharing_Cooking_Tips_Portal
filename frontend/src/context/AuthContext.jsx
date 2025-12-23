import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Sync Init
        try {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            if (storedUser) setUser(JSON.parse(storedUser));
            if (storedToken) setToken(storedToken);
        } catch (error) {
            console.error('Auth init error', error);
            localStorage.clear();
        } finally {
            setLoading(false);
        }

        // 2. Interval Check (Background Verification)
        const checkSession = async () => {
            const currentToken = localStorage.getItem('token');
            if (!currentToken) return;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });

                // If explicitly denied (401/404), logout.
                // We do NOT check 200 OK here to avoid re-parsing user data constantly.
                // We only care if the user is DELETED or token Invalid.
                if (response.status === 404 || response.status === 401) {
                    console.warn("Background check: User deleted or token expired. Logging out.");
                    logout();
                }
            } catch (error) {
                // Ignore network errors, etc.
                console.error("Background check error", error);
            }
        };

        const intervalId = setInterval(checkSession, 5000);

        // Also run once after 2 seconds to catch immediate invalid sessions without blocking mount
        const initialCheck = setTimeout(checkSession, 2000);

        return () => {
            clearInterval(intervalId);
            clearTimeout(initialCheck);
        };
    }, []); // Removed logout dependency to avoid any re-subscription issues, logout is stable via useCallback anyway

    const login = useCallback((userData, authToken) => {
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setToken(authToken);
    }, []);

    // Defined BEFORE useEffect, but used inside it. Ref is stable.
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
    }, []);

    const updateUser = useCallback((u) => {
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
    }, []);

    const value = {
        user,
        token,
        login,
        logout,
        updateUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

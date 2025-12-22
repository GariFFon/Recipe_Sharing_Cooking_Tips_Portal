import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
//this file is used to mange authentication state across the app
//Basically it provides login, logout functionalities and stores user info and token in localStorage
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
        // Check if user is logged in on mount
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedToken) {
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = useCallback((userData, authToken) => {
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setToken(authToken);
    }, []);

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

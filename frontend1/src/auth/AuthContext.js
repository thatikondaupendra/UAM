import React, { createContext, useState, useContext, useEffect } from 'react';

// Define a default empty context value that matches the expected structure
// This helps React understand the shape of the context even before a Provider is rendered.
const defaultAuthContextValue = {
    user: null,
    token: null,
    login: () => {}, // No-op function
    logout: () => {}, // No-op function
    isAuthenticated: false,
    isAdmin: false,
    isManager: false,
    isEmployee: false,
};

const AuthContext = createContext(defaultAuthContextValue); // Initialize with a default object

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        alert("useEffect in authProvider");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const storedUser = {
                    id: payload.userId,
                    username: payload.username || 'Employee',
                    role: payload.role
                };
                setUser(storedUser);
            } catch (error) {
                console.error("Failed to parse token:", error);
                logout();
            }
        }
    }, [token]);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!user && !!token;
    const isAdmin = user?.role === 'Admin';
    const isManager = user?.role === 'Manager';
    const isEmployee = user?.role === 'Employee';

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isAdmin, isManager, isEmployee }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    // This check is still useful if the hook is called outside the provider,
    // though with `defaultAuthContextValue`, `context` will never be `undefined` here.
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà connecté
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        setError(null);
        try {
            const response = await authService.login(credentials);
            const { access_token, user } = response.data.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true, user };
        } catch (err) {
            const message = err.response?.data?.message || 'Erreur de connexion';
            setError(message);
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        setError(null);
        try {
            const response = await authService.register(userData);
            const { access_token, user } = response.data.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true, user };
        } catch (err) {
            const errors = err.response?.data?.errors || {};
            const message = err.response?.data?.message || 'Erreur d\'inscription';
            setError(message);
            return { success: false, message, errors };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error('Erreur lors de la déconnexion', err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
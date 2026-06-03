import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Rediriger selon le rôle
        if (user?.role === 'demandeur') return <Navigate to="/demandeur/dashboard" replace />;
        if (user?.role === 'technicien') return <Navigate to="/technicien/dashboard" replace />;
        if (user?.role === 'administrateur') return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
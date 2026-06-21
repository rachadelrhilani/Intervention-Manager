import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Composant de garde pour filtrer les accès selon les rôles.
 * @param {Array} allowedRoles - Liste des rôles autorisés (ex: ['gestionnaire', 'traiteur'])
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  // 1. En attendant la vérification du token/état d'authentification
  if (loading) {
    return <div className="p-8 text-center text-slate-500">Vérification des droits d'accès...</div>;
  }

  // 2. Si l'utilisateur n'est pas connecté du tout -> Redirection vers Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si l'utilisateur est connecté mais n'a pas le bon rôle -> Redirection selon son vrai rôle
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Accès refusé. Rôle requis: [${allowedRoles}]. Rôle actuel: [${user.role}]`);
    
    // Redirection intelligente selon son rôle réel pour éviter de le bloquer
    if (user.role === 'traiteur') return <Navigate to="/traiteur" replace />;
    if (user.role === 'gestionnaire') return <Navigate to="/gestionnaire" replace />;
    
    return <Navigate to="/client" replace />;
  }

  // 4. Si tout est OK -> On affiche les routes enfants grâce à <Outlet />
  return <Outlet />;
}
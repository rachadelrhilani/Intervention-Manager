import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';

export default function DashboardLayout() {
  const { isAuthenticated, user } = useAuth();

  // Sécurité : Si l'utilisateur n'est pas connecté, retour immédiat au Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-row antialiased">
      
      {/* Menu Gauche - Caché sur mobile, affiché à partir de MD (768px) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Conteneur Principal de droite */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 md:pb-0">
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        
      </div>

      {/* Menu Bas - Affiché uniquement sur Mobile, caché sur PC */}
      <MobileNav />
      
    </div>
  );
}
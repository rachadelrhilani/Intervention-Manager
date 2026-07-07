import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import { Loader2 } from 'lucide-react'; // Si tu veux un petit spinner

export default function DashboardLayout() {
  // 1. Récupère aussi l'état "loading" depuis ton contexte
  const { isAuthenticated, loading } = useAuth();

  // 2. TANT QUE L'AUTHENTIFICATION VÉRIFIE LES IDENTIFIANTS : On affiche un écran d'attente
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <span className="text-xs font-bold uppercase tracking-widest">Vérification de la session...</span>
      </div>
    );
  }

  // 3. Sécurité : Une fois le chargement fini, SI non connecté -> redirection
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-row antialiased">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 pt-20 pb-6 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
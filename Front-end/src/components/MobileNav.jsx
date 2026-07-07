import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  LogOut,
  Inbox,
  Users,
  Cpu,
  FileSpreadsheet,
  User,
  ArrowUpCircle,
  Sliders,
  Menu,
  X
} from 'lucide-react';

export default function MobileNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  // On reprend exactement la même configuration complète que ton Aside principal
  const roleConfigs = {
    demandeur: {
      badgeLabel: 'Client',
      subText: user?.service || 'Général',
      links: [
        { name: 'Tableau de bord', to: '/client/dashboard', icon: LayoutDashboard },
        { name: 'Nouveau Ticket', to: '/client/nouveau-ticket', icon: PlusCircle },
        { name: 'Mes Demandes', to: '/client/tickets', icon: History },
        { name: 'Mon Profil', to: '/client/profile', icon: User },
      ]
    },
    traiteur: {
      badgeLabel: 'Technicien',
      subText: user?.specialite || 'Support',
      links: [
        { name: 'Indicateurs / Stats', to: '/traiteur/dashboard', icon: LayoutDashboard },
        { name: "File d'attente", to: '/traiteur/inbox', icon: Inbox },
        { name: 'Escalader un Ticket', to: '/traiteur/escalade', icon: ArrowUpCircle },
        { name: 'Mon Profil', to: '/traiteur/profile', icon: User },
      ]
    },
    gestionnaire: {
      badgeLabel: 'Gestionnaire',
      subText: user?.service_supervision || 'Superviseur SLA',
      links: [
        { name: 'Performances & IA', to: '/gestionnaire/dashboard', icon: LayoutDashboard },
        { name: 'Registre des Tickets', to: '/gestionnaire/tickets', icon: FileSpreadsheet },
        { name: 'Gestion Utilisateurs', to: '/gestionnaire/utilisateurs', icon: Users },
        { name: 'Configuration SLA', to: '/gestionnaire/sla', icon: Sliders },
        { name: 'Mon Profil', to: '/gestionnaire/profile', icon: User },
      ]
    }
  };

  const currentRole = user?.role || 'demandeur';
  const currentConfig = roleConfigs[currentRole] || roleConfigs.demandeur;

  return (
    <div className="md:hidden">
      {/* 1. BARRE SUPÉRIEURE FIXE (Top Bar) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-indigo-400" />
          <span className="font-bold text-base text-white tracking-wide">SmartSupport</span>
          <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-medium uppercase">
            {currentConfig.badgeLabel}
          </span>
        </div>

        {/* Bouton Hamburger pour ouvrir le menu */}
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>
      <div 
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <aside 
        className={`fixed top-0 bottom-0 right-0 w-72 bg-slate-900 text-slate-300 flex flex-col h-full z-50 border-l border-slate-800 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <span className="font-bold text-sm text-slate-400 uppercase tracking-wider">Navigation</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profil de l'utilisateur connecté */}
        <div className="p-4 mx-4 my-4 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-semibold uppercase shrink-0">
            {user?.nom?.substring(0, 2) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.nom || 'Utilisateur'}</p>
            <p className="text-xs text-slate-400 truncate">{currentConfig.subText}</p>
          </div>
        </div>

        {/* Navigation : TOUS les liens du rôle actif */}
        <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
          {currentConfig.links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)} // Ferme le menu au clic sur un lien
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                      : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Pied du menu avec Déconnexion */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Espacement de sécurité pour éviter que la Top Bar ne cache le haut de tes pages */}
      <div className="h-16" />
    </div>
  );
}
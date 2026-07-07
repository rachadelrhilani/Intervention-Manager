import React from 'react';
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
  Sliders
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

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
    // CHANGEMENT ICI : caché sur mobile (hidden), affiché à partir de md (md:flex)
    <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col h-screen sticky top-0 border-r border-slate-800">

      {/* Header avec Badge */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-800">
        <Cpu className="h-5 w-5 text-indigo-400" />
        <span className="font-bold text-lg text-white tracking-wide">SmartSupport</span>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-medium capitalize">
          {currentConfig.badgeLabel}
        </span>
      </div>

      {/* Profil Utilisateur */}
      <div className="p-4 mx-3 my-4 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-semibold uppercase shadow-md shadow-indigo-900/40">
          {user?.nom?.substring(0, 2) || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{user?.nom || 'Utilisateur'}</p>
          <p className="text-xs text-slate-400 truncate">{currentConfig.subText}</p>
        </div>
      </div>

      {/* Liens de Navigation */}
      <nav className="flex-grow px-3 space-y-1">
        {currentConfig.links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                  : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Déconnexion */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors duration-200 group"
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
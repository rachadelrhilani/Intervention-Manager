import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, PlusCircle, History, LogOut } from 'lucide-react';

export default function MobileNav() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: 'Dashboard', to: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Nouveau', to: '/client/nouveau-ticket', icon: PlusCircle },
    { name: 'Tickets', to: '/client/tickets', icon: History },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 px-4 py-2 flex justify-around items-center z-50 shadow-2xl backdrop-blur-md bg-opacity-95">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-400' : 'text-slate-400'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{link.name}</span>
          </NavLink>
        );
      })}
      
      <button
        onClick={() => { logout(); navigate('/login'); }}
        className="flex flex-col items-center gap-1 py-1 px-3 text-xs font-medium text-rose-400"
      >
        <LogOut className="h-5 w-5" />
        <span>Quitter</span>
      </button>
    </nav>
  );
}
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu, X, Cpu } from 'lucide-react';

export default function PublicLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Barre de navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
                <Cpu className="h-6 w-6" />
                <span>SmartSupport</span>
              </Link>
            </div>
            
            {/* Liens Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition">Accueil</Link>
              <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition">Connexion</Link>
              <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-100">
                S'inscrire
              </Link>
            </div>

            {/* Bouton Mobile Burger */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-indigo-600 focus:outline-none">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile déroulant */}
        {isOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium">Accueil</Link>
            <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium">Connexion</Link>
            <Link to="/signup" onClick={() => setIsOpen(false)} className="block text-center bg-indigo-600 text-white px-3 py-2 rounded-md font-medium hover:bg-indigo-700">
              S'inscrire
            </Link>
          </div>
        )}
      </nav>

      {/* Contenu de la page active (Outlet) */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Pied de page */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <p>&copy; 2026 SmartSupport Application. Propulsé par l'IA Agent.</p>
      </footer>
    </div>
  );
}
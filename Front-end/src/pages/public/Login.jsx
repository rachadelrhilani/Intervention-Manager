import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import loginBackground from '../../assets/login-background.jpeg';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authService.login(formData);
      const role = login(data); // Stocke les infos dans le contexte et récupère le rôle

      // Redirection dynamique selon le rôle de l'acteur (administrateur mape sur gestionnaire)
      if (role === 'administrateur' || role === 'gestionnaire') navigate('/gestionnaire/dashboard');
      else if (role === 'traiteur') navigate('/traiteur/dashboard');
      else navigate('/client/dashboard'); // Pour le demandeur

    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 filter blur-sm"
        style={{ backgroundImage: `url(${loginBackground})` }}
      />

      <div className="absolute inset-0 bg-slate-950/30 pointer-events-none"></div>

      {/* 4. Carte du Formulaire - Effet Transparent Givré (Glassmorphism) net au-dessus */}
      <div className="relative w-full max-w-md bg-white/75 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl shadow-slate-900/20 z-10">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bienvenue</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Connectez-vous à votre espace</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50/90 text-rose-700 text-xs font-bold rounded-xl border border-rose-100 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">Adresse email</label>
            <input 
              type="email" 
              required
              placeholder="votre@email.com"
              className="w-full px-3 py-2.5 text-xs bg-white/60 border border-slate-300/60 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 backdrop-blur-sm font-medium transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">Mot de passe</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full px-3 py-2.5 text-xs bg-white/60 border border-slate-300/60 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 backdrop-blur-sm font-medium transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-xs font-medium text-slate-600 mt-6">
          Nouveau ? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
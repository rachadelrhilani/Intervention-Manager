import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import SignUpBackground from '../../assets/signup-background.jpg';

export default function SignUp() {
  const [formData, setFormData] = useState({
    nom: '', email: '', telephone: '', service: '',
    type_demandeur: 'Interne', password: '', password_confirmation: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setGlobalError(null);
    setLoading(true);

    try {
      const data = await authService.register(formData);
      login(data); // Connecte automatiquement l'utilisateur après inscription
      navigate('/client/dashboard'); // L'inscription publique crée des Demandeurs
    } catch (err) {
      if (err.status === 'error' && err.errors) {
        // Capture les erreurs spécifiques aux champs envoyées par le FormRequest Laravel
        setValidationErrors(err.errors);
      } else {
        setGlobalError(err.message || "Échec de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Conteneur principal qui centre le formulaire sur l'écran
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* 2. Image d'arrière-plan isolée avec effet de flou contrôlé */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 filter blur-md"
        style={{ backgroundImage: `url(${SignUpBackground})` }}
      />

      {/* 3. Superposition sombre (Overlay) pour le contraste */}
      <div className="absolute inset-0 bg-slate-950/30 pointer-events-none"></div>

      {/* 4. Carte du Formulaire - Effet Transparent Givré (Glassmorphism) net au-dessus */}
      <div className="relative w-full max-w-xl bg-white/75 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl shadow-slate-900/20 z-10 my-8">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Créer un compte</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Rejoignez notre plateforme d'assistance</p>
        </div>

        {globalError && (
          <div className="mb-4 p-3 bg-rose-50/90 text-rose-700 text-xs font-bold rounded-xl border border-rose-100 backdrop-blur-sm">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Ligne 1 : Nom complet & Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">Nom complet</label>
              <input 
                type="text" 
                required 
                placeholder="John Doe"
                className="w-full px-3 py-2.5 text-xs bg-white/60 border border-slate-300/60 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 backdrop-blur-sm font-medium transition-all"
                value={formData.nom} 
                onChange={(e) => setFormData({...formData, nom: e.target.value})} 
              />
              {validationErrors.nom && <p className="text-[11px] font-bold text-rose-600 mt-1">{validationErrors.nom[0]}</p>}
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">Téléphone</label>
              <input 
                type="text" 
                placeholder="+212 600-000000"
                className="w-full px-3 py-2.5 text-xs bg-white/60 border border-slate-300/60 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 backdrop-blur-sm font-medium transition-all"
                value={formData.telephone} 
                onChange={(e) => setFormData({...formData, telephone: e.target.value})} 
              />
            </div>
          </div>

          {/* Ligne 2 : Email */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">Adresse email d'entreprise</label>
            <input 
              type="email" 
              required 
              placeholder="votre.nom@entreprise.com"
              className="w-full px-3 py-2.5 text-xs bg-white/60 border border-slate-300/60 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 backdrop-blur-sm font-medium transition-all"
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
            {validationErrors.email && <p className="text-[11px] font-bold text-rose-600 mt-1">{validationErrors.email[0]}</p>}
          </div>

          {/* Ligne 3 : Service & Type de profil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">Service</label>
              <select 
                required 
                className="w-full px-3 py-2.5 text-xs bg-white/60 border border-slate-300/60 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 backdrop-blur-sm font-medium transition-all cursor-pointer"
                value={formData.service} 
                onChange={(e) => setFormData({...formData, service: e.target.value})}
              >
                <option value="">Sélectionnez...</option>
                <option value="Ressources Humaines">Ressources Humaines</option>
                <option value="Informatique">Informatique / IT</option>
                <option value="Finance">Finance / Comptabilité</option>
              </select>
              {validationErrors.service && <p className="text-[11px] font-bold text-rose-600 mt-1">{validationErrors.service[0]}</p>}
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">Type de profil</label>
              <select 
                className="w-full px-3 py-2.5 text-xs bg-white/60 border border-slate-300/60 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 backdrop-blur-sm font-medium transition-all cursor-pointer"
                value={formData.type_demandeur} 
                onChange={(e) => setFormData({...formData, type_demandeur: e.target.value})}
              >
                <option value="Interne">Employé Interne</option>
                <option value="Externe">Prestataire Externe</option>
              </select>
            </div>
          </div>

          {/* Ligne 4 : Mot de passe & Confirmer le mot de passe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              {validationErrors.password && <p className="text-[11px] font-bold text-rose-600 mt-1">{validationErrors.password[0]}</p>}
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">Confirmer le mot de passe</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-xs bg-white/60 border border-slate-300/60 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 backdrop-blur-sm font-medium transition-all"
                value={formData.password_confirmation} 
                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} 
              />
            </div>
          </div>

          {/* Bouton de validation */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? "Création du compte en cours..." : "Créer mon compte"}
            </button>
          </div>
        </form>

        <p className="text-center text-xs font-medium text-slate-600 mt-6">
          Déjà un compte ? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
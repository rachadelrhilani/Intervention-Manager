import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

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
    <div className="max-w-lg mx-auto my-12 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Créer un compte</h2>
        </div>

        {globalError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
              <input type="text" required className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
              {validationErrors.nom && <span className="text-xs text-red-500">{validationErrors.nom[0]}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <input type="text" className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Adresse email d'entreprise</label>
            <input type="email" required className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            {validationErrors.email && <span className="text-xs text-red-500">{validationErrors.email[0]}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Service</label>
              <select required className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})}>
                <option value="">Sélectionnez...</option>
                <option value="Ressources Humaines">Ressources Humaines</option>
                <option value="Informatique">Informatique / IT</option>
                <option value="Finance">Finance / Comptabilité</option>
              </select>
              {validationErrors.service && <span className="text-xs text-red-500">{validationErrors.service[0]}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type de profil</label>
              <select className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                value={formData.type_demandeur} onChange={(e) => setFormData({...formData, type_demandeur: e.target.value})}>
                <option value="Interne">Employé Interne</option>
                <option value="Externe">Prestataire Externe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
              <input type="password" required className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              {validationErrors.password && <span className="text-xs text-red-500">{validationErrors.password[0]}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirmer le mot de passe</label>
              <input type="password" required className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                value={formData.password_confirmation} onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
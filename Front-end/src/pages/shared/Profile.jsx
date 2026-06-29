import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Remplace par le chemin réel de ton contexte Auth
import { profileService } from '../../services/profileService';
import { 
  User, Mail, Phone, Shield, Wrench, 
  Clock, CheckCircle, Lock, KeyRound, AlertTriangle 
} from 'lucide-react';

export default function Profile() {
  const { user, updateLocalUser } = useAuth(); // Récupère l'utilisateur connecté et une fonction pour mettre à jour l'état global si nécessaire
  
  // États du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  // États de l'interface
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [err, setErr] = useState(null);

  // Synchroniser les données du formulaire quand l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nom: user.nom || '',
        email: user.email || '',
        telephone: user.telephone || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    setSuccess(null);

    // Petite vérification de sécurité côté Front
    if (formData.new_password && formData.new_password !== formData.new_password_confirmation) {
      setErr("La confirmation du nouveau mot de passe ne correspond pas.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await profileService.updateProfile({
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        current_password: formData.current_password || null,
        new_password: formData.new_password || null,
        new_password_confirmation: formData.new_password_confirmation || null
      });

      if (response && response.status === 'success') {
        setSuccess("Votre profil a été mis à jour avec succès.");
        // Mettre à jour le contexte global avec les nouvelles données renvoyées par le service Laravel
        if (updateLocalUser) {
          updateLocalUser(response.data);
        }
        // Vider les champs de mot de passe
        setFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        }));
      }
    } catch (error) {
      console.error(error);
      setErr(error.message || "Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* BANNIÈRE / EN-TÊTE D'IDENTITÉ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="h-20 w-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-600/20 shrink-0">
          {user?.nom ? user.nom.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">{user?.nom}</h1>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 items-center">
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider">
              Rôle : {user?.role}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user?.est_actif ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700'}`}>
              {user?.est_actif ? 'Compte Actif' : 'Compte Restreint'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE : STATS ET INFOS MÉTIERS (DYNAMIQUE) */}
        <div className="md:col-span-1 space-y-6">
          
          {/* AFFICHAGE SI L'ACTEUR EST UN TRAITEUR */}
          {user?.role === 'traiteur' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-emerald-500" /> Profil Technique
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Spécialité</label>
                  <p className="text-xs font-bold text-slate-800">{user?.specialite || 'Non spécifiée'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Niveau d'Escalade</label>
                  <span className="inline-block mt-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">
                    Niveau {user?.niveau_traiteur || 1}
                  </span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Disponibilité IA</label>
                  <p className={`text-xs font-bold mt-0.5 ${user?.est_disponible ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {user?.est_disponible ? '✓ Disponible pour assignation' : '✗ Hors ligne'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                  <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                    <span className="text-base font-black text-slate-900 block">{user?.tickets_traites || 0}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Tickets Clos</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                    <span className="text-sm font-black text-slate-900 block">{user?.temps_moyen_resolution || 0}m</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Temps Moy.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AFFICHAGE SI L'ACTEUR EST UN DEMANDEUR */}
          {user?.role === 'demandeur' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <User className="h-4 w-4 text-indigo-500" /> Structure Client
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Service Départemental</label>
                  <p className="text-xs font-bold text-slate-800">{user?.service || 'Général / Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Canal d'accès</label>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{user?.type_demandeur || 'Interne'}</p>
                </div>
              </div>
            </div>
          )}

          {/* AFFICHAGE SI L'ACTEUR EST UN ADMINISTRATEUR (GESTIONNAIRE) */}
          {user?.role === 'administrateur' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-indigo-600" /> Privilèges Système
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Niveau d'accréditation</label>
                  <span className="inline-block mt-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded">
                    Rang {user?.niveau_acces || 1}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Autorisé à modifier la configuration globale des slas et à gérer le registre des utilisateurs.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* COLONNE DROITE : FORMULAIRE DE MODIFICATION */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-5 flex items-center gap-1.5">
            <KeyRound className="h-4 w-4 text-slate-400" /> Informations du compte
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
                <CheckCircle className="h-4 w-4 shrink-0" /> {success}
              </div>
            )}
            
            {err && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {err}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nom Complet</label>
                <input
                  type="text"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Adresse Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {user?.role === 'demandeur' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Téléphone de contact</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    placeholder="+212 600 000 000"
                    className="w-full text-xs font-medium border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-indigo-500"
                  />
                  <Phone className="h-3.5 w-3.5 text-slate-400 absolute left-3" />
                </div>
              </div>
            )}

            {/* EXPANDABLE SECURITY ZONE */}
            <div className="pt-4 border-t border-slate-100 mt-4 space-y-4">
              <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-wider">Sécurité & Mot de passe</h4>
              
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mot de passe actuel</label>
                  <input
                    type="password"
                    name="current_password"
                    placeholder="Obligatoire pour changer de mot de passe"
                    value={formData.current_password}
                    onChange={handleInputChange}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nouveau mot de passe</label>
                    <input
                      type="password"
                      name="new_password"
                      placeholder="Min. 6 caractères"
                      value={formData.new_password}
                      onChange={handleInputChange}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      name="new_password_confirmation"
                      placeholder="Re-saisir le mot de passe"
                      value={formData.new_password_confirmation}
                      onChange={handleInputChange}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SOUMISSION */}
            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/10 transition-colors disabled:opacity-50 active:scale-95 transition-all"
              >
                {submitting ? 'Enregistrement...' : 'Mettre à jour mon profil'}
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { gestionnaireService } from '../../Services/gestionnaireService';
import { 
  Users, 
  UserPlus, 
  Shield, 
  ToggleLeft, 
  ToggleRight, 
  Wrench, 
  Mail, 
  Lock,
  X,
  CheckCircle2,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function UserManagement() {
  // États de données
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });

  // États de recherche et pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États du Modal de création Traiteur
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    specialite: 'Réseau & Infrastructure',
    niveau_competence: 'L1'
  });
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Debouncing de la recherche
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Retour à la page 1 lors d'une nouvelle recherche
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Chargement des utilisateurs
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await gestionnaireService.getAllUsers(currentPage, 10, debouncedSearch);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, debouncedSearch]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pagination.last_page) setCurrentPage(prev => prev + 1);
  };

  // Action : Activer / Désactiver un profil
  const handleToggleStatus = async (userId) => {
    try {
      // Optimistic UI update (mise à jour visuelle immédiate pour fluidité)
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === userId ? { ...u, est_actif: !u.est_actif } : u)
      );
      await gestionnaireService.toggleUserStatus(userId);
    } catch (err) {
      console.error(err);
      // Recharger la liste réelle du serveur en cas d'échec de l'API pour annuler la modif visuelle
      loadUsers();
    }
  };

  // Gestion du formulaire de création
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitLoading(true);

    try {
      await gestionnaireService.createTraiteur(formData);
      // Réinitialisation et fermeture
      setFormData({
        nom: '',
        email: '',
        password: '',
        specialite: 'Réseau & Infrastructure',
        niveau_competence: 'L1'
      });
      setIsModalOpen(false);
      // Rechargement du tableau mis à jour
      loadUsers();
    } catch (err) {
      setFormError(err.message || "Une erreur est survenue lors de la création.");
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Helper pour afficher le badge de rôle de manière élégante
  const getRoleBadge = (role) => {
    const styles = {
      gestionnaire: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-extrabold',
      traiteur: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
      demandeur: 'bg-slate-100 text-slate-700 border-slate-200'
    };
    const labels = { gestionnaire: 'Gestionnaire', traiteur: 'Technicien', demandeur: 'Client' };
    return (
      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] uppercase tracking-wide ${styles[role] || styles.demandeur}`}>
        {labels[role] || role}
      </span>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 space-y-6">
      
      {/* SECTION EN-TÊTE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-indigo-600" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Contrôlez les accès au système, gérez le statut des comptes et affectez les compétences de l'équipe technique.
          </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/10 transition-all active:scale-95"
        >
          <UserPlus className="h-4 w-4" />
          Nouveau Technicien
        </button>
      </div>

      {error && (
        <div className="p-4 text-center text-red-500 font-bold bg-white border border-slate-200 rounded-2xl shadow-sm">
          ⚠️ Une erreur est survenue : {error}
        </div>
      )}

      {/* BARRE DE RECHERCHE & CONFIGURATION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Rechercher un utilisateur (nom, email, spécialité...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>
        <div className="text-xs font-bold text-slate-400 flex items-center gap-2 shrink-0">
          <span>{pagination.total} utilisateur(s) au total</span>
        </div>
      </div>

      {/* TABLEAU PRINCIPAL */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-6">Identité & Contact</th>
                <th className="py-3 px-6 text-center">Rôle</th>
                <th className="py-3 px-6">Spécialité / Métier</th>
                <th className="py-3 px-6 text-center">Niveau Escalade</th>
                <th className="py-3 px-6 text-center">Statut du Compte</th>
                <th className="py-3 px-6 text-center">Action rapide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 font-semibold animate-pulse">
                    Chargement de la liste des comptes...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 font-semibold">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                users.map((userItem) => (
                  <tr key={userItem.id} className={`hover:bg-slate-50/40 transition-colors ${!userItem.est_actif ? 'bg-slate-50/30 opacity-75' : ''}`}>
                    
                    {/* IDENTITÉ */}
                    <td className="py-3.5 px-6">
                      <div className="font-extrabold text-slate-900">{userItem.nom}</div>
                      <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3 shrink-0" />
                        {userItem.email}
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="py-3.5 px-6 text-center">
                      {getRoleBadge(userItem.role)}
                    </td>

                    {/* SPÉCIALITÉ */}
                    <td className="py-3.5 px-6 font-semibold text-slate-600">
                      {userItem.role === 'traiteur' ? (
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <Wrench className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          {userItem.specialite || 'Généraliste'}
                        </div>
                      ) : userItem.role === 'demandeur' ? (
                        <span className="text-slate-400 italic">Client ({userItem.service || 'Non spécifié'})</span>
                      ) : (
                        <span className="text-indigo-600 font-bold flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5" /> Direction Technique
                        </span>
                      )}
                    </td>

                    {/* NIVEAU */}
                    <td className="py-3.5 px-6 text-center font-bold">
                      {userItem.role === 'traiteur' ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black">
                          {userItem.niveau_competence || 'L1'}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* STATUT DU COMPTE */}
                    <td className="py-3.5 px-6 text-center">
                      {userItem.est_actif ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100">
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-red-100">
                          Suspendu
                        </span>
                      )}
                    </td>

                    {/* ACTION TOGGLE */}
                    <td className="py-3.5 px-6 text-center">
                      <button
                        onClick={() => handleToggleStatus(userItem.id)}
                        title={userItem.est_actif ? "Désactiver le compte" : "Activer le compte"}
                        className={`transition-colors p-1 rounded-lg ${userItem.est_actif ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-300 hover:bg-slate-100'}`}
                      >
                        {userItem.est_actif ? (
                          <ToggleRight className="h-7 w-7" />
                        ) : (
                          <ToggleLeft className="h-7 w-7" />
                        )}
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BARRE DE PAGINATION */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <div className="text-xs text-slate-500 font-medium">
            Page <span className="font-bold text-slate-800">{pagination.current_page}</span> sur{' '}
            <span className="font-bold text-slate-800">{pagination.last_page}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading}
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="text-xs font-bold px-3 text-slate-700">
              {currentPage}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage === pagination.last_page || loading}
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* --- MODAL FORMULAIRE : CRÉATION TECHNICIEN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col animate-scaleUp">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-sm tracking-tight">Créer un profil Technicien</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 flex-grow">
              
              {formError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {formError}
                </div>
              )}

              {/* Nom complet */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Nom Complet</label>
                <input
                  type="text"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Ex: Alexandre Martin"
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Adresse Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="alexandre@smartsupport.com"
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Mot de passe initial */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Mot de passe temporaire</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full text-xs font-medium border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <Lock className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                {/* Spécialité */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Spécialité Principale</label>
                  <select
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleInputChange}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-2 py-2.5 bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Réseau & Infrastructure">Réseau & Infra</option>
                    <option value="Base de données / ERP">Base de données</option>
                    <option value="Matériel & Automates">Automates / IoT</option>
                    <option value="Sécurité & Accès">Sécurité / IAM</option>
                  </select>
                </div>

                {/* Niveau de compétence */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Niveau d'escalade (SLA)</label>
                  <select
                    name="niveau_competence"
                    value={formData.niveau_competence}
                    onChange={handleInputChange}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-2 py-2.5 bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="L1">L1 - Support initial</option>
                    <option value="L2">L2 - Tech Confirmé</option>
                    <option value="L3">L3 - Expert Système</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formSubmitLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/10 transition-colors disabled:opacity-50"
                >
                  {formSubmitLoading ? 'Création en cours...' : 'Valider le compte'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
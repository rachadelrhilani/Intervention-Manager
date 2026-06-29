import React, { useState, useEffect } from 'react';
import { ticketService } from '../../Services/ticketService';
import { 
  ArrowUpCircle, 
  AlertCircle, 
  CheckCircle, 
  ShieldAlert, 
  User, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export default function EscaladeTicket() {
  // États pour stocker les données de l'API
  const [tickets, setTickets] = useState([]);
  const [traiteurs, setTraiteurs] = useState([]);
  
  // États du formulaire
  const [selectedTicket, setSelectedTicket] = useState('');
  const [selectedTraiteur, setSelectedTraiteur] = useState('');
  const [motif, setMotif] = useState('');
  
  // États de l'interface utilisateur
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Chargement initial via le ticketService
  useEffect(() => {
    const loadEscaladeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Appels simultanés vers tes routes Laravel
        const [ticketsRes, colleguesRes] = await Promise.all([
          ticketService.getMesTickets(),
          ticketService.getListeCollegues()
        ]);
        
        // Ton API renvoie { status: 'success', data: [...] }
        setTickets(ticketsRes.data || []);
        setTraiteurs(colleguesRes.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Impossible de charger les données du protocole d'escalade.");
      } finally {
        setLoading(false);
      }
    };

    loadEscaladeData();
  }, []);

  const handleEscaladeSubmit = async (e) => {
    e.preventDefault();
    
    // Validation rapide côté Front
    if (!selectedTicket || !selectedTraiteur || !motif.trim()) {
      setError("Veuillez renseigner tous les champs obligatoires.");
      return;
    }

    if (motif.trim().length < 10) {
      setError("Le motif d'escalade doit contenir au moins 10 caractères pour guider votre collègue.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Appel de la méthode centralisée dans ton ticketService
      const response = await ticketService.escaladerTicket(
        selectedTicket,
        selectedTraiteur,
        motif
      );

      if (response.status === 'success') {
        setSuccess("L'incident a été escaladé avec succès. Son état est désormais mis à jour.");
        
        // Mise à jour de la liste locale : on retire le ticket transféré
        setTickets(prevTickets => prevTickets.filter(t => t.id !== parseInt(selectedTicket)));
        
        // Réinitialisation des champs du formulaire
        setSelectedTicket('');
        setSelectedTraiteur('');
        setMotif('');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de la procédure de réassignation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chargement des données d'aiguillage...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-6 max-w-3xl mx-auto space-y-6 animate-fadeIn">
      
      {/* EN-TÊTE DE LA PAGE */}
      <div className="flex items-start gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <ArrowUpCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-black text-slate-900 tracking-tight">Escalade & Transfert d'Incident</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Si l'intelligence artificielle a mal qualifié ou mal orienté une demande d'assistance vers votre file d'attente, utilisez ce formulaire pour déléguer l'intervention à un technicien plus adapté.
          </p>
        </div>
      </div>

      {/* FORMULAIRE PRINCIPAL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleEscaladeSubmit} className="space-y-5">
          
          {/* Notifications de retour */}
          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-sm">
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}
          
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-sm">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Étape 1 : Sélection de l'incident */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              1. Sélectionner l'incident mal orienté
            </label>
            <div className="relative">
              <select
                value={selectedTicket}
                onChange={(e) => setSelectedTicket(e.target.value)}
                className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-3 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="">-- Choisir un ticket de votre file d'attente --</option>
                {tickets.length === 0 ? (
                  <option value="" disabled>Aucun ticket actif éligible à l'escalade</option>
                ) : (
                  tickets.map(t => (
                    <option key={t.id} value={t.id}>
                      #{t.id} - {t.titre} (Priorité: {t.priorite} | État: {t.etat})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Étape 2 : Sélection du nouveau Traiteur */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" />
              2. Transférer à un collaborateur qualifié
            </label>
            <select
              value={selectedTraiteur}
              onChange={(e) => setSelectedTraiteur(e.target.value)}
              className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-3 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">-- Choisir le technicien ou expert cible --</option>
              {traiteurs.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nom} — Spécialité : {t.specialite || 'Support Général'} (Niveau {t.niveau_traiteur || 1})
                </option>
              ))}
            </select>
          </div>

          {/* Étape 3 : Justification */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
              3. Justification de la réassignation
            </label>
            <textarea
              rows="4"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Ex: L'incident a été classé à tort dans le scope Réseau par l'IA. Après analyse, il s'agit d'une corruption de table sur la base de données PostgreSQL de l'application Nexlya, ce qui nécessite l'intervention d'un DBA..."
              className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* ZONE D'ALERTE DES RÈGLES */}
          <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl flex gap-3 items-start">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">Règles de transfert système</h4>
              <p className="text-[10px] font-medium text-amber-700 leading-relaxed">
                En validant cette action, le statut du ticket passera automatiquement à l'état <span className="font-bold">"Escalade"</span>. Une note d'audit contenant votre motif sera enregistrée de manière permanente pour l'analyse des performances de l'IA.
              </p>
            </div>
          </div>

          {/* BOUTON DE VALIDING */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting || !selectedTicket || !selectedTraiteur}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 duration-150"
            >
              {submitting ? 'Traitement du transfert...' : 'Confirmer l\'escalade'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
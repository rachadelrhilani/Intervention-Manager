import React, { useState, useEffect } from 'react';
import { gestionnaireService } from '../../Services/gestionnaireService';
import { 
  FileSpreadsheet, 
  MessageSquare, 
  User, 
  Wrench, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

export default function GestionnaireTicketsList() {
  // États pour les données et la pagination
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  });

  // États d'interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Chargement des données via le service
  const loadTickets = async (pageNumber) => {
    try {
      setLoading(true);
      setError(null);
      const data = await gestionnaireService.getAllTickets(pageNumber, 5);
      
      setTickets(data.tickets);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Erreur registre tickets gestionnaire :", err);
      setError("Impossible de charger le registre des incidents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets(currentPage);
  }, [currentPage]);

  // Fonctions de changement de page
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pagination.last_page) setCurrentPage(prev => prev + 1);
  };

  // --- HELPERS DE STYLISATION DES BADGES ---
  const getEtatBadge = (etat) => {
    const styles = {
      Ouvert: 'bg-blue-50 text-blue-700 border-blue-100',
      EnCours: 'bg-amber-50 text-amber-700 border-amber-100',
      Escalade: 'bg-red-50 text-red-700 border-red-100',
      Resolu: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      Ferme: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return styles[etat] || 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const getPrioriteBadge = (priorite) => {
    const styles = {
      P1: 'bg-red-600 text-white',
      P2: 'bg-orange-500 text-white',
      P3: 'bg-amber-500 text-white',
      P4: 'bg-slate-400 text-white',
    };
    return styles[priorite] || 'bg-slate-400 text-white';
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 space-y-6">
      
      {/* EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-7 w-7 text-indigo-600" />
            Registre Central des Tickets
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Historique complet, suivi des affectations techniciens et diagnostics de confiance de l'IA.
          </p>
        </div>
        
        {/* Actions rapides */}
        <button 
          onClick={() => loadTickets(currentPage)}
          className="self-start sm:self-auto flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all active:scale-95"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* ZONE DE CONTENU PRINCIPALE */}
      {error ? (
        <div className="p-8 text-center text-red-500 font-bold bg-white border border-slate-200 rounded-2xl shadow-sm">
          ⚠️ {error}
        </div>
      ) : loading ? (
        <div className="p-16 text-center text-slate-500 font-medium bg-white border border-slate-200 rounded-2xl shadow-sm animate-pulse">
          Extraction du registre centralisé des incidents...
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          
          {/* BANDEAU COMPTEUR */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              Total filtré : {pagination.total} ticket(s)
            </span>
          </div>

          {/* TABLEAU HTML DES TICKETS */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/20">
                  <th className="py-3 px-6 w-16 text-center">ID</th>
                  <th className="py-3 px-6">Détails Incident</th>
                  <th className="py-3 px-6">Acteurs</th>
                  <th className="py-3 px-4 text-center">Priorité</th>
                  <th className="py-3 px-4 text-center">Statut</th>
                  <th className="py-3 px-6 text-center text-indigo-600">Confiance IA</th>
                  <th className="py-3 px-6 text-right">Date d'ouverture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-400">Aucun ticket enregistré dans le système.</td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* ID */}
                      <td className="py-3.5 px-6 text-center font-bold text-slate-400">
                        #{ticket.id}
                      </td>

                      {/* TITRE ET TYPE */}
                      <td className="py-3.5 px-6 max-w-xs">
                        <div className="font-extrabold text-slate-900 truncate" title={ticket.titre}>
                          {ticket.titre}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                          <span className="bg-slate-100 px-1.5 py-0.2 rounded text-slate-600 font-bold uppercase text-[9px]">
                            {ticket.type}
                          </span>
                          • via {ticket.origine}
                        </div>
                      </td>

                      {/* DEMANDEUR & TECHNICIEN */}
                      <td className="py-3.5 px-6 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <User className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[120px]">{ticket.demandeur}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                          <Wrench className="h-3 w-3 text-indigo-400 shrink-0" />
                          <span className="truncate max-w-[120px]">{ticket.technicien}</span>
                        </div>
                      </td>

                      {/* PRIORITÉ */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide ${getPrioriteBadge(ticket.priorite)}`}>
                          {ticket.priorite}
                        </span>
                      </td>

                      {/* STATUT */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getEtatBadge(ticket.etat)}`}>
                          {ticket.etat}
                        </span>
                      </td>

                      {/* INDICE DE CONFIANCE IA & TCHAT */}
                      <td className="py-3.5 px-6 text-center">
                        <div className="font-bold text-indigo-600 bg-indigo-50/50 border border-indigo-100/50 rounded-lg py-1 px-2 inline-block text-[11px]">
                          {ticket.ia_confiance}
                        </div>
                        {ticket.activite_tchat > 0 && (
                          <div className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center justify-center gap-1">
                            <MessageSquare className="h-2.5 w-2.5" />
                            {ticket.activite_tchat} msg
                          </div>
                        )}
                      </td>

                      {/* DATE */}
                      <td className="py-3.5 px-6 text-right text-slate-500 font-semibold">
                        <div className="flex items-center justify-end gap-1.5">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{ticket.cree_le}</span>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* BARRE DE PAGINATION SÉCURISÉE */}
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
            <div className="text-xs text-slate-500 font-medium">
              Page <span className="font-bold text-slate-800">{pagination.current_page}</span> sur{' '}
              <span className="font-bold text-slate-800">{pagination.last_page}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
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
                onClick={handleNextPage}
                disabled={currentPage === pagination.last_page || loading}
                className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
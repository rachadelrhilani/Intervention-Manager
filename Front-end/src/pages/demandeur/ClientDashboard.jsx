import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FolderOpen, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ ouverts: 0, enCours: 0, resolus: 0 });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketService.getDashboardData();
      setStats(data.stats);
      setRecentTickets(data.recentTickets);
    } catch (err) {
      // MODE DEMO / SÉCURITÉ : Si le backend Laravel n'est pas encore prêt,
      // on charge de fausses données pour tester l'interface React
      console.warn("Backend indisponible, chargement des données de démonstration.");
      setStats({ ouverts: 1, enCours: 2, resolus: 12 });
      setRecentTickets([
        { id: 101, titre: "Problème d'accès au VPN", priorite: "P2", etat: "EnCours", created_at: "2026-06-09 14:30" },
        { id: 102, titre: "Crash du logiciel de paie Sage", priorite: "P1", etat: "Ouvert", created_at: "2026-06-09 09:15" },
        { id: 98, titre: "Demande de double écran", priorite: "P4", etat: "Resolu", created_at: "2026-06-05 11:00" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fonction utilitaire pour attribuer la bonne couleur au badge d'état (Conforme BDD)
  const getStatusBadge = (status) => {
    const styles = {
      Ouvert: 'bg-orange-50 text-orange-700 border-orange-200',
      EnCours: 'bg-blue-50 text-blue-700 border-blue-200',
      Escalade: 'bg-purple-50 text-purple-700 border-purple-200',
      Resolu: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Ferme: 'bg-slate-100 text-slate-600 border-slate-300',
    };
    return styles[status] || styles.Ouvert;
  };

  // Fonction utilitaire pour la couleur des priorités calculées par l'IA
  const getPriorityColor = (priority) => {
    const styles = {
      P1: 'text-red-600 font-bold',
      P2: 'text-amber-600 font-semibold',
      P3: 'text-indigo-600',
      P4: 'text-slate-500',
    };
    return styles[priority] || 'text-slate-500';
  };

  return (
    <div className="space-y-8">
      {/* En-tête de bienvenue */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bonjour, {user?.nom}</h1>
          <p className="text-sm text-slate-500 mt-1">Suivez l'état de vos incidents techniques en temps réel.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchDashboardData}
            className="p-2.5 text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition"
            title="Actualiser les données"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link 
            to="/client/nouveau-ticket" 
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-100"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Déclarer un incident</span>
          </Link>
        </div>
      </div>

      {/* --- CARTES DE STATISTIQUES --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Carte : Tickets Ouverts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">Nouveaux / Ouverts</p>
            <p className="text-3xl font-bold text-slate-900">{loading ? '...' : stats.ouverts}</p>
          </div>
          <div className="p-3.5 bg-orange-50 text-orange-600 rounded-xl">
            <FolderOpen className="h-6 w-6" />
          </div>
        </div>

        {/* Carte : Tickets En Cours */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">En cours de traitement</p>
            <p className="text-3xl font-bold text-slate-900">{loading ? '...' : stats.enCours}</p>
          </div>
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Carte : Tickets Résolus */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">Résolus récents</p>
            <p className="text-3xl font-bold text-slate-900">{loading ? '...' : stats.resolus}</p>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* --- SECTION HISTORIQUE RÉCENT --- */}
      <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 text-lg">Vos dernières demandes</h2>
          <Link to="/client/tickets" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group">
            Voir tout l'historique <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {loading ? (
          /* Effet Skeleton pendant le chargement */
          <div className="p-6 space-y-4">
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-full" />
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-full" />
          </div>
        ) : recentTickets.length === 0 ? (
          /* Liste vide */
          <div className="p-12 text-center text-slate-500 space-y-2">
            <AlertCircle className="h-8 w-8 mx-auto text-slate-400" />
            <p className="font-medium">Aucun ticket ouvert pour le moment</p>
            <p className="text-sm text-slate-400">Si vous rencontrez un problème technique, utilisez le bouton ci-dessus.</p>
          </div>
        ) : (
          /* Tableau adaptatif (Desktop) / Liste de cartes (Mobile) */
          <div className="overflow-x-auto">
            {/* Version Desktop (Tableau) */}
            <table className="w-full text-left border-collapse hidden sm:table">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Sujet de l'incident</th>
                  <th className="px-6 py-4">Priorité (IA)</th>
                  <th className="px-6 py-4">Statut actuel</th>
                  <th className="px-6 py-4">Date de dépôt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-400">#{ticket.id}</td>
                    <td className="px-6 py-4 text-slate-900 max-w-xs truncate">{ticket.titre}</td>
                    <td className={`px-6 py-4 ${getPriorityColor(ticket.priorite)}`}>{ticket.priorite || 'Calcul...'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold border rounded-full ${getStatusBadge(ticket.etat)}`}>
                        {ticket.etat}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-normal">{ticket.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Version Mobile (Empilement vertical de cartes pour écrans tactiles) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 space-y-3 hover:bg-slate-50/40">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-slate-400 font-semibold">#{ticket.id}</span>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold border rounded-full ${getStatusBadge(ticket.etat)}`}>
                      {ticket.etat}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm leading-snug">{ticket.titre}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">{ticket.created_at}</span>
                    <span className="font-medium">Priorité : <span className={getPriorityColor(ticket.priorite)}>{ticket.priorite}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
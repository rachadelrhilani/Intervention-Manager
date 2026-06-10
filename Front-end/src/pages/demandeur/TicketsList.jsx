import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { Search, Inbox, ArrowRight, Shield } from 'lucide-react';

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getAllTickets();
        setTickets(data);
        setFilteredTickets(data);
      } catch (err) {
        // Jeu de données de secours (Démonstration)
        const demo = [
          { id: 101, titre: "Problème d'accès au VPN", priorite: "P2", etat: "EnCours", created_at: "2026-06-09 14:30" },
          { id: 102, titre: "Crash du logiciel de paie Sage", priorite: "P1", etat: "Ouvert", created_at: "2026-06-09 09:15" },
          { id: 98, titre: "Demande de double écran", priorite: "P4", etat: "Resolu", created_at: "2026-06-05 11:00" },
        ];
        setTickets(demo);
        setFilteredTickets(demo);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Filtrer la liste lorsque l'onglet change
  useEffect(() => {
    if (activeTab === 'Tous') {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter(t => t.etat === activeTab));
    }
  }, [activeTab, tickets]);

  const tabs = ['Tous', 'Ouvert', 'EnCours', 'Resolu'];

  const getStatusStyle = (status) => {
    const styles = {
      Ouvert: 'bg-orange-50 text-orange-700 border-orange-200',
      EnCours: 'bg-blue-50 text-blue-700 border-blue-200',
      Resolu: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
    return styles[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Historique de vos demandes</h1>
        <p className="text-sm text-slate-500 mt-1">Retrouvez et suivez l'avancement de tous vos tickets d'assistance.</p>
      </div>

      {/* --- BARRE DE NAVIGATION DES ONGLETS (FILTRES) --- */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'EnCours' ? 'En Cours' : tab === 'Resolu' ? 'Résolus' : tab}
          </button>
        ))}
      </div>

      {/* --- LISTE DES TICKETS --- */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 animate-pulse font-medium">Chargement de l'historique...</div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-2">
          <Inbox className="h-8 w-8 mx-auto text-slate-300" />
          <p className="font-semibold">Aucun ticket dans cette catégorie</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/client/tickets/${ticket.id}`)} // 🔄 La redirection magique !
              className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-indigo-500 hover:shadow-md transition duration-200 cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-2 min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-400">#{ticket.id}</span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold border rounded-full ${getStatusStyle(ticket.etat)}`}>
                    {ticket.etat === 'EnCours' ? 'En Cours' : ticket.etat}
                  </span>
                  <span className="text-xs text-slate-400">{ticket.created_at}</span>
                </div>
                <h2 className="font-bold text-slate-900 text-base truncate group-hover:text-indigo-600 transition">
                  {ticket.titre}
                </h2>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline-flex items-center gap-1">
                  Priorité : <span className="text-red-600 font-bold">{ticket.priorite || 'Calcul...'}</span>
                </span>
                <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
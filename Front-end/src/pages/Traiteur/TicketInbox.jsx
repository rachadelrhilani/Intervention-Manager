import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../../Services/ticketService'; // Ajuste le chemin selon ton dossier

// Composant interne pour le compte à rebours (Re-renders isolés pour la performance)
const SlaCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft('Aucun SLA');
      return;
    }

    const calculateTime = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference <= 0) {
        setTimeLeft('SLA Dépassé');
        setIsOverdue(true);
        return;
      }
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span className={`font-mono font-bold px-2 py-1 rounded text-xs ${
      isOverdue ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-amber-100 text-amber-800'
    }`}>
      {timeLeft}
    </span>
  );
};

export default function TicketInbox() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        setLoading(true);
        const response = await ticketService.getTechInbox();
        
        // Si ton backend encapsule la collection dans un tableau 'data' : response.data
        setTickets(response.data || []);
      } catch (err) {
        setError(err.message || "Une erreur est survenue lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, []);

  const getPriorityBadge = (priorite) => {
    const styles = {
      P1: 'bg-red-600 text-white',
      P2: 'bg-orange-500 text-white',
      P3: 'bg-yellow-500 text-gray-900',
      P4: 'bg-blue-500 text-white'
    };
    return `text-xs uppercase font-extrabold px-3 py-1 rounded-full ${styles[priorite] || 'bg-gray-400 text-white'}`;
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Chargement de votre espace de travail...</div>;
  if (error) return <div className="p-6 text-center text-red-500">⚠️ Erreur : {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ma File d'Attente</h1>
          <p className="text-sm text-gray-600">Interventions synchronisées en temps réel avec le moteur IA OCP.</p>
        </div>
        <span className="bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
          {tickets.length} En cours
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600 tracking-wider">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Priorité</th>
              <th className="px-6 py-4">Sujet du Ticket</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Temps Restant (SLA)</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-500">#{ticket.id}</td>
                <td className="px-6 py-4">
                  <span className={getPriorityBadge(ticket.priorite)}>
                    {ticket.priorite}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-md truncate">
                  <div className="font-medium text-gray-900">{ticket.titre}</div>
                  <div className="text-xs text-gray-400">
                    Reçu le {new Date(ticket.created_at).toLocaleDateString('fr-FR')} à {new Date(ticket.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    ticket.type_demande === 'AvecProcedure' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {ticket.type_demande === 'AvecProcedure' ? '⚙️ Checklist' : 'Standard'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <SlaCountdown targetDate={ticket.date_resolution_sla} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => navigate(`/traiteur/ticket/${ticket.id}`)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold px-4 py-2 rounded-lg text-xs transition-colors"
                  >
                    Ouvrir & Traiter
                  </button>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500 font-medium">
                  Aucun incident à déplorer dans votre périmètre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
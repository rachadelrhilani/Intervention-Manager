import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { ArrowLeft, Send, MessageSquare, Shield, Clock, User } from 'lucide-react';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // Chargement simultané du ticket et de ses messages
      const ticketData = await ticketService.getTicketDetails(id);
      const commentsData = await ticketService.getCommentaires(id);
      setTicket(ticketData);
      setMessages(commentsData);
    } catch (err) {
      // Données de secours si votre backend n'est pas encore totalement relié
      setTicket({ id: id, titre: "Crash du logiciel de paie Sage", etat: "EnCours", urgence: 4, priorite: "P1", traiteur_nom: "Thomas (Support IT)" });
      setMessages([
        { id: 1, texte: "Bonjour Sophie, je viens de prendre en charge votre ticket. L'IA a détecté une anomalie SQL critique.", auteur_nom: "Thomas (Support IT)", auteur_role: "traiteur", est_moi: false, created_at: "10:15" },
        { id: 2, texte: "Merci Thomas ! C'est bloquant pour les salaires de ce mois-ci.", auteur_nom: "Sophie (Moi)", auteur_role: "demandeur", est_moi: true, created_at: "10:18" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Scroll automatique vers le bas à l'arrivée d'un message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await ticketService.postCommentaire(id, newMessage);
      setNewMessage('');
      loadData(); // Rafraîchit le tchat
    } catch (err) {
      // Simulation locale pour la démo
      setMessages([...messages, {
        id: Date.now(),
        texte: newMessage,
        auteur_nom: "Sophie (Moi)",
        auteur_role: "demandeur",
        est_moi: true,
        created_at: "À l'instant"
      }]);
      setNewMessage('');
    }
  };

  if (loading) return <div className="text-center py-12 font-medium text-slate-500 animate-pulse">Chargement de votre dossier de support...</div>;

  return (
    <div className="space-y-6">
      {/* Retour */}
      <button onClick={() => navigate('/client/tickets')} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
        <ArrowLeft className="h-4 w-4" /> Retour au Tableau de bord
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
          <div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">Ticket #{ticket.id}</span>
            <h1 className="text-lg font-bold text-slate-900 mt-2 leading-snug">{ticket.titre}</h1>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-3 text-sm font-medium">
            <div className="flex justify-between">
              <span className="text-slate-400 inline-flex items-center gap-1.5"><Shield className="h-4 w-4" /> Statut</span>
              <span className="text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-lg text-xs font-bold border border-indigo-100">{ticket.etat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> Priorité IA</span>
              <span className="text-red-600 font-bold">{ticket.priorite || "En cours..."}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 inline-flex items-center gap-1.5"><User className="h-4 w-4" /> Technicien</span>
              <span className="text-slate-800 font-semibold">{ticket.traiteur_nom || "Recherche d'agent..."}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[550px] overflow-hidden">
          {/* Header du tchat */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-500" />
            <h2 className="font-bold text-slate-800 text-sm">Échanges avec le support technique</h2>
          </div>

          {/* Corps : Liste des messages scrollable */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.est_moi ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                {/* Métadonnées au-dessus de la bulle */}
                <span className="text-[11px] text-slate-400 mb-1 font-semibold px-1">
                  {msg.auteur_nom} • <span className="font-normal">{msg.created_at}</span>
                </span>
                {/* La bulle de texte */}
                <div className={`p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm border ${
                  msg.est_moi 
                    ? 'bg-indigo-600 text-white border-indigo-700 rounded-tr-none' 
                    : 'bg-white text-slate-800 border-slate-200/70 rounded-tl-none'
                }`}>
                  {msg.texte}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer : Zone d'écriture et envoi */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-2 items-center">
            <input 
              type="text" required placeholder="Écrivez votre message ici..."
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition"
              value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-sm shrink-0">
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../../Services/ticketService'; // Ajuste le chemin d'accès
import { 
  Send, 
  Bot, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  User, 
  Clock, 
  ArrowLeft,
  CheckCircle2,
  Pencil,
  Trash2
} from 'lucide-react';

export default function TicketResolve() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // États de données réelles
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [checklist, setChecklist] = useState([]);
  
  // États d'interface
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  // Modification & Suppression
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    titre: '',
    description: '',
    priorite: 'P3',
    impact: 3,
    urgence: 3
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  // 1. CHARGEMENT DES DONNÉES DEPUIS LE BACK-END
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Appel de ton API via le service
        const response = await ticketService.getTicketById(id);
        
        // On s'adapte à la structure standard de ton Laravel : { status: 'success', data: {...} }
        if (response && response.status === 'success' && response.data) {
          setTicket(response.data.ticket);
          setMessages(response.data.messages || []);
          setChecklist(response.data.checklist || []);
          setEditFormData({
            titre: response.data.ticket.titre || '',
            description: response.data.ticket.description || '',
            priorite: response.data.ticket.priorite || 'P3',
            impact: response.data.ticket.impact || 3,
            urgence: response.data.ticket.urgence || 3
          });
        } else {
          throw new Error("Le format de réponse renvoyé par le serveur est incorrect.");
        }
        
      } catch (err) {
        console.error("Erreur d'acquisition du ticket :", err);
        setError(err.response?.data?.message || err.message || "Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  // Auto-scroll du tchat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gestion des clics sur la checklist (Modification locale de l'état)
  const toggleChecklist = (taskId) => {
    setChecklist(checklist.map(task => 
      task.id === taskId ? { ...task, checked: !task.checked } : task
    ));
  };

  // 2. ENVOI D'UN MESSAGE AU BACK-END
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const textToSend = newMessage;
      setNewMessage(''); // On vide l'input instantanément pour l'UX

      // Envoi asynchrone à Laravel
      const response = await ticketService.sendTicketMessage(id, textToSend);
      
      if (response && response.status === 'success') {
        // On ajoute le message retourné par le serveur (qui contient son ID bdd et son timestamp précis)
        setMessages(prev => [...prev, response.data.message]);
      }
    } catch (err) {
      console.error("Impossible d'envoyer le message :", err);
      alert("Erreur lors de l'envoi du message.");
    }
  };

  // Sécurité d'activation du bouton Clôturer
  const canResolve = checklist
    .filter(task => task.obligatoire || task.is_required) // Gère les deux dénominations
    .every(task => task.checked);

  // 3. SOUMISSION DE LA CLÔTURE AU BACK-END
  const handleMarkAsResolved = async () => {
    if (!canResolve) return;
    
    try {
      setSubmitting(true);
      
      // Envoi de la checklist mise à jour à ton contrôleur Laravel
      const response = await ticketService.resolveTicket(id, checklist);
      
      if (response && response.status === 'success') {
        alert(`Incident #${id} clôturé avec succès !`);
        navigate('/traiteur/dashboard');
      }
    } catch (err) {
      console.error("Erreur lors de la clôture du ticket :", err);
      alert(err.response?.data?.message || "Une erreur est survenue pendant la fermeture du dossier.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cet incident ?")) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await ticketService.deleteTicket(id);
      if (response && response.status === 'success') {
        alert("L'incident a été supprimé avec succès.");
        navigate('/traiteur/inbox');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Une erreur est survenue lors de la suppression.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditError(null);

    try {
      const response = await ticketService.updateTicket(id, editFormData);
      if (response && response.status === 'success') {
        // Mettre à jour l'état local du ticket avec les nouvelles valeurs retournées
        setTicket(prev => ({
          ...prev,
          titre: response.ticket.titre,
          description: response.ticket.description,
          priorite: response.ticket.priorite,
          impact: response.ticket.impact,
          urgence: response.ticket.urgence
        }));
        setIsEditModalOpen(false);
        alert("Incident mis à jour avec succès.");
      }
    } catch (err) {
      console.error(err);
      setEditError(err.message || "Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setEditSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Connexion au serveur et chargement de l'incident #{id}...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">⚠️ Erreur de chargement : {error}</div>;
  if (!ticket) return <div className="p-8 text-center text-slate-500">Aucune donnée trouvée pour cet incident.</div>;

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/traiteur/inbox')}
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-2 py-0.5 bg-red-100 text-red-700 rounded">
                {ticket.priorite}
              </span>
              <h1 className="text-xl font-bold text-slate-900">Incident #{ticket.id}</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium mt-0.5">{ticket.titre}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          {['Ouvert', 'EnCours', 'Escalade'].includes(ticket.etat) && (
            <>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-amber-700 transition cursor-pointer text-xs font-bold animate-fadeIn"
              >
                <Pencil className="h-3.5 w-3.5" />
                Modifier
              </button>
              <button
                onClick={handleDeleteTicket}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-700 transition cursor-pointer text-xs font-bold animate-fadeIn"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
              </button>
            </>
          )}
          <span className="bg-slate-200/70 px-3 py-1.5 rounded-lg border border-slate-300/40">📍 {ticket.zone}</span>
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100">⚙️ {ticket.equipement}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE : DIAGNOSTIC IA & TCHAT */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bloc Description de l'incident */}
          {ticket.description && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                Description de l'Incident
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
                {ticket.description}
              </p>
            </div>
          )}

          {/* Bloc IA Note */}
          {ticket.ia_notes && (
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="absolute right-4 top-4 bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20 text-indigo-400">
                <Bot className="h-5 w-5 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold tracking-wider uppercase text-indigo-300 flex items-center gap-2">
                Analyse & Suggestions de l'IA SmartSupport
              </h3>
              <p className="text-slate-200 text-sm mt-3 leading-relaxed font-medium">
                "{ticket.ia_notes}"
              </p>
            </div>
          )}

          {/* Module Tchat */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[450px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">Fil de discussion</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Canaux synchronisés
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                // Identifie si le message vient du technicien actuellement connecté
                // Ajuste selon le nom de la propriété du back (ex: msg.sender_role ou msg.user_id)
                const isTech = msg.sender === 'tech' || msg.sender_role === 'traiteur';
                
                return (
                  <div key={msg.id} className={`flex ${isTech ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl p-3 shadow-sm ${
                      isTech 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                    }`}>
                      <div className="flex items-center gap-1.5 text-[10px] opacity-75 font-bold mb-1">
                        <User className="h-3 w-3" />
                        {isTech ? 'Vous (Technicien)' : (msg.sender_name || 'Demandeur')}
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{msg.text || msg.content}</p>
                      <span className="block text-[9px] text-right mt-1 opacity-60 font-semibold">{msg.time || msg.created_at_formatted}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2">
              <input 
                type="text"
                placeholder="Écrivez votre message à destination du client..."
                className="flex-1 bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition shadow-md">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* COLONNE DROITE : CHECKLIST D'INTERVENTION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
              <CheckSquare className="h-5 w-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-md">Checklist de validation</h3>
            </div>
            
            <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">
              Cochez obligatoirement les points métiers pour permettre le basculement de l'équipement au statut opérationnel.
            </p>

            <div className="space-y-3">
              {checklist.map((task) => {
                const isObligatoire = task.obligatoire || task.is_required;
                return (
                  <div 
                    key={task.id}
                    onClick={() => toggleChecklist(task.id)}
                    className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                      task.checked 
                        ? 'bg-emerald-50/50 border-emerald-200/80 text-slate-700' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50'
                    }`}
                  >
                    <button className="mt-0.5 text-indigo-600 shrink-0">
                      {task.checked ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-300" />
                      )}
                    </button>
                    <div className="text-sm font-medium leading-snug">
                      {task.text || task.label}
                      {isObligatoire && (
                        <span className="inline-block text-[9px] font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 ml-1.5 rounded">
                          Obligatoire
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            {!canResolve && (
              <div className="mb-3 p-2.5 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2 text-amber-700 text-xs font-semibold">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Validation réglementaire incomplète.</span>
              </div>
            )}

            <button
              onClick={handleMarkAsResolved}
              disabled={!canResolve || submitting}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 ${
                canResolve && !submitting
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/10'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
              }`}
            >
              {submitting ? "Traitement de clôture..." : "Marquer comme Résolu"}
            </button>
          </div>
        </div>

      </div>

    {/* Modal d'édition */}
    {isEditModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-fadeIn">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-md font-bold text-slate-950">Modifier l'Incident #{ticket.id}</h3>
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
            {editError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold">
                {editError}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Titre de l'incident</label>
              <input
                type="text"
                required
                value={editFormData.titre}
                onChange={(e) => setEditFormData(prev => ({ ...prev, titre: e.target.value }))}
                className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description de l'incident</label>
              <textarea
                required
                rows={4}
                value={editFormData.description}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priorité</label>
                <select
                  value={editFormData.priorite}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, priorite: e.target.value }))}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="P1">P1 (Critique)</option>
                  <option value="P2">P2 (Haute)</option>
                  <option value="P3">P3 (Moyenne)</option>
                  <option value="P4">P4 (Basse)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Urgence</label>
                <select
                  value={editFormData.urgence}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, urgence: parseInt(e.target.value) }))}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value={1}>1 (Critique)</option>
                  <option value={2}>2 (Haute)</option>
                  <option value={3}>3 (Moyenne)</option>
                  <option value={4}>4 (Basse)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Impact</label>
                <select
                  value={editFormData.impact}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, impact: parseInt(e.target.value) }))}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value={1}>1 (Critique)</option>
                  <option value={2}>2 (Haute)</option>
                  <option value={3}>3 (Moyenne)</option>
                  <option value={4}>4 (Basse)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={editSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/10 transition disabled:opacity-50"
              >
                {editSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}
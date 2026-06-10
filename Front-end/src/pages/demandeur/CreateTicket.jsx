import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { AlertCircle, Send, ArrowLeft } from 'lucide-react';

export default function CreateTicket() {
  const [formData, setFormData] = useState({ titre: '', description: '', urgence_declaree: 2 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await ticketService.createTicket(formData);
      // Redirection vers le dashboard après succès
      navigate('/client/dashboard');
    } catch (err) {
      setError(err.message || "Impossible de soumettre le ticket.");
    } finally {
      setLoading(false);
    }
  };

  const urgences = [
    { value: 1, label: 'Faible', desc: 'Simple question ou gêne mineure.', color: 'border-slate-200 active:border-slate-500' },
    { value: 2, label: 'Moyenne', desc: 'Travail ralenti mais possible.', color: 'border-slate-200 active:border-blue-500' },
    { value: 3, label: 'Haute', desc: 'Incapable de réaliser une tâche clé.', color: 'border-slate-200 active:border-amber-500' },
    { value: 4, label: 'Critique', desc: 'Blocage total de mon activité.', color: 'border-slate-200 active:border-red-500' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Signaler un nouvel incident</h1>
          <p className="text-sm text-slate-500 mt-1">Décrivez précisément votre problème technique. Notre IA va instantanément l'analyser pour l'attribuer au bon technicien.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" /> <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Sujet résumé de l'incident</label>
            <input type="text" required placeholder="Ex: Impossible d'accéder à l'imprimante RH du 2ème étage"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
              value={formData.titre} onChange={(e) => setFormData({...formData, titre: e.target.value})} />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Description détaillée</label>
            <textarea required rows="5" placeholder="Indiquez les messages d'erreur affichés, les manipulations effectuées, et l'impact sur votre travail..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          {/* Sélecteur d'Urgence Déclarée */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Comment évaluez-vous l'urgence ?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {urgences.map((urg) => (
                <label key={urg.value} className={`border rounded-xl p-3.5 flex flex-col cursor-pointer transition select-none ${
                  formData.urgence_declaree === urg.value 
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600' 
                    : 'bg-white hover:bg-slate-50'
                }`}>
                  <input type="radio" name="urgence" value={urg.value} checked={formData.urgence_declaree === urg.value}
                    onChange={() => setFormData({...formData, urgence_declaree: urg.value})} className="sr-only" />
                  <span className="font-bold text-slate-900 text-sm">{urg.label}</span>
                  <span className="text-xs text-slate-500 mt-0.5 leading-normal">{urg.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bouton d'envoi */}
          <button type="submit" disabled={loading}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <Send className="h-4 w-4" />
            <span>{loading ? "Création en cours..." : "Envoyer la demande"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
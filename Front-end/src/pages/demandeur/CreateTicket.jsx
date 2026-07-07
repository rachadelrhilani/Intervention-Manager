import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { AlertCircle, Send, ArrowLeft, Loader2 } from 'lucide-react';

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
      navigate('/client/dashboard');
    } catch (err) {
      setError(err.message || "Impossible de soumettre le ticket. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const urgences = [
    { 
      value: 1, 
      label: 'Faible', 
      desc: 'Simple question ou gêne mineure sans blocage.', 
      badge: 'bg-slate-100 text-slate-700 ring-slate-600/10'
    },
    { 
      value: 2, 
      label: 'Moyenne', 
      desc: 'Travail ralenti mais reste globalement possible.', 
      badge: 'bg-blue-50 text-blue-700 ring-blue-600/10'
    },
    { 
      value: 3, 
      label: 'Haute', 
      desc: 'Incapable de réaliser une tâche clé de mon activité.', 
      badge: 'bg-amber-50 text-amber-700 ring-amber-600/10'
    },
    { 
      value: 4, 
      label: 'Critique', 
      desc: 'Blocage total et immédiat de mon activité.', 
      badge: 'bg-rose-50 text-rose-700 ring-rose-600/10'
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4 py-8">

      {/* Carte Principale */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 relative overflow-hidden">
        
        {/* Entête décorative subtile */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Signaler un nouvel incident</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed font-medium">
            Décrivez précisément votre problème technique. Notre <span className="text-indigo-600 font-semibold">Agent IA</span> va instantanément qualifier la demande pour la router vers le bon pôle technique.
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="p-4 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-100/80 flex gap-3 items-center animate-headShake">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" /> 
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input Sujet */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">Sujet résumé de l'incident</label>
            <input 
              type="text" 
              required 
              placeholder="Ex: Impossible d'accéder à l'imprimante RH du 2ème étage"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 focus:bg-white transition-all text-sm font-medium text-slate-800 placeholder-slate-400"
              value={formData.titre} 
              onChange={(e) => setFormData({...formData, titre: e.target.value})} 
            />
          </div>

          {/* Textarea Description */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">Description détaillée</label>
            <textarea 
              required 
              rows="5" 
              placeholder="Indiquez les messages d'erreur affichés, les manipulations effectuées, et l'impact exact sur votre poste de travail..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 focus:bg-white transition-all text-sm font-medium text-slate-800 placeholder-slate-400 resize-none leading-relaxed"
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          {/* Grille de sélection d'Urgence */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">Comment évaluez-vous l'urgence ?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {urgences.map((urg) => {
                const isSelected = formData.urgence_declaree === urg.value;
                return (
                  <label 
                    key={urg.value} 
                    className={`group/card border rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all select-none relative ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600 shadow-sm' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="urgence" 
                      value={urg.value} 
                      checked={isSelected}
                      onChange={() => setFormData({...formData, urgence_declaree: urg.value})} 
                      className="sr-only" 
                    />
                    
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-slate-900 text-sm">{urg.label}</span>
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${urg.badge}`}>
                        Niveau {urg.value}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-500 font-medium leading-normal">
                      {urg.desc}
                    </p>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Séparateur */}
          <div className="pt-4 border-t border-slate-100" />

          {/* Bouton Soumettre */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-md shadow-indigo-600/10 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
              <span>{loading ? "Calcul IA & Envoi..." : "Envoyer la demande"}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
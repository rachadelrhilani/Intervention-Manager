import React, { useState, useEffect } from 'react';
import { gestionnaireService } from '../../Services/gestionnaireService';
import { 
  Sliders, 
  Clock, 
  AlertTriangle, 
  Save, 
  CheckCircle2, 
  Info 
} from 'lucide-react';

export default function SlaConfig() {
  const [slaConfigs, setSlaConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Chargement des configurations initiales
  useEffect(() => {
    const fetchSla = async () => {
      try {
        setLoading(true);
        const data = await gestionnaireService.getSlaConfigs();
        setSlaConfigs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSla();
  }, []);

  // Gestion des changements dans les champs numériques
  const handleTimeChange = (priorite, field, value) => {
    setSlaConfigs(prevConfigs => 
      prevConfigs.map(config => 
        config.priorite === priorite 
          ? { ...config, [field]: parseInt(value) || 0 } 
          : config
      )
    );
  };

  // Soumission des modifications
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await gestionnaireService.updateSlaConfigs(slaConfigs);
      setSuccessMessage("Les seuils de temps SLA ont été mis à jour avec succès.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  // Helper pour styliser la couleur de la priorité
  const getPriorityColor = (priorite) => {
    const styles = {
      P1: 'border-l-red-600 bg-red-50/20 text-red-700',
      P2: 'border-l-orange-500 bg-orange-50/20 text-orange-700',
      P3: 'border-l-amber-500 bg-amber-50/20 text-amber-700',
      P4: 'border-l-slate-400 bg-slate-50/20 text-slate-700',
    };
    return styles[priorite] || 'border-l-slate-200';
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Extraction des configurations de l'accord de niveau de service (SLA)...</div>;
  if (error && slaConfigs.length === 0) return <div className="p-8 text-center text-red-500 font-bold">⚠️ Erreur : {error}</div>;

  return (
    <div className="bg-slate-50 min-h-screen p-6 space-y-6">
      
      {/* EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="h-7 w-7 text-indigo-600" />
            Configuration des SLA
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Définissez les limites de temps pour chaque niveau de priorité. Ces valeurs contrôlent les déclenchements d'alertes du système.
          </p>
        </div>
      </div>

      {/* ALERTES RETOUR D'INFORMATION */}
      {successMessage ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      ) : null}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* FORMULAIRE DES CRITÈRES SLA */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Grille des Priorités P1 à P4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slaConfigs.map((config) => (
            <div 
              key={config.priorite} 
              className={`bg-white border border-slate-200 border-l-4 rounded-2xl shadow-sm p-5 ${getPriorityColor(config.priorite)} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <span className="text-base font-black tracking-tight text-slate-900">
                    Priorité {config.priorite}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {config.description || `Niveau ${config.priorite}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Temps de Prise en Charge */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" /> Prise en charge
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="5"
                        required
                        value={config.temps_reponse_minutes}
                        onChange={(e) => handleTimeChange(config.priorite, 'temps_reponse_minutes', e.target.value)}
                        className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-xl pr-12 pl-3 py-2.5 focus:outline-none focus:border-indigo-500"
                      />
                      <span className="absolute right-3 text-[10px] font-bold text-slate-400">min</span>
                    </div>
                  </div>

                  {/* Temps de Résolution */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="h-3 w-3 text-indigo-400" /> Résolution Max
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="10"
                        required
                        value={config.temps_resolution_minutes}
                        onChange={(e) => handleTimeChange(config.priorite, 'temps_resolution_minutes', e.target.value)}
                        className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-xl pr-12 pl-3 py-2.5 focus:outline-none focus:border-indigo-500"
                      />
                      <span className="absolute right-3 text-[10px] font-bold text-slate-400">min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note explicative rapide en bas de carte */}
              <div className="mt-4 pt-3 border-t border-slate-50 text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                <Info className="h-3 w-3 shrink-0" />
                <span>Impacte directement l'alerte sur le tableau de bord du technicien.</span>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION ACTION COMMUNE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Assurez-vous de la cohérence des paliers de temps avant d'appliquer les modifications globales.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md shadow-indigo-600/10 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Sauvegarde globale..." : "Enregistrer les règles SLA"}
          </button>
        </div>

      </form>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { gestionnaireService } from '../../Services/gestionnaireService'; // Import du service créé ci-dessus
import { 
  TrendingUp, 
  ShieldCheck, 
  BrainCircuit, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function GestionnaireDashboard() {
  const [kpis, setKpis] = useState(null);
  const [repartition, setRepartition] = useState({});
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // On délègue totalement l'appel Axios au service
        const data = await gestionnaireService.getDashboardStats();
        
        setKpis(data.kpis);
        setRepartition(data.repartition);
        setAlertes(data.alertes);
      } catch (err) {
        console.error("Erreur composant dashboard :", err);
        setError("Impossible de charger les indicateurs de performance.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Chargement des analyses décisionnelles...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">⚠️ Erreur : {error}</div>;

  // --- TRAITEMENT DES GRAPHES (Données d'historique ou fallbacks) ---
  const dataSLA = [
    { name: 'Jan', taux: 88 }, { name: 'Fév', taux: 91 }, { name: 'Mar', taux: 85 },
    { name: 'Avr', taux: 93 }, { name: 'Mai', taux: 95 }, { name: 'Juin', taux: kpis?.taux_sla || 94 }
  ];

  const dataIA = [
    { name: 'S1', precision: 78 }, { name: 'S2', precision: 82 }, 
    { name: 'S3', precision: 85 }, { name: 'S4', precision: kpis?.precision_ia || 89 }
  ];

  const pieData = [
    { name: 'Ouverts', value: repartition.ouvert || 0, color: '#3b82f6' },
    { name: 'En Cours', value: repartition.en_cours || 0, color: '#f59e0b' },
    { name: 'Escaladés', value: repartition.escalade || 0, color: '#ef4444' },
    { name: 'Résolus/Clos', value: (repartition.resolu || 0) + (repartition.ferme || 0), color: '#10b981' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen p-6 space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-indigo-600" />
            Espace Gestionnaire
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Supervision en temps réel des engagements de service (SLA) et de l'orchestration IA.
          </p>
        </div>
        <div className="text-xs bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm text-slate-500 font-semibold">
          Mis à jour : <span className="text-indigo-600">En direct</span>
        </div>
      </div>

      {/* CARTES KPI SUPÉRIEURES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Respect global SLA</span>
            <div className="text-2xl font-black text-slate-900">{dataSLA[dataSLA.length - 1].taux}%</div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +2.4% ce mois
            </span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Précision Modèle IA</span>
            <div className="text-2xl font-black text-slate-900">{dataIA[dataIA.length - 1].precision}%</div>
            <span className="text-[11px] text-slate-500 font-medium">Sur 3 cibles de prédiction</span>
          </div>
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl border border-indigo-100">
            <BrainCircuit className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Incidents Actifs</span>
            <div className="text-2xl font-black text-slate-900">{kpis?.tickets_actifs || 0}</div>
            <span className="text-[11px] text-amber-600 font-semibold">{kpis?.tickets_en_attente || 0} en attente</span>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl border border-amber-100">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">MTTR (Temps Moyen)</span>
            <div className="text-2xl font-black text-slate-900">{kpis?.temps_resolution_moyen_h || 0}h</div>
            <span className="text-[11px] text-slate-500 font-medium">Ouverture à clôture</span>
          </div>
          <div className="bg-slate-50 text-slate-600 p-3 rounded-xl border border-slate-200">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* ZONE DES GRAPHES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Suivi de la Performance SLA</h3>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Cible : 90%</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataSLA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSla" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="taux" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSla)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Répartition des Incidents</h3>
          </div>
          <div className="h-56 w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-600 border-t border-slate-50 pt-3">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION PRÉCISION IA & ALERTES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-2">Précision de l'IA</h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataIA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Area type="monotone" dataKey="precision" stroke="#4f46e5" strokeWidth={2} fill="url(#colorIa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Alertes Majeures Non Résolues</h3>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </div>
          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
            {alertes.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-medium">Aucune alerte critique en cours.</div>
            ) : (
              alertes.map((alerte) => (
                <div key={alerte.id} className="py-2.5 flex items-center justify-between gap-4 text-xs font-medium">
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.2 rounded text-[10px]">
                        {alerte.priorite}
                      </span>
                      <span className="font-bold text-slate-800 truncate">{alerte.titre}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] truncate">{alerte.procedure}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-slate-500 font-semibold block">{alerte.cree_le}</span>
                    <span className="text-[10px] text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full font-bold mt-0.5 inline-block">
                      {alerte.etat}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
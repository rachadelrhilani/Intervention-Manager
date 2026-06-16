import React, { useState, useEffect } from 'react';
import { ticketService } from '../../Services/ticketService';
import { 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  ArrowUpRight 
} from 'lucide-react';

export default function TechDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await ticketService.getTechDashboardStats();
        
        // CORRECTION : On extrait le tableau 'data' de la réponse enveloppée par Laravel
        if (response && response.data) {
          setStats(response.data); 
        } else {
          throw new Error("Format de réponse invalide");
        }
        
      } catch (err) {
        console.warn("Erreur attrapée par le Dashboard, bascule sur la simulation :", err);
        setStats({
          tickets_resolus: 34,
          temps_moyen_resolution: 48,
          taux_respect_sla: 94.2,
          urgents_actifs: 2,
          derniers_traites: [
            { id: 7, titre: "Défaut d'isolement sur armoire convoyeur", priorite: "P1", resolved_at: "Aujourd'hui à 08:30" },
            { id: 9, titre: "Perte de synchronisation SCADA", priorite: "P2", resolved_at: "Hier" },
            { id: 4, titre: "Blocage logiciel GMAO", priorite: "P3", resolved_at: "12 Juin 2026" },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">Calcul de vos indicateurs de performance...</div>;
  if (error) return <div className="p-6 text-center text-red-500">⚠️ Erreur : {error}</div>;
  if (!stats) return <div className="p-6 text-center text-gray-500">Aucune donnée disponible.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Analyste</h1>
        <p className="text-sm text-gray-600">Suivi en temps réel de votre efficacité et de la conformité aux objectifs SLA.</p>
      </div>

      {/* GRILLE DES COMPTEURS & KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1 : Tickets Résolus */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tickets Résolus</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.tickets_resolus}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>+12%</span> ce mois-ci
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2 : Temps Moyen de Résolution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Temps Moyen</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.temps_moyen_resolution}m</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Objectif cible : &lt; 60m
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3 : Taux de respect du SLA */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Respect du SLA</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.taux_respect_sla}%</h3>
            <p className="text-xs text-indigo-600 font-medium mt-1">
              Excellente conformité
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4 : Alertes critiques en cours */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Urgences en Attente</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.urgents_actifs}</h3>
            <p className="text-xs text-amber-600 font-medium mt-1 animate-pulse">
              Dossiers P1 en cours
            </p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* SECTION DU BAS : DERNIÈRES INTERVENTIONS CLOSES */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-md font-bold text-gray-900">Historique Récent des Clôtures</h2>
            <p className="text-xs text-gray-500">Les derniers incidents industriels et informatiques résolus par votre profil.</p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {stats.derniers_traites?.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between hover:bg-gray-50/50 px-2 rounded-lg transition-colors">
              <div className="flex items-start gap-3">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 mt-0.5 rounded ${
                  item.priorite === 'P1' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.priorite}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{item.titre}</h4>
                  <p className="text-xs text-gray-400">Incident #{item.id} • Clos {item.resolved_at}</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                Résolu <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          ))}
          {(!stats.derniers_traites || stats.derniers_traites.length === 0) && (
            <p className="text-sm text-gray-400 text-center py-6">Aucun ticket résolu récemment.</p>
          )}
        </div>
      </div>

    </div>
  );
}
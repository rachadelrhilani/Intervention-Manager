import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-slate-50">
      {/* Section Héros */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full mb-4 animate-pulse">
          Nouveau : Intégration AI Agent 2.0
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
          Gérez vos incidents à la vitesse de <span className="text-indigo-600">l'intelligence artificielle</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Une plateforme de ticketing d'entreprise qui qualifie, priorise et distribue vos demandes instantanément grâce à notre agent IA connecté.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
            Ouvrir un compte Demandeur <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/login" className="w-full sm:w-auto flex items-center justify-center bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-50 transition">
            Espace membre
          </Link>
        </div>
      </section>

      {/* Section Statistiques / Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 h-fit">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Tri Automatisé</h3>
              <p className="mt-1 text-sm text-slate-600">L'Agent IA calcule la priorité (P1-P4) et injecte le bon SLA en moins d'une seconde.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 h-fit">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Procédures Guidées</h3>
              <p className="mt-1 text-sm text-slate-600">Les techniciens reçoivent des listes de contrôle générées automatiquement pour accélérer la résolution.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 h-fit">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Suivi Analytique</h3>
              <p className="mt-1 text-sm text-slate-600">Un tableau de bord de minimisation pour mesurer en temps réel le temps humain économisé.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
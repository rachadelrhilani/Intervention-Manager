import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  ArrowRight, 
  Cpu, 
  CheckCircle2, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import loginBackground from '../../assets/login-background.jpeg';

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ==========================================
          SECTION HÉROS (Avec Arrière-plan Flouté)
         ========================================== */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 border-b border-slate-200/50">
        {/* Image d'arrière-plan floutée masquée par un dégradé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 filter blur-lg opacity-40 pointer-events-none"
          style={{ backgroundImage: `url(${loginBackground})` }}
        />
        {/* Dégradé de fondu pour lisser l'image avec le fond de page */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-none">
            Gérez vos incidents à la vitesse de <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              l'intelligence artificielle
            </span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Une plateforme de ticketing d'entreprise de nouvelle génération qui qualifie, priorise et distribue vos demandes instantanément grâce à notre agent intelligent.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto sm:max-w-none">
            <Link to="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98]">
              Ouvrir un compte Demandeur <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto flex items-center justify-center bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all active:scale-[0.98]">
              Espace membre
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION FONCTIONNALITÉS (Features)
         ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm flex gap-4 hover:border-indigo-200 transition-all group">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl h-fit group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">Tri Automatisé</h3>
              <p className="text-xs text-slate-600 leading-relaxed">L'Agent IA calcule la priorité d'incident (P1-P4) et injecte le bon contrat de SLA en moins d'une seconde.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm flex gap-4 hover:border-emerald-200 transition-all group">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl h-fit group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">Procédures Guidées</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Les techniciens reçoivent des listes de contrôle de résolutions générées sur-mesure pour abréger le MTTR.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm flex gap-4 hover:border-amber-200 transition-all group">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl h-fit group-hover:scale-110 transition-transform">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">Suivi Analytique</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Un dashboard d'exploitation complet pour mesurer en temps réel le temps de traitement et la charge des équipes.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          SECTION WORKFLOW / COMMENT ÇA MARCHE
         ========================================== */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-black tracking-widest text-indigo-400 uppercase">Cycle Intelligent</h2>
            <p className="text-2xl sm:text-3xl font-black tracking-tight">Comment fonctionne notre Agent IA ?</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Étape 1 */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl space-y-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-xs">01</div>
              <h4 className="font-bold text-base">Analyse sémantique</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Le demandeur décrit sa panne en langage naturel. L'IA extrait le contexte, détecte la gravité et valide l'application impactée.</p>
            </div>

            {/* Étape 2 */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl space-y-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-xs">02</div>
              <h4 className="font-bold text-base">Aiguillage & Routage</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Le ticket est automatiquement assigné au technicien (traiteur) spécialisé. En cas d'erreur, le traiteur dispose d'un bouton d'escalade.</p>
            </div>

            {/* Étape 3 */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl space-y-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-xs">03</div>
              <h4 className="font-bold text-base">Résolution Assistée</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Une checklist de diagnostic personnalisée est injectée sur le terminal du traiteur, assurant un traitement normé et rapide.</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
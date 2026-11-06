import React, { useState } from 'react';
import {
  Library,
  Search,
  BookOpen,
  ExternalLink,
  Bell,
  CheckCircle2,
  Calendar,
  Award,
  Sparkles
} from 'lucide-react';
import { SCIENTIFIC_LIBRARY_DATABASE } from '../services/libraryData';
import { NotificationService } from '../services/notificationService';
import { ScientificArticle } from '../types/medical';

export const ScientificLibraryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [alertSuccessId, setAlertSuccessId] = useState<string | null>(null);

  const themes = Array.from(new Set(SCIENTIFIC_LIBRARY_DATABASE.map(a => a.thematique)));

  const filteredArticles = SCIENTIFIC_LIBRARY_DATABASE.filter(art => {
    const matchesSearch =
      art.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.resume.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.auteurs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.conclusionsCles.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTheme = selectedTheme === 'all' || art.thematique === selectedTheme;
    return matchesSearch && matchesTheme;
  });

  const handleCreateAlert = (art: ScientificArticle) => {
    NotificationService.addNotification({
      titre: `Alerte Veille Scientifique : ${art.thematique}`,
      message: `Directive récente : "${art.titre}" (${art.revue}).`,
      categorie: 'PUBLICATION',
      priorite: 'NORMALE',
      lienTab: 'bibliotheque'
    });

    setAlertSuccessId(art.id);
    setTimeout(() => setAlertSuccessId(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Library className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            Bibliothèque Scientifique Actualisée & Directives OMS
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Dernières recommandations basées sur les preuves (EBM), synthèses d'essais cliniques majeurs et protocoles OMS 2024–2026.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par mot-clé, auteur, protocole (ex: Artésunate, Sepsis, Choléra, Hémorragie...)..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
          className="w-full sm:w-auto text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
        >
          <option value="all">Toutes les thématiques ({SCIENTIFIC_LIBRARY_DATABASE.length})</option>
          {themes.map(th => (
            <option key={th} value={th}>{th}</option>
          ))}
        </select>
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        {filteredArticles.map(art => (
          <div
            key={art.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {art.thematique}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {art.datePublication}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {art.titre}
                </h2>
                <p className="text-xs text-slate-500 mt-1 italic">
                  {art.auteurs} — <strong className="text-slate-700 dark:text-slate-300 font-semibold">{art.revue}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {art.impactScore}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {art.resume}
            </p>

            {/* Key Findings Bullet List */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Conclusions Pratiques & Recommandations Clés :
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {art.conclusionsCles.map((conc, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2">
                    <span className="text-sky-500 font-bold shrink-0">•</span>
                    <span>{conc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={art.urlReference}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
              >
                <span>Accéder à la directive complète</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleCreateAlert(art)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
              >
                {alertSuccessId === art.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Alerte Enregistrée !</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5 text-slate-500" />
                    <span>Créer une Alerte de Veille</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

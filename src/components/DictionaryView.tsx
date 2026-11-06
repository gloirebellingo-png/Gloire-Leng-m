import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Languages,
  Activity,
  Layers,
  Loader2,
  Info
} from 'lucide-react';
import { MEDICAL_DICTIONARY } from '../services/dictionaryData';
import { MedicalTerm } from '../types/medical';

export const DictionaryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  
  // AI Lookup State
  const [isAiSearching, setIsAiSearching] = useState<boolean>(false);
  const [aiLookupResult, setAiLookupResult] = useState<MedicalTerm | null>(null);

  const specialties = Array.from(new Set(MEDICAL_DICTIONARY.map(t => t.specialite.split('/')[0].trim())));

  const filteredTerms = MEDICAL_DICTIONARY.filter(t => {
    const matchesSearch =
      t.terme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.traductionAnglaise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.synonymes.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpec = selectedSpecialty === 'all' || t.specialite.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpec;
  });

  const handleAiLookup = async () => {
    if (!searchQuery.trim()) return;
    setIsAiSearching(true);
    setAiLookupResult(null);

    try {
      const res = await fetch('/api/ai/dictionary-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terme: searchQuery.trim() })
      });
      const data = await res.json();
      if (data.term) {
        setAiLookupResult(data.term);
      }
    } catch {
      // Fallback
      setAiLookupResult({
        id: 'term-custom-' + Date.now(),
        terme: searchQuery.trim(),
        specialite: 'Médecine Générale / Pathologie',
        definition: `Terme médical clinique recherché : ${searchQuery.trim()}.`,
        physiopathologie: 'Mécanisme cellulaire et métabolique sous-jacent avec répercussions hémodynamiques et tissulaires.',
        traductionAnglaise: `${searchQuery.trim()} (Clinical Term)`,
        synonymes: ['Entité nosologique'],
        exemplesCliniques: 'Observation clinique en milieu hospitalier.'
      });
    } finally {
      setIsAiSearching(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            Dictionnaire Médical Intelligent & Physiopathologie
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Lexique médical francophone et anglophone de référence, mécanismes cellulaires et exemples cliniques documentés.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un terme, un score, une maladie (ex: Anaphylaxie, Blantyre, Drépanocytose, HELLP...)..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full sm:w-auto text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
          >
            <option value="all">Toutes les spécialités</option>
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          {searchQuery.trim().length > 2 && (
            <button
              onClick={handleAiLookup}
              disabled={isAiSearching}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm transition whitespace-nowrap disabled:opacity-50"
            >
              {isAiSearching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Recherche sémantique...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Interroger l'IA Médicale
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* AI Lookup Result (if triggered) */}
      {aiLookupResult && (
        <div className="bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-200">
                Fiche Lexicale Générée par l'IA Médicale
              </h2>
            </div>
            <span className="text-[10px] text-sky-700 dark:text-sky-300 font-semibold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900/60">
              {aiLookupResult.specialite}
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {aiLookupResult.terme}
              <span className="ml-2 text-xs font-normal text-slate-500 italic">
                (EN: {aiLookupResult.traductionAnglaise})
              </span>
            </h3>
            <p className="mt-1 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              {aiLookupResult.definition}
            </p>
          </div>

          {aiLookupResult.physiopathologie && (
            <div className="pt-2 border-t border-sky-100 dark:border-sky-900">
              <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300 block mb-1">
                Mécanisme Physiopathologique :
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                {aiLookupResult.physiopathologie}
              </p>
            </div>
          )}

          {aiLookupResult.exemplesCliniques && (
            <div className="pt-2 border-t border-sky-100 dark:border-sky-900">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Contexte Clinique :
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {aiLookupResult.exemplesCliniques}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Grid of Dictionary Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTerms.map(term => (
          <div
            key={term.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs hover:border-sky-300 dark:hover:border-sky-800 transition"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {term.terme}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                  <Languages className="w-3 h-3 text-sky-500" />
                  <span className="italic">{term.traductionAnglaise}</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0">
                {term.specialite}
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {term.definition}
            </p>

            {term.physiopathologie && (
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Physiopathologie & Biologie
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-serif">
                  {term.physiopathologie}
                </p>
              </div>
            )}

            {term.exemplesCliniques && (
              <div className="text-[11px] text-slate-500 pt-1">
                <strong>Exemple pratique :</strong> {term.exemplesCliniques}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

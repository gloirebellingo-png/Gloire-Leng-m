import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle,
  DownloadCloud,
  AlertTriangle,
  BookmarkCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { RDC_PROTOCOLS_DATABASE } from '../services/rdcProtocolsData';
import { RdcProtocol } from '../types/medical';

export const RdcProtocolsView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TOUS');
  const [activeProtoId, setActiveProtoId] = useState<string>('rdc-paludisme-pnlp');
  const [downloadedOffline, setDownloadedOffline] = useState<{ [id: string]: boolean }>({
    'rdc-paludisme-pnlp': true,
    'rdc-tuberculose-pnt': true,
    'rdc-cholera-minsante': true
  });

  const categories = ['TOUS', 'Paludisme', 'Tuberculose', 'VIH', 'Choléra', 'Drépanocytose', 'Malnutrition'];

  const filteredProtocols = RDC_PROTOCOLS_DATABASE.filter(p => {
    const matchesCat = selectedCategory === 'TOUS' || p.categorie === selectedCategory;
    const matchesSearch =
      p.titre.toLowerCase().includes(search.toLowerCase()) ||
      p.resume.toLowerCase().includes(search.toLowerCase()) ||
      p.organisme.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeProto = RDC_PROTOCOLS_DATABASE.find(p => p.id === activeProtoId) || RDC_PROTOCOLS_DATABASE[0];

  const toggleDownload = (id: string) => {
    setDownloadedOffline(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span>Directives Nationales RDC & Recommandations OMS</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Protocoles officiels vérifiés du Ministère de la Santé Publique de la RDC et de l'Organisation Mondiale de la Santé.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-1.5">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Cache Hors-ligne Actif</span>
          </span>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher un protocole..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Protocols list */}
        <div className="lg:col-span-5 space-y-3">
          {filteredProtocols.map((proto) => {
            const isSelected = proto.id === activeProtoId;
            const isSaved = !!downloadedOffline[proto.id];
            return (
              <div
                key={proto.id}
                onClick={() => setActiveProtoId(proto.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 text-left ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-300 dark:border-sky-800 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    {proto.categorie} · {proto.organisme}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Rév. {proto.derniereRevision}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {proto.titre}
                </h3>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {proto.resume}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    {isSaved ? 'Téléchargé (Offline)' : 'Disponible'}
                  </span>
                  <span className="text-xs text-sky-600 dark:text-sky-400 flex items-center gap-0.5 font-semibold">
                    <span>Consulter</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Protocol View */}
        <div className="lg:col-span-7">
          {activeProto ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    {activeProto.organisme}
                  </span>
                  <button
                    onClick={() => toggleDownload(activeProto.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition text-xs font-medium"
                  >
                    <DownloadCloud className="w-3.5 h-3.5 text-sky-500" />
                    <span>{downloadedOffline[activeProto.id] ? 'Stocké Hors-Ligne' : 'Sauvegarder Hors-Ligne'}</span>
                  </button>
                </div>

                <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  {activeProto.titre}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {activeProto.resume}
                </p>
              </div>

              {/* Signes d'alerte */}
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
                <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Signes de Danger et d'Alerte RDC / OMS :</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-rose-900 dark:text-rose-200">
                  {activeProto.signesAlertes.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Algorithme décisionnel */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Algorithme Décisionnel Séquentiel :
                </span>
                <div className="space-y-1.5">
                  {activeProto.algorithmeDecision.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Traitements Ligne 1 & 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-sky-600 dark:text-sky-400 block">
                    Traitement de Première Intention (Ligne 1) :
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeProto.traitementLigne1}
                  </p>
                </div>

                {activeProto.traitementLigne2 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">
                      Traitement de Forme Grave ou 2ème Ligne :
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeProto.traitementLigne2}
                    </p>
                  </div>
                )}
              </div>

              {/* Posologies clés & Prévention */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  Mesures Préventives & Santé Publique Associées :
                </span>
                <ul className="list-disc list-inside space-y-1 text-emerald-900 dark:text-emerald-200">
                  {activeProto.mesuresPrevention.map((prev, i) => (
                    <li key={i}>{prev}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>Dernière révision validée : {activeProto.derniereRevision}</span>
                <span>Conforme directives PNLP/PNT/PNLS</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Sélectionnez un protocole.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

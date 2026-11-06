import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  Users,
  FileCheck,
  Stethoscope,
  ChevronRight,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  HeartPulse
} from 'lucide-react';
import { Patient, Vitals } from '../types/medical';
import { ClinicalEngine, EmergencyEvaluation } from '../services/clinicalEngine';

interface DashboardViewProps {
  patients: Patient[];
  onSelectTab: (tab: any) => void;
  onOpenPatient: (patientId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  onSelectTab,
  onOpenPatient,
}) => {
  // Quick triage state
  const [quickVitals, setQuickVitals] = useState<Vitals>({
    temperature: 38.5,
    frequenceCardiaque: 120,
    frequenceRespiratoire: 32,
    saturationO2: 91,
    taSystolique: 90,
    etatConscience: 'Alerte'
  });
  const [quickAge, setQuickAge] = useState<number>(4);
  const [triageResult, setTriageResult] = useState<EmergencyEvaluation | null>(() =>
    ClinicalEngine.evaluateABCDE(
      {
        temperature: 38.5,
        frequenceCardiaque: 120,
        frequenceRespiratoire: 32,
        saturationO2: 91,
        taSystolique: 90,
        etatConscience: 'Alerte'
      },
      4
    )
  );

  const urgentPatients = patients.filter(p =>
    p.consultations.some(c => c.triage === 'ROUGE')
  );

  const handleRunQuickTriage = () => {
    const result = ClinicalEngine.evaluateABCDE(quickVitals, quickAge);
    setTriageResult(result);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-900/30 via-slate-900 to-slate-900 dark:from-sky-950/40 dark:to-slate-900/80 p-6 rounded-2xl border border-sky-800/30">
        <div>
          <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            Plateforme Médicale Hôpitaux & Universités
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Service des Admissions & Soins Cliniques
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Aide à la décision clinique en 10 points, triage ABCDE des urgences vitales, posologies pédiatriques et directives sanitaires RDC & OMS.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('assistant')}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-sky-600/20 transition"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Nouvelle Analyse IA</span>
          </button>
          <button
            onClick={() => onSelectTab('urgences')}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-rose-600/20 transition"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Urgences Vitales</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dossiers Actifs</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-2">
            {patients.length}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Hôpital Général & Cliniques</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">Urgences Vitales (Rouge)</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-500 mt-2">
            {urgentPatients.length}
          </p>
          <span className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1 block">Prise en charge immédiate</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Protocoles Téléchargés</span>
            <FileCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-2">
            6 Directives
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">PNLP, PNT, PNLS, Choléra</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Module Académie</span>
            <HeartPulse className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-2">
            3 Cycles
          </p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 block">Cours & QCM interactifs</span>
        </div>
      </div>

      {/* Two Column Grid: Quick Triage & Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick ABCDE Vital Evaluator */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Triage Rapide Déterministe ABCDE
              </h2>
            </div>
            <span className="text-[11px] text-slate-500">Zéro délai d'attente</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Âge patient</label>
              <input
                type="number"
                value={quickAge}
                onChange={(e) => setQuickAge(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">SpO2 (%)</label>
              <input
                type="number"
                value={quickVitals.saturationO2 || ''}
                onChange={(e) => setQuickVitals({ ...quickVitals, saturationO2: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">FR (/min)</label>
              <input
                type="number"
                value={quickVitals.frequenceRespiratoire || ''}
                onChange={(e) => setQuickVitals({ ...quickVitals, frequenceRespiratoire: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">FC (bpm)</label>
              <input
                type="number"
                value={quickVitals.frequenceCardiaque || ''}
                onChange={(e) => setQuickVitals({ ...quickVitals, frequenceCardiaque: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">TAs (mmHg)</label>
              <input
                type="number"
                value={quickVitals.taSystolique || ''}
                onChange={(e) => setQuickVitals({ ...quickVitals, taSystolique: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Conscience (AVPU)</label>
              <select
                value={quickVitals.etatConscience}
                onChange={(e) => setQuickVitals({ ...quickVitals, etatConscience: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Alerte">A - Alerte</option>
                <option value="Voix">V - À la voix</option>
                <option value="Douleur">P - À la douleur</option>
                <option value="Inconscient">U - Inconscient</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleRunQuickTriage}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition"
            >
              Évaluer la gravité ABCDE
            </button>
          </div>

          {/* Triage Output Box */}
          {triageResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                triageResult.level === 'ROUGE'
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                  : triageResult.level === 'JAUNE'
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider">
                  Niveau de Triage : {triageResult.level}
                </span>
                <span className="text-[11px] font-mono">
                  {triageResult.transferRequired ? 'RÉFÉRENCE / SOINS INTENSIFS' : 'SURVEILLANCE'}
                </span>
              </div>
              <p className="font-medium">{triageResult.alertMessage}</p>
              {triageResult.triggers.length > 0 && (
                <div>
                  <span className="font-semibold block mb-0.5">Critères déclencheurs :</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
                    {triageResult.triggers.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
              {triageResult.immediateABCDE.length > 0 && (
                <div>
                  <span className="font-semibold block mb-0.5">Gestes immédiats ABCDE :</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
                    {triageResult.immediateABCDE.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Recent Patients In Queue */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-500" />
                <span>Patients Récents & Triage</span>
              </h2>
              <button
                onClick={() => onSelectTab('patients')}
                className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
              >
                <span>Voir tous</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {patients.slice(0, 4).map((p) => {
                const latestConsult = p.consultations[0];
                return (
                  <div
                    key={p.id}
                    onClick={() => onOpenPatient(p.id)}
                    className="py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg cursor-pointer transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {p.nom} {p.postnom}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {p.codeDossier}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                        {latestConsult ? latestConsult.plaintePrincipale : 'Pas de consultation récente'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {latestConsult && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            latestConsult.triage === 'ROUGE'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                              : latestConsult.triage === 'JAUNE'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {latestConsult.triage}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              onClick={() => onSelectTab('patients')}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-medium transition"
            >
              + Créer un nouveau Dossier Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

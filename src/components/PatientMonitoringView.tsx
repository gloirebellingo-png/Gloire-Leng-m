import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  Droplets,
  AlertTriangle,
  Clock,
  Plus,
  Bell,
  ShieldCheck,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { NotificationService } from '../services/notificationService';
import { PatientMonitoringPoint } from '../types/medical';

// Calculate MEWS score according to international resuscitation standards
function computeMEWS(
  fc: number,
  pas: number,
  fr: number,
  temp: number,
  avpu: 'A' | 'V' | 'P' | 'U'
): number {
  let score = 0;

  // Heart Rate
  if (fc < 40) score += 3;
  else if (fc <= 50) score += 1;
  else if (fc <= 100) score += 0;
  else if (fc <= 110) score += 1;
  else if (fc <= 129) score += 2;
  else score += 3;

  // Systolic Blood Pressure
  if (pas < 70) score += 3;
  else if (pas <= 80) score += 2;
  else if (pas <= 100) score += 1;
  else if (pas <= 199) score += 0;
  else score += 2;

  // Respiratory Rate
  if (fr < 9) score += 2;
  else if (fr <= 14) score += 0;
  else if (fr <= 20) score += 1;
  else if (fr <= 29) score += 2;
  else score += 3;

  // Temperature
  if (temp < 35.0) score += 2;
  else if (temp <= 38.4) score += 0;
  else score += 2;

  // Neurological AVPU
  if (avpu === 'A') score += 0;
  else if (avpu === 'V') score += 1;
  else if (avpu === 'P') score += 2;
  else if (avpu === 'U') score += 3;

  return score;
}

export const PatientMonitoringView: React.FC = () => {
  const patients = StorageService.getPatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'MED-2026-001');

  // Initial timeline points for selected patient
  const [points, setPoints] = useState<PatientMonitoringPoint[]>([
    {
      id: 'pt-1',
      patientId: patients[0]?.id || 'MED-2026-001',
      timestamp: '08:00',
      temperature: 39.4,
      frequenceCardiaque: 124,
      frequenceRespiratoire: 28,
      saturationO2: 91,
      taSystolique: 92,
      taDiastolique: 58,
      glycemie: 104,
      scoreMews: 5
    },
    {
      id: 'pt-2',
      patientId: patients[0]?.id || 'MED-2026-001',
      timestamp: '10:00',
      temperature: 38.8,
      frequenceCardiaque: 112,
      frequenceRespiratoire: 24,
      saturationO2: 94,
      taSystolique: 102,
      taDiastolique: 64,
      glycemie: 110,
      scoreMews: 3
    },
    {
      id: 'pt-3',
      patientId: patients[0]?.id || 'MED-2026-001',
      timestamp: '12:00',
      temperature: 38.2,
      frequenceCardiaque: 98,
      frequenceRespiratoire: 20,
      saturationO2: 97,
      taSystolique: 115,
      taDiastolique: 72,
      glycemie: 118,
      scoreMews: 1
    },
    {
      id: 'pt-4',
      patientId: patients[0]?.id || 'MED-2026-001',
      timestamp: '14:00',
      temperature: 37.6,
      frequenceCardiaque: 86,
      frequenceRespiratoire: 18,
      saturationO2: 98,
      taSystolique: 120,
      taDiastolique: 76,
      glycemie: 112,
      scoreMews: 0
    }
  ]);

  // Form for new observation
  const [newTemp, setNewTemp] = useState<number>(37.4);
  const [newFc, setNewFc] = useState<number>(84);
  const [newFr, setNewFr] = useState<number>(18);
  const [newSpo2, setNewSpo2] = useState<number>(98);
  const [newPas, setNewPas] = useState<number>(120);
  const [newPad, setNewPad] = useState<number>(78);
  const [newGlycemie, setNewGlycemie] = useState<number>(105);
  const [newAvpu, setNewAvpu] = useState<'A' | 'V' | 'P' | 'U'>('A');

  const [reminderSetMessage, setReminderSetMessage] = useState<string | null>(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const lastPoint = points[points.length - 1];
  const currentMews = lastPoint ? lastPoint.scoreMews : 0;

  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const mews = computeMEWS(newFc, newPas, newFr, newTemp, newAvpu);

    const newPt: PatientMonitoringPoint = {
      id: 'pt-' + Date.now(),
      patientId: selectedPatientId,
      timestamp: timeStr,
      temperature: newTemp,
      frequenceCardiaque: newFc,
      frequenceRespiratoire: newFr,
      saturationO2: newSpo2,
      taSystolique: newPas,
      taDiastolique: newPad,
      glycemie: newGlycemie,
      scoreMews: mews
    };

    setPoints([...points, newPt]);

    // Notify if high score
    if (mews >= 4) {
      NotificationService.addNotification({
        titre: `Alerte Dégradation MEWS : Score ${mews}/14`,
        message: `Patient ${selectedPatient?.codeDossier || 'en soins'} : Aggravation des constantes vitales nécessitant réévaluation médicale immédiate.`,
        categorie: 'PATIENT',
        priorite: 'URGENTE',
        lienTab: 'monitoring'
      });
    }
  };

  const scheduleReminder = (minutes: number) => {
    const timeLabel = minutes >= 60 ? `${minutes / 60} heure(s)` : `${minutes} minutes`;
    NotificationService.addNotification({
      titre: `Rappel de surveillance — Contrôle dans ${timeLabel}`,
      message: `Contrôle planifié des constantes vitales pour le dossier ${selectedPatient?.codeDossier || 'patient'}.`,
      categorie: 'RAPPEL',
      priorite: 'NORMALE',
      lienTab: 'monitoring'
    });

    setReminderSetMessage(`Rappel de surveillance programmé pour dans ${timeLabel}.`);
    setTimeout(() => setReminderSetMessage(null), 4000);
  };

  // Helper SVG Polyline coordinate generator
  const getSvgPoints = (data: number[], minVal: number, maxVal: number, height = 70, width = 360) => {
    if (data.length <= 1) return `0,${height / 2} ${width},${height / 2}`;
    const step = width / (data.length - 1);
    const range = Math.max(maxVal - minVal, 1);
    return data.map((val, idx) => {
      const x = idx * step;
      const normalized = (val - minVal) / range;
      const y = height - (normalized * (height - 16) + 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            Surveillance & Suivi des Patients — Score MEWS
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Monitoring longitudinal des constantes vitales, détection précoce de la dégradation clinique et alertes programmées.
          </p>
        </div>

        {/* Patient Picker */}
        <div className="flex items-center gap-3">
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.codeDossier} — {p.nom} {p.postnom} ({p.ageAns} ans)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Banner: Real-time MEWS Score Status */}
      <div className={`p-5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition ${
        currentMews >= 5
          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-100'
          : currentMews >= 3
          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-100'
          : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold font-mono text-xl shrink-0 shadow-sm ${
            currentMews >= 5 ? 'bg-rose-600 text-white' : currentMews >= 3 ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            <span>{currentMews}</span>
            <span className="text-[9px] font-sans font-medium uppercase tracking-tight">MEWS</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold">
                {currentMews >= 5
                  ? 'ALERTE CRITIQUE : Risque de défaillance multiviscérale'
                  : currentMews >= 3
                  ? 'SURVEILLANCE RAPPROCHÉE : Dégradation hémodynamique modérée'
                  : 'STABILITÉ CLINIQUE : Paramètres dans les limites de tolérance'}
              </h2>
            </div>
            <p className="text-xs mt-0.5 opacity-90">
              {currentMews >= 5
                ? 'Conduite à tenir : Appel médecin urgent, pose VVP gros calibre, oxygénothérapie à haut débit, préparation transfert USI/Soins intensifs.'
                : currentMews >= 3
                ? 'Conduite à tenir : Contrôle horaire des constantes vitales, avertir le médecin de garde, contrôler gazométrie et ionogramme.'
                : 'Conduite à tenir : Poursuite de la surveillance standard selon protocole de service (toutes les 4 à 6 heures).'}
            </p>
          </div>
        </div>

        {/* Schedule reminder buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold mr-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Programmer contrôle :
          </span>
          <button
            onClick={() => scheduleReminder(15)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/80 dark:bg-slate-900/80 hover:bg-white border border-slate-200 dark:border-slate-800 shadow-xs transition"
          >
            15 min
          </button>
          <button
            onClick={() => scheduleReminder(60)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/80 dark:bg-slate-900/80 hover:bg-white border border-slate-200 dark:border-slate-800 shadow-xs transition"
          >
            1 heure
          </button>
          <button
            onClick={() => scheduleReminder(240)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/80 dark:bg-slate-900/80 hover:bg-white border border-slate-200 dark:border-slate-800 shadow-xs transition"
          >
            4 heures
          </button>
        </div>
      </div>

      {reminderSetMessage && (
        <div className="p-3 bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 rounded-lg text-xs text-sky-800 dark:text-sky-200 flex items-center gap-2">
          <Bell className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>{reminderSetMessage}</span>
        </div>
      )}

      {/* Longitudinal Vital Trends Cards (SVG charts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Température */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <span>Température</span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
              {lastPoint?.temperature.toFixed(1)} °C
            </span>
          </div>
          <svg viewBox="0 0 360 70" className="w-full h-16 stroke-rose-500 fill-none stroke-2">
            <polyline points={getSvgPoints(points.map(p => p.temperature), 36.0, 40.5, 70, 360)} />
          </svg>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{points[0]?.timestamp}</span>
            <span>{points[points.length - 1]?.timestamp}</span>
          </div>
        </div>

        {/* 2. Fréquence Cardiaque */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Heart className="w-4 h-4 text-sky-500" />
              <span>Fréquence Cardiaque</span>
            </div>
            <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
              {lastPoint?.frequenceCardiaque} bpm
            </span>
          </div>
          <svg viewBox="0 0 360 70" className="w-full h-16 stroke-sky-500 fill-none stroke-2">
            <polyline points={getSvgPoints(points.map(p => p.frequenceCardiaque), 50, 140, 70, 360)} />
          </svg>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{points[0]?.timestamp}</span>
            <span>{points[points.length - 1]?.timestamp}</span>
          </div>
        </div>

        {/* 3. Pression Artérielle */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Pression Artérielle</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {lastPoint?.taSystolique}/{lastPoint?.taDiastolique} mmHg
            </span>
          </div>
          <svg viewBox="0 0 360 70" className="w-full h-16 stroke-emerald-500 fill-none stroke-2">
            <polyline points={getSvgPoints(points.map(p => p.taSystolique), 80, 160, 70, 360)} />
          </svg>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{points[0]?.timestamp}</span>
            <span>{points[points.length - 1]?.timestamp}</span>
          </div>
        </div>

        {/* 4. Saturation O2 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Wind className="w-4 h-4 text-indigo-500" />
              <span>Saturation O2</span>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {lastPoint?.saturationO2} %
            </span>
          </div>
          <svg viewBox="0 0 360 70" className="w-full h-16 stroke-indigo-500 fill-none stroke-2">
            <polyline points={getSvgPoints(points.map(p => p.saturationO2), 85, 100, 70, 360)} />
          </svg>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{points[0]?.timestamp}</span>
            <span>{points[points.length - 1]?.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Grid: Observation Input Form + Historical Timeline Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: Add New Observation */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Nouvelle Mesure
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Maintenant</span>
          </div>

          <form onSubmit={handleAddPoint} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  Température (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newTemp}
                  onChange={(e) => setNewTemp(parseFloat(e.target.value) || 37.0)}
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  Pouls (FC bpm)
                </label>
                <input
                  type="number"
                  value={newFc}
                  onChange={(e) => setNewFc(parseInt(e.target.value) || 80)}
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  Fréq. Resp. (cpm)
                </label>
                <input
                  type="number"
                  value={newFr}
                  onChange={(e) => setNewFr(parseInt(e.target.value) || 16)}
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  value={newSpo2}
                  onChange={(e) => setNewSpo2(parseInt(e.target.value) || 98)}
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  PA Systolique (mmHg)
                </label>
                <input
                  type="number"
                  value={newPas}
                  onChange={(e) => setNewPas(parseInt(e.target.value) || 120)}
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  PA Diastolique (mmHg)
                </label>
                <input
                  type="number"
                  value={newPad}
                  onChange={(e) => setNewPad(parseInt(e.target.value) || 80)}
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  Glycémie (mg/dL)
                </label>
                <input
                  type="number"
                  value={newGlycemie}
                  onChange={(e) => setNewGlycemie(parseInt(e.target.value) || 100)}
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  Conscience (AVPU)
                </label>
                <select
                  value={newAvpu}
                  onChange={(e) => setNewAvpu(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="A">A - Alerte</option>
                  <option value="V">V - Voix</option>
                  <option value="P">P - Douleur</option>
                  <option value="U">U - Inconscient</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Enregistrer l'Observation & Calculer MEWS
            </button>
          </form>
        </div>

        {/* Table: Historical Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Historique de Surveillance
            </h3>
            <span className="text-[11px] text-slate-500">{points.length} mesures enregistrées</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold text-[11px]">
                  <th className="py-2 px-2.5">Heure</th>
                  <th className="py-2 px-2.5">Temp (°C)</th>
                  <th className="py-2 px-2.5">FC (bpm)</th>
                  <th className="py-2 px-2.5">FR (cpm)</th>
                  <th className="py-2 px-2.5">TA (mmHg)</th>
                  <th className="py-2 px-2.5">SpO2 (%)</th>
                  <th className="py-2 px-2.5">Glycémie</th>
                  <th className="py-2 px-2.5 text-right">Score MEWS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {points.slice().reverse().map(pt => (
                  <tr key={pt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-2.5 px-2.5 font-bold text-slate-900 dark:text-white font-sans">
                      {pt.timestamp}
                    </td>
                    <td className={`py-2.5 px-2.5 ${pt.temperature >= 38.5 ? 'text-rose-500 font-bold' : ''}`}>
                      {pt.temperature.toFixed(1)}
                    </td>
                    <td className={`py-2.5 px-2.5 ${pt.frequenceCardiaque > 110 ? 'text-amber-500 font-bold' : ''}`}>
                      {pt.frequenceCardiaque}
                    </td>
                    <td className={`py-2.5 px-2.5 ${pt.frequenceRespiratoire > 22 ? 'text-amber-500 font-bold' : ''}`}>
                      {pt.frequenceRespiratoire}
                    </td>
                    <td className="py-2.5 px-2.5">
                      {pt.taSystolique}/{pt.taDiastolique}
                    </td>
                    <td className={`py-2.5 px-2.5 ${pt.saturationO2 < 94 ? 'text-rose-500 font-bold' : ''}`}>
                      {pt.saturationO2}%
                    </td>
                    <td className="py-2.5 px-2.5">
                      {pt.glycemie} mg/dL
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-sans">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        pt.scoreMews >= 5
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : pt.scoreMews >= 3
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {pt.scoreMews}/14
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

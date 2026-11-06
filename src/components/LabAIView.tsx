import React, { useState } from 'react';
import {
  TestTubes,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { LabBiomarker } from '../types/medical';

const STANDARD_BIOMARKERS: LabBiomarker[] = [
  { nom: 'Hémoglobine (Hb)', valeur: 7.2, unite: 'g/dL', normeMin: 12.0, normeMax: 16.0, categorie: 'Hématologie' },
  { nom: 'Volume Globulaire Moyen (VGM)', valeur: 86, unite: 'fL', normeMin: 80, normeMax: 100, categorie: 'Hématologie' },
  { nom: 'Plaquettes', valeur: 85000, unite: '/mm³', normeMin: 150000, normeMax: 400000, categorie: 'Hématologie' },
  { nom: 'Globules Blancs (Leucocytes)', valeur: 14200, unite: '/mm³', normeMin: 4000, normeMax: 10000, categorie: 'Hématologie' },
  { nom: 'Sodium (Na+)', valeur: 132, unite: 'mmol/L', normeMin: 135, normeMax: 145, categorie: 'Ionogramme' },
  { nom: 'Potassium (K+)', valeur: 5.4, unite: 'mmol/L', normeMin: 3.5, normeMax: 5.0, categorie: 'Ionogramme' },
  { nom: 'Chlore (Cl-)', valeur: 98, unite: 'mmol/L', normeMin: 98, normeMax: 106, categorie: 'Ionogramme' },
  { nom: 'Bicarbonates (HCO3-)', valeur: 16, unite: 'mmol/L', normeMin: 22, normeMax: 28, categorie: 'Ionogramme' },
  { nom: 'Créatininémie', valeur: 180, unite: 'µmol/L', normeMin: 60, normeMax: 110, categorie: 'Biochimie' },
  { nom: 'Urée sanguine', valeur: 14.5, unite: 'mmol/L', normeMin: 2.5, normeMax: 7.5, categorie: 'Biochimie' },
  { nom: 'Protéine C-Réactive (CRP)', valeur: 112, unite: 'mg/L', normeMin: 0, normeMax: 5, categorie: 'Infectieux' },
  { nom: 'Procalcitonine (PCT)', valeur: 3.8, unite: 'ng/mL', normeMin: 0, normeMax: 0.5, categorie: 'Infectieux' },
  { nom: 'ASAT (TGO)', valeur: 145, unite: 'UI/L', normeMin: 10, normeMax: 40, categorie: 'Biochimie' },
  { nom: 'ALAT (TGP)', valeur: 160, unite: 'UI/L', normeMin: 10, normeMax: 45, categorie: 'Biochimie' },
  { nom: 'Bilirubine Totale', valeur: 42, unite: 'µmol/L', normeMin: 5, normeMax: 17, categorie: 'Biochimie' }
];

export const LabAIView: React.FC = () => {
  const [biomarkers, setBiomarkers] = useState<LabBiomarker[]>(STANDARD_BIOMARKERS);
  const [patientContext, setPatientContext] = useState<string>(
    'Patient de 28 ans admis pour syndrome fébrile aigu à 39.5°C avec oligurie et ictère conjonctival modéré.'
  );
  const [clinicalSuspicion, setClinicalSuspicion] = useState<string>(
    'Suspicion de Paludisme grave compliqué de défaillance rénale ou Sepsis bactérien hépatorénal'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const handleUpdateValue = (index: number, val: number) => {
    const updated = [...biomarkers];
    updated[index].valeur = val;
    setBiomarkers(updated);
  };

  const applyPreset = (preset: string) => {
    if (preset === 'palu-anemie') {
      setPatientContext('Enfant de 4 ans prostré avec pâleur extrême et fièvre à 39.8°C.');
      setClinicalSuspicion('Paludisme grave forme anémique et neurologique');
      setBiomarkers([
        { nom: 'Hémoglobine (Hb)', valeur: 4.6, unite: 'g/dL', normeMin: 11.5, normeMax: 15.5, categorie: 'Hématologie' },
        { nom: 'Plaquettes', valeur: 48000, unite: '/mm³', normeMin: 150000, normeMax: 400000, categorie: 'Hématologie' },
        { nom: 'Globules Blancs', valeur: 13500, unite: '/mm³', normeMin: 5000, normeMax: 12000, categorie: 'Hématologie' },
        { nom: 'Glycémie', valeur: 42, unite: 'mg/dL', normeMin: 70, normeMax: 110, categorie: 'Biochimie' },
        { nom: 'Lactates', valeur: 5.2, unite: 'mmol/L', normeMin: 0.5, normeMax: 2.0, categorie: 'Gaz du Sang' },
        { nom: 'Bilirubine Totale', valeur: 52, unite: 'µmol/L', normeMin: 5, normeMax: 17, categorie: 'Biochimie' }
      ]);
    } else if (preset === 'acidocetose') {
      setPatientContext('Adolescent diabétique de type 1 présentant polypnée de Kussmaul et haleine acétonique.');
      setClinicalSuspicion('Acidocétose diabétique décompensée');
      setBiomarkers([
        { nom: 'Glycémie', valeur: 420, unite: 'mg/dL', normeMin: 70, normeMax: 110, categorie: 'Biochimie' },
        { nom: 'pH artériel', valeur: 7.12, unite: 'pH', normeMin: 7.35, normeMax: 7.45, categorie: 'Gaz du Sang' },
        { nom: 'Bicarbonates (HCO3-)', valeur: 9, unite: 'mmol/L', normeMin: 22, normeMax: 28, categorie: 'Ionogramme' },
        { nom: 'Sodium (Na+)', valeur: 130, unite: 'mmol/L', normeMin: 135, normeMax: 145, categorie: 'Ionogramme' },
        { nom: 'Potassium (K+)', valeur: 5.6, unite: 'mmol/L', normeMin: 3.5, normeMax: 5.0, categorie: 'Ionogramme' },
        { nom: 'Trou Anionique', valeur: 25, unite: 'mmol/L', normeMin: 8, normeMax: 16, categorie: 'Ionogramme' }
      ]);
    } else if (preset === 'sepsis-ira') {
      setPatientContext('Patient de 55 ans fébrile à 39.9°C avec TAs à 80 mmHg et marbrures.');
      setClinicalSuspicion('Choc septique avec défaillance rénale aiguë');
      setBiomarkers([
        { nom: 'Procalcitonine (PCT)', valeur: 12.5, unite: 'ng/mL', normeMin: 0, normeMax: 0.5, categorie: 'Infectieux' },
        { nom: 'CRP', valeur: 240, unite: 'mg/L', normeMin: 0, normeMax: 5, categorie: 'Infectieux' },
        { nom: 'Créatininémie', valeur: 290, unite: 'µmol/L', normeMin: 60, normeMax: 110, categorie: 'Biochimie' },
        { nom: 'Plaquettes', valeur: 65000, unite: '/mm³', normeMin: 150000, normeMax: 400000, categorie: 'Hématologie' },
        { nom: 'Lactates', valeur: 4.8, unite: 'mmol/L', normeMin: 0.5, normeMax: 2.0, categorie: 'Gaz du Sang' }
      ]);
    }
  };

  const handleInterpret = async () => {
    setLoading(true);
    setAnalysisResult('');
    try {
      const res = await fetch('/api/ai/lab-interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientContext,
          clinicalSuspicion,
          biomarkers
        })
      });
      const data = await res.json();
      setAnalysisResult(data.interpretation || 'Analyse terminée.');
    } catch (e: any) {
      setAnalysisResult(`Erreur : ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <TestTubes className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span>Laboratoire AI — Interprétation des Examens Biologiques</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Analyse experte des perturbations hématologiques, métaboliques, ioniques et infectieuses avec corrélations physiopathologiques.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 shrink-0 font-medium">Profils types :</span>
          <button
            onClick={() => applyPreset('palu-anemie')}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300 whitespace-nowrap"
          >
            Anémie Palustre Sévère
          </button>
          <button
            onClick={() => applyPreset('sepsis-ira')}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300 whitespace-nowrap"
          >
            Choc Septique & IRA
          </button>
          <button
            onClick={() => applyPreset('acidocetose')}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300 whitespace-nowrap"
          >
            Acidocétose Diabétique
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs & Table */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-500 font-bold block mb-1">
                Contexte Clinique du Patient :
              </label>
              <textarea
                rows={2}
                value={patientContext}
                onChange={(e) => setPatientContext(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-bold block mb-1">
                Hypothèse ou Suspicion Clinique Principale :
              </label>
              <input
                type="text"
                value={clinicalSuspicion}
                onChange={(e) => setClinicalSuspicion(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Biomarkers Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Biomarqueurs Dosés ({biomarkers.length})</span>
              <span className="text-[11px] font-normal text-slate-400">Modifier les valeurs pour recalculer</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[420px] overflow-y-auto text-xs">
              {biomarkers.map((b, idx) => {
                const isTooLow = b.valeur < b.normeMin;
                const isTooHigh = b.valeur > b.normeMax;
                return (
                  <div key={idx} className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-900 dark:text-white block">{b.nom}</span>
                      <span className="text-[10px] text-slate-400">
                        Normes : {b.normeMin} - {b.normeMax} {b.unite}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        value={b.valeur}
                        onChange={(e) => handleUpdateValue(idx, parseFloat(e.target.value) || 0)}
                        className="w-24 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-right font-mono font-bold text-slate-900 dark:text-white"
                      />
                      <span className="text-[11px] text-slate-400 w-12 font-mono">{b.unite}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded w-16 text-center ${
                          isTooLow
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                            : isTooHigh
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {isTooLow ? '↓ Bas' : isTooHigh ? '↑ Élevé' : 'Normal'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleInterpret}
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Interprétation Biologique en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Interpréter le Bilan Biologique avec l'IA</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output: Structured Laboratory Report */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[650px]">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Rapport d'Interprétation Biologique Structuré
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Conforme Référentiels Biologie Médicale
            </span>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
            {analysisResult || (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 p-8 text-center">
                <FileSpreadsheet className="w-10 h-10 text-slate-300 dark:text-slate-700 stroke-[1.5]" />
                <p className="max-w-xs text-xs">
                  Ajustez les valeurs des biomarqueurs à gauche ou appliquez un profil clinique type, puis lancez l'interprétation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

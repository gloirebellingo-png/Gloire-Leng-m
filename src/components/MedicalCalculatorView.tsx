import React, { useState } from 'react';
import {
  Calculator,
  Droplets,
  Activity,
  Flame,
  Wind,
  Scale,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { MedicalCalculators } from '../services/medicalCalculators';

type CalcTab = 'perfusion' | 'cockcroft' | 'parkland' | 'trou_anionique' | 'curb65' | 'eau_libre' | 'imc_surface';

export const MedicalCalculatorView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalcTab>('perfusion');

  // --- 1. Perfusion State ---
  const [perfVolume, setPerfVolume] = useState<number>(500);
  const [perfDuree, setPerfDuree] = useState<number>(4);
  const [perfTubulure, setPerfTubulure] = useState<'standard_20' | 'pediatrique_60' | 'transfusion_15'>('standard_20');
  const perfResult = MedicalCalculators.calculateIVFlow(perfVolume, perfDuree, perfTubulure);

  // --- 2. Cockcroft-Gault State ---
  const [cockAge, setCockAge] = useState<number>(62);
  const [cockPoids, setCockPoids] = useState<number>(68);
  const [cockSexe, setCockSexe] = useState<'M' | 'F'>('M');
  const [cockCreat, setCockCreat] = useState<number>(140); // µmol/L
  const cockResult = MedicalCalculators.calculateCockcroft(cockAge, cockPoids, cockSexe, cockCreat);

  // --- 3. Parkland State ---
  const [parkPoids, setParkPoids] = useState<number>(70);
  const [parkPct, setParkPct] = useState<number>(25);
  const parkResult = MedicalCalculators.calculateParkland(parkPoids, parkPct);

  // --- 4. Trou Anionique State ---
  const [naVal, setNaVal] = useState<number>(138);
  const [clVal, setClVal] = useState<number>(101);
  const [hco3Val, setHco3Val] = useState<number>(14);
  const taResult = MedicalCalculators.calculateAnionGap(naVal, clVal, hco3Val);

  // --- 5. CURB-65 State ---
  const [cConfusion, setCConfusion] = useState<boolean>(false);
  const [cUree, setCUree] = useState<boolean>(true);
  const [cFr, setCFr] = useState<boolean>(true);
  const [cTa, setCTa] = useState<boolean>(false);
  const [cAge, setCAge] = useState<boolean>(true);
  const curbResult = MedicalCalculators.calculateCURB65(cConfusion, cUree, cFr, cTa, cAge);

  // --- 6. Déficit en Eau Libre State ---
  const [eauPoids, setEauPoids] = useState<number>(60);
  const [eauNatremie, setEauNatremie] = useState<number>(156);
  const eauResult = MedicalCalculators.calculateWaterDeficit(eauPoids, eauNatremie);

  // --- 7. IMC & Surface Corporelle State ---
  const [imcPoids, setImcPoids] = useState<number>(72);
  const [imcTaille, setImcTaille] = useState<number>(174);
  const imcVal = Number((imcPoids / Math.pow(imcTaille / 100, 2)).toFixed(1));
  const bsaVal = Number(Math.sqrt((imcTaille * imcPoids) / 3600).toFixed(2));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            Calculateurs Médicaux Validés & Formules Officielles
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Moteurs de calcul clinique déterministes conformes aux recommandations internationales (OMS, SFAR, KDIGO, ATS/IDSA).
          </p>
        </div>
      </div>

      {/* Calculator Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab('perfusion')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeTab === 'perfusion'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          Débit de Perfusion
        </button>

        <button
          onClick={() => setActiveTab('cockcroft')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeTab === 'cockcroft'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Clairance Créatinine (Cockcroft)
        </button>

        <button
          onClick={() => setActiveTab('parkland')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeTab === 'parkland'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Brûlures (Parkland)
        </button>

        <button
          onClick={() => setActiveTab('trou_anionique')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeTab === 'trou_anionique'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          Trou Anionique
        </button>

        <button
          onClick={() => setActiveTab('curb65')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeTab === 'curb65'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          Score CURB-65
        </button>

        <button
          onClick={() => setActiveTab('eau_libre')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeTab === 'eau_libre'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          Déficit Eau Libre
        </button>

        <button
          onClick={() => setActiveTab('imc_surface')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeTab === 'imc_surface'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          IMC & Surface Corporelle
        </button>
      </div>

      {/* --- Tab 1: Débit de Perfusion --- */}
      {activeTab === 'perfusion' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-600" />
              Paramètres de la Perfusion
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Volume total du soluté (mL)
              </label>
              <input
                type="number"
                min="10"
                step="50"
                value={perfVolume}
                onChange={(e) => setPerfVolume(Math.max(parseFloat(e.target.value) || 0, 1))}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Durée de passage prescrite (heures)
              </label>
              <input
                type="number"
                min="0.25"
                step="0.5"
                value={perfDuree}
                onChange={(e) => setPerfDuree(Math.max(parseFloat(e.target.value) || 0.1, 0.1))}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Calibre de la tubulure (gouttes/mL)
              </label>
              <select
                value={perfTubulure}
                onChange={(e) => setPerfTubulure(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="standard_20">Tubulure standard adulte (20 gouttes/mL)</option>
                <option value="pediatrique_60">Micro-perfuseur pédiatrique (60 gouttes/mL)</option>
                <option value="transfusion_15">Tubulure de transfusion sanguine (15 gouttes/mL)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Résultat de Réglage au Chevet
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono text-sky-600 dark:text-sky-400">
                  {perfResult.debitGouttesMin}
                </span>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  gouttes / minute
                </span>
              </div>
              <div className="mt-2 text-xs font-mono text-slate-500">
                Équivalent pousse-seringue / pompe : <strong className="text-slate-900 dark:text-white">{perfResult.debitMlHeure} mL/heure</strong>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <span className="font-semibold block text-slate-900 dark:text-white">Formule appliquée :</span>
              <code className="block font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sky-600 dark:text-sky-400">
                Débit (gtt/min) = [Volume (mL) × {perfResult.gouttesParMl}] / [Durée ({perfDuree} h × 60 min)]
              </code>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 2: Cockcroft-Gault --- */}
      {activeTab === 'cockcroft' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" />
              Paramètres Rénaux
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">Âge (années)</label>
                <input
                  type="number"
                  value={cockAge}
                  onChange={(e) => setCockAge(parseInt(e.target.value) || 20)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">Poids (kg)</label>
                <input
                  type="number"
                  value={cockPoids}
                  onChange={(e) => setCockPoids(parseFloat(e.target.value) || 50)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">Sexe</label>
                <select
                  value={cockSexe}
                  onChange={(e) => setCockSexe(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                >
                  <option value="M">Homme (coef = 1.0)</option>
                  <option value="F">Femme (coef = 0.85)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">Créatinine sérique (µmol/L)</label>
                <input
                  type="number"
                  value={cockCreat}
                  onChange={(e) => setCockCreat(parseFloat(e.target.value) || 80)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Clairance Estimée de la Créatinine
              </span>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold font-mono ${
                  cockResult.cockcroftMlMin < 30 ? 'text-rose-500' : cockResult.cockcroftMlMin < 60 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {cockResult.cockcroftMlMin}
                </span>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  mL / minute
                </span>
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                {cockResult.stadeCKD}
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {cockResult.interpretation}
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-semibold block text-slate-900 dark:text-white">Alerte médicamenteuse :</span>
              Si ClCr {'<'} 50 mL/min, réduire les doses ou espacer les prises d'antibiotiques à élimination rénale (Aminosides, Vancomycine, Bêta-lactamines).
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 3: Parkland Brûlures --- */}
      {activeTab === 'parkland' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              Réanimation hydro-électrolytique (Formule de Parkland)
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Poids du patient (kg)
              </label>
              <input
                type="number"
                value={parkPoids}
                onChange={(e) => setParkPoids(parseFloat(e.target.value) || 50)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Surface Corporelle Brûlée 2e/3e degré (% selon Wallace)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={parkPct}
                onChange={(e) => setParkPct(parseFloat(e.target.value) || 1)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Règle des 9 : Tête 9%, Bras 9% x 2, Tronc antérieur 18%, Tronc postérieur 18%, Jambes 18% x 2, Périnée 1%.
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Volume Total Remplissage 24 heures
              </span>
              <div className="text-3xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {parkResult.volumeTotal24hMl} mL <span className="text-xs font-normal text-slate-500 font-sans">de Ringer Lactate</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">8 Premières Heures (50%)</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white block mt-1">
                  {parkResult.volumePhase1Ml} mL
                </span>
                <span className="text-[11px] font-semibold text-rose-500 font-mono">
                  Débit : {parkResult.debitPhase1MlHeure} mL/h
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">16 Heures Suivantes (50%)</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white block mt-1">
                  {parkResult.volumePhase2Ml} mL
                </span>
                <span className="text-[11px] font-semibold text-sky-500 font-mono">
                  Débit : {parkResult.debitPhase2MlHeure} mL/h
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Objectif diurèse au chevet : 0,5 à 1,0 mL/kg/h chez l'adulte (sonde vésicale impérative).
            </p>
          </div>
        </div>
      )}

      {/* --- Tab 4: Trou Anionique --- */}
      {activeTab === 'trou_anionique' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-sky-600" />
              Ionogramme Sanguin
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Sodium Na+ (mmol/L)
              </label>
              <input
                type="number"
                value={naVal}
                onChange={(e) => setNaVal(parseFloat(e.target.value) || 135)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Chlorure Cl- (mmol/L)
              </label>
              <input
                type="number"
                value={clVal}
                onChange={(e) => setClVal(parseFloat(e.target.value) || 100)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Bicarbonates HCO3- (mmol/L)
              </label>
              <input
                type="number"
                value={hco3Val}
                onChange={(e) => setHco3Val(parseFloat(e.target.value) || 24)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Trou Anionique Plasmatique Calculé
              </span>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold font-mono ${
                  taResult.trouAnionique > 16 ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                  {taResult.trouAnionique}
                </span>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  mmol / L (Normale 8 - 16)
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                {taResult.interpretation}
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-semibold block text-slate-900 dark:text-white">Mnémonique GOLDMARK :</span>
              Glycols, Oxoproline, L-lactate, D-lactate, Méthanol, Aspirine, Renal failure, Kétoacidose.
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 5: CURB-65 --- */}
      {activeTab === 'curb65' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Wind className="w-4 h-4 text-sky-600" />
              Critères du Score CURB-65
            </h2>

            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={cConfusion}
                onChange={(e) => setCConfusion(e.target.checked)}
                className="rounded border-slate-300 text-sky-600"
              />
              <span><strong>C</strong> — Confusion mentale aiguë</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={cUree}
                onChange={(e) => setCUree(e.target.checked)}
                className="rounded border-slate-300 text-sky-600"
              />
              <span><strong>U</strong> — Urée sanguine {'>'} 7 mmol/L (environ 0.40 g/L)</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={cFr}
                onChange={(e) => setCFr(e.target.checked)}
                className="rounded border-slate-300 text-sky-600"
              />
              <span><strong>R</strong> — Fréquence Respiratoire ≥ 30 cycles/min</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={cTa}
                onChange={(e) => setCTa(e.target.checked)}
                className="rounded border-slate-300 text-sky-600"
              />
              <span><strong>B</strong> — Pression Artérielle basse (PAS {'<'} 90 ou PAD ≤ 60 mmHg)</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={cAge}
                onChange={(e) => setCAge(e.target.checked)}
                className="rounded border-slate-300 text-sky-600"
              />
              <span><strong>65</strong> — Âge ≥ 65 ans</span>
            </label>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Score Total CURB-65
              </span>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold font-mono ${
                  curbResult.score >= 3 ? 'text-rose-500' : curbResult.score === 2 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {curbResult.score} / 5
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Mortalité estimée : {curbResult.risqueMortalite}
                </span>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white">
                Orientation recommandée : {curbResult.orientation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 6: Déficit Eau Libre --- */}
      {activeTab === 'eau_libre' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-600" />
              Déshydratation Hypernatrémique
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Poids corporel actuel (kg)
              </label>
              <input
                type="number"
                value={eauPoids}
                onChange={(e) => setEauPoids(parseFloat(e.target.value) || 50)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Natrémie mesurée Na+ (mmol/L)
              </label>
              <input
                type="number"
                value={eauNatremie}
                onChange={(e) => setEauNatremie(parseFloat(e.target.value) || 140)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Déficit en Eau Libre Estimé
              </span>
              <div className="text-4xl font-bold font-mono text-sky-600 dark:text-sky-400">
                {eauResult.deficitLitres} Litres
              </div>
              <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 font-medium">
                {eauResult.vitesseCorrection}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- Tab 7: IMC & Surface Corporelle --- */}
      {activeTab === 'imc_surface' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-sky-600" />
              Anthropométrie Clinique
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Taille (cm)
              </label>
              <input
                type="number"
                value={imcTaille}
                onChange={(e) => setImcTaille(parseFloat(e.target.value) || 170)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Poids (kg)
              </label>
              <input
                type="number"
                value={imcPoids}
                onChange={(e) => setImcPoids(parseFloat(e.target.value) || 70)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Indice de Masse Corporelle (IMC)
              </span>
              <div className="text-3xl font-bold font-mono text-sky-600 dark:text-sky-400">
                {imcVal} kg/m²
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Classification : {imcVal < 18.5 ? 'Insuffisance pondérale / Dénutrition' : imcVal < 25 ? 'Corpulence normale' : imcVal < 30 ? 'Surpoids' : 'Obésité'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Surface Corporelle (Formule de Mosteller)
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {bsaVal} m²
              </div>
              <span className="text-[10px] text-slate-400">
                Formule : √[(Taille cm × Poids kg) / 3600]
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

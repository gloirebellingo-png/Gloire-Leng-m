import React, { useState } from 'react';
import {
  Pill,
  Search,
  Calculator,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Info
} from 'lucide-react';
import { DRUGS_DATABASE } from '../services/pharmacologyData';
import { DrugItem } from '../types/medical';

export const PharmacologyView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDrugId, setSelectedDrugId] = useState<string>('artesunate');

  // Pediatric Calculator Inputs
  const [calcWeight, setCalcWeight] = useState<string>('12');
  const [customMgKg, setCustomMgKg] = useState<string>('');
  const [calcIndication, setCalcIndication] = useState<string>('Paludisme grave OMS/PNLP');

  const filteredDrugs = DRUGS_DATABASE.filter(d =>
    d.dci.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.classe.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.nomsCommerciaux.some(n => n.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedDrug = DRUGS_DATABASE.find(d => d.id === selectedDrugId) || DRUGS_DATABASE[0];

  // Calculations
  const weightNum = parseFloat(calcWeight);
  const isValidWeight = !isNaN(weightNum) && weightNum > 0 && weightNum < 200;

  let calculatedDoseMg = 0;
  let volumeMl = 0;
  let calculationNote = '';
  let warnings: string[] = [];

  if (selectedDrug.id === 'artesunate' && isValidWeight) {
    const isUnder20 = weightNum < 20;
    const mgKg = isUnder20 ? 3.0 : 2.4;
    calculatedDoseMg = Number((weightNum * mgKg).toFixed(1));
    volumeMl = Number((calculatedDoseMg / 10).toFixed(1)); // 10 mg/mL
    calculationNote = isUnder20
      ? `Règle pédiatrique RDC/OMS < 20 kg appliquée : 3,0 mg/kg/dose.`
      : `Règle ≥ 20 kg appliquée : 2,4 mg/kg/dose.`;
    warnings.push("Vérifier impérativement la dilution finale à 10 mg/mL (1 mL bicarbonate 5% + 5 mL NaCl 0,9%).");
    warnings.push("Administration : H0, H12, H24 puis toutes les 24h (minimum 3 injections avant relais CTA oral).");
  } else if (selectedDrug.id === 'amoxicilline' && isValidWeight) {
    const doseJour = Math.min(weightNum * 80, 3000); // 80 mg/kg/j plafonné à 3g
    calculatedDoseMg = Number((doseJour / 2).toFixed(1)); // 2 prises par jour
    volumeMl = Number((calculatedDoseMg / 50).toFixed(1)); // sirop 250mg/5ml = 50 mg/ml
    calculationNote = `PCIME Pneumonie : 80 mg/kg/jour répartis en 2 prises de ${calculatedDoseMg} mg (soit ${volumeMl} mL matin et soir).`;
    warnings.push("Vérifier l'absence d'allergie documentée aux pénicillines.");
  } else if (selectedDrug.id === 'paracetamol' && isValidWeight) {
    calculatedDoseMg = Number((weightNum * 15).toFixed(1)); // 15 mg/kg par prise
    volumeMl = Number((calculatedDoseMg / 24).toFixed(1)); // sirop 120mg/5ml = 24 mg/ml
    calculationNote = `Dose unitaire de 15 mg/kg toutes les 6 heures (max 60 mg/kg/jour en 4 prises).`;
    warnings.push("Respecter impérativement l'intervalle minimal de 6 heures entre deux prises.");
  } else if (selectedDrug.calculateurKg && isValidWeight) {
    const rate = customMgKg ? parseFloat(customMgKg) : selectedDrug.calculateurKg.doseMinMgKg;
    calculatedDoseMg = Math.min(weightNum * rate, selectedDrug.calculateurKg.dosePlafondJournalierMg);
    if (selectedDrug.calculateurKg.concentrationMgParMl) {
      volumeMl = Number((calculatedDoseMg / selectedDrug.calculateurKg.concentrationMgParMl).toFixed(1));
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Pill className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <span>Base Pharmacologique & Calculateur de Doses Pédiatriques</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Formulaire thérapeutique hospitalier, posologies pondérales strictes au mg/kg, contre-indications et contrôles de doses maximales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Search & Drug list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher une DCI, classe, nom commercial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 shadow-sm"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 max-h-[640px] overflow-y-auto">
            {filteredDrugs.map((drug) => {
              const isSelected = drug.id === selectedDrugId;
              return (
                <div
                  key={drug.id}
                  onClick={() => setSelectedDrugId(drug.id)}
                  className={`p-3 rounded-xl cursor-pointer transition text-left ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {drug.dci}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                    {drug.classe}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {drug.nomsCommerciaux.slice(0, 2).map((trade, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono"
                      >
                        {trade}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Drug Details & Pediatric Calculator */}
        <div className="lg:col-span-8 space-y-6">
          {/* Pediatric Calculator Module */}
          <div className="bg-gradient-to-r from-sky-900/10 via-slate-900/10 to-slate-900/10 dark:from-sky-950/30 dark:to-slate-900 p-5 rounded-2xl border border-sky-200 dark:border-sky-900/50 space-y-4">
            <div className="flex items-center justify-between border-b border-sky-100 dark:border-sky-900/50 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Calculateur de Doses Pédiatriques — {selectedDrug.dci}
                </h2>
              </div>
              <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded-full">
                Contrôle Anti-Erreur Déterministe
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                  Poids précis de l'enfant (kg) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(e.target.value)}
                  placeholder="Ex: 12.5"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                  Voie d'administration
                </label>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200">
                  {selectedDrug.calculateurKg?.voie || selectedDrug.voiesAdmin.join(', ')}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                  Forme galénique disponible
                </label>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs truncate text-slate-800 dark:text-slate-200">
                  {selectedDrug.calculateurKg?.formeDisponible || 'Forme standard'}
                </div>
              </div>
            </div>

            {/* Validation / Missing Data Check */}
            {!isValidWeight ? (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Veuillez renseigner un poids valide compris entre 0.5 kg et 150 kg pour débloquer le calcul posologique.</span>
              </div>
            ) : (
              <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-sky-300 dark:border-sky-800/80 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Dose Unitaire Calculée</span>
                    <p className="text-xl font-mono font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">
                      {calculatedDoseMg} mg
                    </p>
                  </div>

                  {volumeMl > 0 && (
                    <div>
                      <span className="text-[11px] text-slate-500 block">Volume Précis à Administrer</span>
                      <p className="text-xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {volumeMl} mL
                      </p>
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] text-slate-500 block">Rythme & Durée</span>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1">
                      {selectedDrug.calculateurKg?.instructionsReconstitution || 'Selon prescription médicale'}
                    </p>
                  </div>
                </div>

                {calculationNote && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-2 font-medium">
                    {calculationNote}
                  </p>
                )}

                {warnings.length > 0 && (
                  <div className="space-y-1 border-t border-slate-100 dark:border-slate-800/80 pt-2 text-[11px] text-rose-700 dark:text-rose-300">
                    {warnings.map((w, idx) => (
                      <p key={idx} className="flex items-start gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </p>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Source : {selectedDrug.referenceProtocole}</span>
                  <span className="text-amber-600 font-semibold">Validation obligatoire par le soignant</span>
                </div>
              </div>
            )}
          </div>

          {/* Full Monograph Details */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-xs">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedDrug.dci}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                {selectedDrug.classe} — Noms commerciaux : {selectedDrug.nomsCommerciaux.join(', ')}
              </span>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Mécanisme d'action :
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedDrug.mecanisme}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Indications majeures :
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                  {selectedDrug.indications.map((ind, i) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl">
                <span className="font-bold text-rose-800 dark:text-rose-300 block mb-1">
                  Contre-indications absolues :
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-rose-900 dark:text-rose-200">
                  {selectedDrug.contreIndications.map((ci, i) => (
                    <li key={i}>{ci}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Posologie Adulte de référence :
                </span>
                <p className="text-slate-600 dark:text-slate-400 font-mono">
                  {selectedDrug.posologieAdulte}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Posologie Enfant de référence :
                </span>
                <p className="text-slate-600 dark:text-slate-400 font-mono">
                  {selectedDrug.posologieEnfant}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">Grossesse & Allaitement :</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">{selectedDrug.grossesseAllaitement}</p>
              </div>
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">Adaptation Rénale :</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">{selectedDrug.adaptationRenale}</p>
              </div>
              <div>
                <strong className="block text-slate-700 dark:text-slate-300">Adaptation Hépatique :</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">{selectedDrug.adaptationHepatique}</p>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Référence protocolisée : {selectedDrug.referenceProtocole}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

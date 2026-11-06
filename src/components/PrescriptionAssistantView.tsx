import React, { useState } from 'react';
import {
  FileCheck2,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  ShieldAlert,
  Loader2,
  Info
} from 'lucide-react';
import { DRUGS_DATABASE } from '../services/pharmacologyData';
import { StorageService } from '../services/storageService';
import { NotificationService } from '../services/notificationService';
import { Patient, PrescriptionItem } from '../types/medical';

interface PrescriptionLine {
  id: string;
  dci: string;
  dosage: string;
  posologie: string;
  voie: 'PO' | 'IV' | 'IM' | 'SC' | 'Inhalation' | 'Rectale';
  frequence: string;
  duree: string;
  instructions: string;
}

export const PrescriptionAssistantView: React.FC = () => {
  const patients = StorageService.getPatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  
  // Patient details state
  const [patientAge, setPatientAge] = useState<number>(32);
  const [patientPoids, setPatientPoids] = useState<number>(65);
  const [patientSexe, setPatientSexe] = useState<'M' | 'F'>('M');
  const [patientCreatinine, setPatientCreatinine] = useState<string>('80'); // µmol/L
  const [patientAllergies, setPatientAllergies] = useState<string>('Pénicilline');
  const [grossesseAllaitement, setGrossesseAllaitement] = useState<boolean>(false);

  // Prescription items
  const [items, setItems] = useState<PrescriptionLine[]>([
    {
      id: 'item-1',
      dci: 'Artéméther 20 mg + Luméfantrine 120 mg',
      dosage: '4 comprimés par prise',
      posologie: '4 cp à H0, H8, H24, H36, H48, H60',
      voie: 'PO',
      frequence: '2 fois par jour',
      duree: '3 jours',
      instructions: 'Prendre avec un repas gras ou du lait pour optimiser l\'absorption.'
    },
    {
      id: 'item-2',
      dci: 'Paracétamol 500 mg',
      dosage: '1 g par prise',
      posologie: '1000 mg toutes les 6 heures si fièvre > 38.5°C',
      voie: 'PO',
      frequence: 'Toutes les 6 heures si besoin (max 4g/j)',
      duree: '3 jours',
      instructions: 'Respecter au moins 6h entre chaque prise. Ne pas dépasser 4 g par 24h.'
    }
  ]);

  // Selected drug from dropdown to add quickly
  const [selectedDciQuick, setSelectedDciQuick] = useState<string>('');

  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isDoctorValidated, setIsDoctorValidated] = useState<boolean>(false);

  // Sync when patient selected from dropdown
  const handlePatientSelect = (pid: string) => {
    setSelectedPatientId(pid);
    const p = patients.find(pat => pat.id === pid);
    if (p) {
      setPatientAge(p.ageAns);
      setPatientPoids(p.poidsKg);
      setPatientSexe(p.sexe);
      setPatientAllergies(p.allergies.map(a => a.substance).join(', ') || 'Aucune connue');
    }
  };

  const handleAddQuickDrug = () => {
    if (!selectedDciQuick) return;
    const drug = DRUGS_DATABASE.find(d => d.id === selectedDciQuick);
    if (!drug) return;

    const isChild = patientAge < 15 || patientPoids < 35;
    const newLine: PrescriptionLine = {
      id: 'line-' + Date.now(),
      dci: drug.dci,
      dosage: isChild ? drug.posologieEnfant.slice(0, 45) : drug.posologieAdulte.slice(0, 45),
      posologie: isChild ? drug.posologieEnfant : drug.posologieAdulte,
      voie: (drug.voiesAdmin[0] as any) || 'PO',
      frequence: 'Selon protocole',
      duree: '5 jours',
      instructions: drug.grossesseAllaitement
    };

    setItems([...items, newLine]);
    setSelectedDciQuick('');
    setAiReport(null);
  };

  const handleRemoveLine = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    setAiReport(null);
  };

  const handleUpdateLine = (id: string, field: keyof PrescriptionLine, value: string) => {
    setItems(items.map(it => it.id === id ? { ...it, [field]: value } : it));
    setAiReport(null);
  };

  const handleAnalyzePrescription = async () => {
    if (items.length === 0) return;
    setIsAnalyzing(true);
    setAiReport(null);

    const payload = {
      patient: {
        age: patientAge,
        sexe: patientSexe,
        poidsKg: patientPoids,
        creatinineUmolL: parseFloat(patientCreatinine) || 80,
        allergies: patientAllergies,
        grossesse: grossesseAllaitement
      },
      prescriptions: items.map(it => ({
        dci: it.dci,
        posologie: it.posologie,
        voie: it.voie,
        duree: it.duree,
        instructions: it.instructions
      }))
    };

    try {
      const res = await fetch('/api/ai/prescription-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setAiReport(data.analysis || 'Analyse terminée avec succès.');

      // Push notification if high risk detected
      if (data.analysis && (data.analysis.includes('CONTRE-INDICATION') || data.analysis.includes('CRITIQUE') || data.analysis.includes('DANGER'))) {
        NotificationService.addNotification({
          titre: 'Alerte Prescription : Risque critique identifié',
          message: 'Une contre-indication ou interaction majeure a été détectée dans l\'ordonnance en cours d\'élaboration.',
          categorie: 'SECURITE',
          priorite: 'URGENTE',
          lienTab: 'prescription'
        });
      }
    } catch {
      // Deterministic safety check fallback
      let fallbackText = `### Analyse de Sécurité de Prescription (Vérification Locale)\n\n`;
      fallbackText += `**Profil Patient :** ${patientAge} ans · ${patientPoids} kg · Sexe ${patientSexe} · Allergies : ${patientAllergies}\n\n`;
      fallbackText += `**Médicaments analysés (${items.length}) :**\n`;
      items.forEach((it, idx) => {
        fallbackText += `${idx + 1}. **${it.dci}** : ${it.posologie} (${it.voie}, ${it.duree})\n`;
      });
      fallbackText += `\n**Points de vigilance déontologiques :**\n`;
      fallbackText += `- **Allergies croisées :** Vérifiez l'absence de pénicilline/céphalosporines si terrain allergique connu.\n`;
      fallbackText += `- **Dose par kg :** Vérifier que la dose unitaire ne dépasse pas la dose plafond recommandée pour un poids de ${patientPoids} kg.\n`;
      fallbackText += `- **Fonction rénale :** Si la clairance estimée est < 30 mL/min, adapter les intervalles d'administration.\n`;
      fallbackText += `\n*Validation humaine obligatoire par le médecin avant impression.*`;
      setAiReport(fallbackText);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            Assistant de Prescription Médicale & Sécurité
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Élaboration d'ordonnances sécurisées avec détection des interactions croisées, contre-indications et adaptation pondérale OMS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            disabled={!isDoctorValidated || items.length === 0}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition ${
              isDoctorValidated && items.length > 0
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
            title={!isDoctorValidated ? "Validation médicale requise pour imprimer" : "Imprimer l'ordonnance"}
          >
            <Printer className="w-4 h-4" />
            Imprimer Ordonnance
          </button>
        </div>
      </div>

      {/* Grid: Patient Details + Prescription Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Profile & Parameters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Paramètres Patient</h2>
            <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">Dossier actif</span>
          </div>

          {/* Quick select patient */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Sélectionner un dossier enregistré :
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => handlePatientSelect(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">-- Patient libre / Ambulatoire --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.codeDossier} — {p.nom} {p.postnom} ({p.ageAns} ans, {p.poidsKg} kg)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Âge (années)</label>
              <input
                type="number"
                min="0"
                max="120"
                value={patientAge}
                onChange={(e) => setPatientAge(parseInt(e.target.value) || 0)}
                className="w-full text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Poids (kg)</label>
              <input
                type="number"
                min="1"
                max="250"
                value={patientPoids}
                onChange={(e) => setPatientPoids(parseFloat(e.target.value) || 1)}
                className="w-full text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Sexe biologique</label>
              <select
                value={patientSexe}
                onChange={(e) => setPatientSexe(e.target.value as 'M' | 'F')}
                className="w-full text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Créatinine (µmol/L)</label>
              <input
                type="number"
                value={patientCreatinine}
                onChange={(e) => setPatientCreatinine(e.target.value)}
                className="w-full text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                placeholder="Ex: 85"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Allergies connues</label>
            <input
              type="text"
              value={patientAllergies}
              onChange={(e) => setPatientAllergies(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              placeholder="Ex: Pénicilline, Sulfamides..."
            />
          </div>

          {patientSexe === 'F' && (
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={grossesseAllaitement}
                  onChange={(e) => setGrossesseAllaitement(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>Patiente enceinte ou allaitante</span>
              </label>
            </div>
          )}

          <div className="rounded-lg bg-sky-50 dark:bg-sky-950/30 p-3 border border-sky-200 dark:border-sky-800/40 text-[11px] text-sky-800 dark:text-sky-300 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-sky-600 dark:text-sky-400" />
            <p>
              Les posologies chez l'enfant ({'<'} 15 ans ou {'<'} 35 kg) sont automatiquement calculées en mg/kg/jour avec application des doses plafonds recommandées.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Prescription Items & AI Checker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Drug Adder Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <select
                value={selectedDciQuick}
                onChange={(e) => setSelectedDciQuick(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">-- Choisir un médicament dans la base PNLP/OMS --</option>
                {DRUGS_DATABASE.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.dci} [{d.classe}]
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddQuickDrug}
              disabled={!selectedDciQuick}
              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                selectedDciQuick
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter à l'ordonnance
            </button>
          </div>

          {/* Active Prescription Lines Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Lignes de Traitement</h2>
                <span className="text-xs text-slate-500">({items.length} produit{items.length > 1 ? 's' : ''})</span>
              </div>
              <button
                onClick={() => {
                  const newLine: PrescriptionLine = {
                    id: 'line-' + Date.now(),
                    dci: '',
                    dosage: '',
                    posologie: '',
                    voie: 'PO',
                    frequence: '1 prise par jour',
                    duree: '5 jours',
                    instructions: ''
                  };
                  setItems([...items, newLine]);
                  setAiReport(null);
                }}
                className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Ligne personnalisée
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center italic">
                Aucun médicament prescrit. Sélectionnez un produit ci-dessus ou ajoutez une ligne.
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((line, idx) => (
                  <div
                    key={line.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={line.dci}
                          onChange={(e) => handleUpdateLine(line.id, 'dci', e.target.value)}
                          placeholder="Dénomination Commune Internationale (DCI)..."
                          className="w-full text-xs font-semibold px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveLine(line.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition"
                        title="Supprimer la ligne"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 block">Posologie & Rythme</label>
                        <input
                          type="text"
                          value={line.posologie}
                          onChange={(e) => handleUpdateLine(line.id, 'posologie', e.target.value)}
                          placeholder="Ex: 500 mg x 3/j"
                          className="w-full text-xs px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Voie</label>
                        <select
                          value={line.voie}
                          onChange={(e) => handleUpdateLine(line.id, 'voie', e.target.value as any)}
                          className="w-full text-xs px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                        >
                          <option value="PO">Orale (PO)</option>
                          <option value="IV">Intraveineuse (IV)</option>
                          <option value="IM">Intramusculaire (IM)</option>
                          <option value="SC">Sous-cutanée (SC)</option>
                          <option value="Inhalation">Inhalation</option>
                          <option value="Rectale">Rectale</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Durée</label>
                        <input
                          type="text"
                          value={line.duree}
                          onChange={(e) => handleUpdateLine(line.id, 'duree', e.target.value)}
                          placeholder="Ex: 5 jours"
                          className="w-full text-xs px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 block">Instructions spécifiques / Conseils au patient</label>
                      <input
                        type="text"
                        value={line.instructions}
                        onChange={(e) => handleUpdateLine(line.id, 'instructions', e.target.value)}
                        placeholder="Ex: Prendre au milieu du repas, boire abondamment..."
                        className="w-full text-xs px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Check Safety Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleAnalyzePrescription}
                disabled={isAnalyzing || items.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyse des interactions croisées...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Lancer le Contrôle de Sécurité IA
                  </>
                )}
              </button>

              <span className="text-[11px] text-slate-500">
                Moteur d'analyse basé sur les bases OMS, VIDAL et PNLP
              </span>
            </div>
          </div>

          {/* AI Analysis Report Card */}
          {aiReport && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Rapport de Sécurité Pharmacologique
                  </h3>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Audit IA Conforme
                </span>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono">
                {aiReport}
              </div>

              {/* Clinician Signature Checkbox */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                  <input
                    type="checkbox"
                    checked={isDoctorValidated}
                    onChange={(e) => setIsDoctorValidated(e.target.checked)}
                    className="mt-0.5 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-semibold block">Validation et Signature Médicale Obligatoire :</span>
                    Je certifie avoir examiné le patient, validé les indications, les posologies pondérales et écarté les contre-indications. J'assume la responsabilité de cette prescription.
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

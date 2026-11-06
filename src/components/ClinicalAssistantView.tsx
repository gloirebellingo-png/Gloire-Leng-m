import React, { useState } from 'react';
import {
  Stethoscope,
  Activity,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  FileDown,
  AlertTriangle,
  HeartPulse
} from 'lucide-react';
import { Vitals, MedicalSpecialty } from '../types/medical';
import { ClinicalEngine } from '../services/clinicalEngine';

interface ClinicalAssistantViewProps {
  onAddConsultationToPatient?: (consultation: any) => void;
}

export const ClinicalAssistantView: React.FC<ClinicalAssistantViewProps> = () => {
  const [mode, setMode] = useState<'PROFESSIONNEL' | 'ETUDIANT'>('PROFESSIONNEL');
  const [specialite, setSpecialite] = useState<MedicalSpecialty>('pediatrie');

  // Patient inputs
  const [age, setAge] = useState<string>('3');
  const [poidsKg, setPoidsKg] = useState<string>('13');
  const [sexe, setSexe] = useState<'M' | 'F'>('M');
  const [plainte, setPlainte] = useState<string>(
    'Fièvre à 39.8°C depuis 2 jours, refus d\'alimentation et somnolence progressive'
  );
  const [anamnese, setAnamnese] = useState<string>(
    'Enfant léthargique, prostré, ne pleure que sur stimulation vigoureuse. Pâleur conjonctivale intense. Pas de raideur de nuque évidente. Vomissements de tout aliment ingéré depuis 6 heures.'
  );

  // Vitals
  const [vitals, setVitals] = useState<Vitals>({
    taSystolique: 85,
    taDiastolique: 52,
    frequenceCardiaque: 154,
    frequenceRespiratoire: 48,
    temperature: 39.8,
    saturationO2: 93,
    glycemieCapillaire: 50,
    etatConscience: 'Voix'
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [reportSource, setReportSource] = useState<string>('');

  // Live deterministic evaluation
  const liveTriage = ClinicalEngine.evaluateABCDE(vitals, parseInt(age) || 20);

  // Quick preset templates
  const applyPreset = (preset: string) => {
    if (preset === 'palu-grave') {
      setAge('3');
      setPoidsKg('13');
      setSexe('M');
      setSpecialite('pediatrie');
      setPlainte('Fièvre à 39.8°C depuis 48h, prostration, vomissements et crise convulsive généralisée il y a 1h');
      setAnamnese('Enfant prostré ne buvant plus, pâleur conjonctivale sévère, splénomégalie modérée palpée.');
      setVitals({
        taSystolique: 85,
        taDiastolique: 50,
        frequenceCardiaque: 158,
        frequenceRespiratoire: 48,
        temperature: 39.9,
        saturationO2: 92,
        glycemieCapillaire: 46,
        etatConscience: 'Douleur'
      });
    } else if (preset === 'cholera') {
      setAge('28');
      setPoidsKg('60');
      setSexe('F');
      setSpecialite('infectiologie');
      setPlainte('Diarrhée aqueuse afécale foudroyante en eau de riz (plus de 12 selles en 8h) avec crampes musculaires');
      setAnamnese('Début brutal en zone épidémique. Yeux très enfoncés, soif insatiable, pli cutané persistant > 3 secondes, aphonie modérée.');
      setVitals({
        taSystolique: 80,
        taDiastolique: 50,
        frequenceCardiaque: 130,
        frequenceRespiratoire: 26,
        temperature: 36.2,
        saturationO2: 96,
        glycemieCapillaire: 85,
        etatConscience: 'Alerte'
      });
    } else if (preset === 'eclampsie') {
      setAge('21');
      setPoidsKg('62');
      setSexe('F');
      setSpecialite('gyneco_obstetrique');
      setPlainte('Céphalées pulsatiles intenses, phosphènes et crise convulsive chez une primigeste à 35 SA');
      setAnamnese('Œdèmes massifs des membres inférieurs prenant profondément le godet. Réflexes ostéotendineux vifs et polycinétiques. TA très élevée.');
      setVitals({
        taSystolique: 180,
        taDiastolique: 115,
        frequenceCardiaque: 105,
        frequenceRespiratoire: 22,
        temperature: 37.1,
        saturationO2: 96,
        glycemieCapillaire: 92,
        etatConscience: 'Voix'
      });
    }
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setReport('');
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          specialite,
          age: parseInt(age) || undefined,
          poidsKg: parseFloat(poidsKg) || undefined,
          sexe,
          plainte,
          anamnese,
          constantes: vitals
        })
      });

      const data = await response.json();
      if (data.result) {
        setReport(data.result);
        setReportSource(data.source || 'gemini-3.8-flash');
      } else if (data.error) {
        setReport(`Erreur d'analyse : ${data.error}`);
      }
    } catch (err: any) {
      setReport(`Échec de communication réseau : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span>Assistant Clinique Intelligent — Analyse en 10 Points</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Système d'aide à la décision clinique structurée selon les recommandations OMS et nationales (RDC)
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <button
            onClick={() => setMode('PROFESSIONNEL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              mode === 'PROFESSIONNEL'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mode Professionnel (CDS)
          </button>
          <button
            onClick={() => setMode('ETUDIANT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              mode === 'ETUDIANT'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mode Académie Étudiant
          </button>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 shrink-0 font-medium">Cas fréquents :</span>
        <button
          onClick={() => applyPreset('palu-grave')}
          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 whitespace-nowrap"
        >
          Paludisme Grave Enfant (Kinshasa)
        </button>
        <button
          onClick={() => applyPreset('cholera')}
          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 whitespace-nowrap"
        >
          Déshydratation Sévère Choléra
        </button>
        <button
          onClick={() => applyPreset('eclampsie')}
          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 whitespace-nowrap"
        >
          Éclampsie 35 SA (SONU)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Patient Data & Vitals */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Paramètres Démographiques & Spécialité
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Âge (années)</label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Poids (kg)</label>
                <input
                  type="text"
                  value={poidsKg}
                  onChange={(e) => setPoidsKg(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Sexe</label>
                <select
                  value={sexe}
                  onChange={(e) => setSexe(e.target.value as 'M' | 'F')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="M">Masculin (M)</option>
                  <option value="F">Féminin (F)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Spécialité Médicale</label>
              <select
                value={specialite}
                onChange={(e) => setSpecialite(e.target.value as MedicalSpecialty)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              >
                <option value="pediatrie">Pédiatrie & Néonatalogie</option>
                <option value="infectiologie">Infectiologie & Maladies Tropicales</option>
                <option value="general">Médecine Générale</option>
                <option value="gyneco_obstetrique">Gynécologie-Obstétrique</option>
                <option value="cardiologie">Cardiologie</option>
                <option value="pneumologie">Pneumologie</option>
                <option value="neurologie">Neurologie</option>
                <option value="gastro_enterologie">Gastro-entérologie</option>
                <option value="dermatologie">Dermatologie</option>
                <option value="nephrologie">Néphrologie</option>
                <option value="endocrinologie">Endocrinologie</option>
                <option value="chirurgie">Chirurgie Générale</option>
                <option value="urgences">Médecine d'Urgence & Réanimation</option>
                <option value="sante_publique">Santé Publique</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Motif Principal de Consultation</label>
              <input
                type="text"
                value={plainte}
                onChange={(e) => setPlainte(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                placeholder="Ex: Fièvre aiguë, détresse respiratoire..."
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 block mb-1">
                Anamnèse Détaillée, Signes Fonctionnels & Examen Physique
              </label>
              <textarea
                rows={5}
                value={anamnese}
                onChange={(e) => setAnamnese(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                placeholder="Chronologie d'apparition, tolérance orale, auscultation, signes neurologiques..."
              />
            </div>
          </div>

          {/* Vitals Input Box */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Constantes Vitales Immédiates
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  liveTriage.level === 'ROUGE'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                    : liveTriage.level === 'JAUNE'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                }`}
              >
                Triage : {liveTriage.level}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-500 block">T° (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vitals.temperature || ''}
                  onChange={(e) => setVitals({ ...vitals, temperature: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">SpO2 (%)</label>
                <input
                  type="number"
                  value={vitals.saturationO2 || ''}
                  onChange={(e) => setVitals({ ...vitals, saturationO2: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">FR (/min)</label>
                <input
                  type="number"
                  value={vitals.frequenceRespiratoire || ''}
                  onChange={(e) => setVitals({ ...vitals, frequenceRespiratoire: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">FC (bpm)</label>
                <input
                  type="number"
                  value={vitals.frequenceCardiaque || ''}
                  onChange={(e) => setVitals({ ...vitals, frequenceCardiaque: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">TA Sys (mmHg)</label>
                <input
                  type="number"
                  value={vitals.taSystolique || ''}
                  onChange={(e) => setVitals({ ...vitals, taSystolique: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">TA Dia (mmHg)</label>
                <input
                  type="number"
                  value={vitals.taDiastolique || ''}
                  onChange={(e) => setVitals({ ...vitals, taDiastolique: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">Glycémie (mg/dL)</label>
                <input
                  type="number"
                  value={vitals.glycemieCapillaire || ''}
                  onChange={(e) => setVitals({ ...vitals, glycemieCapillaire: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">Conscience</label>
                <select
                  value={vitals.etatConscience}
                  onChange={(e) => setVitals({ ...vitals, etatConscience: e.target.value as any })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-1 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Alerte">Alerte</option>
                  <option value="Voix">À la Voix</option>
                  <option value="Douleur">À la Douleur</option>
                  <option value="Inconscient">Inconscient</option>
                </select>
              </div>
            </div>

            {liveTriage.level === 'ROUGE' && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-[11px] text-rose-800 dark:text-rose-300 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Signes vitaux critiques détectés !
                </span>
                <p>{liveTriage.immediateABCDE[0]}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <HeartPulse className="w-4 h-4 animate-pulse" />
                <span>Raisonnement Clinique IA en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Générer le Rapport Structuré en 10 Points</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output: 10 Points Structured Report */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[750px]">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 shrink-0">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Rapport Médical Structuré (Format 10 Points)
              </span>
              {reportSource && (
                <span className="text-[10px] text-slate-400 block font-mono">
                  Généré via : {reportSource}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!report}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié' : 'Copier'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs leading-relaxed font-mono whitespace-pre-wrap text-slate-800 dark:text-slate-200">
            {report || (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 p-8 text-center">
                <Stethoscope className="w-10 h-10 text-slate-300 dark:text-slate-700 stroke-[1.5]" />
                <p className="max-w-xs text-xs">
                  Renseignez les données cliniques du patient à gauche ou sélectionnez un cas fréquent, puis lancez l'analyse structurée.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

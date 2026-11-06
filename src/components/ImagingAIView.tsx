import React, { useState } from 'react';
import {
  FileImage,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Layers,
  HeartPulse
} from 'lucide-react';

interface ImagingPreset {
  titre: string;
  modalite: string;
  contexte: string;
  constatations: string;
}

const IMAGING_PRESETS: ImagingPreset[] = [
  {
    titre: 'Pneumonie Franche Lobaire Aiguë (PFLA)',
    modalite: 'Radiographie Thoracique Face Debout',
    contexte: 'Adulte de 34 ans fébrile à 40°C avec point de côté thoracique droit et toux purulente.',
    constatations: 'Opacité alvéolaire dense, homogène, non rétractile occupant le lobe moyen droit, limitée par la petite scissure, avec présence d\'un bronchogramme aérique net. Culs-de-sac pleuraux libres.'
  },
  {
    titre: 'Tuberculose Pulmonaire Excavée Apicale',
    modalite: 'Radiographie Thoracique Face',
    contexte: 'Patient de 42 ans tousseur chronique depuis 1 mois, hémoptysies minimes et sueurs nocturnes.',
    constatations: 'Infiltrats nodulaires hétérogènes au sommet pulmonaire droit avec présence d\'une caverne à paroi épaisse mesurant 2,5 cm de diamètre. Rétraction scissurale apicale.'
  },
  {
    titre: 'Pneumothorax Droit Suffocant',
    modalite: 'Radiographie Thoracique en Urgence',
    contexte: 'Dyspnée aiguë brutale avec douleur thoracique en coup de poignard et polypnée à 38/min.',
    constatations: 'Hyperclarté avasculaire occupant la totalité de l\'hémithorax droit avec ligne de décollement pleural complète et poumon droit rétracté au hile. Déviation trachéale et refoulement médiastinal vers la gauche.'
  },
  {
    titre: 'Infarctus STEMI Antérieur Étendu (ECG)',
    modalite: 'Électrocardiogramme 12 Dérivations',
    contexte: 'Douleur rétrosternale constrictive irradiant au bras gauche depuis 45 minutes.',
    constatations: 'Sus-décalage convexe vers le haut du segment ST de plus de 4 mm en V1, V2, V3 et V4 (onde de Pardee) avec image en miroir (sous-décalage ST en DII, DIII, aVF).'
  },
  {
    titre: 'AVC Ischémique Sylvien Précoce',
    modalite: 'Scanner Cérébral sans injection',
    contexte: 'Hémoplégie droite brutale et aphasie motrice de Broca apparues il y a 2 heures.',
    constatations: 'Effacement précoce des sillons corticaux dans le territoire de l\'artère cérébrale moyenne gauche avec dédifférenciation substance blanche / substance grise au niveau du ruban insulaire.'
  }
];

export const ImagingAIView: React.FC = () => {
  const [modalite, setModalite] = useState<string>('Radiographie Thoracique Face Debout');
  const [contexte, setContexte] = useState<string>(
    'Patient fébrile avec polypnée et crépitants en base pulmonaire droite.'
  );
  const [constatations, setConstatations] = useState<string>(
    'Opacité triangulaire alvéolaire dense du lobe inférieur droit avec bronchogramme aérique visible.'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const applyPreset = (preset: ImagingPreset) => {
    setModalite(preset.modalite);
    setContexte(preset.contexte);
    setConstatations(preset.constatations);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysisResult('');
    try {
      const res = await fetch('/api/ai/image-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modality: modalite,
          clinicalContext: contexte,
          radiologicalFindings: constatations
        })
      });
      const data = await res.json();
      setAnalysisResult(data.analysis || 'Analyse terminée.');
    } catch (e: any) {
      setAnalysisResult(`Erreur d'analyse : ${e.message}`);
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
            <FileImage className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span>Imagerie Médicale AI — Assistance à l'Analyse Radiologique & ECG</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Détection séméiologique des opacités alvéolaires, foyers cavitaires, signes ischémiques et tracés électrocardiographiques d'urgence.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 shrink-0 font-medium">Cas séméiologiques :</span>
          {IMAGING_PRESETS.slice(0, 3).map((p, i) => (
            <button
              key={i}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300 whitespace-nowrap"
            >
              {p.titre.slice(0, 24)}...
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div>
              <label className="text-[11px] text-slate-500 font-bold block mb-1">
                Modalité d'Imagerie ou Examen :
              </label>
              <select
                value={modalite}
                onChange={(e) => setModalite(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-2 text-slate-900 dark:text-white font-medium"
              >
                <option value="Radiographie Thoracique Face Debout">Radiographie Thoracique Face</option>
                <option value="Scanner Cérébral sans injection">Scanner Cérébral sans injection</option>
                <option value="Électrocardiogramme 12 Dérivations">Électrocardiogramme (ECG 12D)</option>
                <option value="Échographie Abdominale & FAST">Échographie Abdominale & FAST</option>
                <option value="Radiographie Osseuse Membres / Bassin">Radiographie Osseuse</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 font-bold block mb-1">
                Contexte Clinique du Patient :
              </label>
              <textarea
                rows={3}
                value={contexte}
                onChange={(e) => setContexte(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white"
                placeholder="Âge, motif, constantes, signes d'auscultation..."
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 font-bold block mb-1">
                Constatations Séméiologiques & Anomalies Observées :
              </label>
              <textarea
                rows={5}
                value={constatations}
                onChange={(e) => setConstatations(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-white font-mono"
                placeholder="Description des opacités, contours, bronchogramme, sus-décalage ST..."
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyse Radiologique IA en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyser les Données Radiologiques</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[650px]">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Rapport d'Assistance Radiologique
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {modalite}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
            {analysisResult || (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 p-8 text-center">
                <FileImage className="w-10 h-10 text-slate-300 dark:text-slate-700 stroke-[1.5]" />
                <p className="max-w-xs text-xs">
                  Sélectionnez un cas séméiologique type ou décrivez les anomalies radiologiques d'un patient pour obtenir l'analyse structurée.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

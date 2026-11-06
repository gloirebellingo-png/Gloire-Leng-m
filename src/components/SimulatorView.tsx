import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Stethoscope,
  Activity,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  HeartPulse,
  Brain,
  Award
} from 'lucide-react';
import { SIMULATION_CASES } from '../services/simulationData';
import { ClinicalCaseSimulation } from '../types/medical';

export const SimulatorView: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-01-neuropalu');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Student inputs
  const [studentQuestions, setStudentQuestions] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [selectedTests, setSelectedTests] = useState<{ [testName: string]: boolean }>({});
  const [studentDiagnosis, setStudentDiagnosis] = useState<string>('');
  const [studentTreatment, setStudentTreatment] = useState<string>('');

  // Evaluation output
  const [evaluationLoading, setEvaluationLoading] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<string>('');

  const currentCase: ClinicalCaseSimulation =
    SIMULATION_CASES.find(c => c.id === selectedCaseId) || SIMULATION_CASES[0];

  const handleAddQuestion = (q: string) => {
    if (!studentQuestions.includes(q)) {
      setStudentQuestions(prev => [...prev, q]);
    }
  };

  const handleAddCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuestion.trim() && !studentQuestions.includes(customQuestion.trim())) {
      setStudentQuestions(prev => [...prev, customQuestion.trim()]);
      setCustomQuestion('');
    }
  };

  const toggleTest = (testName: string) => {
    setSelectedTests(prev => ({ ...prev, [testName]: !prev[testName] }));
  };

  const handleSubmitSimulation = async () => {
    setEvaluationLoading(true);
    setCurrentStep(5);
    setEvaluationResult('');

    try {
      const response = await fetch('/api/ai/simulate-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: currentCase.id,
          caseTitle: currentCase.titre,
          studentAnamnese: studentQuestions.join(' ; '),
          studentPhysical: 'Examen complet réalisé',
          studentTests: Object.keys(selectedTests).filter(k => selectedTests[k]).join(', '),
          studentDiagnosis,
          studentManagement: studentTreatment
        })
      });

      const data = await response.json();
      setEvaluationResult(data.evaluation || 'Évaluation enregistrée.');
    } catch (err: any) {
      setEvaluationResult(`Erreur lors de l'évaluation : ${err.message}`);
    } finally {
      setEvaluationLoading(false);
    }
  };

  const handleResetSimulation = () => {
    setCurrentStep(1);
    setStudentQuestions([]);
    setSelectedTests({});
    setStudentDiagnosis('');
    setStudentTreatment('');
    setEvaluationResult('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Simulateur Clinique & Patients Virtuels Interactifs</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mise en situation hospitalière : anamnèse, constantes, examens biologiques et débriefing socratique par l'IA.
          </p>
        </div>

        {/* Case selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCaseId}
            onChange={(e) => {
              setSelectedCaseId(e.target.value);
              handleResetSimulation();
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
          >
            {SIMULATION_CASES.map(c => (
              <option key={c.id} value={c.id}>
                Cas #{c.id} : {c.titre.slice(0, 40)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Case Context Banner */}
      <div className="bg-indigo-950/30 border border-indigo-800/50 p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
            Situation Clinique Initiale · {currentCase.specialite} ({currentCase.niveau})
          </span>
          <span className="text-[11px] font-mono text-indigo-300 bg-indigo-900/60 px-2.5 py-0.5 rounded-full">
            Patient : {currentCase.patientPresentation.age} ans ({currentCase.patientPresentation.sexe}), {currentCase.patientPresentation.poidsKg} kg
          </span>
        </div>

        <h2 className="text-sm font-bold text-white">
          {currentCase.patientPresentation.motif}
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed">
          {currentCase.patientPresentation.contexte}
        </p>
      </div>

      {/* Step Stepper */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
        {[
          { num: 1, label: '1. Interrogatoire' },
          { num: 2, label: '2. Examen Physique' },
          { num: 3, label: '3. Examens Labo' },
          { num: 4, label: '4. Diagnostic & Thérapeutique' },
          { num: 5, label: '5. Évaluation IA' }
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => s.num <= currentStep && setCurrentStep(s.num as any)}
            className={`flex items-center gap-1.5 font-medium transition ${
              currentStep === s.num
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : s.num < currentStep
                ? 'text-slate-600 dark:text-slate-400'
                : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === s.num
                  ? 'bg-indigo-600 text-white'
                  : s.num < currentStep
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        {/* STEP 1: INTERROGATOIRE */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Étape 1 : Interrogatoire du Patient Virtuel & Recueil de l'Anamnèse
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Sélectionnez les questions d'anamnèse pertinentes à poser à la famille ou formulez votre propre question.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Questions ciblées proposées :
              </span>
              <div className="flex flex-wrap gap-2">
                {currentCase.anamneseAttendue.map((q, idx) => {
                  const isAsked = studentQuestions.includes(q);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAddQuestion(q)}
                      className={`px-3 py-1.5 rounded-lg border text-left transition ${
                        isAsked
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300 font-medium'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isAsked ? '✓ ' : '+ '}
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom question input */}
            <form onSubmit={handleAddCustomQuestion} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Poser une autre question ciblée au patient ou à la mère..."
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                Poser
              </button>
            </form>

            {/* Recorded questions response box */}
            {studentQuestions.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Réponses obtenues lors de l'interrogatoire ({studentQuestions.length}) :
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  {studentQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span><strong>{q} :</strong> "La maman confirme que la fièvre a débuté il y a 2 jours, associée à des vomissements et l'impossibilité de boire depuis le matin. Une crise de secousses des 4 membres a duré environ 5 minutes il y a une heure."</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                Passer à l'Examen Physique →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EXAMEN PHYSIQUE & CONSTANTES */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Étape 2 : Examen Physique et Constantes Vitales
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Analysez attentivement les constantes et l'auscultation pour repérer les signes de gravité.
              </p>
            </div>

            {/* Constantes vitales table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block text-[9px]">Température</span>
                <strong className="text-rose-600 dark:text-rose-400 text-sm">
                  {currentCase.constantesInitiales.temperature}°C
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">FC</span>
                <strong className="text-sm">{currentCase.constantesInitiales.frequenceCardiaque} bpm</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">FR</span>
                <strong className="text-sm">{currentCase.constantesInitiales.frequenceRespiratoire} /min</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">SpO2</span>
                <strong className="text-sm">{currentCase.constantesInitiales.saturationO2}%</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">TA Sys/Dia</span>
                <strong className="text-sm">
                  {currentCase.constantesInitiales.taSystolique}/{currentCase.constantesInitiales.taDiastolique}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Glycémie</span>
                <strong className="text-rose-600 dark:text-rose-400 text-sm">
                  {currentCase.constantesInitiales.glycemieCapillaire || '--'} mg/dL
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Conscience</span>
                <strong className="text-amber-500 text-sm">
                  {currentCase.constantesInitiales.etatConscience}
                </strong>
              </div>
            </div>

            {/* Organ systems examination */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">
                Résultats de l'examen physique par appareil :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(currentCase.examenPhysiqueResultats).map(([systeme, constat]) => (
                  <div
                    key={systeme}
                    className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1"
                  >
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">
                      {systeme}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {constat}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
              >
                ← Retour Interrogatoire
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                Passer aux Examens Complémentaires →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EXAMENS COMPLÉMENTAIRES */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Étape 3 : Prescription des Examens Biologiques et Radiologiques
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Cochez uniquement les examens justifiés et accessibles en urgence. Les résultats réalistes s'affichent instantanément.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentCase.examensComplementairesDisponibles.map((test) => {
                const isChecked = !!selectedTests[test.nom];
                return (
                  <div
                    key={test.nom}
                    onClick={() => toggleTest(test.nom)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition space-y-1.5 ${
                      isChecked
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-700 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {test.nom}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Délai : {test.coutTemps}
                      </span>
                    </div>

                    {isChecked ? (
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-indigo-200 dark:border-indigo-900 text-indigo-950 dark:text-indigo-200 font-mono text-[11px]">
                        <strong>Résultat :</strong> {test.resultat}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 block">
                        Cliquer pour demander cet examen...
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
              >
                ← Retour Examen Physique
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                Passer au Diagnostic & Traitement →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DIAGNOSTIC & CONDUITE THÉRAPEUTIQUE */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Étape 4 : Diagnostic Retenu & Conduite Thérapeutique
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Rédigez vos hypothèses diagnostiques principales et vos propositions thérapeutiques immédiates au poids du patient.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  1. Hypothèses Diagnostiques & Diagnostic Principal :
                </label>
                <textarea
                  rows={3}
                  value={studentDiagnosis}
                  onChange={(e) => setStudentDiagnosis(e.target.value)}
                  placeholder="Ex: Paludisme grave à Plasmodium falciparum avec anémie sévère et hypoglycémie..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  2. Prise en Charge Thérapeutique Immédiate (Posologies au poids, gestes ABCDE, surveillance) :
                </label>
                <textarea
                  rows={5}
                  value={studentTreatment}
                  onChange={(e) => setStudentTreatment(e.target.value)}
                  placeholder="Ex: 1. Correction hypoglycémie par G10% 5 mL/kg. 2. Artésunate injectable 3,0 mg/kg à H0, H12, H24..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
              >
                ← Retour Examens
              </button>
              <button
                onClick={handleSubmitSimulation}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Soumettre pour Évaluation Socratique IA</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: ÉVALUATION SOCRATIQUE & DÉBRIEFING */}
        {currentStep === 5 && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-500" />
                  <span>Évaluation du Raisonnement Clinique de l'Étudiant</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  Cas #{currentCase.id} — {currentCase.titre}
                </span>
              </div>

              <button
                onClick={handleResetSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recommencer le Cas</span>
              </button>
            </div>

            {evaluationLoading ? (
              <div className="py-16 text-center space-y-3">
                <HeartPulse className="w-8 h-8 text-indigo-500 animate-pulse mx-auto" />
                <p className="text-slate-400 font-medium">
                  Le tuteur médical analyse votre démarche diagnostique et thérapeutique...
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 text-xs">
                  {evaluationResult}
                </div>

                {/* Expected Reference Answers Box */}
                <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-3">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300 text-xs block">
                    Corrigé Type du Collège Universitaire :
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Diagnostic exact :</strong>{' '}
                    <span className="text-slate-700 dark:text-slate-300">{currentCase.diagnosticCorrect}</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Prise en charge attendue :</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 mt-1">
                      {currentCase.priseEnChargeAttendue.map((pe, i) => (
                        <li key={i}>{pe}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-rose-600 dark:text-rose-400">Erreurs critiques à ne jamais commettre :</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-rose-700 dark:text-rose-300 mt-1">
                      {currentCase.erreursCritiquesAEviter.map((er, i) => (
                        <li key={i}>{er}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-indigo-200 dark:border-indigo-900/60 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Explication physiopathologique :</strong> {currentCase.explicationPhysiopathologique}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

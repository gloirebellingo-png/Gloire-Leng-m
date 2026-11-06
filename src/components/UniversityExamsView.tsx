import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Award,
  Sparkles,
  BookOpen,
  Loader2,
  FileText
} from 'lucide-react';
import { NotificationService } from '../services/notificationService';

interface ExamSubject {
  id: string;
  titre: string;
  faculte: string;
  dureeMinutes: number;
  casClinique: string;
  questions: {
    numero: number;
    enonce: string;
    points: number;
    motsClesAttendus: string[];
  }[];
}

const PRESET_EXAMS: ExamSubject[] = [
  {
    id: 'exam-peds-01',
    titre: 'Concours de Médecine — Pédiatrie & Urgences Tropicales',
    faculte: 'Faculté de Médecine / Épreuve Nationale d\'Internat',
    dureeMinutes: 15,
    casClinique: `Un nourrisson de 18 mois, pesant 10 kg, est amené aux urgences pour fièvre à 39.8°C depuis 48 heures, vomissements incoercibles et convulsions tonico-cloniques généralisées ayant duré 10 minutes.
À l'examen : Enfant comateux (Score de Blantyre à 1/5), pâleur conjonctivale intense, polypnée à 48 cpm, tirage sous-costal modéré, temps de recoloration cutanée à 3 secondes. Le test de diagnostic rapide (TDR) du paludisme est positif pour Plasmodium falciparum. La glycémie capillaire est à 42 mg/dL.`,
    questions: [
      {
        numero: 1,
        enonce: 'Formulez le diagnostic principal complet avec les critères de gravité OMS présents dans cette observation.',
        points: 6,
        motsClesAttendus: ['Paludisme grave', 'Neuropaludisme', 'Convulsions répétées', 'Coma Blantyre <= 2', 'Hypoglycémie', 'Anémie sévère suspectée', 'Détresse respiratoire']
      },
      {
        numero: 2,
        enonce: 'Détaillez la prise en charge médicale d\'urgence immédiate des 30 premières minutes (gestes de stabilisation, réanimation métabolique et traitement antipaludique d\'attaque selon les directives OMS).',
        points: 8,
        motsClesAttendus: ['Liberté des voies aériennes', 'Oxygène', 'Correction hypoglycémie G10% 2 mL/kg', 'Diazepam ou Clonazepam intra-rectal si convulsion', 'Artésunate IV 3,0 mg/kg', 'H0 H12 H24', 'Perfusion réhydratation prudente']
      },
      {
        numero: 3,
        enonce: 'Quels examens complémentaires urgents demandez-vous au chevet du patient et quelles complications redoutées surveillerez-vous au cours des 24 premières heures ?',
        points: 6,
        motsClesAttendus: ['Goutte épaisse', 'NFS hématocrite', 'Gaz du sang / Lactates', 'Ionogramme créatinine', 'Ponction lombaire après stabilisation', 'Œdème cérébral', 'Hémolyse retardée', 'Acidose métabolique', 'Engagement cérébral']
      }
    ]
  },
  {
    id: 'exam-gyneco-02',
    titre: 'Examen Clinique — Gynécologie-Obstétrique & Mère-Enfant',
    faculte: 'Certificat de Fin d\'Études Médicales / Diplôme de Docteur',
    dureeMinutes: 15,
    casClinique: `Une primigeste de 22 ans, à 34 semaines d'aménorrhée, consulte pour céphalées pulsatiles intenses rebelles au paracétamol, phosphènes (mouches volantes) et douleurs épigastriques vives en barre.
Constantes : PA = 175/110 mmHg à deux reprises, protéinurie à la bandelette urinaire = +++ (3+), réflexes ostéotendineux très vifs et diffus. Les bruits du cœur fœtaux sont réguliers à 144 bpm.`,
    questions: [
      {
        numero: 1,
        enonce: 'Quel est votre diagnostic syndromique précis ? Quels sont les signes précurseurs imminents d\'une complication neurologique mortelle ?',
        points: 6,
        motsClesAttendus: ['Pré-éclampsie sévère', 'Signes de pré-éclampsie grave', 'Céphalées en casque', 'Troubles visuels phosphènes', 'Barre épigastrique de Chaussier', 'Hyperréflexie tendineuse', 'Menace d\'éclampsie']
      },
      {
        numero: 2,
        enonce: 'Rédigez le protocole thérapeutique médicamenteux immédiat de référence (anti-convulsivant et anti-hypertenseur) en précisant les doses d\'attaque et la surveillance stricte de toxicité.',
        points: 8,
        motsClesAttendus: ['Sulfate de magnésium', 'Protocole Zuspan', '4 g IV lente en 15-20 min', 'Entretien 1 g/h IVSE', 'Nicardipine ou Labbétalol IV', 'Surveillance diurèse horaire > 30 mL/h', 'ROT rotuliens présents', 'Fréquence respiratoire > 12/min', 'Gluconate de calcium antidote disponible']
      },
      {
        numero: 3,
        enonce: 'Quelle est la conduite à tenir obstétricale et fœtale ? Quelles sont les indications de l\'extraction fœtale en urgence ?',
        points: 6,
        motsClesAttendus: ['Corticothérapie de maturation pulmonaire fœtale', 'Bétaméthasone 12 mg IM', 'Extraction fœtale si crise d\'éclampsie', 'HELLP syndrome', 'HRP hématome rétro-placentaire', 'Souffrance fœtale aiguë', 'Voie haute césarienne']
      }
    ]
  }
];

export const UniversityExamsView: React.FC = () => {
  const [selectedExamId, setSelectedExamId] = useState<string>(PRESET_EXAMS[0].id);
  const exam = PRESET_EXAMS.find(e => e.id === selectedExamId) || PRESET_EXAMS[0];

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(exam.dureeMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Student responses per question
  const [answers, setAnswers] = useState<{ [qNum: number]: string }>({});

  // Grading state
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<string | null>(null);

  // Reset timer when exam changes
  useEffect(() => {
    setTimeLeft(exam.dureeMinutes * 60);
    setIsRunning(false);
    setAnswers({});
    setExamResult(null);
  }, [selectedExamId]);

  // Countdown tick
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          clearInterval(interval);
          NotificationService.addNotification({
            titre: 'Fin du temps d\'examen universitaire !',
            message: `Le temps alloué pour l'épreuve "${exam.titre}" est écoulé. Veuillez soumettre vos réponses.`,
            categorie: 'ACADEMIE',
            priorite: 'URGENTE',
            lienTab: 'examens_univ'
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, exam.titre]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleGradeExam = async () => {
    setIsGrading(true);
    setExamResult(null);

    const questionsWithAnswers = exam.questions.map(q => ({
      numero: q.numero,
      enonce: q.enonce,
      bareme: q.points,
      reponseEtudiant: answers[q.numero] || 'Aucune réponse fournie.',
      motsClesAttendus: q.motsClesAttendus
    }));

    try {
      const res = await fetch('/api/ai/exam-grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titreExamen: exam.titre,
          casClinique: exam.casClinique,
          questions: questionsWithAnswers
        })
      });
      const data = await res.json();
      setExamResult(data.gradingReport || 'Évaluation terminée avec succès.');

      NotificationService.addNotification({
        titre: 'Résultat d\'Examen Universitaire Disponible',
        message: `Votre copie pour "${exam.titre}" a été corrigée avec analyse détaillée des points et mots-clés.`,
        categorie: 'ACADEMIE',
        priorite: 'NORMALE',
        lienTab: 'examens_univ'
      });
    } catch {
      // Local fallback calculation
      let totalPts = 0;
      let detailedOutput = `### Résultat de l'Évaluation Universitaire (Mode Local)\n\n`;
      detailedOutput += `**Épreuve :** ${exam.titre} (${exam.faculte})\n\n`;

      exam.questions.forEach(q => {
        const studentAns = (answers[q.numero] || '').toLowerCase();
        let matchedKeywords = 0;
        q.motsClesAttendus.forEach(kw => {
          if (studentAns.includes(kw.toLowerCase())) matchedKeywords++;
        });

        const scorePart = q.motsClesAttendus.length > 0
          ? Number(((matchedKeywords / q.motsClesAttendus.length) * q.points).toFixed(1))
          : Math.round(q.points * 0.7);

        totalPts += scorePart;

        detailedOutput += `#### Question ${q.numero} (${scorePart} / ${q.points} pts)\n`;
        detailedOutput += `- **Mots-clés retrouvés :** ${matchedKeywords} / ${q.motsClesAttendus.length}\n`;
        detailedOutput += `- **Mots-clés requis :** ${q.motsClesAttendus.join(', ')}\n\n`;
      });

      detailedOutput += `### Note Globale : ${totalPts.toFixed(1)} / 20\n\n`;
      detailedOutput += `*Mention : ${totalPts >= 16 ? 'Très Bien' : totalPts >= 14 ? 'Bien' : totalPts >= 10 ? 'Admis' : 'Ajourné — Révisez les protocoles d\'urgence OMS.'}*`;
      setExamResult(detailedOutput);
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Examens & Concours Universitaires Interactifs
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Dossiers cliniques progressifs chronométrés, correction analytique par l'IA et notation selon barème académique.
          </p>
        </div>

        {/* Exam selector */}
        <select
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
          className="text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {PRESET_EXAMS.map(ex => (
            <option key={ex.id} value={ex.id}>
              {ex.titre}
            </option>
          ))}
        </select>
      </div>

      {/* Timer & Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
            timeLeft < 180
              ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
          }`}>
            <Clock className="w-5 h-5 text-indigo-500" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-900 dark:text-white block">
              {exam.faculte}
            </span>
            <span className="text-[11px] text-slate-500">
              Durée officielle : {exam.dureeMinutes} minutes · Total sur 20 points
            </span>
          </div>
        </div>

        {/* Play / Pause / Reset Buttons */}
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Démarrer l'Épreuve</span>
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(exam.dureeMinutes * 60);
            }}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition"
            title="Réinitialiser le chronomètre"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clinical Vignette Box */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Énoncé du Dossier Clinique
          </h2>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          {exam.casClinique}
        </p>
      </div>

      {/* Questions & Student Answers */}
      <div className="space-y-6">
        {exam.questions.map(q => (
          <div
            key={q.numero}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Question n°{q.numero}
              </span>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Barème : {q.points} points
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              {q.enonce}
            </p>

            <textarea
              rows={4}
              value={answers[q.numero] || ''}
              onChange={(e) => setAnswers({ ...answers, [q.numero]: e.target.value })}
              placeholder="Rédigez votre réponse argumentée avec termes médicaux précis, posologies exactes et justification clinique..."
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
            />
          </div>
        ))}

        {/* Submit Copie Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={handleGradeExam}
            disabled={isGrading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm transition disabled:opacity-50"
          >
            {isGrading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Correction universitaire par l'IA en cours...
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                Soumettre la Copie & Obtenir la Note avec Corrigé
              </>
            )}
          </button>
          <span className="text-[11px] text-slate-500">
            Notation automatique sur les critères de la Faculté et des sociétés savantes
          </span>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {examResult && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Rapport de Correction du Jury d'Examen
              </h3>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              Copie Évaluée
            </span>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono">
            {examResult}
          </div>
        </div>
      )}
    </div>
  );
};

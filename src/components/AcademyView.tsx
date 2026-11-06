import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { ACADEMY_LESSONS, ACADEMY_QUIZ } from '../services/academyData';
import { AcademyLesson } from '../types/medical';

export const AcademyView: React.FC = () => {
  const [activeCycle, setActiveCycle] = useState<'fondamentale' | 'preclinique' | 'clinique'>('clinique');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('lesson-semio-choc');
  const [viewMode, setViewMode] = useState<'cours' | 'quiz'>('cours');

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredLessons = ACADEMY_LESSONS.filter(l => l.cycle === activeCycle);
  const currentLesson = ACADEMY_LESSONS.find(l => l.id === selectedLessonId) || ACADEMY_LESSONS[0];

  const currentQuestion = ACADEMY_QUIZ[currentQuizIndex];

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuestion.bonneReponseIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex + 1 < ACADEMY_QUIZ.length) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>MEDECINE AI Académie — Université Médicale Numérique</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enseignement progressif en 3 cycles : sciences fondamentales, précliniques et cliniques hospitalières.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <button
            onClick={() => setViewMode('cours')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              viewMode === 'cours'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Cours & Fiches Séméiologiques
          </button>
          <button
            onClick={() => setViewMode('quiz')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              viewMode === 'quiz'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Banque QCM & Évaluation
          </button>
        </div>
      </div>

      {viewMode === 'cours' ? (
        <div className="space-y-6">
          {/* Cycle selector */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setActiveCycle('fondamentale')}
              className={`p-3 rounded-xl border text-left transition ${
                activeCycle === 'fondamentale'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              <span className="text-[10px] uppercase font-bold block opacity-80">1er Cycle</span>
              <span className="text-xs font-bold block mt-0.5">Sciences Fondamentales</span>
              <span className="text-[10px] text-indigo-200 block mt-1">Anatomie, Physiologie, Biochimie</span>
            </button>

            <button
              onClick={() => setActiveCycle('preclinique')}
              className={`p-3 rounded-xl border text-left transition ${
                activeCycle === 'preclinique'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              <span className="text-[10px] uppercase font-bold block opacity-80">2ème Cycle</span>
              <span className="text-xs font-bold block mt-0.5">Sciences Précliniques</span>
              <span className="text-[10px] text-indigo-200 block mt-1">Microbiologie, Parasitologie, Immunologie</span>
            </button>

            <button
              onClick={() => setActiveCycle('clinique')}
              className={`p-3 rounded-xl border text-left transition ${
                activeCycle === 'clinique'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              <span className="text-[10px] uppercase font-bold block opacity-80">3ème Cycle / Doctorat</span>
              <span className="text-xs font-bold block mt-0.5">Sciences Cliniques</span>
              <span className="text-[10px] text-indigo-200 block mt-1">Sémiologie, Pédiatrie, Urgences</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left list of lessons */}
            <div className="lg:col-span-4 space-y-3">
              {filteredLessons.map((lesson) => {
                const isSelected = lesson.id === currentLesson.id;
                return (
                  <div
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition text-left space-y-1.5 ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      {lesson.matiere}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {lesson.titre}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {lesson.resume}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right lesson content */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {currentLesson.matiere} · Enseignement Académique
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {currentLesson.titre}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {currentLesson.resume}
                </p>

                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Objectifs Pédagogiques du Cours :
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 text-[11px]">
                    {currentLesson.objectifsPedagogiques.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Detailed lesson prose */}
              <div className="space-y-3 leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                {currentLesson.contenuDetaille}
              </div>

              {/* Summary table */}
              {currentLesson.tableauSynthese && (
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Tableau Récapitulatif Séméiologique & Thérapeutique :
                  </span>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          {currentLesson.tableauSynthese.entete.map((h, i) => (
                            <th key={i} className="p-2.5">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {currentLesson.tableauSynthese.lignes.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2.5 font-medium">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Key points to remember */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 rounded-xl space-y-2">
                <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Points Clés à Retenir pour l'Examen :</span>
                </span>
                <ul className="space-y-1 text-indigo-950 dark:text-indigo-200 text-[11px]">
                  {currentLesson.pointsClesARetenir.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Mode */
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
          {!quizFinished ? (
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Question {currentQuizIndex + 1} sur {ACADEMY_QUIZ.length}
                  </span>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Matière : {currentQuestion.matiere}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Score : {quizScore} / {currentQuizIndex}
                  </span>
                </div>
              </div>

              {/* Question text */}
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* Options list */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, oIdx) => {
                  let optionClass =
                    'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200';

                  if (isAnswerSubmitted) {
                    if (oIdx === currentQuestion.bonneReponseIndex) {
                      optionClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (selectedOption === oIdx) {
                      optionClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    }
                  } else if (selectedOption === oIdx) {
                    optionClass = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-semibold';
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedOption(oIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${optionClass}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="text-xs leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback box when submitted */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    {selectedOption === currentQuestion.bonneReponseIndex ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Bonne réponse !
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Réponse incorrecte
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentQuestion.explicationMedicale}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-100 dark:border-slate-800">
                    Référence : {currentQuestion.referenceOMS}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleSubmitAnswer}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                  >
                    Valider la réponse
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>Question Suivante</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed Final Score */
            <div className="text-center py-8 space-y-4">
              <Award className="w-12 h-12 text-indigo-500 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Évaluation QCM Terminée !
              </h2>
              <p className="text-sm font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                Votre score : {quizScore} / {ACADEMY_QUIZ.length} ({Math.round((quizScore / ACADEMY_QUIZ.length) * 100)}%)
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {quizScore >= 4
                  ? 'Excellent niveau de connaissances cliniques et de conformité aux protocoles sanitaires.'
                  : 'Révisez les fiches séméiologiques et les posologies pédiatriques dans l\'onglet Cours.'}
              </p>
              <div className="pt-4">
                <button
                  onClick={handleRestartQuiz}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Recommencer le Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

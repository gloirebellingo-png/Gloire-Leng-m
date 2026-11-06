import React from 'react';
import {
  Activity,
  Stethoscope,
  Grid,
  AlertTriangle,
  Pill,
  Users,
  FileText,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  FlaskConical,
  Scan,
  FileCheck2,
  LineChart,
  Box,
  Award,
  Calculator,
  BookOpen,
  Library
} from 'lucide-react';
import { UserRole } from '../types/medical';

export type MainTab =
  | 'dashboard'
  | 'assistant'
  | 'specialties'
  | 'urgences'
  | 'pharmacologie'
  | 'patients'
  | 'laboratoire'
  | 'imagerie'
  | 'prescription'
  | 'monitoring'
  | 'anatomie3d'
  | 'protocoles_rdc'
  | 'academie'
  | 'simulateur'
  | 'examens_univ'
  | 'rapports'
  | 'calculateurs'
  | 'dictionnaire'
  | 'bibliotheque'
  | 'audit';

interface SidebarProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole
}) => {
  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 flex flex-col justify-between shrink-0 overflow-y-auto max-h-[calc(100vh-57px)]">
      <div className="space-y-5">
        {/* Section 1: Pratique Clinique */}
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 px-3 block mb-1.5">
            Pratique Clinique & Soins
          </span>
          <div className="space-y-0.5">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'dashboard'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span>Tableau de bord</span>
            </button>

            <button
              onClick={() => onSelectTab('assistant')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'assistant'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 shrink-0" />
              <span>Assistant Médical IA</span>
            </button>

            <button
              onClick={() => onSelectTab('specialties')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'specialties'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5 shrink-0" />
              <span>14 Spécialités Médicales</span>
            </button>

            <button
              onClick={() => onSelectTab('urgences')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'urgences'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>Urgences Vitales ABCDE</span>
            </button>

            <button
              onClick={() => onSelectTab('monitoring')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'monitoring'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <LineChart className="w-3.5 h-3.5 shrink-0" />
              <span>Surveillance & Score MEWS</span>
            </button>

            <button
              onClick={() => onSelectTab('prescription')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'prescription'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 shrink-0" />
              <span>Assistant Prescription</span>
            </button>

            <button
              onClick={() => onSelectTab('pharmacologie')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'pharmacologie'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <Pill className="w-3.5 h-3.5 shrink-0" />
              <span>Pharmacologie & Doses</span>
            </button>

            <button
              onClick={() => onSelectTab('patients')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'patients'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>Dossiers Patients (DPI)</span>
            </button>

            <button
              onClick={() => onSelectTab('rapports')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'rapports'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Comptes Rendus & Billets</span>
            </button>
          </div>
        </div>

        {/* Section 2: Outils Diagnostiques & IA */}
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 px-3 block mb-1.5">
            Diagnostics Avancés & IA
          </span>
          <div className="space-y-0.5">
            <button
              onClick={() => onSelectTab('laboratoire')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'laboratoire'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
              <span>Laboratoire AI (Biologie)</span>
            </button>

            <button
              onClick={() => onSelectTab('imagerie')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'imagerie'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <Scan className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
              <span>Imagerie Médicale & ECG</span>
            </button>

            <button
              onClick={() => onSelectTab('calculateurs')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'calculateurs'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 shrink-0" />
              <span>Calculateurs Médicaux</span>
            </button>
          </div>
        </div>

        {/* Section 3: Formation Universitaire & 3D */}
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 px-3 block mb-1.5">
            Formation & Université
          </span>
          <div className="space-y-0.5">
            <button
              onClick={() => onSelectTab('anatomie3d')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'anatomie3d'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <Box className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span>Anatomie Humaine 3D</span>
            </button>

            <button
              onClick={() => onSelectTab('academie')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'academie'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span>Académie & QCM</span>
            </button>

            <button
              onClick={() => onSelectTab('simulateur')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'simulateur'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Simulateur Clinique</span>
            </button>

            <button
              onClick={() => onSelectTab('examens_univ')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'examens_univ'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>Examens Universitaires</span>
            </button>
          </div>
        </div>

        {/* Section 4: Références Scientifiques & Lexique */}
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 px-3 block mb-1.5">
            Documentation & Science
          </span>
          <div className="space-y-0.5">
            <button
              onClick={() => onSelectTab('dictionnaire')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'dictionnaire'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Dictionnaire Médical</span>
            </button>

            <button
              onClick={() => onSelectTab('bibliotheque')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'bibliotheque'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <Library className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
              <span>Bibliothèque Scientifique OMS</span>
            </button>

            <button
              onClick={() => onSelectTab('protocoles_rdc')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                activeTab === 'protocoles_rdc'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Protocoles RDC / OMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Sécurité & Audit */}
      <div className="pt-3 mt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => onSelectTab('audit')}
          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
            activeTab === 'audit'
              ? 'bg-slate-800 text-white'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-sky-500" />
          <span>Sécurité & Déontologie</span>
        </button>

        <p className="text-[9px] text-slate-400 dark:text-slate-500 px-3 pt-1.5 leading-tight">
          Aide à la décision clinique · Validation humaine obligatoire.
        </p>
      </div>
    </aside>
  );
};

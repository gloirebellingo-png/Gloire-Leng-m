import React from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck,
  AlertOctagon,
  Users,
  Clock,
  CheckCircle,
  Database
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { UserRole } from '../types/medical';

interface AuditViewProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ currentRole, onRoleChange }) => {
  const auditLogs = StorageService.getAuditLogs();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <span>Sécurité, Déontologie Médicale & Journalisation (Audit Trail)</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Garanties de confidentialité, traçabilité des actes médicaux et gestion des rôles d'accès hospitaliers.
        </p>
      </div>

      {/* Legal & Ethical Responsibility Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200">
            Cadre Déontologique & Principe de Non-Substitution Thérapeutique
          </h2>
        </div>
        <div className="text-xs text-amber-900/90 dark:text-amber-200/90 space-y-1.5 leading-relaxed">
          <p>
            • <strong>Aide à la Décision Clinique (CDS) :</strong> MEDECINE AI est un système de support cognitif et de formation. Il ne remplace sous aucun prétexte le jugement clinique individuel, l'interrogatoire direct et l'examen physique complet d'un médecin ou soignant qualifié.
          </p>
          <p>
            • <strong>Interdiction de Prescription Autonome :</strong> Aucune prescription médicamenteuse, aucun diagnostic définitif et aucune décision d'intervention invasive ne peut être validée de manière automatisée par l'intelligence artificielle.
          </p>
          <p>
            • <strong>Urgences Vitales :</strong> En présence de tout signe de détresse vitale (SpO2 &lt; 90%, choc circulatoire, coma, convulsions actives), les mesures immédiates de réanimation ABCDE doivent être engagées sans différer la prise en charge pour attendre un résultat algorithmique.
          </p>
        </div>
      </div>

      {/* RBAC Roles Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-500" />
          <span>Contrôle d'Accès Basé sur les Rôles (RBAC)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            {
              role: 'MEDECIN',
              nom: 'Médecin / Spécialiste',
              permissions: ['Validation des ordonnances', 'Accès complet aux dossiers', 'Export des comptes-rendus']
            },
            {
              role: 'INFIRMIER',
              nom: 'Infirmier / Praticien',
              permissions: ['Saisie des constantes', 'Protocoles de triage d\'urgence', 'Administration médicamenteuse']
            },
            {
              role: 'ETUDIANT',
              nom: 'Étudiant en Médecine',
              permissions: ['Accès à l\'Académie médicale', 'Simulateur de cas virtuels', 'Dossiers anonymisés']
            },
            {
              role: 'ENSEIGNANT',
              nom: 'Professeur / Tuteur',
              permissions: ['Supervision pédagogique', 'Banque de questions QCM', 'Évaluation socratique']
            }
          ].map((r) => {
            const isCurrent = currentRole === r.role;
            return (
              <div
                key={r.role}
                onClick={() => onRoleChange(r.role as UserRole)}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                  isCurrent
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{r.nom}</span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-950 px-1.5 py-0.5 rounded">
                      Actif
                    </span>
                  )}
                </div>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                  {r.permissions.map((p, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <span className="text-emerald-500 font-bold text-[10px]">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Log Trail */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Journal d'Audit et de Traçabilité des Accès
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {auditLogs.length} événements enregistrés
          </span>
        </div>

        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {log.action}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Rôle : {log.userRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {log.details}
                  </p>
                </div>

                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">
              Aucun événement consigné dans ce journal local.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

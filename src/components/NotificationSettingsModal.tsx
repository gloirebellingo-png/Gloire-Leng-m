import React, { useState } from 'react';
import {
  Settings,
  X,
  Bell,
  Volume2,
  Users,
  ShieldAlert,
  GraduationCap,
  BookOpen,
  Clock,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { NotificationSettings } from '../types/medical';
import { NotificationService } from '../services/notificationService';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [settings, setSettings] = useState<NotificationSettings>(() => NotificationService.getSettings());
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggle = (key: keyof NotificationSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    NotificationService.saveSettings(updated);
  };

  const handleRequestPush = async () => {
    const granted = await NotificationService.requestPushPermission();
    if (granted) {
      setPushStatusMessage('Notifications système autorisées avec succès.');
      setSettings(NotificationService.getSettings());
    } else {
      setPushStatusMessage('Permission refusée par le navigateur ou appareil non compatible.');
    }
    setTimeout(() => setPushStatusMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Paramètres des Notifications
              </h2>
              <p className="text-xs text-slate-500">
                Préférences de diffusion, alertes sonores et confidentialité
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs">
          {/* Push & Sound Section */}
          <div className="space-y-3">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Système & Alertes Sonores
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <Bell className="w-4 h-4 text-sky-500 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Notifications Push Navigateur & Android
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Recevez les alertes d'urgences et de surveillance même en arrière-plan.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRequestPush}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                  settings.autoriserPush
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                }`}
              >
                {settings.autoriserPush ? 'Activé' : 'Activer Push'}
              </button>
            </div>

            {pushStatusMessage && (
              <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-[11px] text-sky-800 dark:text-sky-200 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{pushStatusMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <Volume2 className="w-4 h-4 text-indigo-500 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Carillon Sonore Discret
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Émet une fréquence harmonique douce lors des alertes critiques.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoriserSon}
                onChange={() => handleToggle('autoriserSon')}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
              />
            </div>
          </div>

          {/* Categories Toggle */}
          <div className="space-y-3">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Catégories de Notifications
            </h3>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-sky-500" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Suivi des patients (Constantes, MEWS, Soins)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.activerPatients}
                  onChange={() => handleToggle('activerPatients')}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Alertes de sécurité médicale & Contre-indications
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.activerSecurite}
                  onChange={() => handleToggle('activerSecurite')}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Académie, cours & rappels de révisions
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.activerAcademie}
                  onChange={() => handleToggle('activerAcademie')}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Publications scientifiques & Directives OMS
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.activerPublications}
                  onChange={() => handleToggle('activerPublications')}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Rappels personnalisés et minuteries cliniques
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.activerRappels}
                  onChange={() => handleToggle('activerRappels')}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
              </label>
            </div>
          </div>

          {/* Privacy & Locked Screen Protection */}
          <div className="space-y-3">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Confidentialité Médicale (Secret Professionnel)
            </h3>

            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.masquerDonneesEcranVerrouille}
                  onChange={() => handleToggle('masquerDonneesEcranVerrouille')}
                  className="rounded border-amber-400 text-amber-600 focus:ring-amber-500 h-4 w-4 mt-0.5"
                />
                <div>
                  <span className="font-bold text-amber-900 dark:text-amber-200 block">
                    Masquer les données nominatives et médicales sur l'écran verrouillé
                  </span>
                  <span className="text-amber-800/90 dark:text-amber-300/80 text-[11px] block mt-0.5">
                    Obligation déontologique : Aucune identité de patient, pathologie ou prescription ne sera visible sans déverrouillage de l'appareil.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
          >
            Fermer & Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

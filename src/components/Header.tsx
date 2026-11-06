import React from 'react';
import { Download, Shield, Sun, Moon, Wifi, WifiOff, Bell, Settings } from 'lucide-react';
import { UserRole } from '../types/medical';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWA';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  activeTab: string;
  onSelectTab: (tab: any) => void;
  onOpenNotifications: () => void;
  onOpenNotificationSettings: () => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  isDark,
  onToggleTheme,
  activeTab,
  onSelectTab,
  onOpenNotifications,
  onOpenNotificationSettings,
  unreadNotificationsCount
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showIOSModal, setShowIOSModal] = React.useState(false);

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur px-6 py-3.5 flex items-center justify-between gap-8 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#dashboard" 
          onClick={(e) => { e.preventDefault(); onSelectTab('dashboard'); }}
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
        >
          MEDECINE <span className="text-sky-600 dark:text-sky-400">AI</span>
        </a>
      </div>

      {/* Zone 2: 4-5 clean single-line navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300">
        <button 
          onClick={() => onSelectTab('dashboard')} 
          className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'dashboard' ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''}`}
        >
          Tableau de bord
        </button>
        <button 
          onClick={() => onSelectTab('assistant')} 
          className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'assistant' ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''}`}
        >
          Assistant Clinique
        </button>
        <button 
          onClick={() => onSelectTab('urgences')} 
          className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'urgences' ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''}`}
        >
          Urgences ABCDE
        </button>
        <button 
          onClick={() => onSelectTab('pharmacologie')} 
          className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'pharmacologie' ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''}`}
        >
          Calculateur Doses
        </button>
        <button 
          onClick={() => onSelectTab('protocoles_rdc')} 
          className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'protocoles_rdc' ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''}`}
        >
          Protocoles RDC & OMS
        </button>
      </nav>

      {/* Zone 3: Actions & Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Connectivity status icon */}
        <div 
          className="flex items-center text-xs text-slate-500 dark:text-slate-400"
          title={isOnline ? "Connecté au réseau" : "Mode Hors-ligne actif — Protocoles en cache"}
        >
          {isOnline ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-500" aria-label="En ligne" />
          ) : (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Hors-ligne</span>
            </span>
          )}
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs">
          <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
          <select 
            value={currentRole} 
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
            aria-label="Sélectionner le rôle utilisateur"
          >
            <option value="MEDECIN">Médecin</option>
            <option value="INFIRMIER">Infirmier</option>
            <option value="ETUDIANT">Étudiant Médecine</option>
            <option value="ENSEIGNANT">Enseignant / Tuteur</option>
          </select>
        </div>

        {/* PWA Install Button */}
        {isInstallable && !isInstalled && (
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition whitespace-nowrap shrink-0"
            title="Installer MEDECINE AI sur cet appareil"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Installer l'App</span>
          </button>
        )}

        {isIOS && !isInstalled && (
          <button
            onClick={() => setShowIOSModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Installer iOS</span>
          </button>
        )}

        {/* Notification Bell Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition"
          aria-label="Centre de notifications et alertes"
          title="Centre de notifications et alertes"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Notification Settings Button */}
        <button
          onClick={onOpenNotificationSettings}
          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition"
          aria-label="Paramètres des notifications"
          title="Paramètres des notifications"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition"
          aria-label="Basculer le thème clair ou sombre"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Installer sur iPhone ou iPad</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              1. Appuyez sur le bouton <strong>Partager</strong> dans la barre Safari.<br />
              2. Faites défiler vers le bas et touchez <strong>Sur l'écran d'accueil</strong>.<br />
              3. L'application fonctionnera hors-ligne avec les protocoles RDC et OMS.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full rounded-lg bg-sky-600 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

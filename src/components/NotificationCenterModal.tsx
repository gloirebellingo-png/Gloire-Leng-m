import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Users,
  Shield,
  GraduationCap,
  BookOpen,
  Clock,
  ExternalLink,
  Plus
} from 'lucide-react';
import { AppNotification, NotificationCategory } from '../types/medical';
import { NotificationService } from '../services/notificationService';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: any) => void;
  onRefreshCount: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onRefreshCount
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'ALL'>('ALL');
  const [quickReminderText, setQuickReminderText] = useState<string>('');
  const [quickReminderMinutes, setQuickReminderMinutes] = useState<number>(30);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setNotifications(NotificationService.getNotifications());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkAsRead = (id: string) => {
    NotificationService.markAsRead(id);
    setNotifications(NotificationService.getNotifications());
    onRefreshCount();
  };

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead();
    setNotifications(NotificationService.getNotifications());
    onRefreshCount();
  };

  const handleDelete = (id: string) => {
    NotificationService.deleteNotification(id);
    setNotifications(NotificationService.getNotifications());
    onRefreshCount();
  };

  const handleClearAll = () => {
    NotificationService.clearAll();
    setNotifications([]);
    onRefreshCount();
  };

  const handleItemClick = (notif: AppNotification) => {
    handleMarkAsRead(notif.id);
    if (notif.lienTab) {
      onSelectTab(notif.lienTab);
      onClose();
    }
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReminderText.trim()) return;

    NotificationService.addNotification({
      titre: `Rappel Clinique (${quickReminderMinutes} min)`,
      message: quickReminderText.trim(),
      categorie: 'RAPPEL',
      priorite: 'NORMALE',
      lienTab: 'monitoring'
    });

    setQuickReminderText('');
    setShowAddForm(false);
    setNotifications(NotificationService.getNotifications());
    onRefreshCount();
  };

  const filtered = notifications.filter(n => {
    if (selectedCategory === 'ALL') return true;
    return n.categorie === selectedCategory;
  });

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'PATIENT': return <Users className="w-4 h-4 text-sky-500" />;
      case 'SECURITE': return <Shield className="w-4 h-4 text-rose-500" />;
      case 'ACADEMIE': return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      case 'PUBLICATION': return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case 'RAPPEL': return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Centre de Notifications & Alertes
              </h2>
              <p className="text-xs text-slate-500">
                {notifications.filter(n => !n.lue).length} notification(s) non lue(s)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouveau rappel</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Reminder Form */}
        {showAddForm && (
          <form onSubmit={handleCreateReminder} className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Créer un Rappel Personnalisé</span>
              <span className="text-[10px] text-slate-400">Notification in-app & Push</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                value={quickReminderText}
                onChange={(e) => setQuickReminderText(e.target.value)}
                placeholder="Ex: Contrôler glycémie lit 4, Réviser protocole Zuspan..."
                className="sm:col-span-3 text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                required
              />
              <select
                value={quickReminderMinutes}
                onChange={(e) => setQuickReminderMinutes(parseInt(e.target.value))}
                className="text-xs px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value={15}>Dans 15 min</option>
                <option value={30}>Dans 30 min</option>
                <option value={60}>Dans 1 heure</option>
                <option value={120}>Dans 2 heures</option>
                <option value={240}>Dans 4 heures</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition"
              >
                Enregistrer le Rappel
              </button>
            </div>
          </form>
        )}

        {/* Filter Pills */}
        <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setSelectedCategory('PATIENT')}
              className={`px-2.5 py-1 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === 'PATIENT'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Patients
            </button>
            <button
              onClick={() => setSelectedCategory('SECURITE')}
              className={`px-2.5 py-1 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === 'SECURITE'
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Sécurité
            </button>
            <button
              onClick={() => setSelectedCategory('ACADEMIE')}
              className={`px-2.5 py-1 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === 'ACADEMIE'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Académie
            </button>
            <button
              onClick={() => setSelectedCategory('PUBLICATION')}
              className={`px-2.5 py-1 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === 'PUBLICATION'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Publications
            </button>
            <button
              onClick={() => setSelectedCategory('RAPPEL')}
              className={`px-2.5 py-1 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === 'RAPPEL'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Rappels
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-medium whitespace-nowrap"
              title="Tout marquer comme lu"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tout lire</span>
            </button>
            <button
              onClick={handleClearAll}
              className="text-[11px] text-slate-400 hover:text-rose-500 transition p-1"
              title="Effacer tout l'historique"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-10 h-10 stroke-[1.2] mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-medium">Aucune notification dans cette catégorie.</p>
            </div>
          ) : (
            filtered.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                  !notif.lue
                    ? 'bg-sky-50/60 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/60'
                    : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5 shrink-0">
                    {getCategoryIcon(notif.categorie)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {notif.titre}
                      </h4>
                      {!notif.lue && (
                        <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                      )}
                      {notif.priorite === 'URGENTE' && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shrink-0">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5">
                      <span>{new Date(notif.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      {notif.lienTab && (
                        <span className="text-sky-600 dark:text-sky-400 font-medium flex items-center gap-0.5">
                          <span>Ouvrir module</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notif.id);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-500 transition shrink-0"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

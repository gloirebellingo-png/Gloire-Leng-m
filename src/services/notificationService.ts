import { AppNotification, NotificationCategory, NotificationSettings } from '../types/medical';
import { StorageService } from './storageService';

const STORAGE_NOTIF_KEY = 'medecine_ai_notifications_list';
const STORAGE_NOTIF_SETTINGS = 'medecine_ai_notifications_settings';

const DEFAULT_SETTINGS: NotificationSettings = {
  autoriserPush: false,
  autoriserSon: true,
  activerPatients: true,
  activerAcademie: true,
  activerSecurite: true,
  activerPublications: true,
  activerRappels: true,
  masquerDonneesEcranVerrouille: true // Confidentialité médicale
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    titre: 'Alerte Suivi Patient — Contrôle Constantes',
    message: 'Contrôle horaire de la glycémie capillaire et SpO2 requis pour le dossier MED-2026-001 (Soins intensifs).',
    categorie: 'PATIENT',
    priorite: 'URGENTE',
    date: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    lue: false,
    lienTab: 'monitoring',
    donneesSensiblesMasquees: true
  },
  {
    id: 'notif-2',
    titre: 'Alerte Sécurité Médicale — Interaction Détectée',
    message: 'Vérification requise : Risque d\'allongement de l\'intervalle QT lors de la co-prescription Arteméther-Luméfantrine et Quinine.',
    categorie: 'SECURITE',
    priorite: 'URGENTE',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    lue: false,
    lienTab: 'prescription',
    donneesSensiblesMasquees: false
  },
  {
    id: 'notif-3',
    titre: 'Nouvelle Directive OMS 2026',
    message: 'Mise à jour du protocole de prise en charge intégrée de la malnutrition aiguë sévère (PRONANUT / OMS).',
    categorie: 'PUBLICATION',
    priorite: 'NORMALE',
    date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    lue: true,
    lienTab: 'bibliotheque',
    donneesSensiblesMasquees: false
  },
  {
    id: 'notif-4',
    titre: 'Rappel de Révision Académique',
    message: 'Nouveau cas clinique disponible au simulateur : Prise en charge d\'un coma fébrile chez l\'enfant.',
    categorie: 'ACADEMIE',
    priorite: 'NORMALE',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    lue: true,
    lienTab: 'simulateur',
    donneesSensiblesMasquees: false
  }
];

export class NotificationService {
  public static getSettings(): NotificationSettings {
    try {
      const data = localStorage.getItem(STORAGE_NOTIF_SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public static saveSettings(settings: NotificationSettings): void {
    localStorage.setItem(STORAGE_NOTIF_SETTINGS, JSON.stringify(settings));
    StorageService.addAuditLog('NOTIFICATIONS_CONFIG', 'Mise à jour des préférences de notifications.');
  }

  public static getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_NOTIF_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  public static markAsRead(id: string): void {
    const list = this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.lue = true;
      localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(list));
    }
  }

  public static markAllAsRead(): void {
    const list = this.getNotifications();
    list.forEach(n => (n.lue = true));
    localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(list));
  }

  public static deleteNotification(id: string): void {
    const list = this.getNotifications().filter(n => n.id !== id);
    localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(list));
  }

  public static clearAll(): void {
    localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify([]));
  }

  public static addNotification(notif: Omit<AppNotification, 'id' | 'date' | 'lue'>): AppNotification {
    const settings = this.getSettings();

    // Check if category is enabled in settings
    let isCategoryEnabled = true;
    if (notif.categorie === 'PATIENT' && !settings.activerPatients) isCategoryEnabled = false;
    if (notif.categorie === 'ACADEMIE' && !settings.activerAcademie) isCategoryEnabled = false;
    if (notif.categorie === 'SECURITE' && !settings.activerSecurite) isCategoryEnabled = false;
    if (notif.categorie === 'PUBLICATION' && !settings.activerPublications) isCategoryEnabled = false;
    if (notif.categorie === 'RAPPEL' && !settings.activerRappels) isCategoryEnabled = false;

    if (!isCategoryEnabled) {
      return { ...notif, id: 'suppressed', date: new Date().toISOString(), lue: true };
    }

    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      date: new Date().toISOString(),
      lue: false,
      donneesSensiblesMasquees: settings.masquerDonneesEcranVerrouille
    };

    const list = this.getNotifications();
    list.unshift(newNotif);
    localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(list.slice(0, 100)));

    // Trigger Browser Push / System Notification if supported and permitted
    if (settings.autoriserPush && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const safeMessage = settings.masquerDonneesEcranVerrouille && notif.categorie === 'PATIENT'
          ? 'Nouveau message ou alerte de suivi médical.'
          : notif.message;

        new Notification(notif.titre, {
          body: safeMessage,
          icon: '/icon.svg',
          tag: newNotif.id
        });
      } catch (e) {
        console.warn('Erreur notification native :', e);
      }
    }

    // Play subtle audio chime if enabled
    if (settings.autoriserSon) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } catch {
        // AudioContext not allowed or not ready
      }
    }

    return newNotif;
  }

  public static async requestPushPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    const settings = this.getSettings();
    settings.autoriserPush = granted;
    this.saveSettings(settings);
    return granted;
  }
}

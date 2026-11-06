/**
 * MEDECINE AI — Plateforme Médicale Intelligente Professionnelle & Universitaire
 * @license Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar, MainTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ClinicalAssistantView } from './components/ClinicalAssistantView';
import { SpecialtiesView } from './components/SpecialtiesView';
import { EmergencyView } from './components/EmergencyView';
import { PharmacologyView } from './components/PharmacologyView';
import { PatientsView } from './components/PatientsView';
import { RdcProtocolsView } from './components/RdcProtocolsView';
import { AcademyView } from './components/AcademyView';
import { SimulatorView } from './components/SimulatorView';
import { AuditView } from './components/AuditView';

// New Advanced Medical Modules
import { LabAIView } from './components/LabAIView';
import { ImagingAIView } from './components/ImagingAIView';
import { PrescriptionAssistantView } from './components/PrescriptionAssistantView';
import { PatientMonitoringView } from './components/PatientMonitoringView';
import { Anatomy3DView } from './components/Anatomy3DView';
import { UniversityExamsView } from './components/UniversityExamsView';
import { ReportGeneratorView } from './components/ReportGeneratorView';
import { MedicalCalculatorView } from './components/MedicalCalculatorView';
import { DictionaryView } from './components/DictionaryView';
import { ScientificLibraryView } from './components/ScientificLibraryView';

// Notifications Modals & Service
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { NotificationService } from './services/notificationService';
import { StorageService } from './services/storageService';
import { Patient, UserRole } from './types/medical';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>(() => StorageService.getCurrentRole());
  const [isDark, setIsDark] = useState<boolean>(true);
  const [patients, setPatients] = useState<Patient[]>(() => StorageService.getPatients());
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(undefined);

  // Notifications State
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState<boolean>(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(() => {
    return NotificationService.getNotifications().filter(n => !n.lue).length;
  });

  const refreshNotificationsCount = useCallback(() => {
    setUnreadNotificationsCount(NotificationService.getNotifications().filter(n => !n.lue).length);
  }, []);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Enregistrement Service Worker non actif en dev:', err);
      });
    }
  }, []);

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    StorageService.setCurrentRole(newRole);
  };

  const handleRefreshPatients = () => {
    setPatients(StorageService.getPatients());
  };

  const handleOpenPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patients');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* Top Bar Navigation */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNotifications={() => {
          setIsNotificationCenterOpen(true);
          refreshNotificationsCount();
        }}
        onOpenNotificationSettings={() => setIsNotificationSettingsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentRole={currentRole}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              patients={patients}
              onSelectTab={setActiveTab}
              onOpenPatient={handleOpenPatient}
            />
          )}

          {activeTab === 'assistant' && (
            <ClinicalAssistantView />
          )}

          {activeTab === 'specialties' && (
            <SpecialtiesView />
          )}

          {activeTab === 'urgences' && (
            <EmergencyView />
          )}

          {activeTab === 'monitoring' && (
            <PatientMonitoringView />
          )}

          {activeTab === 'prescription' && (
            <PrescriptionAssistantView />
          )}

          {activeTab === 'pharmacologie' && (
            <PharmacologyView />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              onRefresh={handleRefreshPatients}
              currentRole={currentRole}
              selectedPatientId={selectedPatientId}
            />
          )}

          {activeTab === 'rapports' && (
            <ReportGeneratorView />
          )}

          {activeTab === 'laboratoire' && (
            <LabAIView />
          )}

          {activeTab === 'imagerie' && (
            <ImagingAIView />
          )}

          {activeTab === 'calculateurs' && (
            <MedicalCalculatorView />
          )}

          {activeTab === 'anatomie3d' && (
            <Anatomy3DView />
          )}

          {activeTab === 'academie' && (
            <AcademyView />
          )}

          {activeTab === 'simulateur' && (
            <SimulatorView />
          )}

          {activeTab === 'examens_univ' && (
            <UniversityExamsView />
          )}

          {activeTab === 'dictionnaire' && (
            <DictionaryView />
          )}

          {activeTab === 'bibliotheque' && (
            <ScientificLibraryView />
          )}

          {activeTab === 'protocoles_rdc' && (
            <RdcProtocolsView />
          )}

          {activeTab === 'audit' && (
            <AuditView
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => {
          setIsNotificationCenterOpen(false);
          refreshNotificationsCount();
        }}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          refreshNotificationsCount();
        }}
        onRefreshCount={refreshNotificationsCount}
      />

      <NotificationSettingsModal
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
      />
    </div>
  );
}

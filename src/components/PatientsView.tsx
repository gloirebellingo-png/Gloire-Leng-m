import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  HeartPulse,
  Printer,
  ChevronRight,
  Shield,
  Stethoscope,
  X
} from 'lucide-react';
import { Patient, Consultation, Vitals, UserRole } from '../types/medical';
import { StorageService } from '../services/storageService';
import { ClinicalEngine } from '../services/clinicalEngine';

interface PatientsViewProps {
  patients: Patient[];
  onRefresh: () => void;
  currentRole: UserRole;
  selectedPatientId?: string;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  onRefresh,
  currentRole,
  selectedPatientId: initialPatientId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'ROUGE' | 'JAUNE' | 'VERT'>('ALL');
  const [activePatientId, setActivePatientId] = useState<string | null>(initialPatientId || (patients[0]?.id || null));

  // Modals
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showNewConsultModal, setShowNewConsultModal] = useState(false);
  const [showPrintReportModal, setShowPrintReportModal] = useState(false);

  // New Patient Form
  const [newNom, setNewNom] = useState('');
  const [newPostnom, setNewPostnom] = useState('');
  const [newPrenom, setNewPrenom] = useState('');
  const [newAge, setNewAge] = useState('25');
  const [newSexe, setNewSexe] = useState<'M' | 'F'>('F');
  const [newPoids, setNewPoids] = useState('60');
  const [newGroupe, setNewGroupe] = useState('O+');
  const [newHb, setNewHb] = useState<'AA' | 'AS' | 'SS' | 'SC' | 'Non déterminé'>('AA');
  const [newAllergie, setNewAllergie] = useState('');

  // New Consultation Form
  const [consultPlainte, setConsultPlainte] = useState('');
  const [consultAnamnese, setConsultAnamnese] = useState('');
  const [consultVitals, setConsultVitals] = useState<Vitals>({
    taSystolique: 120,
    taDiastolique: 80,
    frequenceCardiaque: 78,
    frequenceRespiratoire: 18,
    temperature: 37.0,
    saturationO2: 98,
    poidsKg: 60,
    etatConscience: 'Alerte'
  });
  const [consultDiag, setConsultDiag] = useState('');
  const [consultCAT, setConsultCAT] = useState('');

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.postnom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.codeDossier.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterSeverity === 'ALL') return true;
    const latestConsult = p.consultations[0];
    return latestConsult?.triage === filterSeverity;
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNom.trim() || !newPostnom.trim()) return;

    const code = `MED-2026-${String(patients.length + 1).padStart(3, '0')}`;
    const newPatient: Patient = {
      id: 'pat-' + Date.now(),
      codeDossier: code,
      nom: newNom.toUpperCase(),
      postnom: newPostnom.toUpperCase(),
      prenom: newPrenom,
      dateNaissance: new Date().toISOString().split('T')[0],
      ageAns: parseInt(newAge) || 20,
      sexe: newSexe,
      poidsKg: parseFloat(newPoids) || 50,
      groupeSanguin: newGroupe,
      electrophoreseHb: newHb,
      allergies: newAllergie ? [{ id: 'all-' + Date.now(), substance: newAllergie, reaction: 'Non précisé', severite: 'Modérée' }] : [],
      antecedents: [],
      consultations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.savePatient(newPatient);
    onRefresh();
    setActivePatientId(newPatient.id);
    setShowNewPatientModal(false);

    // Reset
    setNewNom('');
    setNewPostnom('');
    setNewPrenom('');
    setNewAllergie('');
  };

  const handleCreateConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !consultPlainte.trim()) return;

    const triageResult = ClinicalEngine.evaluateABCDE(consultVitals, activePatient.ageAns);

    const newConsult: Consultation = {
      id: 'c-' + Date.now(),
      patientId: activePatient.id,
      date: new Date().toISOString(),
      praticienNom: currentRole === 'MEDECIN' ? 'Dr. Praticien' : 'Soignant Référent',
      praticienRole: currentRole,
      plaintePrincipale: consultPlainte,
      anamnese: consultAnamnese,
      constantes: consultVitals,
      triage: triageResult.level,
      examenPhysique: 'Examen clinique effectué en consultation.',
      hypothesesDiagnostiques: consultDiag ? [consultDiag] : [],
      examensDemandes: [],
      prescriptions: [],
      conduiteATenir: consultCAT
    };

    StorageService.addConsultation(activePatient.id, newConsult);
    onRefresh();
    setShowNewConsultModal(false);

    // Reset
    setConsultPlainte('');
    setConsultAnamnese('');
    setConsultDiag('');
    setConsultCAT('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span>Dossiers Patients Informatisés (DPI & EMR)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestion sécurisée des dossiers médicaux, traçabilité des antécédents, constantes vitales et prescriptions.
          </p>
        </div>

        <button
          onClick={() => setShowNewPatientModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm transition whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Dossier Patient</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient List with Search & Filters */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher nom, postnom, identifiant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 shadow-sm"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 text-[11px] bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setFilterSeverity('ALL')}
              className={`flex-1 py-1 rounded text-center font-medium transition ${
                filterSeverity === 'ALL'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Tous ({patients.length})
            </button>
            <button
              onClick={() => setFilterSeverity('ROUGE')}
              className={`px-2 py-1 rounded text-center font-medium transition ${
                filterSeverity === 'ROUGE'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              Rouge
            </button>
            <button
              onClick={() => setFilterSeverity('JAUNE')}
              className={`px-2 py-1 rounded text-center font-medium transition ${
                filterSeverity === 'JAUNE'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              Jaune
            </button>
          </div>

          {/* Patients scroll list */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 max-h-[640px] overflow-y-auto">
            {filteredPatients.map((p) => {
              const isSelected = activePatient && p.id === activePatient.id;
              const latestConsult = p.consultations[0];
              return (
                <div
                  key={p.id}
                  onClick={() => setActivePatientId(p.id)}
                  className={`p-3 rounded-xl cursor-pointer transition text-left flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {p.nom} {p.postnom}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {p.codeDossier}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {p.ageAns} ans ({p.sexe}) · {p.poidsKg} kg · Hb {p.electrophoreseHb || 'AA'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {latestConsult && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          latestConsult.triage === 'ROUGE'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                            : latestConsult.triage === 'JAUNE'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {latestConsult.triage}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Patient Record */}
        <div className="lg:col-span-8 space-y-5">
          {activePatient ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              {/* Header profile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {activePatient.nom} {activePatient.postnom} {activePatient.prenom || ''}
                    </h2>
                    <span className="text-xs font-mono bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-md">
                      {activePatient.codeDossier}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>{activePatient.ageAns} ans</span>
                    <span>·</span>
                    <span>Sexe : {activePatient.sexe === 'M' ? 'Masculin' : 'Féminin'}</span>
                    <span>·</span>
                    <span>Poids : {activePatient.poidsKg} kg</span>
                    <span>·</span>
                    <span>Groupe : {activePatient.groupeSanguin || 'Inconnu'}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Électrophorèse Hb : {activePatient.electrophoreseHb || 'AA'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPrintReportModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Compte-Rendu</span>
                  </button>
                  <button
                    onClick={() => setShowNewConsultModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nouvelle Consultation</span>
                  </button>
                </div>
              </div>

              {/* Allergies & Antécédents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-rose-600 dark:text-rose-400 block">
                    Allergies Documentées
                  </span>
                  {activePatient.allergies.length > 0 ? (
                    <ul className="space-y-1">
                      {activePatient.allergies.map((all) => (
                        <li key={all.id} className="text-slate-700 dark:text-slate-300">
                          <strong>{all.substance}</strong> — {all.reaction} ({all.severite})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-400">Aucune allergie médicamenteuse signalée.</span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-sky-600 dark:text-sky-400 block">
                    Antécédents Médicaux & Chirurgicaux
                  </span>
                  {activePatient.antecedents.length > 0 ? (
                    <ul className="space-y-1">
                      {activePatient.antecedents.map((ant) => (
                        <li key={ant.id} className="text-slate-700 dark:text-slate-300">
                          [{ant.type}] {ant.description} {ant.annee ? `(${ant.annee})` : ''}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-400">Pas d'antécédent lourd consigné.</span>
                  )}
                </div>
              </div>

              {/* Consultations List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Historique des Consultations ({activePatient.consultations.length})
                  </h3>
                </div>

                <div className="space-y-4">
                  {activePatient.consultations.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {new Date(c.date).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className="text-slate-400">par {c.praticienNom} ({c.praticienRole})</span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            c.triage === 'ROUGE'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                              : c.triage === 'JAUNE'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          }`}
                        >
                          Triage {c.triage}
                        </span>
                      </div>

                      <div>
                        <strong className="text-slate-700 dark:text-slate-300">Plainte :</strong> {c.plaintePrincipale}
                      </div>

                      {c.anamnese && (
                        <p className="text-slate-600 dark:text-slate-400 italic">
                          "{c.anamnese}"
                        </p>
                      )}

                      {/* Constantes vitales strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                        <div>
                          <span className="text-slate-400 block text-[9px]">TA</span>
                          <strong>{c.constantes.taSystolique || '--'}/{c.constantes.taDiastolique || '--'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">FC</span>
                          <strong>{c.constantes.frequenceCardiaque || '--'} bpm</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">FR</span>
                          <strong>{c.constantes.frequenceRespiratoire || '--'} /min</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">SpO2</span>
                          <strong>{c.constantes.saturationO2 || '--'}%</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">Temp</span>
                          <strong>{c.constantes.temperature || '--'}°C</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">Conscience</span>
                          <strong>{c.constantes.etatConscience || 'Alerte'}</strong>
                        </div>
                      </div>

                      {/* Prescriptions */}
                      {c.prescriptions.length > 0 && (
                        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-2 space-y-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                            Ordonnance & Prescriptions validées :
                          </span>
                          {c.prescriptions.map((pr) => (
                            <div key={pr.id} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                              <span><strong>{pr.dci}</strong> — {pr.posologie} ({pr.voie}, {pr.duree})</span>
                              <span className="text-emerald-600 font-semibold text-[10px]">Validé Dr</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {c.conduiteATenir && (
                        <div className="text-[11px] text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800/80 pt-1">
                          <strong>Conduite à tenir :</strong> {c.conduiteATenir}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Sélectionnez ou créez un dossier patient.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Patient */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Créer un Nouveau Dossier Patient
              </h3>
              <button onClick={() => setShowNewPatientModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={newNom}
                    onChange={(e) => setNewNom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Postnom *</label>
                  <input
                    type="text"
                    required
                    value={newPostnom}
                    onChange={(e) => setNewPostnom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1">Prénom</label>
                  <input
                    type="text"
                    value={newPrenom}
                    onChange={(e) => setNewPrenom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Âge (ans)</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Sexe</label>
                  <select
                    value={newSexe}
                    onChange={(e) => setNewSexe(e.target.value as 'M' | 'F')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-slate-900 dark:text-white"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-500 block mb-1">Poids (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newPoids}
                    onChange={(e) => setNewPoids(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Groupe Sanguin</label>
                  <select
                    value={newGroupe}
                    onChange={(e) => setNewGroupe(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-slate-900 dark:text-white"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Électrophorèse Hb</label>
                  <select
                    value={newHb}
                    onChange={(e) => setNewHb(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-slate-900 dark:text-white"
                  >
                    <option value="AA">AA (Normal)</option>
                    <option value="AS">AS (Trait drépanocytaire)</option>
                    <option value="SS">SS (Drépanocytose majeure)</option>
                    <option value="Non déterminé">Non déterminé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Allergies documentées</label>
                <input
                  type="text"
                  placeholder="Ex: Pénicilline, Sulfamides..."
                  value={newAllergie}
                  onChange={(e) => setNewAllergie(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Enregistrer le Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Consultation */}
      {showNewConsultModal && activePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Nouvelle Consultation — {activePatient.nom} {activePatient.postnom}
              </h3>
              <button onClick={() => setShowNewConsultModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateConsultation} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Motif / Plainte Principale *</label>
                <input
                  type="text"
                  required
                  value={consultPlainte}
                  onChange={(e) => setConsultPlainte(e.target.value)}
                  placeholder="Ex: Céphalées fébriles, dyspnée..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Anamnèse & Constatations Cliniques</label>
                <textarea
                  rows={3}
                  value={consultAnamnese}
                  onChange={(e) => setConsultAnamnese(e.target.value)}
                  placeholder="Détails des symptômes, évolution, signes physiques..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white"
                />
              </div>

              {/* Constantes */}
              <div>
                <label className="text-slate-500 block mb-1">Constantes Vitales de Consultation</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <input
                    type="number"
                    placeholder="TAs"
                    value={consultVitals.taSystolique || ''}
                    onChange={(e) => setConsultVitals({ ...consultVitals, taSystolique: parseFloat(e.target.value) })}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono"
                  />
                  <input
                    type="number"
                    placeholder="FC"
                    value={consultVitals.frequenceCardiaque || ''}
                    onChange={(e) => setConsultVitals({ ...consultVitals, frequenceCardiaque: parseFloat(e.target.value) })}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono"
                  />
                  <input
                    type="number"
                    placeholder="FR"
                    value={consultVitals.frequenceRespiratoire || ''}
                    onChange={(e) => setConsultVitals({ ...consultVitals, frequenceRespiratoire: parseFloat(e.target.value) })}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono"
                  />
                  <input
                    type="number"
                    placeholder="SpO2"
                    value={consultVitals.saturationO2 || ''}
                    onChange={(e) => setConsultVitals({ ...consultVitals, saturationO2: parseFloat(e.target.value) })}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono"
                  />
                  <input
                    type="number"
                    placeholder="T°"
                    step="0.1"
                    value={consultVitals.temperature || ''}
                    onChange={(e) => setConsultVitals({ ...consultVitals, temperature: parseFloat(e.target.value) })}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-mono"
                  />
                  <select
                    value={consultVitals.etatConscience}
                    onChange={(e) => setConsultVitals({ ...consultVitals, etatConscience: e.target.value as any })}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1 py-1 text-xs"
                  >
                    <option value="Alerte">Alerte</option>
                    <option value="Voix">Voix</option>
                    <option value="Douleur">Douleur</option>
                    <option value="Inconscient">Inconscient</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Diagnostic Retenu</label>
                <input
                  type="text"
                  value={consultDiag}
                  onChange={(e) => setConsultDiag(e.target.value)}
                  placeholder="Ex: Paludisme simple à P. falciparum"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Conduite à Tenir & Ordonnance</label>
                <textarea
                  rows={2}
                  value={consultCAT}
                  onChange={(e) => setConsultCAT(e.target.value)}
                  placeholder="Prescription Coartem 6 prises, repos, surveillance..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewConsultModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Enregistrer la Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Print Medical Report */}
      {showPrintReportModal && activePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Compte-Rendu Médical Officiel — {activePatient.codeDossier}
              </h3>
              <button onClick={() => setShowPrintReportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <strong>PLATEFORME MÉDICALE MEDECINE AI</strong><br />
                DOSSIER PATIENT : {activePatient.codeDossier} — {activePatient.nom} {activePatient.postnom}<br />
                ÂGE : {activePatient.ageAns} ans | SEXE : {activePatient.sexe} | POIDS : {activePatient.poidsKg} kg<br />
                GROUPE SANGUIN : {activePatient.groupeSanguin || '--'} | STATUT Hb : {activePatient.electrophoreseHb || 'AA'}<br />
                DATE D'ÉMISSION : {new Date().toLocaleDateString('fr-FR')}
              </div>

              <div>
                <strong>ALLERGIES :</strong> {activePatient.allergies.map(a => a.substance).join(', ') || 'Néant'}<br />
                <strong>ANTÉCÉDENTS :</strong> {activePatient.antecedents.map(a => a.description).join(' ; ') || 'Néant'}
              </div>

              {activePatient.consultations[0] && (
                <div>
                  <strong>DERNIÈRE CONSULTATION ({new Date(activePatient.consultations[0].date).toLocaleDateString('fr-FR')}) :</strong><br />
                  - Motif : {activePatient.consultations[0].plaintePrincipale}<br />
                  - Triage : {activePatient.consultations[0].triage}<br />
                  - Diagnostic : {activePatient.consultations[0].hypothesesDiagnostiques.join(', ') || 'En cours'}<br />
                  - Conduite à tenir : {activePatient.consultations[0].conduiteATenir || 'Surveillance clinique'}
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
                Aide à la décision clinique. Validation médicale réservée au praticien diplômé.
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPrintReportModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs"
              >
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer / Exporter PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

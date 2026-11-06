/**
 * MEDECINE AI — Modèles et Définitions TypeScript
 */

export type UserRole = 'MEDECIN' | 'INFIRMIER' | 'ETUDIANT' | 'ENSEIGNANT';

export type TriageLevel = 'ROUGE' | 'JAUNE' | 'VERT';

export type MedicalSpecialty =
  | 'general'
  | 'pediatrie'
  | 'gyneco_obstetrique'
  | 'cardiologie'
  | 'pneumologie'
  | 'neurologie'
  | 'gastro_enterologie'
  | 'infectiologie'
  | 'dermatologie'
  | 'nephrologie'
  | 'endocrinologie'
  | 'chirurgie'
  | 'urgences'
  | 'sante_publique';

export interface Vitals {
  taSystolique?: number;
  taDiastolique?: number;
  frequenceCardiaque?: number;
  frequenceRespiratoire?: number;
  temperature?: number;
  saturationO2?: number;
  glycemieCapillaire?: number; // en mg/dL ou mmol/L
  poidsKg?: number;
  tailleCm?: number;
  etatConscience?: 'Alerte' | 'Voix' | 'Douleur' | 'Inconscient';
  perimetreBrachialMm?: number; // Pour dépistage malnutrition enfant (< 115mm = MAS)
}

export interface Allergy {
  id: string;
  substance: string;
  reaction: string;
  severite: 'Faible' | 'Modérée' | 'Sévère (Anaphylaxie)';
}

export interface Antecedent {
  id: string;
  type: 'Médical' | 'Chirurgical' | 'Familial' | 'Gynéco-obstétrique';
  description: string;
  annee?: number;
}

export interface PrescriptionItem {
  id: string;
  dci: string;
  posologie: string;
  voie: 'PO' | 'IV' | 'IM' | 'SC' | 'Inhalation' | 'Rectale';
  duree: string;
  instructions?: string;
  valideParMedecin: boolean;
}

export interface Consultation {
  id: string;
  patientId: string;
  date: string;
  praticienNom: string;
  praticienRole: UserRole;
  plaintePrincipale: string;
  anamnese: string;
  constantes: Vitals;
  triage: TriageLevel;
  examenPhysique: string;
  hypothesesDiagnostiques: string[];
  examensDemandes: string[];
  prescriptions: PrescriptionItem[];
  conduiteATenir: string;
  synthese10Points?: string;
}

export interface Patient {
  id: string;
  codeDossier: string; // Ex: MED-2026-042
  nom: string;
  postnom: string;
  prenom?: string;
  dateNaissance: string;
  ageAns: number;
  sexe: 'M' | 'F';
  poidsKg: number;
  tailleCm?: number;
  groupeSanguin?: string; // A+, O+, etc.
  electrophoreseHb?: 'AA' | 'AS' | 'SS' | 'SC' | 'Non déterminé'; // Crucial RDC & Afrique
  allergies: Allergy[];
  antecedents: Antecedent[];
  consultations: Consultation[];
  createdAt: string;
  updatedAt: string;
}

export interface DrugItem {
  id: string;
  dci: string;
  nomsCommerciaux: string[];
  classe: string;
  mecanisme: string;
  indications: string[];
  contreIndications: string[];
  posologieAdulte: string;
  posologieEnfant: string;
  calculateurKg?: {
    doseMinMgKg: number;
    doseMaxMgKg: number;
    dosePlafondJournalierMg: number;
    formeDisponible: string;
    concentrationMgParMl?: number;
    nombrePrisesParJour: number;
    voie: string;
    instructionsReconstitution?: string;
  };
  voiesAdmin: string[];
  effetsIndesirables: string[];
  interactionsMajeures: string[];
  grossesseAllaitement: string;
  adaptationRenale: string;
  adaptationHepatique: string;
  referenceProtocole: string;
}

export interface SpecialtyProtocol {
  id: string;
  specialite: MedicalSpecialty;
  titre: string;
  indication: string;
  signesCliniques: string[];
  signesGravite: string[];
  examens: string[];
  traitementPremiereIntention: string;
  traitementDeuxiemeIntention?: string;
  criteresHospitalisation: string[];
  source: string;
}

export interface RdcProtocol {
  id: string;
  titre: string;
  organisme: string; // Ex: PNLP RDC, PNT RDC, PNLS RDC, OMS
  categorie: 'Paludisme' | 'Tuberculose' | 'VIH' | 'Choléra' | 'Drépanocytose' | 'Malnutrition' | 'Santé Maternelle';
  resume: string;
  signesAlertes: string[];
  algorithmeDecision: string[];
  traitementLigne1: string;
  traitementLigne2?: string;
  posologiesCles: string;
  mesuresPrevention: string[];
  disponibleHorsLigne: boolean;
  derniereRevision: string;
}

export interface AcademyLesson {
  id: string;
  cycle: 'fondamentale' | 'preclinique' | 'clinique';
  matiere: string;
  titre: string;
  objectifsPedagogiques: string[];
  resume: string;
  contenuDetaille: string;
  tableauSynthese: { entete: string[]; lignes: string[][] };
  pointsClesARetenir: string[];
}

export interface QuizQuestion {
  id: string;
  matiere: string;
  question: string;
  options: string[];
  bonneReponseIndex: number;
  explicationMedicale: string;
  referenceOMS: string;
}

export interface ClinicalCaseSimulation {
  id: string;
  titre: string;
  niveau: 'Étudiant 2ème cycle' | 'Interne / Médecin Junior';
  specialite: string;
  patientPresentation: {
    age: number;
    sexe: 'M' | 'F';
    poidsKg: number;
    profession: string;
    motif: string;
    contexte: string;
  };
  constantesInitiales: Vitals;
  anamneseAttendue: string[];
  examenPhysiqueResultats: { [cle: string]: string };
  examensComplementairesDisponibles: {
    nom: string;
    resultat: string;
    coutTemps: string;
    pertinent: boolean;
  }[];
  diagnosticCorrect: string;
  diagnosticsDifferentiels: string[];
  priseEnChargeAttendue: string[];
  erreursCritiquesAEviter: string[];
  explicationPhysiopathologique: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userRole: UserRole;
  userNom: string;
  action: string;
  details: string;
}

// --- Notifications Types ---
export type NotificationCategory = 'PATIENT' | 'ACADEMIE' | 'SECURITE' | 'PUBLICATION' | 'RAPPEL';

export interface AppNotification {
  id: string;
  titre: string;
  message: string;
  categorie: NotificationCategory;
  priorite: 'BASSE' | 'NORMALE' | 'URGENTE';
  date: string;
  lue: boolean;
  lienTab?: string;
  donneesSensiblesMasquees?: boolean;
}

export interface NotificationSettings {
  autoriserPush: boolean;
  autoriserSon: boolean;
  activerPatients: boolean;
  activerAcademie: boolean;
  activerSecurite: boolean;
  activerPublications: boolean;
  activerRappels: boolean;
  masquerDonneesEcranVerrouille: boolean;
}

// --- Lab AI & Biomarkers ---
export interface LabBiomarker {
  nom: string;
  valeur: number;
  unite: string;
  normeMin: number;
  normeMax: number;
  categorie: 'Hématologie' | 'Biochimie' | 'Ionogramme' | 'Infectieux' | 'Gaz du Sang' | 'LCR';
}

// --- Patient Monitoring Record ---
export interface PatientMonitoringPoint {
  id: string;
  patientId: string;
  timestamp: string;
  temperature: number;
  frequenceCardiaque: number;
  frequenceRespiratoire: number;
  saturationO2: number;
  taSystolique: number;
  taDiastolique: number;
  glycemie: number;
  scoreMews: number;
}

// --- Medical Report Template ---
export interface MedicalReportData {
  type: 'LETTRE_SORTIE' | 'COMPTE_RENDU_HOSPITALISATION' | 'BILLET_TRANSFERT' | 'PROTOCOLE_OPERATOIRE';
  patientId: string;
  date: string;
  medecinRedacteur: string;
  diagnosticPrincipal: string;
  resumeClinique: string;
  evolutionHospitalisation: string;
  traitementSortie: string[];
  recommandationsSuivi: string;
  serviceDestinataire?: string;
}

// --- Scientific Library ---
export interface ScientificArticle {
  id: string;
  titre: string;
  auteurs: string;
  revue: string;
  datePublication: string;
  thematique: 'Paludisme' | 'Tuberculose' | 'VIH' | 'Urgences & Réanimation' | 'Santé Maternelle' | 'Infectiologie' | 'Pédiatrie';
  resume: string;
  conclusionsCles: string[];
  urlReference: string;
  impactScore: string;
  miseAJour: string;
}

// --- Medical Dictionary ---
export interface MedicalTerm {
  id: string;
  terme: string;
  specialite: string;
  definition: string;
  physiopathologie?: string;
  traductionAnglaise: string;
  synonymes: string[];
  exemplesCliniques: string;
}

// --- University Exam ---
export interface UniversityExamQuestion {
  id: string;
  contexteClinique: string;
  question: string;
  baremePoints: number;
  reponseAttendue: string;
  motsClesRequis: string[];
}


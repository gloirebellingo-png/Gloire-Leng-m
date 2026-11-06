import { Patient, Consultation, AuditLogItem, UserRole } from '../types/medical';

const STORAGE_KEY_PATIENTS = 'medecine_ai_patients_v1';
const STORAGE_KEY_ROLE = 'medecine_ai_current_role';
const STORAGE_KEY_AUDIT = 'medecine_ai_audit_logs';

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    codeDossier: 'MED-2026-001',
    nom: 'KABONGO',
    postnom: 'MUKENDI',
    prenom: 'Junior',
    dateNaissance: '2023-04-12',
    ageAns: 3,
    sexe: 'M',
    poidsKg: 13,
    tailleCm: 92,
    groupeSanguin: 'O+',
    electrophoreseHb: 'SS', // Drépanocytaire
    allergies: [
      { id: 'all-1', substance: 'Pénicilline', reaction: 'Urticaire généralisé', severite: 'Modérée' }
    ],
    antecedents: [
      { id: 'ant-1', type: 'Médical', description: 'Drépanocytose homozygote SS suivie au CNRD, 2 crises vaso-occlusives antérieures', annee: 2025 }
    ],
    consultations: [
      {
        id: 'c-001',
        patientId: 'pat-001',
        date: '2026-11-05T14:30:00Z',
        praticienNom: 'Dr. Ilunga Mwamba',
        praticienRole: 'MEDECIN',
        plaintePrincipale: 'Fièvre à 39.8°C, vomissements et léthargie',
        anamnese: 'Enfant amené pour syndrome fébrile aigu de 48h avec refus d\'alimentation et prostration.',
        constantes: {
          taSystolique: 85,
          taDiastolique: 52,
          frequenceCardiaque: 154,
          frequenceRespiratoire: 48,
          temperature: 39.8,
          saturationO2: 93,
          glycemieCapillaire: 58,
          poidsKg: 13,
          etatConscience: 'Voix'
        },
        triage: 'ROUGE',
        examenPhysique: 'Pâleur conjonctivale intense, splénomégalie stade 2, pas de raideur méningée.',
        hypothesesDiagnostiques: [
          'Paludisme grave à Plasmodium falciparum (forme anémique et prostration)',
          'Crise de déglobulisation aiguë sur terrain drépanocytaire SS',
          'Sepsis bactérien à point de départ indéterminé'
        ],
        examensDemandes: ['TDR Paludisme', 'Goutte Épaisse', 'Hémocue / NFS', 'Glycémie capillaire'],
        prescriptions: [
          {
            id: 'pr-1',
            dci: 'Artésunate injectable (60 mg)',
            posologie: '3,0 mg/kg soit 39 mg IV lente à H0, H12, H24',
            voie: 'IV',
            duree: '3 doses minimum avant relais CTA',
            instructions: 'Reconstituer à 10 mg/mL avec solvant bicarbonate puis NaCl 0,9%.',
            valideParMedecin: true
          },
          {
            id: 'pr-2',
            dci: 'Paracétamol injectable',
            posologie: '15 mg/kg soit 195 mg IV q6h si T° > 38.5°C',
            voie: 'IV',
            duree: '48 heures',
            valideParMedecin: true
          }
        ],
        conduiteATenir: 'Hospitalisation en soins intensifs pédiatriques. Oxygène 2 L/min, VVP 20G, surveillance Blantyre horaire, transfusion si Hb < 5 g/dL.'
      }
    ],
    createdAt: '2026-11-05T14:00:00Z',
    updatedAt: '2026-11-05T15:00:00Z'
  },
  {
    id: 'pat-002',
    codeDossier: 'MED-2026-002',
    nom: 'MWAMBA',
    postnom: 'KASONGO',
    prenom: 'Esther',
    dateNaissance: '2004-08-20',
    ageAns: 22,
    sexe: 'F',
    poidsKg: 58,
    tailleCm: 165,
    groupeSanguin: 'B+',
    electrophoreseHb: 'AA',
    allergies: [],
    antecedents: [
      { id: 'ant-2', type: 'Gynéco-obstétrique', description: 'Primigeste à 32 semaines d\'aménorrhée (G1P0)', annee: 2026 }
    ],
    consultations: [
      {
        id: 'c-002',
        patientId: 'pat-002',
        date: '2026-11-06T08:15:00Z',
        praticienNom: 'Inf. Major Kalala',
        praticienRole: 'INFIRMIER',
        plaintePrincipale: 'Céphalées pulsatiles, phosphènes (mouches devant les yeux) et œdèmes des chevilles',
        anamnese: 'Grossesse de 32 SA. Céphalées d\'intensité croissante depuis 3 jours, non calmées par le paracétamol.',
        constantes: {
          taSystolique: 165,
          taDiastolique: 105,
          frequenceCardiaque: 88,
          frequenceRespiratoire: 18,
          temperature: 37.0,
          saturationO2: 98,
          poidsKg: 58,
          etatConscience: 'Alerte'
        },
        triage: 'ROUGE',
        examenPhysique: 'Œdèmes bilatéraux prenant le godet jusqu\'aux genoux. Réflexes rotuliens très vifs.',
        hypothesesDiagnostiques: [
          'Pré-éclampsie avec signes de gravité (Urgence obstétricale majeure)',
          'Risque imminent d\'éclampsie'
        ],
        examensDemandes: ['Bandelette urinaire (Protéinurie)', 'NFS + Plaquettes', 'Bilan hépatique (ASAT/ALAT)', 'Créatininémie'],
        prescriptions: [
          {
            id: 'pr-3',
            dci: 'Sulfate de Magnésium (MgSO4)',
            posologie: 'Dose de charge 4 g IV lente sur 20 min + 5 g IM dans chaque fesse',
            voie: 'IV',
            duree: 'Protocole de Pritchard d\'urgence',
            valideParMedecin: false
          }
        ],
        conduiteATenir: 'Alerte obstétricale immédiate. Transfert d\'urgence vers la maternité de référence pour surveillance continue et avis pour extraction.'
      }
    ],
    createdAt: '2026-11-06T08:00:00Z',
    updatedAt: '2026-11-06T08:30:00Z'
  },
  {
    id: 'pat-003',
    codeDossier: 'MED-2026-003',
    nom: 'BAHATI',
    postnom: 'ZAWADI',
    prenom: 'Gloire',
    dateNaissance: '1988-11-14',
    ageAns: 38,
    sexe: 'M',
    poidsKg: 64,
    tailleCm: 172,
    groupeSanguin: 'A+',
    electrophoreseHb: 'AA',
    allergies: [
      { id: 'all-2', substance: 'Sulfamides (Cotrimoxazole)', reaction: 'Érythème pigmenté fixe', severite: 'Modérée' }
    ],
    antecedents: [
      { id: 'ant-3', type: 'Médical', description: 'Tabagisme sevré, notion de toux chronique vespérale', annee: 2026 }
    ],
    consultations: [
      {
        id: 'c-003',
        patientId: 'pat-003',
        date: '2026-11-04T10:00:00Z',
        praticienNom: 'Dr. Kasongo Tshilombo',
        praticienRole: 'MEDECIN',
        plaintePrincipale: 'Toux productive depuis 3 semaines avec sueurs nocturnes et perte de 5 kg',
        anamnese: 'Patient adressé pour suspicion de tuberculose pulmonaire.',
        constantes: {
          taSystolique: 120,
          taDiastolique: 75,
          frequenceCardiaque: 82,
          frequenceRespiratoire: 19,
          temperature: 37.8,
          saturationO2: 97,
          poidsKg: 64,
          etatConscience: 'Alerte'
        },
        triage: 'JAUNE',
        examenPhysique: 'Râles sous-crépitants au sommet pulmonaire droit. État général conservé.',
        hypothesesDiagnostiques: [
          'Tuberculose pulmonaire bactériologiquement confirmée ou présumée',
          'Pneumonie bactérienne subaiguë',
          'Co-infection VIH / TB'
        ],
        examensDemandes: ['GeneXpert MTB/RIF sur expectorations', 'Radiographie thoracique face', 'Sérologie VIH avec accord'],
        prescriptions: [],
        conduiteATenir: 'Attente du résultat GeneXpert. Isolement respiratoire relatif, port de masque chirurgical.'
      }
    ],
    createdAt: '2026-11-04T09:30:00Z',
    updatedAt: '2026-11-04T11:00:00Z'
  }
];

export class StorageService {
  public static getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PATIENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(INITIAL_PATIENTS));
        return INITIAL_PATIENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PATIENTS;
    }
  }

  public static savePatient(patient: Patient): void {
    const patients = this.getPatients();
    const index = patients.findIndex(p => p.id === patient.id);
    if (index >= 0) {
      patients[index] = { ...patient, updatedAt: new Date().toISOString() };
    } else {
      patients.unshift({ ...patient, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
    this.addAuditLog('SAUVEGARDE_PATIENT', `Dossier ${patient.codeDossier} (${patient.nom} ${patient.postnom}) mis à jour.`);
  }

  public static addConsultation(patientId: string, consultation: Consultation): void {
    const patients = this.getPatients();
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      patient.consultations.unshift(consultation);
      patient.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
      this.addAuditLog('NOUVELLE_CONSULTATION', `Consultation ajoutée au dossier ${patient.codeDossier}. Triage: ${consultation.triage}`);
    }
  }

  public static getCurrentRole(): UserRole {
    return (localStorage.getItem(STORAGE_KEY_ROLE) as UserRole) || 'MEDECIN';
  }

  public static setCurrentRole(role: UserRole): void {
    localStorage.setItem(STORAGE_KEY_ROLE, role);
    this.addAuditLog('CHANGEMENT_ROLE', `Rôle utilisateur basculé vers: ${role}`);
  }

  public static getAuditLogs(): AuditLogItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_AUDIT);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static addAuditLog(action: string, details: string): void {
    try {
      const logs = this.getAuditLogs();
      const newLog: AuditLogItem = {
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString(),
        userRole: this.getCurrentRole(),
        userNom: 'Praticien Connecté',
        action,
        details
      };
      logs.unshift(newLog);
      if (logs.length > 100) logs.pop();
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(logs));
    } catch {
      // storage quota or disabled
    }
  }
}

import React, { useState } from 'react';
import {
  Grid,
  Heart,
  Baby,
  Stethoscope,
  Wind,
  Brain,
  ShieldAlert,
  Flame,
  CheckCircle,
  HelpCircle,
  Activity,
  Layers
} from 'lucide-react';
import { MedicalSpecialty } from '../types/medical';

interface SpecialtyDetail {
  id: MedicalSpecialty;
  nom: string;
  icon: string;
  description: string;
  scoresOutils: string[];
  protocolesCles: {
    pathologie: string;
    conduite: string;
    examens: string;
    signesGravite: string;
    hospitalisation: string;
  }[];
}

const SPECIALTIES_DATA: SpecialtyDetail[] = [
  {
    id: 'general',
    nom: 'Médecine Générale',
    icon: 'Stethoscope',
    description: 'Premier recours, approche globale holistique, suivi des polypathologies et prévention.',
    scoresOutils: ['Score de Mac Isaac (Angine)', 'Score de Centor', 'Calcul du risque cardiovasculaire global (SCORE OMS)'],
    protocolesCles: [
      {
        pathologie: 'Syndrome Fébril Aigu en zone endémique',
        conduite: 'TDR Paludisme immédiat. Si positif -> CTA 3 jours. Si négatif -> recherche foyer respiratoire, urinaire, ORL.',
        examens: 'TDR Paludisme, Bandelette urinaire, NFS si fièvre > 5 jours.',
        signesGravite: 'Altération de conscience, purpura, hypotension, détresse respiratoire.',
        hospitalisation: 'Tout signe de danger général ou suspicion de neuropaludisme.'
      },
      {
        pathologie: 'Hypertension Artérielle de l\'adulte',
        conduite: 'Confirmer par 3 mesures séparées. RHD (régime hyposodé, exercice). Monothérapie puis bithérapie préférentielle (Inhibiteur calcique + IEC ou Diurétique thiazidique).',
        examens: 'Bilan de retentissement (Créatininémie, DFG, Ionogramme, Bandelette urinaire protéinurie, ECG 12 dérivations).',
        signesGravite: 'PAS ≥ 180 ou PAD ≥ 120 avec souffrance d\'organe (céphalées intenses, OAP, insuffisance rénale aiguë).',
        hospitalisation: 'Urgence hypertensive vraie (admission en soins intensifs).'
      }
    ]
  },
  {
    id: 'pediatrie',
    nom: 'Pédiatrie & Néonatalogie',
    icon: 'Baby',
    description: 'Prise en charge intégrée du nourrisson, enfant et adolescent selon la PCIME et la néonatalogie.',
    scoresOutils: ['Score d\'Apgar néonatal', 'Score de Silverman (détresse respiratoire)', 'Score de Blantyre (coma fébrile)', 'Z-score Poids/Taille'],
    protocolesCles: [
      {
        pathologie: 'Paludisme Grave Pédiatrique',
        conduite: 'Artésunate injectable 3,0 mg/kg si < 20 kg à H0, H12, H24 puis q24h. Relais CTA dès que possible (min 3 doses).',
        examens: 'TDR, Goutte Épaisse, Glycémie capillaire immédiate, Hémocue.',
        signesGravite: 'Score de Blantyre < 3, anémie clinique décompensée, respiration acidosique.',
        hospitalisation: 'Hospitalisation immédiate sous monitorage en soins intensifs.'
      },
      {
        pathologie: 'Pneumonie Aiguë de l\'Enfant (PCIME)',
        conduite: 'Si pas de signe de danger ni tirage : Amoxicilline per os 80 mg/kg/j en 2 prises pendant 5 jours.',
        examens: 'Comptage FR sur 1 min, oxymétrie de pouls.',
        signesGravite: 'Tirage sous-costal marqué, geignement expiratoire, SpO2 < 92%, stridor au repos.',
        hospitalisation: 'Oxygène + Ampicilline/Gentamicine ou Ceftriaxone IV si signes de gravité.'
      }
    ]
  },
  {
    id: 'gyneco_obstetrique',
    nom: 'Gynécologie-Obstétrique',
    icon: 'Heart',
    description: 'Surveillance prénatale, accouchement sécurisé, soins obstétricaux et néonatals d\'urgence (SONU).',
    scoresOutils: ['Score de Bishop (maturation cervicale)', 'Score de Manning (profil biophysique)', 'Partogramme OMS'],
    protocolesCles: [
      {
        pathologie: 'Éclampsie et Pré-éclampsie Sévère',
        conduite: 'Sulfate de magnésium (MgSO4) dose de charge 4g IV + 5g IM dans chaque fesse. Nicardipine IV si HTA ≥ 160/110. Césarienne d\'urgence après stabilisation.',
        examens: 'Protéinurie des 24h ou bandelette, plaquettes, transaminases, créatinine.',
        signesGravite: 'Convulsions, phosphènes, barre épigastrique de Chaussier, oligurie.',
        hospitalisation: 'Transfert médicalisé immédiat en bloc opératoire / maternité SONU.'
      },
      {
        pathologie: 'Hémorragie du Post-Partum (HPP)',
        conduite: 'Règle des 4T. Oxytocine 10 UI IM/IV immédiate. Massage utérin bimanuel. Révision utérine et examen sous valves. Acide tranexamique 1g IV si < 3h.',
        examens: 'NFS, Groupe sanguin Rhesus, bilan d\'hémostase.',
        signesGravite: 'Pertes sanguines > 500 mL (voie basse) ou > 1000 mL (césarienne) avec hypotension.',
        hospitalisation: 'Urgence chirurgicale d\'hémostase si échec du traitement médical.'
      }
    ]
  },
  {
    id: 'cardiologie',
    nom: 'Cardiologie',
    icon: 'Activity',
    description: 'Insuffisance cardiaque, cardiopathies rhumatismales, syndromes coronariens aigus et arythmies.',
    scoresOutils: ['Score CHA2DS2-VASc (Fibrillation auriculaire)', 'Score TIMI / GRACE (SCA)', 'Classification NYHA'],
    protocolesCles: [
      {
        pathologie: 'Syndrome Coronarien Aigu (SCA avec ou sans sus-ST)',
        conduite: 'Aspirine 300 mg à croquer + Clopidogrel 300 mg (ou Ticagrelor) + Héparine de bas poids moléculaire (Énoxaparine 1 mg/kg SC q12h). Dérivé nitré sublingual.',
        examens: 'ECG 12 dérivations dans les 10 minutes, Troponine ultrasensible à H0 et H2.',
        signesGravite: 'Instabilité hémodynamique, OAP cardiogénique, arrêt circulatoire.',
        hospitalisation: 'Unité de Soins Intensifs Cardiologiques (USIC) avec préparation à la coronarographie.'
      },
      {
        pathologie: 'Œdème Aigu du Poumon (OAP)',
        conduite: 'Position assise jambes pendantes. Oxygène pour SpO2 > 95%. Furosémide IV 40 à 80 mg en bolus direct. Dérivés nitrés IV.',
        examens: 'Radio thoracique, Gaz du sang, ECG, Pro-BNP.',
        signesGravite: 'SpO2 < 85%, sueurs, tirage, épuisement respiratoire.',
        hospitalisation: 'Soins continus cardiologiques.'
      }
    ]
  },
  {
    id: 'pneumologie',
    nom: 'Pneumologie',
    icon: 'Wind',
    description: 'Affections respiratoires aiguës et chroniques, asthme, BPCO, pneumonies et tuberculose.',
    scoresOutils: ['Score CURB-65 (gravité pneumonie)', 'Score de Wells (Embolie pulmonaire)', 'Classification GOLD (BPCO)'],
    protocolesCles: [
      {
        pathologie: 'Crise d\'Asthme Aiguë Grave (AAG)',
        conduite: 'Oxygène au masque à fort débit (viser SpO2 94-98%). Nébulisation Salbutamol 5 mg + Ipratropium 0,5 mg répétée 3 fois en 1 heure. Corticothérapie systémique précoce (Prednisolone 1 mg/kg PO ou Méthylprednisolone 1 mg/kg IV).',
        examens: 'Débit Expiratoire de Pointe (DEP), Gazométrie si épuisement.',
        signesGravite: 'Silence auscultatoire ("poumon silencieux"), parole impossible, cyanose, bradycardie.',
        hospitalisation: 'Réanimation immédiate si absence d\'amélioration après 1 heure de nébulisation.'
      }
    ]
  },
  {
    id: 'neurologie',
    nom: 'Neurologie',
    icon: 'Brain',
    description: 'Accidents vasculaires cérébraux, épilepsies, comas, méningites et neuropathies périphériques.',
    scoresOutils: ['Score de Glasgow (GCS)', 'Score NIHSS (AVC ischémique)', 'Score de Four (coma réanimatoire)'],
    protocolesCles: [
      {
        pathologie: 'Accident Vasculaire Cérébral (AVC) en phase aiguë',
        conduite: 'Heure exacte de début des symptômes ! Maintenir tête à 30°, glycémie normale (ne pas perfuser de glucosé pur), TA respectée (traiter seulement si > 220/120 mmHg).',
        examens: 'Scanner cérébral sans injection en urgence immédiate (distinction ischémie vs hémorragie).',
        signesGravite: 'Score Glasgow < 9, détresse respiratoire, engagement cérébral.',
        hospitalisation: 'Unité Neurovasculaire d\'Urgence (UNV).'
      }
    ]
  },
  {
    id: 'infectiologie',
    nom: 'Infectiologie & Médecine Tropicale',
    icon: 'ShieldAlert',
    description: 'Paludisme, Tuberculose, VIH, Choléra, Fièvre typhoïde, Hépatites virales et arboviroses.',
    scoresOutils: ['Score qSOFA', 'Stadification clinique OMS du VIH', 'Index de gravité du sepsis'],
    protocolesCles: [
      {
        pathologie: 'Fièvre Typhoïde Sévère',
        conduite: 'Ceftriaxone IV 2g/jour ou Ciprofloxacine 500mg x 2/j. Réhydratation, surveillance abdominale stricte (risque de perforation iléale).',
        examens: 'Hémocultures (1ère semaine), Coproculture, NFS (leucopénie paradoxale).',
        signesGravite: 'Tuphos (torpeur profonde), rectorragies massives, défense abdominale.',
        hospitalisation: 'Hospitalisation en médecine interne avec avis chirurgical en alerte.'
      }
    ]
  },
  {
    id: 'gastro_enterologie',
    nom: 'Gastro-entérologie',
    icon: 'Layers',
    description: 'Hémorragies digestives, ulcères gastroduodénaux, cirrhoses, hépatites et pancréatites aiguës.',
    scoresOutils: ['Score de Child-Pugh', 'Score de Glasgow-Blatchford (hémorragie digestive)', 'Score de Ranson (pancréatite)'],
    protocolesCles: [
      {
        pathologie: 'Hémorragie Digestive Haute (Hématémèse / Méléna)',
        conduite: '2 VVP gros calibre, remplissage cristalloïde, IPP forte dose (Oméprazole 80 mg IV bolus puis 8 mg/h). Transfusion si Hb < 7-8 g/dL.',
        examens: 'NFS, bilan d\'hémostase, Endoscopie œso-gastro-duodénale (EOGD) dans les 24 heures.',
        signesGravite: 'Choc hémorragique, récidive de saignement actif.',
        hospitalisation: 'Soins intensifs médico-chirurgicaux.'
      }
    ]
  },
  {
    id: 'dermatologie',
    nom: 'Dermatologie',
    icon: 'Grid',
    description: 'Dermatoses tropicales, gale, impétigo, ulcères de Buruli, lèpre et toxidermies graves.',
    scoresOutils: ['Score SCORTEN (Syndrome de Lyell)', 'Surface corporelle atteinte (Règle des 9 de Wallace)'],
    protocolesCles: [
      {
        pathologie: 'Toxidermie Bulleuse Grave (Stevens-Johnson / Lyell)',
        conduite: 'Arrêt immédiat de tout médicament imputable (sulfamides, allopurinol, carbamazépine). Soins en environnement aseptique stérile. Hydratation prudente.',
        examens: 'Biopsie cutanée urgente, ionogramme complet.',
        signesGravite: 'Décollement cutané étendu > 10%, atteinte des muqueuses buccale et génitale.',
        hospitalisation: 'Centre de traitement des brûlés / Réanimation.'
      }
    ]
  },
  {
    id: 'nephrologie',
    nom: 'Néphrologie',
    icon: 'Activity',
    description: 'Insuffisance rénale aiguë, syndrome néphrotique, glomérulonéphrites et hémodialyse.',
    scoresOutils: ['Critères KDIGO (Insuffisance rénale aiguë)', 'Calcul de la Clairance de la Créatinine (CKD-EPI)'],
    protocolesCles: [
      {
        pathologie: 'Hyperkaliémie Menaçante (K+ > 6.5 mmol/L)',
        conduite: 'Gluconate de Calcium 10% 1 ampoule IV lente en 3 minutes (protection myocardique) + Insuline rapide 10 UI dans 500 mL G10% en 30 min (transfert intracellulaire) + Résine échangeuse d\'ions (Kayexalate).',
        examens: 'ECG immédiat (ondes T pointues, disparition onde P, élargissement QRS).',
        signesGravite: 'Troubles du rythme ventriculaire, arrêt cardiaque imminent.',
        hospitalisation: 'Unité de soins intensifs et indication d\'hémodialyse en urgence.'
      }
    ]
  },
  {
    id: 'endocrinologie',
    nom: 'Endocrinologie & Métabolisme',
    icon: 'Flame',
    description: 'Diabète de type 1 et 2, acidocétose diabétique, coma hyperosmolaire, pathologies thyroïdiennes.',
    scoresOutils: ['Calcul du Trou Anionique', 'Osmolarité plasmatique calculée'],
    protocolesCles: [
      {
        pathologie: 'Acidocétose Diabétique',
        conduite: 'Réhydratation massive au NaCl 0,9% (1L la 1ère heure). Insuline rapide IV continue (0,1 UI/kg/h) dès que K+ > 3.3 mmol/L. Recharge potassique systématique précoce.',
        examens: 'Glycémie horaire, cétonémie/cétonurie, ionogramme complet, gaz du sang.',
        signesGravite: 'pH < 7.0, respiration de Kussmaul, coma acidosique.',
        hospitalisation: 'Soins intensifs métaboliques.'
      }
    ]
  },
  {
    id: 'chirurgie',
    nom: 'Chirurgie Générale & Viscérale',
    icon: 'Stethoscope',
    description: 'Abdomens aigus chirurgicaux, péritonites, occlusions intestinales, traumatismes et plaies par arme.',
    scoresOutils: ['Score d\'Alvarado (Appendicite aiguë)', 'Score ASA pré-anesthésique'],
    protocolesCles: [
      {
        pathologie: 'Péritonite Aiguë Généralisée',
        conduite: 'À jeun strict. Pose de sonde nasogastrique en déclive. Réanimation hydro-électrolytique. Antibiothérapie triple IV large spectre (C3G + Métronidazole + Gentamicine).',
        examens: 'ASP ou scanner abdominal (recherche de pneumopéritoine), bilan préopératoire.',
        signesGravite: 'Choc septique péritonéal, défense puis contracture abdominale généralisée ("ventre de bois").',
        hospitalisation: 'Bloc opératoire en urgence chirurgicale absolue.'
      }
    ]
  },
  {
    id: 'urgences',
    nom: 'Médecine d\'Urgence & Réanimation',
    icon: 'ShieldAlert',
    description: 'Défaillances multiviscérales, arrêt cardiorespiratoire, polytraumatisés et gestion des afflux massifs.',
    scoresOutils: ['Algorithme ABCDE', 'Score de Glasgow', 'Score Revised Trauma Score (RTS)'],
    protocolesCles: [
      {
        pathologie: 'Arrêt Cardio-Respiratoire (ACR)',
        conduite: 'Alerte immédiate. Massages cardiaques externes continus (100-120/min, 5-6 cm de profondeur). Ratio 30:2 ou continu si intubé. Défibrillation précoce si rythme choquable (FV/TV sans pouls). Adrénaline 1 mg IV toutes les 3-5 min.',
        examens: 'Analyse du tracé sur défibrillateur.',
        signesGravite: 'Inconscience, absence de pouls carotidien, absence de mouvements respiratoires.',
        hospitalisation: 'Réanimation cardio-pulmonaire avancée en déchocage.'
      }
    ]
  },
  {
    id: 'sante_publique',
    nom: 'Santé Publique & Épidémiologie',
    icon: 'Activity',
    description: 'Surveillance sentinelle des épidémies, riposte vaccinale, hygiène et assainissement hospitalier.',
    scoresOutils: ['Taux d\'attaque épidémique', 'Taux de létalité intrahospitalière', 'Indicateurs WASH'],
    protocolesCles: [
      {
        pathologie: 'Flambée Épidémique de Choléra ou Fièvre Hémorragique',
        conduite: 'Déclaration obligatoire immédiate au Ministère et à la Division Provinciale de la Santé (DPS). Mise en place d\'un cordon d\'isolement et d\'un Centre de Traitement dédié.',
        examens: 'Prélèvements sentinelles avec transport sécurisé vers l\'INRB (Kinshasa).',
        signesGravite: 'Augmentation exponentielle des cas avec dépassement du seuil d\'alerte épidémique.',
        hospitalisation: 'Isolement strict et prise en charge protocolisée sécurisée.'
      }
    ]
  }
];

export const SpecialtiesView: React.FC = () => {
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<MedicalSpecialty>('pediatrie');

  const selectedSpecialty = SPECIALTIES_DATA.find(s => s.id === selectedSpecialtyId) || SPECIALTIES_DATA[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Grid className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <span>14 Spécialités Médicales & Protocoles Documentés</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Outils diagnostiques spécifiques, scores validés et conduites à tenir thérapeutiques de référence
        </p>
      </div>

      {/* Grid of 14 Specialties */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {SPECIALTIES_DATA.map((s) => {
          const isSelected = s.id === selectedSpecialtyId;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSpecialtyId(s.id)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-sky-400'
              }`}
            >
              <span className="text-xs font-semibold block leading-tight">{s.nom}</span>
              <span className={`text-[10px] mt-2 block ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                {s.protocolesCles.length} protocoles
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail Pane for Selected Specialty */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {selectedSpecialty.nom}
            </h2>
            <span className="text-xs font-mono text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-full">
              Référentiel Hospitalier Validé
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {selectedSpecialty.description}
          </p>

          {/* Scores & Tools */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Scores d'évaluation associés :
            </span>
            {selectedSpecialty.scoresOutils.map((sc, i) => (
              <span
                key={i}
                className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono"
              >
                {sc}
              </span>
            ))}
          </div>
        </div>

        {/* Protocols List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Protocoles Cliniques Opérationnels
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedSpecialty.protocolesCles.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {p.pathologie}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-sky-600 dark:text-sky-400 block mb-0.5">
                    Conduite à tenir initiale :
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {p.conduite}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Examens prioritaires :
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    {p.examens}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-rose-600 dark:text-rose-400 block mb-0.5">
                    Signes d'alerte et de gravité :
                  </span>
                  <p className="text-rose-700 dark:text-rose-300/90 text-[11px]">
                    {p.signesGravite}
                  </p>
                </div>

                <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-800/80">
                  <strong className="text-slate-700 dark:text-slate-300">Critère d'hospitalisation :</strong> {p.hospitalisation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

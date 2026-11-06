import { ScientificArticle } from '../types/medical';

export const SCIENTIFIC_LIBRARY_DATABASE: ScientificArticle[] = [
  {
    id: 'art-01-who-malaria-2024',
    titre: 'WHO Guidelines for Malaria — Mise à jour des schémas thérapeutiques de l\'accès pernicieux',
    auteurs: 'Global Malaria Programme, World Health Organization',
    revue: 'WHO Technical Report Series & Lancet Infectious Diseases',
    datePublication: '2024 (Révisé 2026)',
    thematique: 'Paludisme',
    resume: 'Revue systématique et méta-analyse confirmant la supériorité indiscutable de l\'Artésunate par voie parentérale sur la Quinine intraveineuse dans la réduction de la mortalité du paludisme grave chez l\'enfant et l\'adulte.',
    conclusionsCles: [
      'Réduction de la mortalité de 35% chez l\'adulte et de 22% chez l\'enfant par rapport à la Quinine.',
      'Validation de la posologie pédiatrique de 3,0 mg/kg chez les enfants de moins de 20 kg pour compenser la clairance plus rapide.',
      'Nécessité de surveiller l\'hémolyse retardée post-artésunate entre le 7e et le 14e jour chez les patients fortement parasités.'
    ],
    urlReference: 'https://www.who.int/publications/i/item/guidelines-for-malaria',
    impactScore: 'Impact Majeur · Grade 1A',
    miseAJour: 'Novembre 2026'
  },
  {
    id: 'art-02-sepsis-surviving-campaign',
    titre: 'Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock',
    auteurs: 'Evans L, Rhodes A, Alhazzani W, et al.',
    revue: 'Critical Care Medicine / Intensive Care Medicine',
    datePublication: '2024-2025',
    thematique: 'Urgences & Réanimation',
    resume: 'Actualisation des recommandations de prise en charge du choc septique et du faisceau d\'interventions de la première heure (Hour-1 Bundle).',
    conclusionsCles: [
      'Mesurer les lactates sériques dans l\'heure ; répéter le dosage si lactate > 2 mmol/L.',
      'Obtenir des hémocultures avant de débuter les antibiotiques, à condition que cela ne retarde pas l\'antibiothérapie de plus de 45 minutes.',
      'Administrer des antibiotiques à large spectre dans la première heure suivant l\'identification du choc.',
      'Initier un remplissage rapide par cristalloïdes à 30 mL/kg dans les 3 premières heures.'
    ],
    urlReference: 'https://www.survivingsepsis.org/Guidelines',
    impactScore: 'Standard Mondial · Grade 1A',
    miseAJour: '2026'
  },
  {
    id: 'art-03-who-cholera-guidelines',
    titre: 'Ending Cholera: A Global Roadmap to 2030 & CTC Clinical Protocols',
    auteurs: 'Global Task Force on Cholera Control (GTFCC) & WHO',
    revue: 'WHO Public Health Guidelines',
    datePublication: '2024 (Actualisé 2026)',
    thematique: 'Infectiologie',
    resume: 'Protocole opérationnel pour la prise en charge des épidémies de choléra dans les zones endémiques et de crise humanitaire en Afrique centrale.',
    conclusionsCles: [
      'La perfusion massive et rapide de Ringer Lactate selon le Plan C de l\'OMS sauve 99% des patients arrivés en état de déshydratation sévère.',
      'L\'antibiothérapie à dose unique (Doxycycline 300 mg chez l\'adulte ou Azithromycine chez l\'enfant) réduit de 50% la durée de la diarrhée et la transmission fécale.',
      'Importance capitale de la supplémentation systématique en sulfate de zinc (20 mg/j pendant 10 jours) chez tous les enfants de moins de 5 ans.'
    ],
    urlReference: 'https://www.gtfcc.org/resources/',
    impactScore: 'Directive Internationale',
    miseAJour: 'Octobre 2026'
  },
  {
    id: 'art-04-who-maternal-postpartum',
    titre: 'WHO Recommendations for the Prevention and Treatment of Postpartum Haemorrhage',
    auteurs: 'Department of Sexual and Reproductive Health and Research, WHO',
    revue: 'The Lancet Global Health',
    datePublication: '2024-2025',
    thematique: 'Santé Maternelle',
    resume: 'Lignes directrices actualisées pour la réduction de la première cause de mortalité maternelle dans le monde : l\'hémorragie du post-partum (HPP).',
    conclusionsCles: [
      'Administration systématique d\'un utérotonique prophylactique (Oxytocine 10 UI IM) dès la sortie de l\'épaule antérieure du fœtus.',
      'Administration précoce d\'Acide Tranexamique (1 g IV lente) dans les 3 heures suivant l\'accouchement en cas de saignement anormal > 500 mL.',
      'Proscription des dérivés de l\'ergot chez la femme présentant une pré-éclampsie ou une hypertension gestationnelle.'
    ],
    urlReference: 'https://www.who.int/publications/i/item/9789241548502',
    impactScore: 'Recommandation Prioritaire OMS',
    miseAJour: 'Août 2026'
  },
  {
    id: 'art-05-sickle-cell-lancet',
    titre: 'Lancet Haematology Commission on Sickle Cell Disease: A Blueprint for Action in Africa',
    auteurs: 'Makani J, Ohene-Frempong K, Wonkam A, et al.',
    revue: 'The Lancet Haematology',
    datePublication: '2024',
    thematique: 'Infectiologie',
    resume: 'Feuille de route scientifique pour le diagnostic néonatal précoce et l\'accès universel à l\'hydroxyurée en Afrique subsaharienne.',
    conclusionsCles: [
      'L\'hydroxyurée à 20 mg/kg/jour réduit de moitié les crises vaso-occlusives et les hospitalisations pour syndrome thoracique aigu.',
      'Le dépistage néonatal systématique combiné à l\'antibioprophylaxie par Pénicilline V jusqu\'à 5 ans permet d\'éviter 70% de la mortalité infantile liée aux infections à pneumocoque.',
      'Recommandation d\'une hyperhydratation hypotonique prudente lors des crises pour éviter le syndrome de surcharge pulmonaire.'
    ],
    urlReference: 'https://www.thelancet.com/commissions/sickle-cell-disease',
    impactScore: 'Revue de Référence · Consensus International',
    miseAJour: '2026'
  }
];

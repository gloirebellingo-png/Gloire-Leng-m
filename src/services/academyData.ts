import { AcademyLesson, QuizQuestion } from '../types/medical';

export const ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'lesson-semio-choc',
    cycle: 'clinique',
    matiere: 'Sémiologie & Urgences Médicales',
    titre: 'Sémiologie des États de Choc et Prise en Charge Initiale',
    objectifsPedagogiques: [
      'Définir l\'état de choc et comprendre la dette en oxygène tissulaire',
      'Reconnaître les 4 grands mécanismes : hypovolémique, distributif (septique/anaphylactique), cardiogénique, obstructif',
      'Maîtriser les gestes prioritaires de réanimation ABCDE'
    ],
    resume: 'L\'état de choc est une défaillance circulatoire aiguë entraînant une inadéquation entre l\'apport et la consommation cellulaire en oxygène (hypoxie tissulaire). C\'est une urgence diagnostique et thérapeutique extrême où chaque minute compte.',
    contenuDetaille: `
L'état de choc ne se résume pas à une baisse de tension : c'est avant tout un déficit de perfusion périphérique. La chute tensionnelle (PAS < 90 mmHg ou baisse de > 40 mmHg) est un signe tardif de décompensation.

1. SIGNES CLINIQUES DE MAUVAISE PERFUSION TISSULAIRE (TRIADE CLASSIQUE) :
- Cutanés : Marbrures (débutant aux genoux), extrémités froides et cyanosées, temps de recoloration cutanée (TRC) allongé > 3 secondes.
- Rénaux : Oligurie (< 0,5 mL/kg/heure) traduisant l'hypoperfusion rénale et l'activation du système rénine-angiotensine-aldostérone.
- Neurologiques : Agitation, confusion, anxiété, puis somnolence et coma liés à l'hypoperfusion cérébrale.

2. CLASSIFICATION ÉTIOLOGIQUE :
- Choc Hypovolémique : Perte de volume intravasculaire (hémorragies aiguës, déshydratation sévère sur choléra, brûlures). Pression veineuse centrale basse, veines jugulaires plates.
- Choc Septique (Distributif) : Vasodilatation systémique massive induite par la réponse inflammatoire à un pathogène, avec perméabilité capillaire accrue. Phase initiale "chaude" possible avec peau chaude et pouls bondissant, puis collapsus.
- Choc Cardiogénique : Défaillance de la pompe cardiaque (infarctus étendu, myocardite, trouble du rythme). Signes de congestion veineuse : turgescence jugulaire, reflux hépato-jugulaire, râles crépitants pulmonaires d'OAP.
- Choc Obstructif : Obstacle mécanique au remplissage ou à l'éjection (tamponnade cardiaque, embolie pulmonaire massive, pneumothorax suffocant).

3. DÉMARCHE IMMÉDIATE (ABCDE) :
- Airway & Breathing : Libérer les voies aériennes, O2 à haut débit au masque à haute concentration (10-15 L/min).
- Circulation : 2 voies veineuses périphériques de gros calibre (16G ou 18G). Remplissage vasculaire immédiat par cristalloïdes isotoniques (Ringer Lactate ou NaCl 0,9% 20 mL/kg en 15-30 min) SAUF en cas de choc cardiogénique avéré avec OAP.
- Débuter les vasopresseurs (Noradrénaline) si absence de réponse rapide au remplissage dans le choc septique.
    `,
    tableauSynthese: {
      entete: ['Type de Choc', 'Mécanisme Physiopathologique', 'Signes Cliniques Clés', 'Traitement Prioritaire'],
      lignes: [
        ['Hypovolémique', 'Baisse du volume intravasculaire circulant', 'Turgescence jugulaire absente, plis cutanés, soif', 'Remplissage cristalloïde rapide (20 mL/kg) ± Transfusion'],
        ['Septique', 'Vasodilatation artériolo-veineuse + fuite capillaire', 'Fièvre/hypothermie, tachycardie, marbrures, oligurie', 'Remplissage 30 mL/kg + Antibiothérapie < 1h + Noradrénaline'],
        ['Cardiogénique', 'Défaillance de la contractilité myocardique', 'Turgescence jugulaire, râles d\'OAP, galop B3', 'Inotropes positifs (Dobutamine), diurétiques si OAP'],
        ['Anaphylactique', 'Libération massive d\'histamine médiée par IgE', 'Urticaire, bronchospasme, œdème de Quincke', 'Adrénaline IM immédiate (0,5 mg adulte / 0,01 mg/kg enfant)']
      ]
    },
    pointsClesARetenir: [
      'La pression artérielle peut être normale au stade compensé grâce à la tachycardie et la vasoconstriction.',
      'Le temps de recoloration cutanée (TRC > 3s) et les marbrures aux genoux sont des signaux d\'alarme majeurs.',
      'Tout retard d\'antibiothérapie dans le choc septique augmente la mortalité de 7% par heure de retard.'
    ]
  },
  {
    id: 'lesson-parasito-paludisme',
    cycle: 'preclinique',
    matiere: 'Microbiologie & Parasitologie Tropicale',
    titre: 'Cycle Évolutif de Plasmodium falciparum et Physiopathologie du Neuropaludisme',
    objectifsPedagogiques: [
      'Comprendre le cycle dixène de Plasmodium (anophèle vecteur / hôte humain)',
      'Expliquer le mécanisme de cytoadhérence et de séquestration microvasculaire',
      'Détailler la physiopathologie de l\'accès pernicieux et de l\'anémie palustre'
    ],
    resume: 'Plasmodium falciparum est le protozoaire le plus létal parmi les plasmodies humaines. Sa capacité unique à induire la cytoadhérence des hématies parasitées sur l\'endothélium vasculaire cérébral explique la gravité du paludisme cérébral (neuropaludisme).',
    contenuDetaille: `
1. LE CYCLE PARASITAIRE :
- Phase hépatique (schizogonie pré-érythrocytaire) : L'anophèle femelle infectée inocule des sporozoïtes lors du repas sanguin. Les sporozoïtes migrent en 30 à 60 minutes vers le foie, pénètrent les hépatocytes et se multiplient en formant des schizontes contenant des milliers de mérozoïtes (phase cliniquement muette de 7 à 14 jours).
- Phase sanguine (schizogonie érythrocytaire) : Les mérozoïtes libérés pénètrent les érythrocytes, évoluent en trophozoïtes (en bague), puis en schizontes sanguins qui lysent le globule rouge toutes les 48 heures (fièvre tierce maligne). Une petite fraction se transforme en gamétocytes sexués, infectieux pour l'anophèle.

2. PHYSIOPATHOLOGIE DU PALUDISME GRAVE :
- Protéine PfEMP1 (Plasmodium falciparum erythrocyte membrane protein 1) : Exprimée à la surface des hématies sous forme de protubérances ("knobs"). Elle se lie spécifiquement aux récepteurs endothéliaux : CD36, ICAM-1, EPCR (endothelial protein C receptor).
- Cytoadhérence et Séquestration : Les hématies parasitées matures adhèrent à l'endothélium des veinules post-capillaires cérébrales, pulmonaires et rénales. Elles échappent ainsi à la filtration et à la clairance splénique.
- Conséquences microcirculatoires : Obstruction mécanique du flux sanguin cérébral, hypoxie tissulaire locale, rupture de la barrière hémato-encéphalique, œdème cérébral et sécrétion massive de cytokines pro-inflammatoires (TNF-alpha, IL-1, IL-6).

3. MÉCANISME DE L'ANÉMIE PALUSTRE SÉVÈRE :
- Hémolyse directe des hématies parasitées lors de la rupture des schizontes.
- Destruction splénique accrue des hématies saines non parasitées (phénomène auto-immun et fragilisation membranaire).
- Dysérythropoïèse médullaire induite par le TNF-alpha et l'hémozoïne (pigment malarique).
    `,
    tableauSynthese: {
      entete: ['Stade Parasitaire', 'Localisation Anatomique', 'Durée / Caractéristique', 'Cible Thérapeutique'],
      lignes: [
        ['Sporozoïte', 'Circulation sanguine -> Hépatocyte', '30 à 60 minutes', 'Vaccin RTS,S / R21'],
        ['Schizonte hépatique', 'Foie (intrahépatocytaire)', '7 à 10 jours (asymptomatique)', 'Primaquine (sur hypnozoïtes P.vivax/ovale)'],
        ['Trophozoïte / Schizonte érythrocytaire', 'Sang circulant & microvaisseaux profonds', 'Cycles de 48 heures', 'Artémisinines (Artésunate, Artéméther), Quinine'],
        ['Gamétocyte', 'Érythrocytes périphériques', 'Plusieurs semaines', 'Primaquine (dose unique gamétocytocide)']
      ]
    },
    pointsClesARetenir: [
      'Seul P. falciparum séquestre dans la microcirculation profonde, ce qui explique l\'absence de formes matures au frottis sanguin périphérique standard.',
      'L\'Artésunate détruit tous les stades sanguins asexués, y compris les jeunes trophozoïtes en bague, ce qui arrête immédiatement la séquestration.',
      'La glycémie capillaire doit être vérifiée systématiquement : l\'hypoglycémie imite parfaitement le neuropaludisme.'
    ]
  },
  {
    id: 'lesson-pediatrie-pcime',
    cycle: 'clinique',
    matiere: 'Pédiatrie & Santé Maternelle et Infantile',
    titre: 'Démarche PCIME : Signes Généraux de Danger et Triage Pédiatrique',
    objectifsPedagogiques: [
      'Identifier les 4 signes généraux de danger chez l\'enfant de 2 mois à 5 ans',
      'Classifier et trier un enfant malade selon la stratégie OMS / UNICEF',
      'Appliquer les règles de réhydratation et d\'antibiothérapie de première ligne'
    ],
    resume: 'La Prise en Charge Intégrée des Maladies de l\'Enfant (PCIME) est la référence absolue pour réduire la mortalité infantile en Afrique subsaharienne. Elle hiérarchise les priorités en identifiant d\'abord les signes généraux de danger.',
    contenuDetaille: `
Tout soignant recevant un enfant fébrile ou malade en consultation doit rechercher en PREMIER les 4 signes généraux de danger :

LES 4 SIGNES GÉNÉRAUX DE DANGER PCIME :
1. L'enfant est-il incapable de boire ou de téter au sein ?
2. L'enfant vomit-il tout ce qu'il consomme (vomissements incoercibles) ?
3. L'enfant a-t-il présenté des convulsions au cours de cette maladie ?
4. L'enfant est-il léthargique ou inconscient (somnolence anormale, ne s'éveille pas, regard vide) ?

SIGNIFICATION CLINIQUE :
- Si l'enfant présente AU MOINS UN de ces 4 signes : il s'agit d'une MALADIE TRÈS GRAVE (Code Rouge).
- L'enfant nécessite un traitement pré-transfert d'urgence (première dose d'artésunate injectable, première dose d'antibiotique parentéral, correction de l'hypoglycémie) et une référence immédiate vers l'Hôpital Général de Référence le plus proche.

ÉVALUATION SYSTÉMATIQUE DU SYMPTÔME MAJEUR :
- Toux ou Respiration difficile : Compter la fréquence respiratoire sur 1 minute complète au repos. Rechercher un tirage sous-costal et un stridor chez l'enfant calme.
  - Fréquence respiratoire rapide :
    * 2 mois à 11 mois : FR ≥ 50 cycles/min
    * 12 mois à 5 ans : FR ≥ 40 cycles/min
- Diarrhée : Évaluer la déshydratation (léthargie, yeux enfoncés, soif, persistance du pli cutané).
    `,
    tableauSynthese: {
      entete: ['Classification PCIME', 'Signes Présents', 'Code Couleur', 'Action Immédiate'],
      lignes: [
        ['Maladie Très Grave', 'Au moins un signe général de danger OU stridor au repos OU tirage sévère', 'ROUGE', 'Doses d\'urgence pré-transfert + Référence immédiate'],
        ['Pneumonie Simple', 'Respiration rapide SANS tirage sous-costal ni signe de danger', 'JAUNE', 'Amoxicilline orale 80 mg/kg/j pendant 5 jours à domicile + Conseils'],
        ['Pas de pneumonie (Rhume/Toux)', 'Pas de respiration rapide, pas de tirage, pas de signe de danger', 'VERT', 'Soins à domicile, antipyrétique si fièvre, pas d\'antibiotique']
      ]
    },
    pointsClesARetenir: [
      'Ne jamais administrer d\'antibiotique pour une toux simple ou une bronchite virale sans respiration rapide.',
      'Un enfant qui ne peut pas boire ne tolèrera aucun médicament oral : la voie injectable s\'impose.',
      'Toujours tester l\'appétit chez l\'enfant malnutri avant de décider du mode d\'hospitalisation.'
    ]
  }
];

export const ACADEMY_QUIZ: QuizQuestion[] = [
  {
    id: 'quiz-01',
    matiere: 'Pédiatrie & Infectiologie (PNLP RDC)',
    question: 'Quelle est la posologie initiale recommandée d\'Artésunate injectable chez un enfant de 12 kg admis pour un paludisme grave selon les directives du PNLP RDC et de l\'OMS ?',
    options: [
      '2,4 mg/kg (soit 28,8 mg) IV lente',
      '3,0 mg/kg (soit 36,0 mg) IV lente',
      '5,0 mg/kg (soit 60,0 mg) IV lente',
      '10 mg/kg (soit 120 mg) en perfusion de 4 heures'
    ],
    bonneReponseIndex: 1,
    explicationMedicale: 'Les directives de l\'OMS et du PNLP RDC stipulent que les enfants pesant moins de 20 kg doivent recevoir 3,0 mg/kg/dose d\'artésunate injectable (contre 2,4 mg/kg chez les enfants de plus de 20 kg et les adultes) pour compenser un volume de distribution et une clairance pédiatriques plus élevés.',
    referenceOMS: 'Lignes directrices de l\'OMS pour le paludisme (Section Thérapeutique pédiatrique du paludisme grave, 2024).'
  },
  {
    id: 'quiz-02',
    matiere: 'Urgences Médicales & Réanimation',
    question: 'Face à un patient adulte en état de choc septique présentant une TAs à 75 mmHg et une SpO2 à 91%, quelle est la première mesure thérapeutique circulatoire conforme aux recommandations internationales de la Surviving Sepsis Campaign ?',
    options: [
      'Injecter immédiatement 1 mg d\'Adrénaline en bolus IV direct',
      'Remplissage vasculaire rapide par cristalloïdes isotoniques (30 mL/kg) dans les 3 premières heures',
      'Perfusion immédiate de Furosémide 80 mg IV pour relancer la diurèse',
      'Transfusion de culot globulaire sans attendre le bilan biologique'
    ],
    bonneReponseIndex: 1,
    explicationMedicale: 'Dans la prise en charge initiale du choc septique, la réanimation volémique par cristalloïdes (Ringer Lactate ou NaCl 0,9%) à la dose de 30 mL/kg administrée rapidement est la pierre angulaire pour restaurer la précharge et le débit cardiaque avant l\'introduction éventuelle de noradrénaline.',
    referenceOMS: 'Surviving Sepsis Campaign International Guidelines for Management of Sepsis and Septic Shock (2021).'
  },
  {
    id: 'quiz-03',
    matiere: 'Gynécologie-Obstétrique (SONU RDC)',
    question: 'Chez une parturiente de 28 ans à 35 semaines d\'aménorrhée présentant une crise d\'éclampsie, quel est le médicament de première intention absolu pour juguler les convulsions et prévenir les récidives ?',
    options: [
      'Diazépam 10 mg IV lente',
      'Phénytoïne 15 mg/kg en perfusion',
      'Sulfate de Magnésium (MgSO4) selon le protocole de charge IV/IM',
      'Loxapine 50 mg IM'
    ],
    bonneReponseIndex: 2,
    explicationMedicale: 'Le sulfate de magnésium est le traitement de choix et de référence internationale (OMS/SONU) pour l\'éclampsie et la pré-éclampsie sévère. Les essais cliniques randomisés (Magpie Trial) ont démontré sa supériorité indiscutable sur le diazépam et la phénytoïne, avec une réduction de plus de 50% du risque de récidive convulsive et une moindre dépression néonatale.',
    referenceOMS: 'Recommandations de l\'OMS pour la prévention et le traitement de la pré-éclampsie et de l\'éclampsie.'
  },
  {
    id: 'quiz-04',
    matiere: 'Gastro-entérologie & Maladies Tropicales',
    question: 'Dans le Plan C de prise en charge du Choléra avec déshydratation sévère chez un adulte de 60 kg, quel volume de Ringer Lactate doit être perfusé au total et en combien de temps ?',
    options: [
      '2 000 mL en 12 heures',
      '6 000 mL (100 mL/kg) : 1 800 mL en 30 minutes, puis 4 200 mL en 2h30',
      '3 000 mL en 24 heures sous forme de sérum glucosé à 5%',
      '1 000 mL en bolus unique sans relais'
    ],
    bonneReponseIndex: 1,
    explicationMedicale: 'Le Plan C de l\'OMS prévoit 100 mL/kg de Ringer Lactate au total. Chez l\'adulte et l\'enfant de plus de 1 an : 30% du volume (30 mL/kg soit 1 800 mL) sont perfusés très rapidement en 30 minutes pour rétablir les pouls radiaux, puis les 70% restants (70 mL/kg soit 4 200 mL) sont perfusés sur 2 heures et demie.',
    referenceOMS: 'OMS — Cholera Outbreak Guidelines: Preparedness and Response (Plan C Réhydratation).'
  },
  {
    id: 'quiz-05',
    matiere: 'Hématologie & Médecine Interne',
    question: 'Chez un enfant atteint de drépanocytose homozygote (Hb SS) hospitalisé pour une crise vaso-occlusive douloureuse, quel est le geste systématique indispensable pour réduire la viscosité sanguine et favoriser la dé-falciformation ?',
    options: [
      'Restriction hydrique stricte pour éviter l\'œdème pulmonaire',
      'Hyperhydratation hydrosodée ou hypotonique (environ 3 litres/m²/jour)',
      'Prescription systématique d\'Aspirine à dose antiagrégante 300 mg/jour',
      'Injection intramusculaire d\'analgésique dans les masses musculaires douloureuses'
    ],
    bonneReponseIndex: 1,
    explicationMedicale: 'L\'hyperhydratation (environ 3 L/m²/24h de soluté glucosé hypotonique ou demi-salé) est capitale dans la crise vaso-occlusive : elle diminue l\'osmolarité plasmatique, réhydrate les hématies drépanocytaires, abaisse la concentration corpusculaire en hémoglobine S et prévient la polymérisation intracellulaire de l\'HbS. Les injections intramusculaires sont formellement à proscrire (risque d\'hématome et d\'abcès).',
    referenceOMS: 'Prise en charge de la drépanocytose en Afrique subsaharienne — Consensus OMS / Société Internationale d\'Hématologie.'
  }
];

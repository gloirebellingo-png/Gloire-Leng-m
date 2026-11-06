import { DrugItem } from '../types/medical';

export const DRUGS_DATABASE: DrugItem[] = [
  {
    id: 'artesunate',
    dci: 'Artésunate injectable',
    nomsCommerciaux: ['Artesun', 'Larinate', 'Artesunate Guilin'],
    classe: 'Antipaludique dérivé de l\'artémisinine',
    mecanisme: 'Génération de radicaux libres après clivage du pont endoperoxyde par le fer héminique intra-érythrocytaire, détruisant rapidement les parasites sanguins.',
    indications: [
      'Paludisme grave à Plasmodium falciparum selon critères OMS',
      'Paludisme avec signes de danger PCIME chez l\'enfant',
      'Incapacité d\'avaler un traitement oral'
    ],
    contreIndications: [
      'Hypersensibilité documentée à l\'artésunate ou aux dérivés de l\'artémisinine'
    ],
    posologieAdulte: '2,4 mg/kg IV lente ou IM profonde à H0, H12, H24 puis q24h jusqu\'à relais oral.',
    posologieEnfant: '3,0 mg/kg si poids < 20 kg ; 2,4 mg/kg si poids ≥ 20 kg. Schéma H0, H12, H24 puis q24h. Relais CTA complet dès que la voie orale est acquise (minimum 3 doses injectables).',
    calculateurKg: {
      doseMinMgKg: 2.4,
      doseMaxMgKg: 3.0,
      dosePlafondJournalierMg: 300,
      formeDisponible: 'Flacon de poudre 60 mg avec solvant bicarbonate 5% + diluant NaCl 0,9%',
      concentrationMgParMl: 10,
      nombrePrisesParJour: 1,
      voie: 'IV lente (sur 2 min) ou IM',
      instructionsReconstitution: 'Dissoudre le flacon de 60 mg avec 1 mL de bicarbonate de sodium à 5%, puis ajouter 5 mL de NaCl 0,9% pour obtenir une solution à 10 mg/mL.'
    },
    voiesAdmin: ['IV', 'IM'],
    effetsIndesirables: [
      'Anémie hémolytique retardée (post-artésunate) entre J7 et J14 (surveiller NFS)',
      'Neutropénie transitoire',
      'Nausées, vertiges'
    ],
    interactionsMajeures: [
      'Éviter l\'association avec des médicaments inducteurs du CYP2A6'
    ],
    grossesseAllaitement: 'Recommandé à tous les trimestres de la grossesse en cas de paludisme grave (bénéfice vital majeur). Compatible avec l\'allaitement.',
    adaptationRenale: 'Pas d\'adaptation posologique nécessaire en cas d\'insuffisance rénale.',
    adaptationHepatique: 'Pas d\'adaptation formelle dans l\'insuffisance hépatique modérée.',
    referenceProtocole: 'Directives Nationales PNLP RDC (2020) & Lignes directrices de l\'OMS pour le paludisme (2024)'
  },
  {
    id: 'artemether_lumefantrine',
    dci: 'Artéméther + Luméfantrine (CTA)',
    nomsCommerciaux: ['Coartem', 'Riamet', 'Lumartem', 'Artefan'],
    classe: 'Combinaison Thérapeutique à base d\'Artémisinine (CTA)',
    mecanisme: 'Artéméther élimine rapidement la biomasse parasitaire initiale ; la luméfantrine, à demi-vie longue, prévient les rechutes.',
    indications: [
      'Paludisme simple à P. falciparum non compliqué (1ère intention en RDC)'
    ],
    contreIndications: [
      'Allongement congénital ou acquis du QT',
      'Insuffisance cardiaque sévère, arythmies'
    ],
    posologieAdulte: '4 comprimés (20/120mg) par prise à H0, H8, H24, H36, H48, H60 (cure complète de 6 prises sur 3 jours avec un aliment gras ou du lait).',
    posologieEnfant: '5 à 14 kg : 1 comp 2x/j pendant 3 jours ; 15 à 24 kg : 2 comp 2x/j pendant 3 jours ; 25 à 34 kg : 3 comp 2x/j pendant 3 jours ; ≥ 35 kg : posologie adulte (4 comp 2x/j).',
    voiesAdmin: ['PO'],
    effetsIndesirables: ['Céphalées, anorexie, nausées, allongement modéré de l\'intervalle QTc'],
    interactionsMajeures: ['Médicaments allongeant le QT (érythromycine, halopéridol, quinine), inhibiteurs/inducteurs enzymatiques du CYP3A4'],
    grossesseAllaitement: 'Utilisable aux 2ème et 3ème trimestres. Au 1er trimestre : Quinine orale privilégiée, ou CTA si absence d\'alternative.',
    adaptationRenale: 'Pas d\'ajustement dans l\'insuffisance rénale légère à modérée.',
    adaptationHepatique: 'Prudence en cas d\'insuffisance hépatique sévère.',
    referenceProtocole: 'PNLP RDC / OMS 2024'
  },
  {
    id: 'amoxicilline',
    dci: 'Amoxicilline',
    nomsCommerciaux: ['Clamoxyl', 'Amoxil', 'Hiconcil', 'Bactox'],
    classe: 'Antibiotique Bêta-lactamine (Pénicilline A)',
    mecanisme: 'Inhibition de la synthèse de la paroi bactérienne (peptidoglycane) par liaison aux PLP, action bactéricide.',
    indications: [
      'Pneumonies aiguës communautaires de l\'enfant (PCIME) et de l\'adulte',
      'Otite moyenne aiguë purulente',
      'Infections bucco-dentaires, sinusites',
      'Exacerbation de bronchite chronique'
    ],
    contreIndications: [
      'Allergie avérée aux Pénicillines ou aux Bêta-lactamines (choc anaphylactique, angio-œdème)',
      'Mononucléose infectieuse (risque d\'éruption cutanée maculopapuleuse sévère)'
    ],
    posologieAdulte: '1 g 2 à 3 fois par jour per os (2 g à 3 g/jour max).',
    posologieEnfant: '80 à 90 mg/kg/jour en 2 à 3 prises per os (PCIME Pneumonie pédiatrique : 80 mg/kg/jour en 2 prises pendant 5 jours).',
    calculateurKg: {
      doseMinMgKg: 50,
      doseMaxMgKg: 90,
      dosePlafondJournalierMg: 3000,
      formeDisponible: 'Suspension buvable 250 mg / 5 mL (soit 50 mg/mL) ou 500 mg / 5 mL',
      concentrationMgParMl: 50,
      nombrePrisesParJour: 2,
      voie: 'PO',
      instructionsReconstitution: 'Compléter avec de l\'eau minérale ou bouillie refroidie jusqu\'au trait de jauge, agiter vigoureusement avant chaque prise. Conserver au frais (max 10 jours).'
    },
    voiesAdmin: ['PO', 'IV'],
    effetsIndesirables: ['Diarrhée, nausées, rash cutané, colite pseudomembraneuse rare'],
    interactionsMajeures: ['Méthotrexate (augmentation de la toxicité), Allopurinol (risque accru d\'éruption cutanée)'],
    grossesseAllaitement: 'Utilisable sans restriction chez la femme enceinte et allaitante (classe de sécurité A).',
    adaptationRenale: 'Si DFG 10-30 mL/min : 500 mg toutes les 12h. Si DFG < 10 mL/min : 500 mg toutes les 24h.',
    adaptationHepatique: 'Aucune adaptation requise.',
    referenceProtocole: 'PCIME RDC / OMS Pneumonie & OMS Model List of Essential Medicines 2023'
  },
  {
    id: 'ceftriaxone',
    dci: 'Ceftriaxone',
    nomsCommerciaux: ['Rocéphine', 'Cefaxone', 'Mesporin'],
    classe: 'Céphalosporine de 3ème génération (C3G)',
    mecanisme: 'Bactéricide par inhibition de la synthèse de la paroi cellulaire. Large spectre contre les bactéries Gram négatif et Gram positif.',
    indications: [
      'Méningites bactériennes purulentes',
      'Sepsis sévère et état de choc septique',
      'Fièvre typhoïde compliquée ou résistante',
      'Pneumonies bactériennes sévères à l\'hôpital',
      'Infections urinaires hautes graves'
    ],
    contreIndications: [
      'Antécédent d\'hypersensibilité immédiate sévère aux céphalosporines',
      'Nouveau-né ictérique ou prématuré (risque d\'ictère nucléaire par déplacement de la bilirubine)',
      'Administration concomitante de solutions intraveineuses contenant du calcium chez le nouveau-né (risque de précipitation létale)'
    ],
    posologieAdulte: '1 g à 2 g par jour en une seule injection IV ou IM. Dans la méningite : 4 g/jour (ou 2 g q12h).',
    posologieEnfant: '50 à 80 mg/kg/jour en 1 perfusion IV lente. Dans la méningite purulente : 100 mg/kg/jour en 1 ou 2 perfusions (max 4 g/jour).',
    calculateurKg: {
      doseMinMgKg: 50,
      doseMaxMgKg: 100,
      dosePlafondJournalierMg: 4000,
      formeDisponible: 'Flacon poudre 1 g avec solvant pour perfusion',
      concentrationMgParMl: 50,
      nombrePrisesParJour: 1,
      voie: 'IV lente (30 minutes)',
      instructionsReconstitution: 'Reconstituer 1 g dans 20 mL de NaCl 0,9% ou G5% pour perfusion IV sur 30 minutes.'
    },
    voiesAdmin: ['IV', 'IM'],
    effetsIndesirables: ['Diarrhée, boues biliaires (pseudolithiase biliaire), leucopénie transitoire, candidose'],
    interactionsMajeures: ['Contre-indication formelle avec solutions calciques (Ringer Lactate) dans la même ligne de perfusion chez le nouveau-né'],
    grossesseAllaitement: 'Utilisable si nécessaire pendant la grossesse. Compatible avec l\'allaitement.',
    adaptationRenale: 'Pas de réduction si la fonction hépatique est normale, sauf si ClCr < 10 mL/min (max 2 g/jour).',
    adaptationHepatique: 'Pas d\'adaptation si la fonction rénale est préservée.',
    referenceProtocole: 'Guide Pratique des Urgences Infectieuses OMS & Médecins Sans Frontières (MSF)'
  },
  {
    id: 'paracetamol',
    dci: 'Paracétamol (Acétaminophène)',
    nomsCommerciaux: ['Doliprane', 'Efferalgan', 'Perfalgan', 'Dafalgan'],
    classe: 'Analgésique et Antipyrétique non opioïde',
    mecanisme: 'Inhibition centrale de la synthèse des prostaglandines (effet antipyrétique et antalgique sans action anti-inflammatoire périphérique notable).',
    indications: [
      'Douleurs d\'intensité légère à modérée (Palier 1 OMS)',
      'Fièvre et syndrome fébrile aigu'
    ],
    contreIndications: [
      'Insuffisance hépatocellulaire sévère',
      'Allergie avérée au paracétamol'
    ],
    posologieAdulte: '500 mg à 1 g par prise, à renouveler toutes les 6 heures si besoin (Maximum strict : 3 g/jour en automédication, 4 g/jour sur prescription).',
    posologieEnfant: '15 mg/kg par prise toutes les 6 heures, soit 60 mg/kg/jour maximum répartis en 4 prises.',
    calculateurKg: {
      doseMinMgKg: 10,
      doseMaxMgKg: 15,
      dosePlafondJournalierMg: 2000,
      formeDisponible: 'Sirop pédiatrique 120 mg / 5 mL (24 mg/mL) ou flacon perfusion 10 mg/mL',
      concentrationMgParMl: 24,
      nombrePrisesParJour: 4,
      voie: 'PO ou IV',
      instructionsReconstitution: 'Respecter scrupuleusement l\'intervalle minimal de 6 heures entre les prises.'
    },
    voiesAdmin: ['PO', 'IV', 'Rectale'],
    effetsIndesirables: ['Hépatotoxicité majeure en cas de surdosage (> 150 mg/kg chez l\'enfant ou > 6 g chez l\'adulte) ; antidote : N-acétylcystéine'],
    interactionsMajeures: ['Inducteurs enzymatiques (alcoolisme chronique, rifampicine, phénytoïne) augmentant la production du métabolite toxique NAPQI'],
    grossesseAllaitement: 'Médicament antalgique et antipyrétique de choix pendant la grossesse et l\'allaitement.',
    adaptationRenale: 'Si ClCr < 10 mL/min, espacer les prises de 8 heures minimum.',
    adaptationHepatique: 'Dose réduite à 2 g/jour maximum en cas d\'insuffisance hépatique légère à modérée.',
    referenceProtocole: 'Formulaire Thérapeutique RDC & OMS'
  },
  {
    id: 'diazepam',
    dci: 'Diazépam',
    nomsCommerciaux: ['Valium', 'Stesolid'],
    classe: 'Benzodiazépine anxiolytique et anticonvulsivante',
    mecanisme: 'Agoniste des récepteurs GABA-A, augmentant la conductance au chlore et l\'inhibition neuronale dans le système nerveux central.',
    indications: [
      'Arrêt immédiat des crises convulsives / État de mal épileptique',
      'Convulsions fébriles prolongées de l\'enfant',
      'Tétanos (spasmes musculaires)',
      'Sédation d\'urgence'
    ],
    contreIndications: [
      'Myasthénie grave',
      'Insuffisance respiratoire sévère décompensée',
      'Syndrome d\'apnée du sommeil'
    ],
    posologieAdulte: '10 mg IV lente (sur 2 minutes) à répéter à 10 minutes si la crise persiste (max 30 mg).',
    posologieEnfant: '0,5 mg/kg par voie rectale (canule ou seringue sans aiguille) OU 0,2 à 0,3 mg/kg IV lente. Attention au risque de dépression respiratoire.',
    calculateurKg: {
      doseMinMgKg: 0.3,
      doseMaxMgKg: 0.5,
      dosePlafondJournalierMg: 10,
      formeDisponible: 'Ampoule injectable 10 mg / 2 mL (5 mg/mL)',
      concentrationMgParMl: 5,
      nombrePrisesParJour: 1,
      voie: 'Rectale ou IV lente',
      instructionsReconstitution: 'Avoir à portée de main un ballon auto-gonflable (Ambu) avec masque facial adapté en cas d\'apnée.'
    },
    voiesAdmin: ['IV', 'Rectale'],
    effetsIndesirables: ['Dépression respiratoire, somnolence profonde, hypotension artérielle, hypotonie'],
    interactionsMajeures: ['Alcool, autres sédatifs et opioïdes (majoration majeure de la dépression du système nerveux central)'],
    grossesseAllaitement: 'Risque d\'hypotonie néonatale et de détresse respiratoire à la naissance (floppy infant syndrome). À réserver aux urgences convulsives.',
    adaptationRenale: 'Prudence requise.',
    adaptationHepatique: 'Contre-indiqué ou réduction de posologie dans l\'insuffisance hépatique sévère (risque d\'encéphalopathie).',
    referenceProtocole: 'Guide des Urgences Neurologiques OMS & PCIME'
  },
  {
    id: 'ringer_lactate',
    dci: 'Ringer Lactate (Soluté de Hartmann)',
    nomsCommerciaux: ['Ringer Lactate B. Braun', 'Ringer Fresenius'],
    classe: 'Soluté cristalloïde isotonique poly-ionique pour perfusion',
    mecanisme: 'Restauration volémique du compartiment extracellulaire. Les ions lactate sont métabolisés en bicarbonates par le foie, contribuant à corriger l\'acidose métabolique.',
    indications: [
      'Déshydratation sévère sur diarrhée aiguë et Choléra (Plan C OMS)',
      'État de choc hypovolémique et hémorragique',
      'Brûlures étendues (formule de Parkland)'
    ],
    contreIndications: [
      'Hyperkaliémie sévère',
      'Acidose lactique décompensée',
      'Perfusion concomitante de Ceftriaxone chez le nouveau-né'
    ],
    posologieAdulte: 'Choc : 1 000 mL en bolus rapide sur 15 à 30 minutes, puis réévaluation hémodynamique.',
    posologieEnfant: 'Plan C Choléra OMS (100 mL/kg au total) : < 1 an : 30 mL/kg en 1h puis 70 mL/kg en 5h ; ≥ 1 an : 30 mL/kg en 30 min puis 70 mL/kg en 2h30.',
    calculateurKg: {
      doseMinMgKg: 20,
      doseMaxMgKg: 100,
      dosePlafondJournalierMg: 3000,
      formeDisponible: 'Poches de 500 mL et 1000 mL',
      concentrationMgParMl: 1,
      nombrePrisesParJour: 1,
      voie: 'IV',
      instructionsReconstitution: 'Surveiller la diurèse et la réapparition des pouls périphériques.'
    },
    voiesAdmin: ['IV'],
    effetsIndesirables: ['Surcharge hydrosodée, œdème aigu du poumon chez les insuffisants cardiaques ou rénaux'],
    interactionsMajeures: ['Ceftriaxone chez le nouveau-né'],
    grossesseAllaitement: 'Parfaitement compatible.',
    adaptationRenale: 'Prudence pour éviter la surcharge volémique.',
    adaptationHepatique: 'Utiliser du sérum physiologique NaCl 0,9% si insuffisance hépatique majeure (mauvaise métabolisation du lactate).',
    referenceProtocole: 'Protocole National de Prise en Charge du Choléra en RDC / OMS'
  },
  {
    id: 'sulfate_magnesium',
    dci: 'Sulfate de Magnésium (MgSO4)',
    nomsCommerciaux: ['Sulfate de Magnésium Lavoisier 15% / 50%'],
    classe: 'Anticonvulsivant tocolytique et neuroprotecteur obstétrical',
    mecanisme: 'Blocage des récepteurs NMDA et vasodilatation cérébrale prévenant les convulsions éclanptiques.',
    indications: [
      'Pré-éclampsie sévère (prévention des crises convulsives)',
      'Éclampsie (traitement de la crise convulsive)',
      'Neuroprotection fœtale en cas d\'accouchement prématuré imminent'
    ],
    contreIndications: [
      'Myasthénie grave',
      'Bloc auriculo-ventriculaire, insuffisance rénale anurique'
    ],
    posologieAdulte: 'Dose de charge : 4 g IV lente sur 15-20 min, suivie soit de 1 g/heure en perfusion IV continue, soit de 5 g IM dans chaque fesse (Protocole de Pritchard).',
    posologieEnfant: 'Non applicable (indication obstétricale).',
    voiesAdmin: ['IV', 'IM'],
    effetsIndesirables: [
      'Signes de surdosage : abolition des réflexes ostéotendineux (ROT), bradypnée < 12/min, arrêt respiratoire, arrêt cardiaque. Antidote impératif : Gluconate de Calcium 10% 1 g IV lente.'
    ],
    interactionsMajeures: ['Potentialisation des curares et des inhibiteurs calciques'],
    grossesseAllaitement: 'Médicament de référence absolue OMS pour l\'éclampsie.',
    adaptationRenale: 'Contrôler la diurèse (> 30 mL/h) avant chaque dose.',
    adaptationHepatique: 'Aucune adaptation spécifique.',
    referenceProtocole: 'Directives Nationales de Santé de la Mère et du Nouveau-né RDC / Recommandations OMS 2024'
  }
];

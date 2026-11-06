import { ClinicalCaseSimulation } from '../types/medical';

export const SIMULATION_CASES: ClinicalCaseSimulation[] = [
  {
    id: 'case-01-neuropalu',
    titre: 'Enfant de 3 ans avec fièvre élevée, prostration et convulsions',
    niveau: 'Étudiant 2ème cycle',
    specialite: 'Pédiatrie & Infectiologie Tropicale',
    patientPresentation: {
      age: 3,
      sexe: 'M',
      poidsKg: 13,
      profession: 'Enfant d\'âge préscolaire',
      motif: 'Fièvre brûlante depuis 48 heures, vomissements répétés et survenue d\'une crise convulsive généralisée il y a 1 heure.',
      contexte: 'Amené par sa mère au centre de santé de référence de Kingasani (Kinshasa, RDC). La mère signale que l\'enfant ne boit plus depuis ce matin.'
    },
    constantesInitiales: {
      temperature: 39.9,
      frequenceCardiaque: 158,
      frequenceRespiratoire: 46,
      saturationO2: 92,
      taSystolique: 85,
      taDiastolique: 50,
      glycemieCapillaire: 42, // Hypoglycémie critique (< 54 mg/dL)
      poidsKg: 13,
      etatConscience: 'Douleur'
    },
    anamneseAttendue: [
      'Durée exacte de la fièvre et profil d\'évolution',
      'Type de convulsions (tonico-cloniques généralisées ou focales)',
      'Prise de médicaments traditionnels ou automédication préalable',
      'Statut vaccinal (PEV) et utilisation d\'une moustiquaire imprégnée (MILD)',
      'Notion de drépanocytose familiale ou personnelle'
    ],
    examenPhysiqueResultats: {
      'Inspection générale': 'Enfant prostré, ne réagit qu\'à la stimulation douloureuse. Pâleur conjonctivale intense (anémie sévère clinique). Pli cutané s\'effaçant rapidement (pas de déshydratation majeure).',
      'Neurologique': 'Score de Blantyre = 2/5 (mouvements non adaptés à la douleur, pas de cri approprié, ne suit pas du regard). Raideur de nuque douteuse. Pupilles égales et réactives.',
      'Cardiovasculaire': 'Tachycardie régulière à 158 bpm, pas de souffle audible, pouls périphériques bien frappés, TRC = 2 secondes.',
      'Pulmonaire': 'Polypnée superficielle à 46/min sans tirage sous-costal marqué, murmure vésiculaire symétrique sans râles.',
      'Abdominal': 'Abdomen souple, rate palpable à 2 cm sous le rebord costal (splénomégalie modérée stade II de Hackett).'
    },
    examensComplementairesDisponibles: [
      { nom: 'TDR Paludisme (Pan/Pf)', resultat: 'POSITIF pour Plasmodium falciparum (Ag HRP-2 fortement réactif)', coutTemps: '15 minutes', pertinent: true },
      { nom: 'Goutte Épaisse & Frottis sanguin', resultat: 'Trophozoïtes en bague de P. falciparum, parasitémie estimée à 120 000 parasites/µL (très élevée)', coutTemps: '45 minutes', pertinent: true },
      { nom: 'Hémoglobine rapide (Hémocue)', resultat: 'Hb = 4,8 g/dL (Anémie sévère décompensée)', coutTemps: '5 minutes', pertinent: true },
      { nom: 'Glycémie capillaire de contrôle', resultat: '42 mg/dL (2,3 mmol/L) -> HYPOGLYCÉMIE SÉVÈRE', coutTemps: '2 minutes', pertinent: true },
      { nom: 'Ponction Lombaire (après stabilisation)', resultat: 'LCR eau de roche, 2 éléments/mm³, protéinorachie 0,25 g/L, pas de germes à l\'examen direct (élimine méningite purulente)', coutTemps: '1 heure', pertinent: true },
      { nom: 'Scanner cérébral injecté', resultat: 'Non disponible en urgence de nuit / non indiqué en 1ère intention', coutTemps: '6 heures', pertinent: false }
    ],
    diagnosticCorrect: 'Paludisme grave de l\'enfant à Plasmodium falciparum sous triple forme : Neurologique (Neuropaludisme), Anémique sévère (Hb 4,8 g/dL) et Métabolique (Hypoglycémie).',
    diagnosticsDifferentiels: [
      'Méningite bactérienne aiguë',
      'Encéphalite virale',
      'Sepsis sévère à point de départ digestif ou urinaire',
      'Crise d\'épilepsie sur convulsions fébriles simples (écartée par la prostration persistante)'
    ],
    priseEnChargeAttendue: [
      '1. Correction immédiate de l\'hypoglycémie : Sérum Glucosé 10% 5 mL/kg IVD en bolus lent (soit 65 mL de G10%), puis perfusion d\'entretien glucosée.',
      '2. Voie veineuse périphérique de sécurité et oxygénothérapie au masque à 2 L/min.',
      '3. Antipaludique d\'urgence : Artésunate injectable 3,0 mg/kg (soit 39 mg IV lente à H0, H12, H24).',
      '4. Transfusion d\'urgence : Culot globulaire isogroupe isorhésus 10 mL/kg (ou sang total frais 20 mL/kg) sous surveillance stricte.',
      '5. Traitement anticonvulsivant si reprise de crise : Diazépam 0,5 mg/kg intra-rectal.',
      '6. Surveillance horaire : Score de Blantyre, glycémie, température, diurèse.'
    ],
    erreursCritiquesAEviter: [
      'Oublier de vérifier et corriger la glycémie capillaire (l\'hypoglycémie non corrigée entraîne des séquelles cérébrales irréversibles ou le décès).',
      'Administrer une dose adulte d\'artésunate (2,4 mg/kg) au lieu de la dose pédiatrique recommandée de 3,0 mg/kg pour un enfant < 20 kg.',
      'Pratiquer une ponction lombaire immédiate sans avoir d\'abord stabilisé l\'hypoxie et la glycémie.',
      'Tenter un traitement oral chez un enfant prostré avec vomissements.'
    ],
    explicationPhysiopathologique: 'Chez cet enfant en zone d\'endémie, la séquestration massive des hématies parasitées dans les veinules cérébrales via la protéine PfEMP1 a induit une ischémie microvasculaire. L\'anémie sévère (Hb < 5 g/dL) aggrave l\'hypoxie tissulaire par baisse du transport d\'oxygène. La consommation de glucose par les parasites associée à l\'épuisement des réserves hépatiques de glycogène a provoqué l\'hypoglycémie critique, facteur de risque majeur de mortalité.'
  },
  {
    id: 'case-02-obstetrique-eclampsie',
    titre: 'Primigeste de 19 ans à 36 SA convulsive avec HTA sévère',
    niveau: 'Interne / Médecin Junior',
    specialite: 'Gynécologie-Obstétrique & Urgences',
    patientPresentation: {
      age: 19,
      sexe: 'F',
      poidsKg: 62,
      profession: 'Étudiante',
      motif: 'Convulsions généralisées à domicile, céphalées pulsatiles intenses et troubles visuels (phosphènes / mouches volantes).',
      contexte: 'Grossesse estimée à 36 semaines d\'aménorrhée, mal suivie (une seule CPN au 1er trimestre). Arrive inconsciente en salle de travail.'
    },
    constantesInitiales: {
      temperature: 37.2,
      frequenceCardiaque: 110,
      frequenceRespiratoire: 24,
      saturationO2: 95,
      taSystolique: 185,
      taDiastolique: 120, // HTA maligne
      poidsKg: 62,
      etatConscience: 'Voix'
    },
    anamneseAttendue: [
      'Heure et nombre d\'épisodes convulsifs',
      'Signes fonctionnels d\'HTA : céphalées en casque, phosphènes, acouphènes, barre épigastrique de Chaussier',
      'Mouvements fœtaux ressentis récemment',
      'Pertes de liquide amniotique ou saignements génitaux'
    ],
    examenPhysiqueResultats: {
      'Inspection générale': 'Patiente en phase post-critique, confuse, œdèmes massifs des membres inférieurs prenant profondément le godet et infiltration du visage.',
      'Cardiovasculaire': 'TA = 185/120 mmHg aux deux bras. Bruits du cœur réguliers sans souffle.',
      'Neurologique': 'Réflexes ostéotendineux (ROT) polycinétiques et vifs avec trépidation épileptoïde du pied.',
      'Obstétrical': 'Hauteur utérine = 31 cm, utérus relâché en dehors des contractions. Bruits du cœur fœtaux (BDCF) = 145 bpm réguliers. Col fermé, postérieur.'
    },
    examensComplementairesDisponibles: [
      { nom: 'Bandelette urinaire (Albustix)', resultat: 'Protéinurie massive : 4 croix (++++), pas de leucocytes ni nitrites', coutTemps: '2 minutes', pertinent: true },
      { nom: 'NFS, Plaquettes & Schizocytes', resultat: 'Plaquettes = 72 000/mm³ (thrombopénie), Hb = 11 g/dL, présence de schizocytes (suspicion HELLP syndrome)', coutTemps: '30 minutes', pertinent: true },
      { nom: 'Bilan hépatique (ASAT / ALAT)', resultat: 'ASAT = 210 UI/L, ALAT = 185 UI/L (Cytolyse hépatique > 3x la normale confirmant HELLP syndrome)', coutTemps: '45 minutes', pertinent: true },
      { nom: 'Créatininémie et Acide urique', resultat: 'Créatinine = 125 µmol/L, Acide urique = 480 µmol/L (dysfonction rénale aiguë pré-éclamptique)', coutTemps: '45 minutes', pertinent: true }
    ],
    diagnosticCorrect: 'Éclampsie inaugurale compliquée d\'un HELLP Syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets) sur grossesse de 36 SA.',
    diagnosticsDifferentiels: [
      'Épilepsie essentielle décompensée sur grossesse',
      'Accident Vasculaire Cérébral hémorragique ou thrombophlébite cérébrale du post-partum',
      'Encéphalopathie hypertensive'
    ],
    priseEnChargeAttendue: [
      '1. Mesures immédiates : Pose de canule de Guedel, aspiration, O2 au masque 8 L/min, VVP gros calibre, sonde urinaire à demeure avec contrôle horaire de la diurèse.',
      '2. Traitement anticonvulsivant de référence : Sulfate de magnésium (MgSO4) : Dose de charge 4 g IV lente sur 20 min + 5 g IM dans chaque fesse (Protocole de Pritchard), puis entretien 1 g/h IV continu ou 5 g IM q4h.',
      '3. Traitement antihypertenseur d\'urgence : Nicardipine IV (Loxen) à la seringue électrique (débuter à 1-2 mg/h) pour viser une PAS entre 140-150 mmHg et PAD 90-100 mmHg.',
      '4. Surveillance stricte de la toxicité du MgSO4 : Réflexes rotuliens (présents ?), FR (> 12/min ?), Diurèse (> 30 mL/h ?). Avoir prêt l\'antidote : Gluconate de calcium 10% 1 g IV.',
      '5. Décision obstétricale incontournable : Extraction fœtale en urgence par césarienne après stabilisation hémodynamique et neurologique de la mère.'
    ],
    erreursCritiquesAEviter: [
      'Utiliser le diazépam à la place du sulfate de magnésium comme premier choix (le diazépam est moins efficace et déprime le fœtus).',
      'Faire chuter trop brutalement la pression artérielle (risque d\'hypoperfusion placentaire et d\'asphyxie fœtale aiguë).',
      'Retarder la césarienne : le seul traitement étiologique définitif de la pré-éclampsie/éclampsie est la délivrance du placenta.'
    ],
    explicationPhysiopathologique: 'Un défaut de remodelage des artères spiralées utérines lors de la placentation entraîne une ischémie placentaire avec libération de facteurs anti-angiogéniques (sFlt-1). Ceux-ci provoquent une dysfonction endothéliale systémique généralisée, responsable de l\'hypertension, de la fuite protéique rénale, de la nécrose hépatocytaire (HELLP) et de l\'œdème vasogénique cérébral déclenchant les convulsions éclanptiques.'
  }
];

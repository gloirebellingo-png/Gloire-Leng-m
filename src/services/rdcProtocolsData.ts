import { RdcProtocol } from '../types/medical';

export const RDC_PROTOCOLS_DATABASE: RdcProtocol[] = [
  {
    id: 'rdc-paludisme-pnlp',
    titre: 'Protocole National de Prise en Charge du Paludisme',
    organisme: 'PNLP RDC / Ministère de la Santé Publique, Hygiène et Prévention',
    categorie: 'Paludisme',
    resume: 'Prise en charge intégrée du paludisme simple et grave chez l\'enfant, la femme enceinte et l\'adulte en République Démocratique du Congo.',
    signesAlertes: [
      'Prostration ou léthargie / Coma (Blantyre < 3 ou Glasgow < 9)',
      'Convulsions répétées (plus de 2 épisodes en 24h)',
      'Détresse respiratoire (respiration acidosique, tirage sous-costal)',
      'Pâleur conjonctivale sévère ou hémoglobine < 5 g/dL',
      'Ictère franc cutanéo-muqueux',
      'Hémoglobinurie (urines couleur coca-cola)',
      'Collapsus circulatoire ou état de choc (extrémités froides, pouls filant)'
    ],
    algorithmeDecision: [
      '1. Tout syndrome fébrile aigu doit faire l\'objet d\'une confirmation parasitologique (TDR ou Goutte Épaisse).',
      '2. Si TDR positif sans aucun signe de danger : Paludisme Simple -> CTA de 1ère intention par voie orale pendant 3 jours.',
      '3. Si présence d\'au moins UN signe de danger : Paludisme Grave -> Hospitalisation urgente et traitement parentéral immédiat sans délai.'
    ],
    traitementLigne1: 'Paludisme Simple : Artéméther-Luméfantrine (Coartem) 6 prises sur 3 jours OU Artésunate-Amodiaquine (ASAQ) 1 prise/jour pendant 3 jours.',
    traitementLigne2: 'Paludisme Grave : Artésunate injectable IV lente (2 minutes) ou IM profonde. Dose pédiatrique (< 20 kg) : 3,0 mg/kg/dose. Dose grand enfant / adulte (≥ 20 kg) : 2,4 mg/kg/dose. Schéma : H0, H12, H24 puis toutes les 24h (minimum 3 injections). Relais complet CTA oral dès que le patient boit sans vomir.',
    posologiesCles: 'Artésunate : reconstitution 10 mg/mL. CTA Coartem : 1 comp (<15kg), 2 comp (15-24kg), 3 comp (25-34kg), 4 comp (≥35kg).',
    mesuresPrevention: [
      'Utilisation systématique de moustiquaires imprégnées d\'insecticide à longue durée d\'action (MILD).',
      'Traitement Préventif Intermittent de la femme enceinte (TPIg) à la Sulfadoxine-Pyriméthamine (SP) dès le 2ème trimestre (minimum 3 doses).',
      'Chimioprévention du paludisme saisonnier (CPS) chez l\'enfant de 3 à 59 mois dans les zones ciblées.'
    ],
    disponibleHorsLigne: true,
    derniereRevision: '2024'
  },
  {
    id: 'rdc-tuberculose-pnt',
    titre: 'Directives Nationales de Diagnostic et Traitement de la Tuberculose',
    organisme: 'PNT RDC / OMS',
    categorie: 'Tuberculose',
    resume: 'Stratégie nationale pour le diagnostic précoce par biologie moléculaire (GeneXpert) et traitement des tuberculoses sensibles et pharmacorésistantes.',
    signesAlertes: [
      'Toux persistante de plus de 2 semaines productive ou hémoptoïque',
      'Fièvre vespéro-nocturne et sueurs nocturnes profuses',
      'Perte de poids involontaire progressive (amaigrissement)',
      'Hémoptysie massive (> 200 mL / 24h) imposant une hémostase d\'urgence'
    ],
    algorithmeDecision: [
      '1. Tout présumé tuberculeux doit bénéficier d\'un test GeneXpert MTB/RIF sur expectorations du matin.',
      '2. Si MTB détecté et résistance à la Rifampicine NON détectée : Régime standard de 6 mois 2RHZE / 4RH.',
      '3. Si résistance à la Rifampicine détectée (TB-RR) : Référence immédiate au Centre d\'Excellence TB-MR pour régime court bédacquiline.'
    ],
    traitementLigne1: 'Phase intensive (2 mois) : 4 associations fixes (Rifampicine + Isoniazide + Pyrazinamide + Éthambutol = RHZE) quotidienne selon tranche de poids. Phase de continuation (4 mois) : 2 associations fixes (Rifampicine + Isoniazide = RH) quotidienne.',
    posologiesCles: 'RHZE comp fixes : 30-39 kg = 2 comp/j ; 40-54 kg = 3 comp/j ; 55-70 kg = 4 comp/j ; > 70 kg = 5 comp/j.',
    mesuresPrevention: [
      'Dépistage systématique des cas contacts intra-domiciliaires (particulièrement enfants < 5 ans).',
      'Traitement préventif de la tuberculose (TPT) à l\'Isoniazide (6 mois) ou 3HP (Rifapentine + Isoniazide 3 mois) pour les personnes vivant avec le VIH et les enfants contacts.'
    ],
    disponibleHorsLigne: true,
    derniereRevision: '2023'
  },
  {
    id: 'rdc-vih-pnls',
    titre: 'Protocole National de Prise en Charge de l\'Infection à VIH / SIDA',
    organisme: 'PNLS RDC / OMS',
    categorie: 'VIH',
    resume: 'Mise en œuvre des directives « Tester et Traiter » avec schéma préférentiel à base de Dolutégravir pour tous les adultes, adolescents et enfants.',
    signesAlertes: [
      'Infections opportunistes graves : méningite à cryptocoque, pneumocystose, toxoplasmose cérébrale',
      'Syndrome d\'émaciation sévère (Slim disease)',
      'Syndrome de reconstitution immunitaire (IRIS) lors de l\'initiation ARV'
    ],
    algorithmeDecision: [
      '1. Dépistage selon la stratégie sérologique nationale en 3 tests rapides conformes.',
      '2. Initiation du traitement ARV le jour même ou dans les 7 jours suivant la confirmation diagnostique (Tester et Traiter).',
      '3. Bilan initial : Charge virale de base ou CD4, dépistage Tuberculose systématique (GeneXpert / LF-LAM).'
    ],
    traitementLigne1: 'Schéma de première intention universel : TLD (Ténofovir Disoproxil Fumarate 300 mg + Lamivudine 300 mg + Dolutégravir 50 mg) en 1 comprimé unique par jour, le soir.',
    posologiesCles: 'TLD : 1 comprimé/jour. Cotrimoxazole (960 mg/j) systématique en prophylaxie si CD4 < 350 ou stade 3/4 OMS.',
    mesuresPrevention: [
      'PTME B+ : Traitement ARV à vie pour toute femme enceinte ou allaitante séropositive dès le diagnostic.',
      'Prophylaxie pré-exposition (PrEP) pour les populations à haut risque.',
      'Prophylaxie post-exposition (PEP) dans les 72 heures suivant un accident d\'exposition au sang ou une agression sexuelle.'
    ],
    disponibleHorsLigne: true,
    derniereRevision: '2024'
  },
  {
    id: 'rdc-cholera-minsante',
    titre: 'Protocole National de Riposte et Prise en Charge du Choléra',
    organisme: 'Direction Générale de Lutte contre les Épidémies RDC / OMS',
    categorie: 'Choléra',
    resume: 'Stratégie d\'urgence dans les Centres de Traitement du Choléra (CTC) : réhydratation hydro-électrolytique agressive immédiate selon les Plans A, B et C de l\'OMS.',
    signesAlertes: [
      'Diarrhée aqueuse afécale foudroyante en « eau de riz » (plus de 10 selles liquides par jour)',
      'Vomissements incoercibles associés',
      'Déshydratation sévère : yeux enfoncés, pli cutané s\'effaçant très lentement (> 2s), soif insatiable ou inconscience',
      'Absence de pouls radial, hypotension sévère, anurie'
    ],
    algorithmeDecision: [
      '1. Évaluer l\'état d\'hydratation selon l\'échelle OMS (Pas de déshydratation, Déshydratation modérée, Déshydratation sévère).',
      '2. Si déshydratation sévère : Plan C -> Poser d\'emblée 2 VVP de gros calibre, Ringer Lactate 100 mL/kg.',
      '3. Dès que le patient peut boire : relayer avec la Solution de Réhydratation Orale (SRO) à volonté.'
    ],
    traitementLigne1: 'Plan C Réhydratation IV : Ringer Lactate 100 mL/kg. Adulte : 30 mL/kg en 30 min, puis 70 mL/kg en 2h30. Enfant < 1 an : 30 mL/kg en 1h, puis 70 mL/kg en 5h.',
    traitementLigne2: 'Antibiothérapie curative ciblée (réduit la durée et l\'excrétion de Vibrio cholerae) : Doxycycline 300 mg PO en dose unique chez l\'adulte OU Azithromycine 20 mg/kg dose unique chez l\'enfant et la femme enceinte. Supplémentation en Zinc (20 mg/j pendant 10 jours) chez tous les enfants < 5 ans.',
    posologiesCles: 'Ringer Lactate : 100 mL/kg. Doxycycline : 300 mg stat.',
    mesuresPrevention: [
      'Chloration stricte de l\'eau de boisson (0,5 mg/L de chlore résiduel libre).',
      'Lavage régulier des mains à l\'eau et au savon ou à la solution hydroalcoolique.',
      'Enterrement sécurisé et désinfection des linges et latrines au chlore 2%.'
    ],
    disponibleHorsLigne: true,
    derniereRevision: '2024'
  },
  {
    id: 'rdc-drepanocytose-cvo',
    titre: 'Protocole Hospitalier de Prise en Charge de la Drépanocytose (Hb SS)',
    organisme: 'Centre National de Référence de la Drépanocytose / Société Congolaise d\'Hématologie',
    categorie: 'Drépanocytose',
    resume: 'Gestion des crises vaso-occlusives (CVO), du syndrome thoracique aigu, de la séquestration splénique et suivi au long cours.',
    signesAlertes: [
      'Syndrome Thoracique Aigu (STA) : douleur thoracique, détresse respiratoire, hypoxie, nouvel infiltrat radiologique (Urgence vitale majeure !)',
      'Accident Vasculaire Cérébral (AVC) / déficit moteur soudain',
      'Séquestration splénique aiguë : splénomégalie brutale douloureuse avec pâleur extrême et collapsus',
      'Priapisme aigu prolongé > 3 heures (risque de nécrose érectile définitive)'
    ],
    algorithmeDecision: [
      '1. Crise Vaso-Occlusive douloureuse : Triade thérapeutique immédiate = Hydratation + Analgésie adaptée + Recherche du facteur déclenchant (paludisme, infection, déshydratation, froid).',
      '2. Mesurer la saturation en oxygène (SpO2) et la température.',
      '3. Ne pas retarder la morphine si douleur sévère (EVA ≥ 7/10).'
    ],
    traitementLigne1: 'Hyperhydratation : 3 L/m²/24h de soluté glucosé G5% avec 3 g NaCl/L ou soluté hypotonique demi-salé. Analgésie par paliers : Palier 1 Paracétamol 15 mg/kg q6h + AINS (Ibuprofène 10 mg/kg si fonction rénale saine) ; Palier 3 Morphine 0,1 mg/kg SC ou IV titrée si EVA ≥ 7. Oxygénothérapie uniquement si SpO2 < 95%.',
    traitementLigne2: 'Traitement de fond de référence : Hydroxyurée (Hydrea) 15 à 20 mg/kg/j (réduit de 50% la fréquence des crises et du STA). Supplémentation quotidienne en Acide Folique (5 mg/j) pour soutenir l\'érythropoïèse.',
    posologiesCles: 'Hydratation : 3 L/m²/j. Acide folique : 5 mg/j. Hydroxyurée : 15-20 mg/kg/j.',
    mesuresPrevention: [
      'Antibioprophylaxie par Pénicilline V orale quotidienne (100 000 UI/kg/j) de l\'âge de 2 mois à 5 ans pour prévenir les infections fulgurantes à pneumocoque.',
      'Vaccination anti-pneumococcique et anti-méningococcique conjuguée à jour.',
      'Éviter le froid, les déshydratations, l\'altitude et les efforts physiques excessifs non compensés.'
    ],
    disponibleHorsLigne: true,
    derniereRevision: '2023'
  },
  {
    id: 'rdc-malnutrition-pronanut',
    titre: 'Protocole National de Prise en Charge de la Malnutrition Aiguë Sévère (MAS)',
    organisme: 'PRONANUT RDC / UNICEF / OMS',
    categorie: 'Malnutrition',
    resume: 'Prise en charge intégrée des enfants malnutris sévères en Unité Nutritionnelle Thérapeutique Intensive (UNTI) ou Ambulatoire (UNTA).',
    signesAlertes: [
      'Périmètre brachial (PB) < 115 mm chez l\'enfant de 6 à 59 mois',
      'Présence d\'œdèmes bilatéraux prenant le godet (Kwashiorkor)',
      'Rapport Poids/Taille Z-score < -3',
      'Test d\'appétit négatif (refus de consommer l\'ATPE)',
      'Complications médicales associées : hypothermie (< 35,5°C), hypoglycémie, infection respiratoire sévère'
    ],
    algorithmeDecision: [
      '1. Si Z-score < -3 OU PB < 115 mm SANS complications ET test d\'appétit POSITIF -> Prise en charge ambulatoire (UNTA) avec ATPE (Plumpy\'Nut).',
      '2. Si présence de complications médicales OU œdèmes bilatéraux sévères (+++) OU test d\'appétit NÉGATIF -> Hospitalisation immédiate en UNTI.',
      '3. Phase 1 Stabilisation (UNTI) : Lait thérapeutique F-75 (130 mL/kg/jour en 8 repas de 3h).'
    ],
    traitementLigne1: 'Phase 1 : Lait F-75 (100 kcal / 1000 mL) pour rétablir les fonctions cellulaires sans surcharger le foie et les reins. Pas de soluté de perfusion rapide (risque d\'insuffisance cardiaque fatale !). En cas de déshydratation : réhydratation exclusive par ReSoMal par voie orale ou sonde nasogastrique.',
    traitementLigne2: 'Phase de transition et réhabilitation : Dès que l\'appétit revient et que les œdèmes diminuent, passage progressif au Lait F-100 puis aux Aliments Thérapeutiques Prêts à l\'Emploi (ATPE). Antibiothérapie systématique de couverture : Amoxicilline PO 50-80 mg/kg/j pendant 7 jours.',
    posologiesCles: 'F-75 : 130 mL/kg/j. ReSoMal : 5 mL/kg toutes les 30 min pendant 2h.',
    mesuresPrevention: [
      'Promotion de l\'allaitement maternel exclusif jusqu\'à 6 mois.',
      'Alimentation de complément diversifiée et riche en nutriments locaux (bouillies enrichies au soja, arachides, moringa, chenilles).',
      'Supplémentation semestrielle en Vitamine A et déparasitage systématique au Mébendazole.'
    ],
    disponibleHorsLigne: true,
    derniereRevision: '2024'
  }
];

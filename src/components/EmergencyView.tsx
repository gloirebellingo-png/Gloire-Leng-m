import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  Zap,
  Activity,
  HeartPulse,
  Droplets,
  ShieldAlert,
  Wind,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

interface EmergencyProtocol {
  id: string;
  nom: string;
  categorie: string;
  signesAlerte: string[];
  prioritesABCDE: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };
  gestesStabilisation: string[];
  traitementsPremiereIntention: string[];
  indicationsTransfert: string[];
  piegesAEviter: string[];
}

const EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
  {
    id: 'detresse-respiratoire',
    nom: 'Détresse Respiratoire Aiguë',
    categorie: 'Respiration & Ventilation',
    signesAlerte: [
      'SpO2 < 90% en air ambiant (ou < 92% chez la femme enceinte ou l\'enfant)',
      'Fréquence respiratoire > 35/min ou bradypnée < 8/min (signe d\'épuisement pré-arrêt)',
      'Tirage sous-costal majeur, battement des ailes du nez, balancement thoraco-abdominal',
      'Cyanose des extrémités, polypnée superficielle, parole impossible'
    ],
    prioritesABCDE: {
      a: 'Libérer les voies aériennes supérieures (aspiration, canule de Guedel si comateux).',
      b: 'Oxygénothérapie immédiate à haut débit (Masque haute concentration 12-15 L/min). Assister au ballon Ambu si bradypnée.',
      c: 'Voie veineuse de bon calibre, monitorer TA et FC.',
      d: 'Évaluer la vigilance (agitation = hypoxie cérébrale ; somnolence = hypercapnie).',
      e: 'Rechercher un bronchospasme, asymétrie auscultatoire (pneumothorax).'
    },
    gestesStabilisation: [
      'Position demi-assise stricte à 45° (ou assise pieds pendants si suspicion d\'OAP).',
      'Si crise d\'asthme / BPCO : Aérosol Salbutamol 5 mg + Ipratropium 0,5 mg sous 6-8 L/min d\'O2.',
      'Si OAP cardiogénique : Furosémide 40-80 mg IVD bolus.'
    ],
    traitementsPremiereIntention: [
      'Oxygène à fort débit (100% initialement)',
      'Bêta-2 mimétiques nébulisés ou diurétiques selon l\'étiologie',
      'Corticothérapie systémique si crise d\'asthme sévère'
    ],
    indicationsTransfert: [
      'Absence d\'amélioration dans les 15 minutes',
      'SpO2 restant < 90% sous masque à haute concentration',
      'Signes d\'épuisement respiratoire (bradycardie, troubles de conscience)'
    ],
    piegesAEviter: [
      'Retarder l\'oxygénothérapie pour attendre des examens complémentaires ou une radio.',
      'Coucher à plat un patient en détresse respiratoire.'
    ]
  },
  {
    id: 'etat-de-choc',
    nom: 'État de Choc Circulatoire (Hypovolémique / Septique / Cardiogénique)',
    categorie: 'Hémodynamique',
    signesAlerte: [
      'PAS < 90 mmHg ou baisse de plus de 40 mmHg de la pression habituelle',
      'Temps de recoloration cutanée (TRC) > 3 secondes, marbrures péri-rotuliennes',
      'Oligurie (< 0,5 mL/kg/h) avec urines très concentrées',
      'Tachycardie filante > 120 bpm, extrémités froides et moites'
    ],
    prioritesABCDE: {
      a: 'Assurer la perméabilité des voies aériennes.',
      b: 'Oxygénothérapie au masque pour compenser la dette tissulaire en oxygène.',
      c: '2 VVP gros calibre (14G ou 16G). Remplissage vasculaire cristalloïde immédiat (Ringer Lactate ou NaCl 0,9% 20 à 30 mL/kg en 20 min) sauf si OAP.',
      d: 'Glycémie capillaire immédiate, pupilles, vigilance.',
      e: 'Rechercher la cause : foyer septique, hémorragie occulte, réaction allergique.'
    },
    gestesStabilisation: [
      'Surélévation des membres inférieurs (position de Trendelenburg modifiée si choc hypovolémique).',
      'Remplissage rapide sous surveillance auscultatoire pulmonaire.',
      'Si absence de remontée tensionnelle après 30 mL/kg : Noradrénaline IV à la seringue électrique.'
    ],
    traitementsPremiereIntention: [
      'Ringer Lactate 1 000 mL en bolus chez l\'adulte (20 mL/kg chez l\'enfant)',
      'Noradrénaline si choc septique vasoplégique',
      'Antibiothérapie probabiliste à large spectre dans l\'heure'
    ],
    indicationsTransfert: [
      'Choc réfractaire au remplissage volémique',
      'Nécessité de catécholamines à la seringue électrique'
    ],
    piegesAEviter: [
      'Se fier à une tension artérielle normale pour exclure le choc : le choc est compensé par la tachycardie au début !',
      'Remplir massivement un choc cardiogénique avec crépitants pulmonaires.'
    ]
  },
  {
    id: 'convulsions-etat-mal',
    nom: 'Convulsions Aiguës & État de Mal Épileptique',
    categorie: 'Neurologie d\'Urgence',
    signesAlerte: [
      'Crise convulsive durant plus de 5 minutes consécutives',
      'Répétition de crises convulsives rapprochées sans reprise de conscience intercritique',
      'Morsure de langue, hypersécrétion bronchique, cyanose associée',
      'Fièvre majeure (> 39.5°C) chez l\'enfant ou le nourrisson'
    ],
    prioritesABCDE: {
      a: 'Protection de la tête, Position Latérale de Sécurité (PLS) dès l\'arrêt des secousses, aspiration.',
      b: 'Oxygène au masque à haute concentration dès que possible.',
      c: 'Abord veineux périphérique (ne pas s\'acharner pendant les secousses : préférer voie rectale ou IM).',
      d: 'GLYCÉMIE CAPILLAIRE IMMÉDIATE (l\'hypoglycémie convulsive doit être corrigée dans la minute).',
      e: 'Prendre la température, rechercher un traumatisme crânien ou une piqûre.'
    },
    gestesStabilisation: [
      'Ne jamais mettre d\'objet dur entre les dents (risque de fracture dentaire et inhalation).',
      'Adulte : Diazépam 10 mg IV lente (ou Clonazépam 1 mg IV).',
      'Enfant : Diazépam intra-rectal 0,5 mg/kg (canule ou seringue sans aiguille).',
      'Si hypoglycémie (< 54 mg/dL) : G10% 5 mL/kg IV direct (enfant) ou G30% 1 ampoule (adulte).'
    ],
    traitementsPremiereIntention: [
      'Benzodiazépine à action rapide (Diazépam ou Clonazépam)',
      'Deuxième dose de benzodiazépine à 5 minutes si échec',
      'Antiépileptique d\'action prolongée (Phénytoïne, Lévétiracétam) à H10-H15 si persistance'
    ],
    indicationsTransfert: [
      'Crise > 15 minutes (État de mal convulsif constitué)',
      'Troubles de conscience persistants après arrêt des secousses'
    ],
    piegesAEviter: [
      'Oublier la glycémie : injecter une benzodiazépine sur une hypoglycémie ne traite pas la cause !'
    ]
  },
  {
    id: 'coma-alteration-conscience',
    nom: 'Coma & Troubles Aigus de Conscience',
    categorie: 'Neurologie & Métabolisme',
    signesAlerte: [
      'Score de Glasgow < 9 chez l\'adulte ou Blantyre < 3 chez l\'enfant',
      'Perte des réflexes de déglutition et d\'encombrement des voies aériennes',
      'Anisocorie (asymétrie pupillaire) ou mydriase bilatérale aréactive',
      'Respiration anormale (Cheyne-Stokes ou polypnée acidosique de Kussmaul)'
    ],
    prioritesABCDE: {
      a: 'Mise en PLS immédiate pour éviter l\'inhalation de vomissures.',
      b: 'Assistance ventilatoire si bradypnée ou encombrement.',
      c: 'Surveillance tensionnelle et volémique.',
      d: 'Glycémie capillaire (impératif), score de Glasgow, réactivité des pupilles.',
      e: 'Recherche de traces d\'injection, odeur acétonique de l\'haleine, raideur de nuque.'
    },
    gestesStabilisation: [
      'Éliminer en premier les 3 causes immédiatement curables : Hypoglycémie (G10% ou G30%), Intoxication aux opioïdes (Naloxone), Neuropaludisme (Artésunate IV).',
      'Si score Glasgow ≤ 8 : Indication formelle d\'intubation orotrachéale pour protéger les voies aériennes.'
    ],
    traitementsPremiereIntention: [
      'Correction d\'une éventuelle hypoglycémie',
      'Artésunate injectable IV si goutte épaisse ou TDR positif en zone endémique',
      'Ceftriaxone IV si suspicion de méningite purulente'
    ],
    indicationsTransfert: [
      'Tout score Glasgow ≤ 8',
      'Suspicion d\'engagement cérébral ou d\'hémorragie méningée'
    ],
    piegesAEviter: [
      'Laisser un patient dans le coma sur le dos (risque d\'étouffement par la langue ou inhalation fatale de vomissures).'
    ]
  },
  {
    id: 'hemorragies-aigues',
    nom: 'Hémorragies Aiguës & Choc Hémorragique',
    categorie: 'Hémostase & Chirurgie',
    signesAlerte: [
      'Pertes sanguines visibles massives (hématémèse, méléna, HPP, plaie artérielle)',
      'Pâleur cireuse extrême des muqueuses',
      'Chute tensionnelle brutale avec tachycardie et sueurs profuses',
      'Soif d\'air, vertiges au moindre redressement'
    ],
    prioritesABCDE: {
      a: 'Oxygène au masque à fort débit pour saturer au maximum l\'hémoglobine restante.',
      b: 'Surveiller la fréquence respiratoire.',
      c: 'Hémostase mécanique immédiate (compression locale directe, pansement compressif, garrot si plaie de membre hémorragique). 2 VVP 14-16G.',
      d: 'Surveillance de l\'état neurologique.',
      e: 'Prévenir l\'hypothermie (couvrir le patient, l\'hypothermie aggrave la coagulopathie).'
    },
    gestesStabilisation: [
      'Compression directe ou garrot artériel tactique (noter l\'heure).',
      'Remplissage initial modéré (hypotension permissive : viser PAS 80-90 mmHg pour ne pas désenclaver les caillots).',
      'Acide tranexamique 1 g IV lente dans les 3 heures suivant le saignement.'
    ],
    traitementsPremiereIntention: [
      'Acide tranexamique 1g IV',
      'Transfusion de culots globulaires O négatif (ou isogroupe) en urgence vitale',
      'Ringer Lactate réchauffé'
    ],
    indicationsTransfert: [
      'Hémorragie interne non contrôlable médicalement -> Bloc opératoire d\'urgence.'
    ],
    piegesAEviter: [
      'Desserrer un garrot sans contrôle chirurgical au bloc opératoire.'
    ]
  },
  {
    id: 'deshydratation-severe-cholera',
    nom: 'Déshydratation Sévère & Choléra (Plan C OMS)',
    categorie: 'Gastro-entérologie & Épidémies',
    signesAlerte: [
      'Yeux profondément enfoncés dans les orbites, absence de larmes',
      'Pli cutané s\'effaçant très lentement (> 2 secondes)',
      'Incapacité totale de boire ou léthargie',
      'Pouls radial impalpable ou très filant, anurie totale'
    ],
    prioritesABCDE: {
      a: 'Libérer les voies aériennes si le patient est aphone ou léthargique.',
      b: 'Surveiller la polypnée de compensation acidosique.',
      c: 'Plan C OMS : 2 voies veineuses périphériques de gros calibre sans perdre une minute.',
      d: 'Vérifier la glycémie.',
      e: 'Préserver la chaleur corporelle.'
    },
    gestesStabilisation: [
      'Perfusion IV de Ringer Lactate à débit maximal (100 mL/kg au total) :',
      '- Adulte : 30 mL/kg en 30 min puis 70 mL/kg en 2h30.',
      '- Enfant < 1 an : 30 mL/kg en 1h puis 70 mL/kg en 5h.',
      'Dès que le patient peut déglutir : donner la SRO par voie orale en continu.'
    ],
    traitementsPremiereIntention: [
      'Ringer Lactate en perfusion intraveineuse rapide',
      'Sels de Réhydratation Orale (SRO) dès amélioration',
      'Antibiothérapie curative (Doxycycline 300 mg dose unique adulte ou Azithromycine enfant)'
    ],
    indicationsTransfert: [
      'Absence de reprise de la diurèse après 3 heures de perfusion'
    ],
    piegesAEviter: [
      'Utiliser du sérum glucosé à 5% pour réhydrater un choléra : cela provoque une hyponatrémie foudroyante et des convulsions par œdème cérébral !'
    ]
  },
  {
    id: 'sepsis-choc-septique',
    nom: 'Sepsis Grave & Choc Septique',
    categorie: 'Infectiologie & Réanimation',
    signesAlerte: [
      'Critères qSOFA ≥ 2 (FR ≥ 22, TAs ≤ 100, conscience altérée)',
      'Température > 38.5°C ou au contraire hypothermie < 36.0°C',
      'Purpura fulminans (lésions ecchymotiques nécrotiques extensives)',
      'Oligurie avec élévation des lactates sanguins'
    ],
    prioritesABCDE: {
      a: 'Voies aériennes et O2 pour SpO2 > 94%.',
      b: 'Évaluer la détresse respiratoire.',
      c: 'Remplissage cristalloïde rapide 30 mL/kg en 3 heures. Hémocultures avant antibiotiques si faisable sans retard.',
      d: 'Surveillance neurologique rapprochée.',
      e: 'Rechercher la porte d\'entrée cutanée, pulmonaire, urinaire ou abdominale.'
    },
    gestesStabilisation: [
      'Antibiothérapie IV précoce dans la PREMIÈRE HEURE (Hour-1 Bundle de la Surviving Sepsis Campaign).',
      'Si Purpura fulminans : Injection IM ou IV immédiate de Ceftriaxone ou Pénicilline G avant tout transfert.'
    ],
    traitementsPremiereIntention: [
      'Ringer Lactate ou NaCl 0,9% 30 mL/kg',
      'Ceftriaxone 2 g IV (ou Amoxicilline/Gentamicine)',
      'Vasopresseurs si PAM < 65 mmHg persistante'
    ],
    indicationsTransfert: [
      'Nécessité de drogues vasoactives ou défaillance multiviscérale'
    ],
    piegesAEviter: [
      'Retarder l\'antibiothérapie pour attendre des résultats de laboratoire.'
    ]
  },
  {
    id: 'urgences-obstetricales',
    nom: 'Urgences Obstétricales Majeures (Éclampsie, HPP, HRP)',
    categorie: 'Gynécologie-Obstétrique (SONU)',
    signesAlerte: [
      'Convulsions sur grossesse (Éclampsie)',
      'Hémorragie du post-partum active avec utérus atone',
      'Hématome Rétro-Placentaire (HRP) : utérus dur "de bois", métrorragies noirâtres, mort fœtale in utero',
      'Rupture utérine : disparition brutale des contractions avec douleur syncopale'
    ],
    prioritesABCDE: {
      a: 'Position latérale de sécurité gauche (dégage la veine cave inférieure).',
      b: 'Oxygène au masque.',
      c: 'Voie veineuse 16G, sonde urinaire à demeure avec débitmètre horaire.',
      d: 'Réflexes ostéotendineux rotuliens.',
      e: 'Hauteur utérine, Bruits du Cœur Fœtaux.'
    },
    gestesStabilisation: [
      'Si éclampsie : Sulfate de magnésium (MgSO4) 4g IV lente + 5g IM dans chaque fesse.',
      'Si HPP : Massage utérin + Oxytocine 10 UI IM ou IV directe lente + Acide tranexamique 1g IV.',
      'Si HRP ou rupture : Césarienne d\'extrême urgence.'
    ],
    traitementsPremiereIntention: [
      'Sulfate de Magnésium (MgSO4) pour éclampsie',
      'Oxytocine (Syntocinon) pour hémorragie',
      'Nicardipine IV si PAS ≥ 160 mmHg'
    ],
    indicationsTransfert: [
      'Maternité chirurgicale SONU complète'
    ],
    piegesAEviter: [
      'Donner des dérivés de l\'ergot de seigle (Méthergin) chez une femme avec pré-éclampsie ou HTA !'
    ]
  },
  {
    id: 'urgences-pediatriques',
    nom: 'Urgences Pédiatriques & Signes de Danger PCIME',
    categorie: 'Pédiatrie d\'Urgence',
    signesAlerte: [
      'Incapacité de boire ou téter le sein',
      'Vomissements de tout aliment ingéré',
      'Convulsions au cours de l\'épisode fébrile',
      'Léthargie profonde ou inconscience'
    ],
    prioritesABCDE: {
      a: 'Dégager les narines et la bouche (mouchage doux, aspiration).',
      b: 'Oxygène au masque ou lunettes pédiatriques si tirage ou SpO2 < 92%.',
      c: 'Accès vasculaire (ou voie intra-osseuse tibiale si VVP impossible en 3 minutes).',
      d: 'Glycémie capillaire immédiate ! Score de Blantyre.',
      e: 'Rechercher des œdèmes nutritionnels des pieds (Kwashiorkor).'
    },
    gestesStabilisation: [
      'Traitement pré-transfert : 1ère dose d\'Artésunate IV/IM (3,0 mg/kg si < 20 kg).',
      '1ère dose d\'antibiotique parentéral (Ampicilline + Gentamicine ou Ceftriaxone 50 mg/kg).',
      'Corriger l\'hypoglycémie : G10% 5 mL/kg IV direct lent.'
    ],
    traitementsPremiereIntention: [
      'Artésunate 3,0 mg/kg',
      'Sérum glucosé 10% 5 mL/kg si glycémie < 54 mg/dL',
      'Diazépam rectal 0,5 mg/kg si convulsions actives'
    ],
    indicationsTransfert: [
      'Tout enfant présentant au moins un signe général de danger PCIME'
    ],
    piegesAEviter: [
      'Tenter de donner des comprimés ou liquides oraux à un enfant somnolent ou qui convulse.'
    ]
  },
  {
    id: 'douleur-thoracique-aigue',
    nom: 'Douleurs Thoraciques Aiguës (SCA / Embolie Pulmonaire / Dissection)',
    categorie: 'Cardiologie & Vasculaire',
    signesAlerte: [
      'Douleur rétrosternale constrictive "en étau" irradiant vers la mâchoire et le bras gauche',
      'Douleur pleurétique brutale avec polypnée et hémoptysie (Embolie pulmonaire)',
      'Douleur dorsale déchirante irradiant vers les lombes avec asymétrie tensionnelle (Dissection aortique)',
      'Hypotension artérielle, sueurs profuses, état de choc'
    ],
    prioritesABCDE: {
      a: 'Liberté des VAS.',
      b: 'Oxygène UNIQUEMENT si SpO2 < 90%.',
      c: 'ECG 12 dérivations dans les 10 minutes ! TA aux deux bras. VVP.',
      d: 'Évaluer la douleur (EVA 0 à 10).',
      e: 'Palpation des mollets (signes de TVP).'
    },
    gestesStabilisation: [
      'Si sus-décalage de ST à l\'ECG (STEMI) : Aspirine 300 mg PO à croquer + Clopidogrel 300 mg + Énoxaparine SC.',
      'Si forte suspicion d\'embolie pulmonaire avec choc : Héparine non fractionnée IV bolus (80 UI/kg).',
      'Soulager la douleur : Morphine IV titrée si douleur insupportable.'
    ],
    traitementsPremiereIntention: [
      'Aspirine 300 mg per os',
      'Héparine de bas poids moléculaire',
      'Dérivé nitré sublingual (sauf si PAS < 90 mmHg ou suspicion d\'infarctus du ventricule droit)'
    ],
    indicationsTransfert: [
      'Syndrome coronarien aigu avec sus-ST (indication de reperfusion par angioplastie ou thrombolyse)'
    ],
    piegesAEviter: [
      'Donner des dérivés nitrés si le patient a pris un inhibiteur de la phosphodiestérase (Sildénafil) dans les 24h (risque de collapsus mortel).'
    ]
  }
];

export const EmergencyView: React.FC = () => {
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('detresse-respiratoire');

  const selectedProtocol = EMERGENCY_PROTOCOLS.find(p => p.id === selectedProtocolId) || EMERGENCY_PROTOCOLS[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-rose-950/40 border border-rose-800/60 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500" />
            Module des Urgences Vitales Immédiates
          </span>
          <h1 className="text-xl font-extrabold text-white mt-1">
            Algorithmes de Sauvetage ABCDE & Fiches Réflexes
          </h1>
          <p className="text-xs text-rose-200/80 mt-1">
            Priorité à l'action clinique déterministe. Ne jamais retarder un geste vital pour attendre une réponse numérique.
          </p>
        </div>

        <div className="bg-rose-900/60 border border-rose-700/80 px-3.5 py-2 rounded-xl text-xs font-mono text-white text-center shrink-0">
          <span className="text-[10px] text-rose-300 block uppercase">Temps de Réaction</span>
          <strong>0 à 5 Minutes</strong>
        </div>
      </div>

      {/* Selector Grid of 10 Emergencies */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
        {EMERGENCY_PROTOCOLS.map((proto) => {
          const isSelected = proto.id === selectedProtocolId;
          return (
            <button
              key={proto.id}
              onClick={() => setSelectedProtocolId(proto.id)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-600 text-white border-rose-600 font-semibold shadow-md shadow-rose-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-rose-400'
              }`}
            >
              <span>{proto.nom}</span>
              <span className={`text-[10px] mt-2 block ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                {proto.categorie}
              </span>
            </button>
          );
        })}
      </div>

      {/* Protocol Detailed View */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>{selectedProtocol.nom}</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Catégorie : {selectedProtocol.categorie}
            </span>
          </div>

          <span className="text-xs bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full font-semibold">
            Urgence Vitale Majeure
          </span>
        </div>

        {/* 1. Signes d'alerte */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Signes d'Alerte et Critères de Gravité Immédiats</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {selectedProtocol.signesAlerte.map((s, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200 flex items-start gap-2"
              >
                <span className="text-rose-500 font-bold">•</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Priorités Séquentielles ABCDE */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-sky-500" />
            <span>Priorités d'Évaluation et d'Action ABCDE</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-sky-600 dark:text-sky-400 block mb-1">
                A - Voies Aériennes
              </span>
              <p className="text-slate-600 dark:text-slate-300">{selectedProtocol.prioritesABCDE.a}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-sky-600 dark:text-sky-400 block mb-1">
                B - Respiration
              </span>
              <p className="text-slate-600 dark:text-slate-300">{selectedProtocol.prioritesABCDE.b}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-sky-600 dark:text-sky-400 block mb-1">
                C - Circulation
              </span>
              <p className="text-slate-600 dark:text-slate-300">{selectedProtocol.prioritesABCDE.c}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-sky-600 dark:text-sky-400 block mb-1">
                D - Neurologie & Glycémie
              </span>
              <p className="text-slate-600 dark:text-slate-300">{selectedProtocol.prioritesABCDE.d}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-sky-600 dark:text-sky-400 block mb-1">
                E - Environnement / T°
              </span>
              <p className="text-slate-600 dark:text-slate-300">{selectedProtocol.prioritesABCDE.e}</p>
            </div>
          </div>
        </div>

        {/* 3. Gestes de stabilisation & Traitements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Gestes de Stabilisation Immédiate</span>
            </span>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
              {selectedProtocol.gestesStabilisation.map((g, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-500" />
              <span>Traitements Médicamenteux d'Urgence</span>
            </span>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
              {selectedProtocol.traitementsPremiereIntention.map((t, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-sky-500 font-bold">→</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Indications de transfert & Pièges */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-2">
          <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Indications de Transfert Médicalisé et Pièges Critiques à Éviter</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-amber-900 dark:text-amber-200">
            <div>
              <strong className="block mb-1">Critères de transfert :</strong>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {selectedProtocol.indicationsTransfert.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="block mb-1">Erreurs / Pièges majeurs :</strong>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {selectedProtocol.piegesAEviter.map((pa, idx) => (
                  <li key={idx}>{pa}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

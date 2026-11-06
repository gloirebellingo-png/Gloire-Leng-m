import { MedicalTerm } from '../types/medical';

export const MEDICAL_DICTIONARY: MedicalTerm[] = [
  {
    id: 'term-anaphylaxie',
    terme: 'Anaphylaxie',
    specialite: 'Immuno-allergologie / Urgences',
    definition: 'Réaction d\'hypersensibilité immédiate systémique, sévère et potentiellement mortelle, médiée par les IgE, survenant brutalement après exposition à un allergène.',
    physiopathologie: 'Dégranulation massive et brutale des mastocytes tissulaires et des basophiles circulants libérant histamine, leucotriènes et prostaglandines. Entraîne une vasodilatation artériolaire généralisée, une extravasation plasmatique et un bronchospasme sévère.',
    traductionAnglaise: 'Anaphylaxis',
    synonymes: ['Choc anaphylactique', 'Hypersensibilité immédiate type I'],
    exemplesCliniques: 'Urticaire généralisé, œdème de Quincke, stridor laryngé et hypotension artérielle foudroyante après injection de pénicilline.'
  },
  {
    id: 'term-blantyre',
    terme: 'Score de Blantyre',
    specialite: 'Pédiatrie / Neurologie',
    definition: 'Échelle d\'évaluation de la profondeur du coma chez le jeune enfant fébrile ou atteint de neuropaludisme (adaptée du score de Glasgow pour les enfants de moins de 5 ans).',
    physiopathologie: 'Évalue la réponse motrice (0 à 2), la réponse verbale/cri (0 à 2) et la poursuite du regard (0 à 1). Score total de 0 à 5. Un score ≤ 2 définit le neuropaludisme comateux.',
    traductionAnglaise: 'Blantyre Coma Scale',
    synonymes: ['Échelle de Blantyre'],
    exemplesCliniques: 'Enfant ne suivant pas du regard (0), gémissant de manière inappropriée (1), avec retrait à la douleur (1) = Score 2/5 (Coma palustre critique).'
  },
  {
    id: 'term-drepanocytose',
    terme: 'Drépanocytose (Anémie falciforme)',
    specialite: 'Hématologie / Génétique',
    definition: 'Hémoglobinopathie héréditaire autosomique récessive caractérisée par la synthèse d\'une hémoglobine anormale (HbS) due à la substitution de l\'acide glutamique par la valine en position 6 de la chaîne bêta-globine.',
    physiopathologie: 'En situation d\'hypoxie, d\'acidose ou de déshydratation, l\'HbS désoxygénée polymérise en fibres insolubles rigides, déformant l\'hématie en faucille ("falciformation"). Ces hématies rigides et adhérentes obstruent la microcirculation post-capillaire, provoquant ischémie tissulaire, micro-infarctus osseux et hémolyse chronique.',
    traductionAnglaise: 'Sickle Cell Disease / Sickle Cell Anemia',
    synonymes: ['Hémoglobinose S', 'Drépanocytose homozygote SS'],
    exemplesCliniques: 'Crise vaso-occlusive fémoro-tibiale hyperalgique déclenchée par le froid ou le paludisme, splénomégalie chez le nourrisson puis asplénie fonctionnelle.'
  },
  {
    id: 'term-hellp',
    terme: 'HELLP Syndrome',
    specialite: 'Gynécologie-Obstétrique / Réanimation',
    definition: 'Complication microangiopathique sévère de la pré-éclampsie associant Hémolyse microangiopathique (H), Élévation des enzymes hépatiques (EL) et Thrombopénie (LP).',
    physiopathologie: 'Lésion endothéliale diffuse d\'origine placentaire avec activation et consommation des plaquettes dans des dépôts microvasculaires de fibrine hépatique, entraînant nécrose hépatocytaire centro-lobulaire et fragmentation mécanique des hématies (schizocytes).',
    traductionAnglaise: 'HELLP Syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets)',
    synonymes: ['Syndrome HELLP'],
    exemplesCliniques: 'Douleur aiguë en barre épigastrique (signe de Chaussier), cytolyse avec ASAT > 200 UI/L, plaquettes < 100 000/mm³ chez une parturiente hypertendue.'
  },
  {
    id: 'term-kussmaul',
    terme: 'Respiration de Kussmaul',
    specialite: 'Pneumologie / Réanimation / Endocrinologie',
    definition: 'Rythme respiratoire ample, profond et régulier en 4 temps (inspiration profonde, pause, expiration brève, pause).',
    physiopathologie: 'Mécanisme ventilatoire de compensation réflexe d\'une acidose métabolique sévère (pH < 7.20). Les chémorécepteurs carotidiens et bulbaires stimulent l\'hyperventilation pour éliminer le dioxyde de carbone (PaCO2) et tamponner la chute du pH.',
    traductionAnglaise: 'Kussmaul breathing',
    synonymes: ['Respiration acidosique'],
    exemplesCliniques: 'Patient comateux avec acidocétose diabétique inaugurale ou acidose lactique sévère sur état de choc.'
  },
  {
    id: 'term-cytoadherence',
    terme: 'Cytoadhérence & Séquestration palustre',
    specialite: 'Parasitologie / Infectiologie',
    definition: 'Propriété biologique exclusive de Plasmodium falciparum consistant en l\'adhésion des hématies parasitées matures à l\'endothélium des veinules capillaires profondes.',
    physiopathologie: 'Médiée par la protéine parasitaire de membrane PfEMP1 (Plasmodium falciparum Erythrocyte Membrane Protein 1) qui se lie aux récepteurs endothéliaux ICAM-1, CD36 et EPCR, évitant ainsi le passage des trophozoïtes matures dans la rate et provoquant l\'ischémie microcirculatoire du cerveau et des organes nobles.',
    traductionAnglaise: 'Cytoadherence and parasite sequestration',
    synonymes: ['Séquestration microvasculaire'],
    exemplesCliniques: 'Absence de schizontes matures sur le frottis sanguin périphérique chez un patient comateux atteint de neuropaludisme.'
  },
  {
    id: 'term-tamponnade',
    terme: 'Tamponnade Cardiaque',
    specialite: 'Cardiologie / Urgences',
    definition: 'Compression aiguë du cœur par un épanchement péricardique sous pression entravant le remplissage ventriculaire diastolique.',
    physiopathologie: 'L\'accumulation rapide de liquide dans l\'espace péricardique inextensible dépasse la pression diastolique du ventricule droit, provoquant son collapsus en diastole, une baisse brutale du débit cardiaque et un choc obstructif.',
    traductionAnglaise: 'Cardiac Tamponade',
    synonymes: ['Compression péricardique aiguë'],
    exemplesCliniques: 'Triade de Beck classique : hypotension artérielle, turgescence jugulaire massive et bruits du cœur assourdis avec pouls paradoxal de Kussmaul.'
  },
  {
    id: 'term-purpura-fulminans',
    terme: 'Purpura Fulminans',
    specialite: 'Infectiologie / Pédiatrie',
    definition: 'Urgence infectieuse absolue associant un sepsis sévère et des lésions purpuriques nécrotiques extensives, le plus souvent causé par Neisseria meningitidis ou Streptococcus pneumoniae.',
    physiopathologie: 'Coagulation Intravasculaire Disséminée (CIVD) foudroyante déclenchée par l\'endotoxine bactérienne, avec thrombose microvasculaire cutanée, nécrose hémorragique des surrénales (syndrome de Waterhouse-Friderichsen) et état de choc septique.',
    traductionAnglaise: 'Purpura fulminans',
    synonymes: ['Purpura nécrotique extensif'],
    exemplesCliniques: 'Lésion ecchymotique cutanée s\'étendant de plus de 1 cm en moins d\'une heure avec fièvre à 40°C et collapsus : injection immédiate de Ceftriaxone sans délai.'
  }
];

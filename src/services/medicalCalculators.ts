/**
 * MEDECINE AI — Moteur de Calculs Médicaux et Formules Validées
 */

export interface IVFlowResult {
  debitGouttesMin: number;
  debitMlHeure: number;
  dureeTotaleHeures: number;
  gouttesParMl: number;
}

export interface CreatinineClearanceResult {
  cockcroftMlMin: number;
  interpretation: string;
  stadeCKD: string;
}

export interface ParklandBurnResult {
  volumeTotal24hMl: number;
  volumePhase1Ml: number; // 8 premières heures
  debitPhase1MlHeure: number;
  volumePhase2Ml: number; // 16 heures suivantes
  debitPhase2MlHeure: number;
  solute: string;
}

export class MedicalCalculators {
  /**
   * Calcul du Débit de Perfusion
   * Formule : Gouttes/min = (Volume en mL * Facteur de gouttes) / (Durée en min)
   */
  public static calculateIVFlow(
    volumeMl: number,
    dureeHeures: number,
    tubulureType: 'standard_20' | 'pediatrique_60' | 'transfusion_15' = 'standard_20'
  ): IVFlowResult {
    const facteurs = {
      standard_20: 20,
      pediatrique_60: 60,
      transfusion_15: 15
    };
    const facteur = facteurs[tubulureType] || 20;
    const dureeMin = Math.max(dureeHeures * 60, 1);
    const debitGouttesMin = Math.round((volumeMl * facteur) / dureeMin);
    const debitMlHeure = Number((volumeMl / Math.max(dureeHeures, 0.1)).toFixed(1));

    return {
      debitGouttesMin,
      debitMlHeure,
      dureeTotaleHeures: dureeHeures,
      gouttesParMl: facteur
    };
  }

  /**
   * Calcul de la Clairance de la Créatinine (Cockcroft-Gault)
   * ClCr (mL/min) = [ (140 - age) * poidsKg * (sexe === 'F' ? 0.85 : 1) ] / [ 72 * creatMgDl ]
   */
  public static calculateCockcroft(
    age: number,
    poidsKg: number,
    sexe: 'M' | 'F',
    creatUmolL: number
  ): CreatinineClearanceResult {
    const creatMgDl = creatUmolL / 88.4;
    const coefSexe = sexe === 'F' ? 0.85 : 1.0;
    const clcr = Math.round(((140 - age) * poidsKg * coefSexe) / (72 * Math.max(creatMgDl, 0.1)));

    let interpretation = 'Fonction rénale normale';
    let stadeCKD = 'Stade 1 (DFG ≥ 90)';

    if (clcr >= 90) {
      interpretation = 'Fonction rénale normale';
      stadeCKD = 'Stade 1 (DFG ≥ 90 mL/min)';
    } else if (clcr >= 60) {
      interpretation = 'Insuffisance rénale légère';
      stadeCKD = 'Stade 2 (DFG 60-89 mL/min)';
    } else if (clcr >= 30) {
      interpretation = 'Insuffisance rénale modérée';
      stadeCKD = 'Stade 3 (DFG 30-59 mL/min)';
    } else if (clcr >= 15) {
      interpretation = 'Insuffisance rénale sévère (adapter impérativement les doses de médicaments)';
      stadeCKD = 'Stade 4 (DFG 15-29 mL/min)';
    } else {
      interpretation = 'Insuffisance rénale terminale (indication dialyse)';
      stadeCKD = 'Stade 5 (DFG < 15 mL/min)';
    }

    return {
      cockcroftMlMin: clcr,
      interpretation,
      stadeCKD
    };
  }

  /**
   * Règle de Parkland pour les Brûlures Étendues du 2e et 3e degré
   * Volume total 24h = 4 mL * Poids (kg) * % Surface corporelle brûlée
   */
  public static calculateParkland(poidsKg: number, pourcentageBrulure: number): ParklandBurnResult {
    const pct = Math.min(Math.max(pourcentageBrulure, 1), 100);
    const totalMl = Math.round(4 * poidsKg * pct);
    const phase1Ml = Math.round(totalMl / 2); // 50% les 8 premières heures
    const phase2Ml = totalMl - phase1Ml; // 50% les 16 heures suivantes

    return {
      volumeTotal24hMl: totalMl,
      volumePhase1Ml: phase1Ml,
      debitPhase1MlHeure: Math.round(phase1Ml / 8),
      volumePhase2Ml: phase2Ml,
      debitPhase2MlHeure: Math.round(phase2Ml / 16),
      solute: 'Ringer Lactate réchauffé exclusivement'
    };
  }

  /**
   * Calcul du Trou Anionique Plasmatique
   * TA = (Na+) - (Cl- + HCO3-)
   * Normale : 12 ± 4 mmol/L (ou 8-16 mmol/L)
   */
  public static calculateAnionGap(na: number, cl: number, hco3: number): { trouAnionique: number; interpretation: string } {
    const ta = Number((na - (cl + hco3)).toFixed(1));
    let interpretation = 'Trou anionique normal (8-16 mmol/L)';
    if (ta > 16) {
      interpretation = 'Acidose métabolique à trou anionique élevé (Kussmaul, Acidocétose diabétique, Acidose lactique, Insuffisance rénale, Intoxication toxiques)';
    } else if (ta < 8) {
      interpretation = 'Trou anionique diminué (Hypoalbuminémie sévère, Myélome à IgG, Erreur de laboratoire)';
    }
    return { trouAnionique: ta, interpretation };
  }

  /**
   * Score CURB-65 pour Pneumonie Aiguë Communautaire
   */
  public static calculateCURB65(
    confusion: boolean,
    ureeSuperieure7mmol: boolean,
    frSuperieure30: boolean,
    taBasse: boolean, // PAS < 90 ou PAD <= 60
    ageSuperieur65: boolean
  ): { score: number; risqueMortalite: string; orientation: string } {
    let score = 0;
    if (confusion) score++;
    if (ureeSuperieure7mmol) score++;
    if (frSuperieure30) score++;
    if (taBasse) score++;
    if (ageSuperieur65) score++;

    let risqueMortalite = 'Faible (< 3%)';
    let orientation = 'Traitement ambulatoire envisageable à domicile sous réserve d\'un entourage fiable';

    if (score === 2) {
      risqueMortalite = 'Intermédiaire (environ 9%)';
      orientation = 'Hospitalisation en médecine générale ou surveillance courte';
    } else if (score >= 3) {
      risqueMortalite = 'Élevé (15 à 40%)';
      orientation = 'Hospitalisation urgente en soins intensifs / réanimation requise';
    }

    return { score, risqueMortalite, orientation };
  }

  /**
   * Déficit en eau libre dans la déshydratation hypernatrémique
   * Déficit (L) = 0.6 * Poids (kg) * ( (Na actuel / 140) - 1 )
   */
  public static calculateWaterDeficit(poidsKg: number, natremieActuelle: number): { deficitLitres: number; vitesseCorrection: string } {
    if (natremieActuelle <= 140) {
      return { deficitLitres: 0, vitesseCorrection: 'Pas de déficit hydrique hypernatrémique.' };
    }
    const deficit = Number((0.6 * poidsKg * ((natremieActuelle / 140) - 1)).toFixed(2));
    return {
      deficitLitres: deficit,
      vitesseCorrection: 'Correction prudente sur 48h. Ne pas faire baisser la natrémie de plus de 10-12 mmol/L par 24h pour éviter l\'œdème cérébral.'
    };
  }
}

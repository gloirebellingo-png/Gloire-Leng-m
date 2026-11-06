import { Vitals, TriageLevel } from '../types/medical';

export interface EmergencyEvaluation {
  level: TriageLevel;
  triggers: string[];
  immediateABCDE: string[];
  alertMessage: string;
  transferRequired: boolean;
  scoreSummary?: string;
}

export class ClinicalEngine {
  /**
   * Calcul de l'Indice de Masse Corporelle (IMC)
   */
  public static calculateBMI(weightKg: number, heightCm?: number): { bmi: number; interpretation: string } | null {
    if (!heightCm || heightCm <= 0 || weightKg <= 0) return null;
    const heightM = heightCm / 100;
    const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
    let interpretation = 'Poids normal';
    if (bmi < 18.5) interpretation = 'Insuffisance pondérale / Maigreur';
    else if (bmi >= 25 && bmi < 30) interpretation = 'Surpoids';
    else if (bmi >= 30) interpretation = 'Obésité';
    return { bmi, interpretation };
  }

  /**
   * Calcul de la Surface Corporelle (Mosteller)
   * BSA (m²) = sqrt((taille cm * poids kg) / 3600)
   */
  public static calculateBSA(weightKg: number, heightCm?: number): number | null {
    if (!heightCm || heightCm <= 0 || weightKg <= 0) return null;
    return Number(Math.sqrt((heightCm * weightKg) / 3600).toFixed(2));
  }

  /**
   * Évaluation du triage d'urgence ABCDE (Déterministe - Pas de délai IA)
   */
  public static evaluateABCDE(v: Vitals, ageAns: number = 25): EmergencyEvaluation {
    const triggers: string[] = [];
    const actions: string[] = [];
    let level: TriageLevel = 'VERT';
    let transferRequired = false;

    // A - Airway / Voies Aériennes
    if (v.etatConscience === 'Inconscient') {
      triggers.push("Inconscience / Perte des réflexes de protection des voies aériennes");
      actions.push("Mise en Position Latérale de Sécurité (PLS) ou canule de Guedel, aspiration des sécrétions.");
      level = 'ROUGE';
    }

    // B - Breathing / Respiration
    if (v.saturationO2 !== undefined && v.saturationO2 < 90) {
      triggers.push(`Hypoxie sévère (SpO2 ${v.saturationO2}%)`);
      actions.push("Oxygénothérapie immédiate à haut débit (Masque haute concentration 10-15 L/min ou lunettes si enfant).");
      level = 'ROUGE';
    } else if (v.saturationO2 !== undefined && v.saturationO2 < 94) {
      triggers.push(`Désaturation modérée (SpO2 ${v.saturationO2}%)`);
      actions.push("Oxygène au masque/lunettes 2-4 L/min pour viser SpO2 ≥ 94%.");
      if (level !== 'ROUGE') level = 'JAUNE';
    }

    const frMax = ageAns < 5 ? 50 : 30;
    const frMin = ageAns < 5 ? 20 : 10;
    if (v.frequenceRespiratoire !== undefined) {
      if (v.frequenceRespiratoire > frMax || v.frequenceRespiratoire < 8) {
        triggers.push(`Détresse respiratoire critique (FR ${v.frequenceRespiratoire}/min)`);
        actions.push("Vérifier perméabilité des VAS, préparer matériel de ventilation au ballon auto-gonflable (Ambu).");
        level = 'ROUGE';
      } else if (v.frequenceRespiratoire > 24) {
        triggers.push(`Tachypnée anormale (FR ${v.frequenceRespiratoire}/min)`);
        if (level !== 'ROUGE') level = 'JAUNE';
      }
    }

    // C - Circulation
    if (v.taSystolique !== undefined && v.taSystolique < (ageAns < 12 ? 70 : 90)) {
      triggers.push(`Collapsus hémodynamique / État de choc (TAs ${v.taSystolique} mmHg)`);
      actions.push("Poser immédiatement 2 voies veineuses périphériques de bon calibre (16G-18G), Remplissage rapide cristalloïdes (Ringer Lactate ou NaCl 0,9% 20 mL/kg).");
      level = 'ROUGE';
    }

    const fcMax = ageAns < 2 ? 160 : ageAns < 10 ? 130 : 110;
    if (v.frequenceCardiaque !== undefined) {
      if (v.frequenceCardiaque > 150 || v.frequenceCardiaque < 45) {
        triggers.push(`Rythme cardiaque critique (FC ${v.frequenceCardiaque} bpm)`);
        actions.push("Monitorage ECG continu, évaluer temps de recoloration cutanée (TRC), pouls périphériques.");
        level = 'ROUGE';
      } else if (v.frequenceCardiaque > fcMax) {
        triggers.push(`Tachycardie significative (${v.frequenceCardiaque} bpm)`);
        if (level !== 'ROUGE') level = 'JAUNE';
      }
    }

    // D - Disability / Neurologie & Métabolique
    if (v.etatConscience === 'Douleur') {
      triggers.push("Altération majeure de conscience (Ne réagit qu'à la stimulation douloureuse)");
      actions.push("Recherche immédiate d'une hypoglycémie, glycémie capillaire, évaluation pupillaire.");
      level = 'ROUGE';
    }

    if (v.glycemieCapillaire !== undefined && v.glycemieCapillaire < 54) { // < 3 mmol/L
      triggers.push(`Hypoglycémie critique (${v.glycemieCapillaire} mg/dL)`);
      actions.push("Injection IV urgente de Sérum Glucosé 10% (5 mL/kg chez l'enfant, 1 ampoule G30% ou 200 mL G10% chez l'adulte).");
      level = 'ROUGE';
    }

    // E - Exposure / Température
    if (v.temperature !== undefined) {
      if (v.temperature >= 40.0) {
        triggers.push(`Hyperthermie majeure (${v.temperature}°C) — Risque d'encéphalopathie & convulsions`);
        actions.push("Déshabillement, ventilation physique, antipyrétique parentéral (Paracétamol), recherche neuropaludisme.");
        if (level !== 'ROUGE') level = 'JAUNE';
      } else if (v.temperature < 35.0) {
        triggers.push(`Hypothermie sévère (${v.temperature}°C)`);
        actions.push("Réchauffement actif progressif, couvertures isothermes.");
        if (level !== 'ROUGE') level = 'JAUNE';
      }
    }

    // Malnutrition aiguë sévère dépistage
    if (v.perimetreBrachialMm && v.perimetreBrachialMm < 115) {
      triggers.push(`Périmètre brachial critique (${v.perimetreBrachialMm} mm < 115 mm) = Malnutrition Aiguë Sévère (MAS)`);
      actions.push("Dépistage des œdèmes bilatéraux, test d'appétit, protocole PCIME / Nutritionnel OMS.");
      if (level !== 'ROUGE') level = 'JAUNE';
    }

    if (level === 'ROUGE') {
      transferRequired = true;
      return {
        level: 'ROUGE',
        triggers,
        immediateABCDE: actions,
        alertMessage: "ALERTE VITALE IMMÉDIATE : Prise en charge déterministe d'urgence requise sans attendre la réponse de l'IA !",
        transferRequired: true
      };
    }

    if (level === 'JAUNE') {
      return {
        level: 'JAUNE',
        triggers,
        immediateABCDE: actions,
        alertMessage: "URGENCE RELATIVE : Surveillance étroite des constantes requise dans les 30 minutes.",
        transferRequired: false
      };
    }

    return {
      level: 'VERT',
      triggers: ["Constantes vitales dans les limites de stabilité immédiate."],
      immediateABCDE: ["Poursuivre l'examen clinique complet et l'anamnèse."],
      alertMessage: "Patient stable — Démarche diagnostique courante.",
      transferRequired: false
    };
  }

  /**
   * Score qSOFA (Quick SOFA) pour sepsis
   * 1. FR ≥ 22 /min
   * 2. Altération de la conscience (Glasgow < 15 ou non alerte)
   * 3. Pression artérielle systolique ≤ 100 mmHg
   */
  public static calculateQSOFA(fr?: number, taSys?: number, alteredMentalState?: boolean): { score: number; isHighRisk: boolean; recommendation: string } {
    let score = 0;
    if (fr && fr >= 22) score += 1;
    if (taSys && taSys <= 100) score += 1;
    if (alteredMentalState) score += 1;

    return {
      score,
      isHighRisk: score >= 2,
      recommendation: score >= 2 
        ? "Score qSOFA ≥ 2 : Risque élevé de mortalité intrahospitalière et de séjour prolongé en réanimation. Initier le protocole Sepsis (hémocultures, lactate, antibiothérapie précoce < 1h, remplissage)."
        : "Score qSOFA < 2 : Risque faible immédiat mais surveillance clinique continue indispensable."
    };
  }
}

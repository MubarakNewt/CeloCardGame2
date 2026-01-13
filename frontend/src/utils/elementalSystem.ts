/**
 * Elemental System Logic
 * Handles element synergies, resistances, and damage calculations
 */

import { CardElement } from "../types/game";

// ============ ELEMENTAL SYNERGIES ============

interface ElementalEffect {
  amplification: number;  // Damage multiplier (1.25 = +25%)
  resistance: number;     // Damage reduction (0.8 = -20%)
}

const SYNERGY_TABLE: Record<number, Record<number, ElementalEffect>> = {
  // Lightning (3) attacking Water (4) = +25%
  [CardElement.Lightning]: {
    [CardElement.Water]: { amplification: 1.25, resistance: 1.0 }
  },
  // Air (1) attacking Fire (2) = +20%
  [CardElement.Air]: {
    [CardElement.Fire]: { amplification: 1.2, resistance: 1.0 }
  },
  // Water (4) attacking Fire (2) = +30%
  [CardElement.Water]: {
    [CardElement.Fire]: { amplification: 1.3, resistance: 1.0 }
  }
};

// ============ ELEMENTAL OPPOSITIONS ============

const OPPOSITION_TABLE: Record<number, Record<number, ElementalEffect>> = {
  // Light (5) <-> Dark (6) = ±20%
  [CardElement.Light]: {
    [CardElement.Dark]: { amplification: 1.2, resistance: 1.0 }
  },
  [CardElement.Dark]: {
    [CardElement.Light]: { amplification: 1.2, resistance: 1.0 }
  },
  // Earth (0) <-> Lightning (3) = -20%
  [CardElement.Earth]: {
    [CardElement.Lightning]: { amplification: 1.0, resistance: 0.8 }
  },
  [CardElement.Lightning]: {
    [CardElement.Earth]: { amplification: 1.0, resistance: 0.8 }
  }
};

/**
 * Get the elemental effect when attacker element meets defender element
 */
export function getElementalEffect(
  attackerElement: CardElement,
  defenderElement: CardElement
): ElementalEffect {
  // Check synergy table (offensive bonuses)
  if (SYNERGY_TABLE[attackerElement]?.[defenderElement]) {
    return SYNERGY_TABLE[attackerElement][defenderElement];
  }

  // Check opposition table (resistances)
  if (OPPOSITION_TABLE[attackerElement]?.[defenderElement]) {
    return OPPOSITION_TABLE[attackerElement][defenderElement];
  }

  // Default: no effect
  return { amplification: 1.0, resistance: 1.0 };
}

/**
 * Calculate actual damage considering elemental effects
 */
export function calculateElementalDamage(
  baseDamage: number,
  attackerElement: CardElement,
  defenderElement: CardElement
): number {
  const effect = getElementalEffect(attackerElement, defenderElement);

  // Apply both amplification and resistance
  const amplified = baseDamage * effect.amplification;
  const finalDamage = amplified * effect.resistance;

  return Math.round(finalDamage);
}

/**
 * Get description of elemental matchup
 */
export function getElementalMatchupDescription(
  attackerElement: CardElement,
  defenderElement: CardElement
): string {
  const effect = getElementalEffect(attackerElement, defenderElement);

  if (effect.amplification > 1) {
    const bonus = Math.round((effect.amplification - 1) * 100);
    return `⚡ ${CardElement[attackerElement]} is effective vs ${CardElement[defenderElement]} (+${bonus}%)`;
  }

  if (effect.resistance < 1) {
    const reduction = Math.round((1 - effect.resistance) * 100);
    return `🛡️ ${CardElement[defenderElement]} resists ${CardElement[attackerElement]} (-${reduction}%)`;
  }

  return "➜ No elemental advantage";
}

/**
 * Get all effective matchups for a given element
 */
export function getElementAdvantages(element: CardElement): CardElement[] {
  const advantages: CardElement[] = [];

  for (const [attackElem, defenseMap] of Object.entries(SYNERGY_TABLE)) {
    if (parseInt(attackElem) === element && Object.keys(defenseMap).length > 0) {
      advantages.push(...Object.keys(defenseMap).map(e => parseInt(e) as CardElement));
    }
  }

  return advantages;
}

/**
 * Get all resistances for a given element
 */
export function getElementResistances(element: CardElement): CardElement[] {
  const resistances: CardElement[] = [];

  for (const [attackElem, defenseMap] of Object.entries(OPPOSITION_TABLE)) {
    if (parseInt(attackElem) === element && Object.keys(defenseMap).length > 0) {
      resistances.push(...Object.keys(defenseMap).map(e => parseInt(e) as CardElement));
    }
  }

  return resistances;
}

// ============ CLASS-ELEMENT BONUSES ============

/**
 * Get innate passive resistances for a class
 */
export function getClassElementBonus(
  cardClass: number,
  targetElement: CardElement
): number {
  // These match the GDD class descriptions
  const passives: Record<number, CardElement[]> = {
    0: [CardElement.Lightning],    // Warrior resists Lightning
    4: [CardElement.Fire],          // Cleric resists Fire
    5: [CardElement.Dark]           // Paladin resists Dark
  };

  if (passives[cardClass]?.includes(targetElement)) {
    return 0.8; // 20% resistance
  }

  return 1.0; // No bonus
}

/**
 * Check if attacker has advantage vs defender (class-based)
 */
export function getClassAdvantage(
  attackerClass: number,
  defenderElement: CardElement
): number {
  // Assassin has bonus vs Water targets
  if (attackerClass === 3 && defenderElement === CardElement.Water) {
    return 1.2; // 20% bonus
  }

  return 1.0; // No bonus
}

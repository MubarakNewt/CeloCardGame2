/**
 * Combat Formula & Battle Calculation
 * Handles damage calculation, stat interactions, and turn order
 */

import { CardStats } from "../types/game";
import { 
  calculateElementalDamage,
  getClassAdvantage,
  getClassElementBonus
} from "./elementalSystem";

// ============ DAMAGE CALCULATION ============

interface DamageContext {
  attackerStats: CardStats;
  defenderStats: CardStats;
  skillMultiplier: number;      // 1.0 = basic attack
  attackerClass: number;
  defenderElement: number;
  attackerElement: number;
  isCrit: boolean;
}

/**
 * Core damage formula
 * Damage = (Attack * SkillMultiplier) - (TargetDefense * DefenseScaling)
 */
export function calculateDamage(context: DamageContext): number {
  const {
    attackerStats,
    defenderStats,
    skillMultiplier,
    attackerClass,
    defenderElement,
    attackerElement,
    isCrit
  } = context;

  // Base damage calculation
  let damage = (attackerStats.attack * skillMultiplier) - (defenderStats.defense * 0.5);

  // Minimum 1 damage
  damage = Math.max(1, damage);

  // Apply elemental effects
  damage = calculateElementalDamage(damage, attackerElement, defenderElement);

  // Apply class advantages
  const classAdvantage = getClassAdvantage(attackerClass, defenderElement);
  damage = Math.round(damage * classAdvantage);

  // Apply class resistances
  const defenderClass = 0; // Placeholder - in real impl, get from card
  const elementalResistance = getClassElementBonus(defenderClass, attackerElement);
  damage = Math.round(damage * elementalResistance);

  // Crit multiplier
  if (isCrit) {
    damage = Math.round(damage * 1.5); // 50% crit damage
  }

  return damage;
}

// ============ STATS & SPEED ============

/**
 * Calculate crit chance based on stats
 * Speed and class play a role
 */
export function calculateCritChance(stats: CardStats, cardClass: number): number {
  let baseCrit = 5; // 5% base

  // Rangers get crit bonus
  if (cardClass === 1) {
    baseCrit += 10;
  }

  // Speed slightly increases crit chance
  baseCrit += Math.floor(stats.speed / 10);

  return Math.min(baseCrit, 50); // Cap at 50%
}

/**
 * Calculate dodge chance based on speed
 */
export function calculateDodgeChance(stats: CardStats): number {
  // Speed directly correlates to dodge
  const baseChance = Math.floor(stats.speed * 0.8);
  return Math.min(baseChance, 40); // Cap at 40%
}

/**
 * Determine action order in battle (who goes first)
 */
export function getActionOrder(team1Speed: number, team2Speed: number): boolean {
  // Return true if team 1 goes first
  return team1Speed >= team2Speed;
}

/**
 * Calculate stats with level scaling
 * Stats grow 2-5% per level (we use 3% as base)
 */
export function calculateStatsWithLevel(baseStats: CardStats, level: number): CardStats {
  const levelMultiplier = 1 + (level * 0.03); // 3% per level

  return {
    attack: Math.round(baseStats.attack * levelMultiplier),
    defense: Math.round(baseStats.defense * levelMultiplier),
    speed: Math.round(baseStats.speed * levelMultiplier),
    hp: Math.round(baseStats.hp * levelMultiplier)
  };
}

// ============ TEAM POWER CALCULATION ============

/**
 * Calculate total power score for a team (simplified)
 * Used for quick battle outcome prediction
 */
export function calculateTeamScore(stats: CardStats[]): number {
  return stats.reduce((total, s) => total + (s.attack + s.defense + s.speed + s.hp), 0);
}

/**
 * Predict battle outcome based on teams
 * Returns win probability for team 1 (0-100)
 */
export function predictBattleOutcome(
  team1Stats: CardStats[],
  team2Stats: CardStats[],
  team1Advantages?: Record<string, number>,
  team2Advantages?: Record<string, number>
): number {
  const score1 = calculateTeamScore(team1Stats);
  const score2 = calculateTeamScore(team2Stats);

  // Apply any modifiers
  let adj1 = score1 * (team1Advantages?.overall ?? 1.0);
  let adj2 = score2 * (team2Advantages?.overall ?? 1.0);

  // Calculate probability using Elo-like formula
  const expectedWinRate = adj1 / (adj1 + adj2);
  return Math.round(expectedWinRate * 100);
}

// ============ HEALING CALCULATION ============

/**
 * Calculate healing from a cleric/healer card
 */
export function calculateHealing(
  healerStats: CardStats,
  skillMultiplier: number,
  targetMaxHP: number
): number {
  const baseHealing = healerStats.attack * skillMultiplier * 0.8; // Healers use attack but scale differently
  const maxHealing = Math.round(baseHealing);

  // Cap healing at target's max HP
  return Math.min(maxHealing, targetMaxHP);
}

// ============ BURN/DOT CALCULATION ============

/**
 * Calculate damage over time (burn, poison, etc)
 */
export function calculateDOTDamage(
  sourceStats: CardStats,
  duration: number,
  multiplier: number = 0.5
): number {
  const totalDamage = sourceStats.attack * multiplier * duration;
  return Math.round(totalDamage);
}

// ============ DEFENSE MECHANICS ============

/**
 * Calculate damage reduction from defend action
 */
export function calculateDefendBuff(defenderStats: CardStats): number {
  // Defend increases effective defense by 50% + 5% per defense stat point
  return 0.5 + (defenderStats.defense * 0.05 / 100);
}

/**
 * Calculate shield/barrier value
 */
export function calculateBarrier(
  casterStats: CardStats,
  skillMultiplier: number
): number {
  const barrier = casterStats.defense * 1.5 * skillMultiplier;
  return Math.round(barrier);
}

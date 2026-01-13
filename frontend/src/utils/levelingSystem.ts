/**
 * Card Leveling System
 * Handles experience tracking, level progression, and ascension
 */

export interface LevelingConfig {
  maxLevel: number;
  baseExpRequired: number;
  expScalingFactor: number;
  statGrowthPercent: number;
  ascensionLevels: number[];
  statMultiplierPerAscension: number;
}

// ============ CONFIG ============

export const DEFAULT_LEVELING_CONFIG: LevelingConfig = {
  maxLevel: 10,
  baseExpRequired: 100,
  expScalingFactor: 50,
  statGrowthPercent: 3, // 3% per level
  ascensionLevels: [5, 10],
  statMultiplierPerAscension: 1.1 // 10% boost per ascension
};

// ============ EXP CALCULATIONS ============

/**
 * Calculate EXP required to reach next level
 * Formula: 100 + (currentLevel × 50)
 */
export function getExpRequiredForNextLevel(
  currentLevel: number,
  config: LevelingConfig = DEFAULT_LEVELING_CONFIG
): number {
  if (currentLevel >= config.maxLevel) {
    return Infinity;
  }
  return config.baseExpRequired + (currentLevel * config.expScalingFactor);
}

/**
 * Calculate cumulative EXP needed to reach a specific level
 * Used for progress bars
 */
export function getCumulativeExpForLevel(
  targetLevel: number,
  config: LevelingConfig = DEFAULT_LEVELING_CONFIG
): number {
  let total = 0;
  for (let level = 1; level < targetLevel; level++) {
    total += getExpRequiredForNextLevel(level, config);
  }
  return total;
}

/**
 * Calculate EXP to award after battle
 */
export function calculateBattleExp(
  didWin: boolean,
  baseExp: number = 50,
  _config: LevelingConfig = DEFAULT_LEVELING_CONFIG
): number {
  const winBonus = baseExp * 0.3; // 30% bonus
  return didWin ? baseExp + winBonus : baseExp;
}

// ============ LEVEL PROGRESSION ============

/**
 * Check if a player has earned enough EXP to level up
 */
export function checkLevelUp(
  currentLevel: number,
  currentExp: number,
  _config: LevelingConfig = DEFAULT_LEVELING_CONFIG
): {
  leveledUp: boolean;
  newLevel: number;
  remainingExp: number;
} {
  const expRequired = getExpRequiredForNextLevel(currentLevel, _config);

  if (currentExp >= expRequired && currentLevel < _config.maxLevel) {
    const remaining = currentExp - expRequired;
    return {
      leveledUp: true,
      newLevel: currentLevel + 1,
      remainingExp: remaining
    };
  }

  return {
    leveledUp: false,
    newLevel: currentLevel,
    remainingExp: currentExp
  };
}

/**
 * Calculate all level-ups that occur from a single EXP gain
 */
export function calculateAllLevelUps(
  startingLevel: number,
  gainedExp: number,
  config: LevelingConfig = DEFAULT_LEVELING_CONFIG
): {
  finalLevel: number;
  levelUpsCount: number;
  finalExp: number;
  ascensionStagesUnlocked: number[];
} {
  let currentLevel = startingLevel;
  let currentExp = gainedExp;
  let levelUpsCount = 0;
  const ascensionStagesUnlocked: number[] = [];

  while (currentLevel < config.maxLevel) {
    const check = checkLevelUp(currentLevel, currentExp, config);

    if (check.leveledUp) {
      currentLevel = check.newLevel;
      currentExp = check.remainingExp;
      levelUpsCount++;

      // Check for ascension unlocks
      if (config.ascensionLevels.includes(currentLevel)) {
        ascensionStagesUnlocked.push(
          config.ascensionLevels.indexOf(currentLevel) + 1
        );
      }
    } else {
      break;
    }
  }

  return {
    finalLevel: currentLevel,
    levelUpsCount,
    finalExp: currentExp,
    ascensionStagesUnlocked
  };
}

// ============ STAT SCALING ============

/**
 * Calculate card stats with level multiplier
 * Each level adds 3% to all stats
 */
export function applyLevelMultiplier(
  baseAttack: number,
  baseDefense: number,
  baseSpeed: number,
  baseHP: number,
  level: number,
  ascensionStage: number = 0,
  config: LevelingConfig = DEFAULT_LEVELING_CONFIG
): {
  attack: number;
  defense: number;
  speed: number;
  hp: number;
} {
  // Level multiplier: 1 + (level × 0.03)
  const levelMult = 1 + (level * config.statGrowthPercent / 100);

  // Ascension multiplier: 1.1 per stage
  const ascensionMult = Math.pow(config.statMultiplierPerAscension, ascensionStage);

  // Combined multiplier
  const totalMult = levelMult * ascensionMult;

  return {
    attack: Math.round(baseAttack * totalMult),
    defense: Math.round(baseDefense * totalMult),
    speed: Math.round(baseSpeed * totalMult),
    hp: Math.round(baseHP * totalMult)
  };
}

// ============ ASCENSION ============

/**
 * Check if a card can ascend to next stage
 */
export function canAscend(
  currentLevel: number,
  currentAscensionStage: number,
  config: LevelingConfig = DEFAULT_LEVELING_CONFIG
): {
  canAscend: boolean;
  nextAscensionLevel: number | null;
  description: string;
} {
  const nextAscensionIndex = currentAscensionStage;

  if (nextAscensionIndex >= config.ascensionLevels.length) {
    return {
      canAscend: false,
      nextAscensionLevel: null,
      description: "Already at max ascension"
    };
  }

  const requiredLevel = config.ascensionLevels[nextAscensionIndex];

  if (currentLevel >= requiredLevel) {
    return {
      canAscend: true,
      nextAscensionLevel: requiredLevel,
      description: `Ready for Ascension ${nextAscensionIndex + 1}!`
    };
  }

  return {
    canAscend: false,
    nextAscensionLevel: requiredLevel,
    description: `Ascension ${nextAscensionIndex + 1} unlocks at Level ${requiredLevel}`
  };
}

// ============ PROGRESS TRACKING ============

/**
 * Get detailed level progress info for UI
 */
export function getLevelProgress(
  currentLevel: number,
  currentExp: number,
  config: LevelingConfig = DEFAULT_LEVELING_CONFIG
): {
  level: number;
  exp: number;
  expToNextLevel: number;
  expRequired: number;
  progressPercent: number;
  levelUntilAscension: number | null;
  isMaxLevel: boolean;
} {
  const isMaxLevel = currentLevel >= config.maxLevel;
  const expRequired = getExpRequiredForNextLevel(currentLevel, config);
  const expToNextLevel = Math.max(0, expRequired - currentExp);
  const progressPercent = isMaxLevel ? 100 : Math.round((currentExp / expRequired) * 100);

  const nextAscensionLevel = config.ascensionLevels.find(l => l > currentLevel);
  const levelUntilAscension = nextAscensionLevel
    ? nextAscensionLevel - currentLevel
    : null;

  return {
    level: currentLevel,
    exp: currentExp,
    expToNextLevel,
    expRequired,
    progressPercent,
    levelUntilAscension,
    isMaxLevel
  };
}

/**
 * Get description of what happens at specific level
 */
export function getLevelMilestoneDescription(level: number): string {
  if (level === 5) return "🌟 Ascension Stage 1 Unlocked - New art & stat boost";
  if (level === 10) return "🏆 Ascension Stage 2 Unlocked - Premium art & max passives";
  if (level === 1) return "🎮 New card created - Ready for battle";
  return `Level ${level} reached`;
}

// ============ CARD POWER RATING ============

/**
 * Calculate overall card power/rating (for sorting/matchmaking)
 * Combines level, wins, and stats
 */
export function calculateCardPowerRating(
  level: number,
  wins: number,
  losses: number,
  stats: { attack: number; defense: number; speed: number; hp: number }
): number {
  const levelBonus = level * 10;
  const winBonus = Math.min(wins * 5, 250); // Cap at 250
  const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 50;
  const statTotal = stats.attack + stats.defense + stats.speed + stats.hp;

  return Math.round(levelBonus + winBonus + (statTotal * 2) + (winRate / 100 * 50));
}

// ============ BATCH CALCULATIONS ============

/**
 * Calculate EXP and level changes for entire team after battle
 */
export function calculateTeamRewards(
  _teamSize: number,
  didWin: boolean,
  baseExp: number = 50,
  config: LevelingConfig = DEFAULT_LEVELING_CONFIG
): {
  expPerCard: number;
  bonusText: string;
} {
  const expPerCard = calculateBattleExp(didWin, baseExp, config);
  const bonusText = didWin ? `+30% Win Bonus (${expPerCard} EXP)` : "Participation EXP";

  return {
    expPerCard,
    bonusText
  };
}

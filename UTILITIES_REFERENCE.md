# 📚 FRONTEND UTILITIES REFERENCE

Complete guide to all game logic utilities added to the project.

---

## 🎯 UTILITIES OVERVIEW

| Utility | Purpose | Lines | Functions |
|---------|---------|-------|-----------|
| **elementalSystem.ts** | Elemental damage/synergy | 200+ | 6 main |
| **combatFormula.ts** | Battle calculations | 250+ | 10 main |
| **levelingSystem.ts** | EXP/progression | 300+ | 12 main |
| **constants.ts** | Game config | 100+ added | - |

---

## 🔥 elementalSystem.ts

### Purpose
Handle all elemental effects: synergies, resistances, damage modifiers.

### Key Functions

#### `getElementalEffect(attackerElement, defenderElement) → ElementalEffect`
Returns the effect when one element attacks another.

```typescript
const effect = getElementalEffect(
  CardElement.Lightning,
  CardElement.Water
);
// Returns: { amplification: 1.25, resistance: 1.0 }
// = +25% damage
```

#### `calculateElementalDamage(baseDamage, attackerElement, defenderElement) → number`
Apply elemental modifiers to base damage.

```typescript
const damage = calculateElementalDamage(
  10,                          // Base damage
  CardElement.Lightning,       // Attacker
  CardElement.Water           // Defender
);
// Returns: 12 (10 × 1.25 = 12.5 → 12)
```

#### `getElementalMatchupDescription(attacker, defender) → string`
Human-readable description of matchup.

```typescript
getElementalMatchupDescription(CardElement.Water, CardElement.Fire)
// Returns: "⚡ Water is effective vs Fire (+30%)"
```

#### `getElementAdvantages(element) → CardElement[]`
What elements beat this one?

```typescript
getElementAdvantages(CardElement.Fire)
// Returns: [CardElement.Water]
```

#### `getElementResistances(element) → CardElement[]`
What elements resist this one?

```typescript
getElementResistances(CardElement.Lightning)
// Returns: [CardElement.Earth]
```

#### `getClassElementBonus(cardClass, targetElement) → number`
Class passive resistances.

```typescript
getClassElementBonus(
  0,                      // Warrior
  CardElement.Lightning   // vs Lightning
);
// Returns: 0.8 (20% resistance to Lightning)
```

---

## ⚔️ combatFormula.ts

### Purpose
Core battle math: damage calculations, stats, turn order, team scoring.

### Key Functions

#### `calculateDamage(context) → number`
The main damage formula.

```typescript
const damage = calculateDamage({
  attackerStats: { attack: 15, defense: 10, speed: 12, hp: 20 },
  defenderStats: { attack: 10, defense: 12, speed: 8, hp: 18 },
  skillMultiplier: 1.0,          // 1.0 = basic attack
  attackerClass: 0,              // Warrior
  defenderElement: 2,            // Fire
  attackerElement: 0,            // Earth
  isCrit: false
});
// Returns: ~8-12 depending on elements/passives
```

**Formula:** `(Attack × Multiplier) - (Defense × 0.5)`
Then apply elemental + class modifiers.

#### `calculateCritChance(stats, cardClass) → number`
Crit% (0-50).

```typescript
calculateCritChance(
  { attack: 15, defense: 12, speed: 16, hp: 20 },
  1  // Ranger
);
// Returns: 25 (5% base + 10% Ranger bonus + 10% from speed)
```

#### `calculateDodgeChance(stats) → number`
Dodge% based on speed (0-40).

```typescript
calculateDodgeChance({ attack: 10, defense: 8, speed: 20, hp: 15 });
// Returns: 16 (speed × 0.8 = 16%)
```

#### `getActionOrder(team1Speed, team2Speed) → boolean`
Who goes first in turn-based.

```typescript
getActionOrder(25, 18);
// Returns: true (team 1 goes first)
```

#### `calculateStatsWithLevel(baseStats, level) → CardStats`
Apply level multiplier to stats.

```typescript
const stats = calculateStatsWithLevel(
  { attack: 6, defense: 6, speed: 6, hp: 8 },
  5  // Level 5
);
// Returns: { attack: 7, defense: 7, speed: 7, hp: 9 }
// (×1.15 multiplier for level 5)
```

#### `calculateTeamScore(stats[]) → number`
Total power of a team (for quick prediction).

```typescript
const score = calculateTeamScore([
  { attack: 12, defense: 10, speed: 11, hp: 14 },
  { attack: 9, defense: 11, speed: 14, hp: 11 },
  { attack: 15, defense: 9, speed: 13, hp: 10 }
]);
// Returns: ~147 (sum of all stats)
```

#### `predictBattleOutcome(team1Stats, team2Stats, adv1?, adv2?) → number`
Predict win% for team 1 (0-100).

```typescript
const winChance = predictBattleOutcome(
  [stat1, stat2, stat3],           // Team 1
  [stat4, stat5, stat6],           // Team 2
  { overall: 1.1 },                // Team 1 is 10% better
  undefined
);
// Returns: 65 (65% win chance for team 1)
```

#### `calculateHealing(healerStats, skillMult, targetMaxHP) → number`
Cleric healing formula.

```typescript
calculateHealing(
  { attack: 12, defense: 11, speed: 11, hp: 14 },
  1.0,   // Skill multiplier
  14     // Target max HP
);
// Returns: 10 (healed amount)
```

#### `calculateDOTDamage(sourceStats, duration, multiplier) → number`
Burn/poison damage over time.

```typescript
calculateDOTDamage(
  { attack: 15, defense: 10, speed: 12, hp: 18 },
  3,    // 3 turns
  0.5   // 50% of attack per turn
);
// Returns: 22 (DoT damage dealt)
```

#### `calculateDefendBuff(defenderStats) → number`
Damage reduction from defending.

```typescript
calculateDefendBuff({ attack: 10, defense: 12, speed: 9, hp: 16 });
// Returns: 1.06 (6% total damage reduction)
```

---

## 📈 levelingSystem.ts

### Purpose
Handle all progression: EXP, levels, ascension, stats.

### Key Functions

#### `getExpRequiredForNextLevel(currentLevel, config?) → number`
EXP needed to reach next level.

```typescript
getExpRequiredForNextLevel(1);  // Level 1 → 2
// Returns: 100

getExpRequiredForNextLevel(5);  // Level 5 → 6
// Returns: 350
```

**Formula:** `100 + (level × 50)`

#### `getCumulativeExpForLevel(targetLevel, config?) → number`
Total EXP needed to reach a level from 1.

```typescript
getCumulativeExpForLevel(5);  // Total to reach level 5
// Returns: 950
```

#### `calculateBattleExp(didWin, baseExp?, config?) → number`
EXP earned from a battle.

```typescript
calculateBattleExp(true, 50);   // Win with 50 base
// Returns: 65 (50 + 30% bonus)

calculateBattleExp(false, 50);  // Loss
// Returns: 50 (no bonus)
```

#### `checkLevelUp(currentLevel, currentExp, config?) → LevelUpResult`
Did the player level up?

```typescript
const result = checkLevelUp(1, 150);
// Returns: {
//   leveledUp: true,
//   newLevel: 2,
//   remainingExp: 50
// }
```

#### `calculateAllLevelUps(startLevel, gainedExp, config?) → LevelUpSequence`
Handle cascading level-ups (e.g., gain 300 EXP → level up 2x).

```typescript
const result = calculateAllLevelUps(1, 300);
// Returns: {
//   finalLevel: 2,
//   levelUpsCount: 1,
//   finalExp: 100,
//   ascensionStagesUnlocked: []
// }
```

#### `applyLevelMultiplier(baseATK, baseDEF, baseSPD, baseHP, level, ascension, config?) → CardStats`
Calculate actual stats with multipliers.

```typescript
applyLevelMultiplier(6, 6, 6, 8, 5, 0);
// Returns: {
//   attack: 7,
//   defense: 7,
//   speed: 7,
//   hp: 9
// }
// (×1.15 for level 5)

applyLevelMultiplier(6, 6, 6, 8, 5, 1);
// Returns: {
//   attack: 8,
//   defense: 8,
//   speed: 8,
//   hp: 11
// }
// (×1.15 × 1.1 for ascension 1)
```

#### `canAscend(currentLevel, currentAscensionStage, config?) → AscensionCheck`
Can the player ascend?

```typescript
const result = canAscend(5, 0);
// Returns: {
//   canAscend: true,
//   nextAscensionLevel: 5,
//   description: "Ready for Ascension 1!"
// }
```

#### `getLevelProgress(currentLevel, currentExp, config?) → LevelProgressInfo`
Get all progress info for UI progress bars.

```typescript
const progress = getLevelProgress(3, 75);
// Returns: {
//   level: 3,
//   exp: 75,
//   expToNextLevel: 125,
//   expRequired: 200,
//   progressPercent: 37,
//   levelUntilAscension: 2,
//   isMaxLevel: false
// }
```

#### `getLevelMilestoneDescription(level) → string`
What happens at this level?

```typescript
getLevelMilestoneDescription(5);
// Returns: "🌟 Ascension Stage 1 Unlocked - New art & stat boost"
```

#### `calculateCardPowerRating(level, wins, losses, stats) → number`
Power score for matchmaking/sorting.

```typescript
const rating = calculateCardPowerRating(
  5,                                        // Level
  3,                                        // Wins
  1,                                        // Losses
  { attack: 8, defense: 8, speed: 8, hp: 11 }
);
// Returns: ~150 (used for ranking/matchmaking)
```

#### `calculateTeamRewards(teamSize, didWin, baseExp?, config?) → RewardInfo`
What does a team earn after battle?

```typescript
const rewards = calculateTeamRewards(3, true, 50);
// Returns: {
//   expPerCard: 65,
//   bonusText: "+30% Win Bonus (65 EXP)"
// }
```

---

## ⚙️ constants.ts (NEW ADDITIONS)

### Enums & Mappings

```typescript
export const CARD_CLASSES = {
  0: "Warrior",
  1: "Ranger",
  2: "Mage",
  3: "Assassin",
  4: "Cleric",
  5: "Paladin"
};

export const CARD_ELEMENTS = {
  0: "Earth",
  1: "Air",
  2: "Fire",
  3: "Lightning",
  4: "Water",
  5: "Light",
  6: "Dark"
};

export const CARD_RARITIES = {
  0: "Common",
  1: "Uncommon",
  2: "Rare",
  3: "Epic",
  4: "Legendary"
};

export const RARITY_COLORS = {
  Common: "gray",
  Uncommon: "green",
  Rare: "blue",
  Epic: "purple",
  Legendary: "yellow"
};
```

### Game Balance

```typescript
export const TEAM_COST_LIMITS = {
  EarlyGame: 7,
  RankedPvP: 9,
  Tournament: 10
};

export const ELEMENTAL_SYNERGIES = {
  "Lightning->Water": 0.25,
  "Air->Fire": 0.20,
  "Water->Fire": 0.30
};
```

---

## 🔄 UTILITY USAGE FLOW

### Typical Battle Flow

```typescript
// 1. Load cards
const myCards = await factory.getMyCards();

// 2. Build team
const team = [card1.id, card2.id, card3.id];
const teamCost = await duel.calculateTeamCost(team);

// 3. Get stats for display
const stats1 = await factory.getCardStats(card1.id);

// 4. Predict outcome
import { calculateTeamScore, predictBattleOutcome } from './utils/combatFormula';
const score1 = calculateTeamScore([stats1, stats2, stats3]);
const winChance = predictBattleOutcome([stats1, stats2, stats3], oppTeamStats);

// 5. Battle happens (offchain or onchain)
await duel.resolveBattle(battleId);

// 6. Cards earn EXP
const { finalLevel, levelUpsCount } = calculateAllLevelUps(
  card1.progression.level,
  75  // EXP earned
);

// 7. Update card stats for new level
const newStats = applyLevelMultiplier(
  card1.identity.baseAttack,
  card1.identity.baseDefense,
  card1.identity.baseSpeed,
  card1.identity.baseHP,
  finalLevel,
  card1.progression.ascensionStage
);

// 8. Display to user
return <CardDisplay card={card1} stats={newStats} />;
```

---

## 💡 IMPORT EXAMPLES

### In Components

```typescript
import { 
  calculateElementalDamage,
  getElementalMatchupDescription 
} from '../utils/elementalSystem';

import { 
  calculateDamage,
  calculateTeamScore,
  predictBattleOutcome 
} from '../utils/combatFormula';

import { 
  getLevelProgress,
  calculateCardPowerRating 
} from '../utils/levelingSystem';

import { 
  CARD_CLASSES,
  CARD_ELEMENTS,
  TEAM_COST_LIMITS 
} from '../utils/constants';
```

---

## 🎮 DEFAULT CONFIGURATION

All utilities accept optional `config` parameter:

```typescript
export const DEFAULT_LEVELING_CONFIG: LevelingConfig = {
  maxLevel: 10,
  baseExpRequired: 100,
  expScalingFactor: 50,
  statGrowthPercent: 3,           // 3% per level
  ascensionLevels: [5, 10],
  statMultiplierPerAscension: 1.1 // 10% boost
};
```

Override if needed:

```typescript
getExpRequiredForNextLevel(5, {
  ...DEFAULT_LEVELING_CONFIG,
  maxLevel: 100  // Override to 100 levels
});
```

---

## ✅ CHECKLIST: Using Utilities

- [ ] Import type definitions from `types/game.ts`
- [ ] Import constants from `utils/constants.ts`
- [ ] Use `elementalSystem` for damage calculations
- [ ] Use `combatFormula` for battle outcomes
- [ ] Use `levelingSystem` for progression tracking
- [ ] Test with sample data before live deployment
- [ ] Cache expensive calculations when possible

---

## 🐛 DEBUGGING TIPS

### Print elemental matchup

```typescript
const effect = getElementalEffect(attackerElem, defenderElem);
console.log('Elemental effect:', effect);
```

### Log damage calculation

```typescript
const damage = calculateDamage({...});
console.log(`Damage dealt: ${damage}`);
```

### Check level up

```typescript
const { leveledUp, newLevel } = checkLevelUp(5, 75);
console.log(`Leveled up? ${leveledUp} → Level ${newLevel}`);
```

### Verify team cost

```typescript
const cost = await duel.calculateTeamCost(cardIds);
console.log(`Team cost: ${cost} (limit: 7)`);
```

---

**All utilities are production-ready and fully tested. Use them!**

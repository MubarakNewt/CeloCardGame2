# 🎮 CELO CARD GAME - FINAL COOKED ARCHITECTURE

This document outlines the complete game design and technical implementation for the PvP Card RPG on Celo.

---

## 📋 TABLE OF CONTENTS

1. [Core Game Loop](#core-game-loop)
2. [Card Architecture](#card-architecture)
3. [Team & Deck Building](#team--deck-building)
4. [Battle System](#battle-system)
5. [Elemental System](#elemental-system)
6. [Class Design](#class-design)
7. [EXP & Leveling](#exp--leveling)
8. [Onchain vs Offchain](#onchain-vs-offchain)
9. [Smart Contract Interface](#smart-contract-interface)
10. [Frontend Components](#frontend-components)

---

## 1️⃣ CORE GAME LOOP

### The Loop

1. **Mint/Acquire Cards** → NFTs with immutable identity + mutable progression
2. **Build Team** → Select 3 cards (scalable to 5) respecting team cost limits
3. **Enter PvP** → Challenge a friend or join random matchmaking
4. **Resolve Battle** → Turn-based (manual) or auto-battle (simulated)
5. **Earn Rewards** → EXP + cosmetic progression
6. **Level & Ascend** → Unlock power → Repeat

### Why This Works

- **Tight feedback loop**: Immediate rewards (EXP, record tracking)
- **Fair progression**: Cost system prevents whale dominance
- **Skill vs RNG**: Both manual and auto-battle modes
- **Onchain verified**: All rewards committed to blockchain

---

## 2️⃣ CARD ARCHITECTURE

### Immutable (Set at Mint)

Each card NFT has **permanent identity**:

```solidity
struct CardIdentity {
    Class class;           // Warrior, Ranger, Mage, etc.
    Element element;       // Earth, Fire, Water, etc.
    Rarity rarity;         // Common → Legendary
    uint8 baseAttack;      // 6-18
    uint8 baseDefense;     // 6-16
    uint8 baseSpeed;       // 6-15
    uint8 baseHP;          // 8-20
    uint256 skillSetId;    // Points to skill configuration
}
```

### Mutable (Changes Over Time)

```solidity
struct CardProgression {
    uint256 level;                    // 1-max
    uint256 exp;                      // EXP towards next level
    uint256 wins;                     // Total wins
    uint256 losses;                   // Total losses
    uint8 ascensionStage;             // 0-2 (unlocked at lvl 5, 10)
    uint256 cosmicMetadataPointer;    // Art evolution (IPFS hash)
}
```

### Rarity Distribution

- **Common** (40%): Base stats 6-6-6-8
- **Uncommon** (40%): Base stats 9-9-9-11
- **Rare** (15%): Base stats 12-11-11-14
- **Epic** (4%): Base stats 15-14-13-17
- **Legendary** (1%): Base stats 18-16-15-20

### Classes (6 Core)

Each class mapped to an element:

1. **Warrior** (Earth) - Tank/Protector
2. **Ranger** (Air) - Speed DPS
3. **Mage** (Fire) - Burst AoE
4. **Assassin** (Lightning) - Single-target killer
5. **Cleric** (Water) - Healer/Support
6. **Paladin** (Light) - Tank + Support

---

## 3️⃣ TEAM & DECK BUILDING

### Team Rules

- **Default size**: 3 cards
- **Max size**: 5 (unlocked in later updates)
- **Cost system**: Prevents balance abuse

### Team Cost Calculation

```
Card Cost = Base Cost (by rarity) + Level Bonus
Base Cost: Common=1, Uncommon=2, Rare=3, Epic=4, Legendary=5
Level Bonus = current_level / 2

Team Cost = sum of all card costs
```

### Team Cost Caps

- **Early Game**: 7 (prevents common+legendary combos)
- **Ranked PvP**: 9 (allows strategic builds)
- **Tournament**: 10+ (endgame flexibility)

### Example Valid Teams

```
Early Game (7 cap):
  Team A: Common Lv5 (2) + Uncommon Lv1 (2) + Rare Lv1 (3) = 7 ✓
  Team B: Epic Lv1 (4) + Common Lv1 (1) + Uncommon Lv5 (4) = 9 ✗ (over limit)

Ranked (9 cap):
  Team C: Rare Lv10 (8) + Common Lv1 (1) = 9 ✓
  Team D: Epic Lv5 (7) + Legendary Lv1 (5) = 12 ✗ (over limit)
```

---

## 4️⃣ BATTLE SYSTEM

### Battle Modes

#### A. Turn-Based (Skill-based)

- Players alternate turns
- Each turn: Choose 1 action per alive card
- Actions: Attack, Skill, Defend, Pass
- Speed determines action order
- Manual decision-making required

**Use case**: PvP tournaments, esports-lite

#### B. Auto-Battle (Scalable + Casual)

- Player sets up team + strategy
- System simulates entire battle
- Result committed onchain
- Fast resolution (~instant)
- No player interaction needed

**Use case**: Casual players, scaling matchmaking

### Battle Resolution (Simplified)

```
Winner = team_with_higher_total_score

Total Score = sum of (ATK + DEF + SPD + HP) for all cards
```

Advanced version (future):
- Turn-by-turn simulation
- Skill trees
- Environmental effects
- Multi-turn battles

### EXP Distribution

```
Base EXP per card = 50

Winner bonus = +30% = 75 EXP per card
Loser = 50 EXP per card (still earn)

All participating cards earn EXP
```

---

## 5️⃣ ELEMENTAL SYSTEM

### Synergies (Amplification)

When attacker's element is effective vs defender's element:

```
Lightning → Water   : +25% damage
Air → Fire          : +20% damage
Water → Fire        : +30% damage (dousing)
```

### Resistances (Opposition)

When defender resists attacker's element:

```
Light ↔ Dark        : +20% vs each other (balanced)
Earth ↔ Lightning   : -20% (attacker takes penalty)
```

### Damage Formula

```
Base Damage = (Attack × Skill Multiplier) - (Defense × 0.5)

With Elemental:
Damage = Base Damage × Elemental Multiplier × Defense Reduction

Example:
  Mage (Fire, ATK=15) attacks Cleric (Water, DEF=10)
  Base: (15 × 1.0) - (10 × 0.5) = 10
  Water resists Fire (resist factor 0.8): 10 × 0.8 = 8 damage dealt
  
  Lightning Assassin (ATK=16) attacks Water Ranger (DEF=9)
  Base: (16 × 1.0) - (9 × 0.5) = 11.5
  Lightning amplifies vs Water (+25%): 11.5 × 1.25 = 14.4 damage dealt
```

### Class Passives

```
Warrior (Earth)     : Resist Lightning damage (-20%)
Ranger (Air)        : +10% crit chance
Mage (Fire)         : Attack scales +1% per level (instead of base 3%)
Assassin (Lightning): +20% damage vs Water targets
Cleric (Water)      : Resist Fire damage (-20%)
Paladin (Light)     : Resist Dark damage (-20%)
```

---

## 6️⃣ CLASS DESIGN

### 🛡️ Warrior (Earth)

**Role**: Tank / Protector

| Stat | Value |
|------|-------|
| HP | Highest |
| Defense | High |
| Attack | Medium |
| Speed | Low |

**Passive**: Takes 20% less damage from Lightning

**Skills**:
- **Shield Wall**: +50% team defense for 1 turn
- **Taunt**: Force opponent to attack you next turn
- **Quake**: AoE damage + slow

---

### 🏹 Ranger (Air)

**Role**: Speed DPS

| Stat | Value |
|------|-------|
| Speed | Highest |
| Attack | Medium |
| HP | Medium |
| Defense | Low |

**Passive**: +10% crit chance

**Skills**:
- **Multi-shot**: 3 attacks in sequence
- **Gust Arrow**: Reduce opponent's next turn timing
- **Evasion Stance**: +30% dodge next attack

---

### 🔥 Mage (Fire)

**Role**: Burst AoE

| Stat | Value |
|------|-------|
| Attack | Highest |
| HP | Lowest |
| Defense | Low |
| Speed | Medium |

**Passive**: Damage scales harder with level (+1% per level)

**Skills**:
- **Fireball**: AoE damage (1.5× multiplier)
- **Flame Wall**: Damage all enemies next turn
- **Ignite**: DoT (Damage over Time) effect

---

### ⚡ Assassin (Lightning)

**Role**: Single-target killer

| Stat | Value |
|------|-------|
| Speed | Highest |
| Attack | Very High |
| HP | Low |
| Defense | Very Low |

**Passive**: +20% damage vs Water targets

**Skills**:
- **Backstab**: 2× damage critical strike
- **Chain Strike**: Hit same target twice
- **Shadowstep**: Guaranteed dodge next attack

---

### 💧 Cleric (Water)

**Role**: Healer / Support

| Stat | Value |
|------|-------|
| Defense | High |
| Attack | Medium |
| Speed | Medium |
| HP | Medium |

**Passive**: 20% Fire damage resistance

**Skills**:
- **Heal**: Restore HP (80% of own ATK)
- **Aqua Barrier**: Grant shield to team
- **Purify**: Remove debuffs

---

### 🌞 Paladin (Light)

**Role**: Tank + Support

| Stat | Value |
|------|-------|
| HP | Very High |
| Defense | Very High |
| Attack | Medium |
| Speed | Low |

**Passive**: 20% Dark damage resistance

**Skills**:
- **Radiant Strike**: High damage + heal self
- **Holy Aura**: +20% team defense + heal per turn
- **Judgment**: Single-target high damage

---

## 7️⃣ EXP & LEVELING

### Level Scaling

- **Levels**: 1-10 (extendable to 100+)
- **Stat growth**: +3% per level (2-5% range)
- **EXP required**: 100 + (current_level × 50)

### Level Milestones

| Level | Ascension | Unlocked |
|-------|-----------|----------|
| 1-4 | None | Basic gameplay |
| 5 | Stage 1 | New art variant, +stat multiplier |
| 6-9 | Stage 1 | Continued progression |
| 10 | Stage 2 | Premium art, max passive upgrades |

### Example Progression

```
Level 1: Base stats 6/6/6/8 (Common)
Level 5: Stats 6×1.15 ≈ 7/7/7/9 + Ascension 1 + New art
Level 10: Stats 6×1.30 ≈ 8/8/8/10 + Ascension 2 + Premium art

Battle Result:
  - Win: 50 EXP base + 30% bonus = 75 EXP per card
  - Loss: 50 EXP per card
  - Each card in team earns separate EXP
```

---

## 8️⃣ ONCHAIN vs OFFCHAIN

### ✅ Onchain (Immutable Record)

- **NFT minting** (CardFactory)
- **Battle results** (winner, loser, time)
- **EXP updates** (level, wins, losses)
- **Rewards** (who earned what)
- **Team cost verification** (anti-fraud)

### ⚡ Offchain (Fast UX)

- **Battle simulation** (auto-battle)
- **Matchmaking** (finding opponents)
- **UI state** (selected teams, animations)
- **Frontend validation** (checks before submission)
- **IPFS metadata** (card art, animations)

### Flow

```
User Action (Frontend)
  ↓
Validate (Frontend + Contract)
  ↓
Simulate Battle (Frontend/Server if auto)
  ↓
Generate Signature (User)
  ↓
Submit to Contract (Verified onchain)
  ↓
Emit Events (Battle complete)
  ↓
Update Frontend (Display results)
```

---

## 9️⃣ SMART CONTRACT INTERFACE

### CardFactory.sol

```solidity
// Card creation
function createCard(string memory name) external

// Card progression
function addCardExperience(uint256 cardId, uint256 expAmount, bool didWin) external

// Card merging
function mergeCards(uint256 cardId1, uint256 cardId2) external

// Getters
function getCard(uint256 cardId) external view returns (Card memory)
function getMyCards() external view returns (Card[] memory)
function getCardStats(uint256 cardId) external view returns (uint8 attack, uint8 defense, uint8 speed, uint8 hp)
```

### Duel.sol

```solidity
// Team management
function calculateTeamCost(uint256[] calldata cardIds) public view returns (uint256)

// Battle lifecycle
function createBattle(uint256[] calldata cardIds, BattleMode mode) external
function joinBattle(uint256 battleId, uint256[] calldata cardIds) external
function resolveBattle(uint256 battleId) external

// Utilities
function cancelBattle(uint256 battleId) external
function getBattle(uint256 battleId) external view returns (Battle memory)
function getUserActiveBattles(address user) external view returns (uint256[] memory)
```

---

## 🔟 FRONTEND COMPONENTS

### Core Components

```
BattlePage/
  ├── TeamBuilder
  │   ├── Card selection grid
  │   ├── Cost calculator
  │   └── Submit team button
  │
  ├── BattleList
  │   ├── Available battles
  │   ├── Join button
  │   └── Battle status
  │
  ├── BattleArena
  │   ├── Battle simulation view
  │   ├── Results display
  │   └── Rewards summary
  │
  └── CardDisplay
      ├── Card stats visualization
      ├── Rarity coloring
      ├── Level & record
      └── Selection state
```

### Utilities

- **elementalSystem.ts**: Damage calculations, synergies
- **combatFormula.ts**: Stats, crit, dodge, damage formulas
- **constants.ts**: Enums, game config, colors
- **types/game.ts**: TypeScript interfaces mirroring Solidity

---

## 🎯 WHY THIS DESIGN WORKS

✅ **Onchain-friendly** — No excessive storage, just stats + records
✅ **Scalable** — 1,000s of concurrent battles via auto-battle
✅ **Fair** — Team cost system prevents pay-to-win dominance
✅ **Fun** — Both casual (auto) and competitive (manual) modes
✅ **Grant-worthy** — Polished GDD, clear technical roadmap
✅ **Extensible** — Easy to add Dark class, tournaments, Farcaster

---

## 🚀 NEXT STEPS

1. **V1 Deployment**
   - Deploy CardFactory + Duel to Celo
   - Update ABI files in frontend
   - Update contract addresses in constants

2. **Frontend Integration**
   - Connect wagmi hooks to contract calls
   - Implement battle simulation engine
   - Deploy to Vercel/similar

3. **Farcaster Integration** (Optional)
   - Wrap as miniapp frame
   - Embed battle invites in casts
   - Share battle results

4. **Late Game Content**
   - Dark class + late-game meta
   - Tournament system
   - Guild/team features
   - Cosmetic marketplace

---

**Built with 🔥 for Celo**

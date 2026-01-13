# 🎮 CELO CARD GAME - V1 IMPLEMENTATION GUIDE

This guide walks you through the complete implementation of the polished PvP Card RPG on Celo.

---

## 📦 WHAT'S INCLUDED

### Smart Contracts (Solidity)

**CardFactory.sol** - Card NFT management
- ✅ Enum-based card system (Class, Element, Rarity)
- ✅ Immutable identity + mutable progression
- ✅ Level system with EXP tracking
- ✅ Ascension stages (Level 5, 10)
- ✅ Card merging with rarity promotion

**Duel.sol** - PvP battle system
- ✅ Team-based battles (3-5 cards)
- ✅ Team cost calculation & validation
- ✅ Two battle modes (Turn-Based, Auto-Battle)
- ✅ Battle resolution with EXP rewards
- ✅ Cost caps by game mode (Early=7, Ranked=9, Tournament=10)

### Frontend Components (React + TypeScript)

**CardDisplay.tsx** - Card visualization
- Shows card identity, progression, and stats
- Compact and detailed view modes
- Rarity coloring and level display
- Selectable for team building

**TeamBuilder.tsx** - Team composition UI
- Visual card selector
- Real-time team cost calculation
- Cost limit validation
- Team preview with card names
- Submit button with validation

**BattlePage.tsx** - Main battle hub
- Wallet connection required
- Card loading from contract
- Battle mode selector
- Two-column layout (builder + available battles)
- Integration with BattleArena and BattleList

### Game Logic (Utilities)

**elementalSystem.ts** - Elemental effects
- Synergy table (Lightning→Water, Air→Fire, etc.)
- Opposition resistances
- Class passives and advantages
- Damage calculation with elements

**combatFormula.ts** - Battle math
- Base damage calculation
- Crit chance & dodge calculations
- Stat scaling with level & ascension
- Team power scoring
- Healing & DoT calculations

**levelingSystem.ts** - Progression mechanics
- EXP requirements per level
- Level-up detection & cascading
- Ascension stage tracking
- Stat growth calculations
- Power rating for matchmaking

**constants.ts** - Game configuration
- Enum mappings (Class, Element, Rarity)
- Game balance constants
- UI colors and descriptions
- Team cost limits

### Types

**types/game.ts** - TypeScript interfaces
- Mirrors Solidity structures
- Full type safety for contracts
- UI component prop types

---

## 🚀 DEPLOYMENT CHECKLIST

### 1. Deploy Smart Contracts

```bash
# Compile
forge build

# Deploy CardFactory
forge create contracts/CardFactory.sol:CardFactory \
  --rpc-url https://forno.celo.org \
  --private-key YOUR_PRIVATE_KEY

# Deploy Duel (pass CardFactory address)
forge create contracts/Duel.sol:Duel \
  --rpc-url https://forno.celo.org \
  --private-key YOUR_PRIVATE_KEY \
  --constructor-args <CARD_FACTORY_ADDRESS>
```

### 2. Update Contract Addresses

Edit `frontend/src/utils/constants.ts`:

```typescript
export const CARD_FACTORY_ADDRESS = "0x..." as const;
export const DUEL_ADDRESS = "0x..." as const;
```

### 3. Generate ABIs (if needed)

```bash
# Copy ABI files to frontend/src/abi/
cp out/CardFactory.sol/CardFactory.json frontend/src/abi/CardFactory.ts
cp out/Duel.sol/Duel.json frontend/src/abi/Duel.ts
```

Update imports in constants.ts if paths change.

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install wagmi viem @rainbow-me/rainbowkit
npm run dev
```

### 5. Connect Wallet

Frontend should auto-detect Celo network via Wagmi. Ensure user's wallet is set to Celo Mainnet.

---

## 🎯 FEATURE WALKTHROUGH

### Card Minting

```typescript
// User mints a card
await cardFactory.createCard("Flameburst");

// Smart contract:
// 1. Generates random Class (0-5)
// 2. Generates random Element (0-6)
// 3. Generates random Rarity (weighted distribution)
// 4. Assigns base stats based on rarity
// 5. Sets Level 1, 0 EXP, 0 wins/losses
// 6. Stores in contract state
```

### Team Building

```typescript
// User selects 3 cards
const team = [cardId1, cardId2, cardId3];

// Frontend calculates team cost
const cost = await duel.calculateTeamCost(team);
// Returns: 2 + 3 + 3 = 8

// Contract validates
require(cost <= EARLY_GAME_TEAM_COST_CAP); // Must be ≤ 7
// ✓ Valid team
```

### Starting Battle

```typescript
// Player 1 creates battle with team + mode
await duel.createBattle([card1, card2, card3], BattleMode.AutoBattle);

// Battle is "WaitingForOpponent" status
// Other players can see this battle in BattleList

// Player 2 joins with their team
await duel.joinBattle(battleId, [card4, card5, card6]);

// Battle status → "InProgress"
```

### Auto-Battle Resolution

```typescript
// Frontend simulates full battle
const winner = autoSimulateBattle(team1, team2);
// Returns: address of winner

// Contract resolves and awards EXP
await duel.resolveBattle(battleId);

// All cards in winning team get 75 EXP
// All cards in losing team get 50 EXP

// Cards may level up:
// Level 1 + 75 EXP → Level 2 (75 of 150 EXP needed)
```

### Card Leveling

```typescript
// Onchain tracking:
card.progression = {
  level: 1,
  exp: 75,
  wins: 1,
  losses: 0,
  ascensionStage: 0
}

// Frontend calculates stats:
const stats = await cardFactory.getCardStats(cardId);
// {attack: 8, defense: 7, speed: 7, hp: 9}
// (base 6/6/6/8 × 1.03 for level 2)

// At Level 5:
// - Automatically unlock Ascension Stage 1
// - Stat multiplier becomes 1.15 (base × 1.15)
// - New art available
```

---

## 🎨 UI COMPONENT USAGE

### Display a Card

```typescript
import { CardDisplay } from './CardDisplay';

<CardDisplay
  card={myCard}
  stats={calculatedStats}
  showDetails
  selectable
  isSelected={isSelected}
  onSelect={(id) => addToTeam(id)}
/>
```

### Build a Team

```typescript
import { TeamBuilder } from './TeamBuilder';

<TeamBuilder
  availableCards={myCards}
  onTeamSelected={(cardIds) => createBattle(cardIds)}
  maxTeamSize={3}
  costLimit={7}
/>
```

### Main Battle Hub

```typescript
import BattlePage from './BattlePage';

<BattlePage /> // Handles everything
```

---

## ⚙️ GAME BALANCE PARAMETERS

All configurable in `constants.ts`:

| Parameter | Value | Purpose |
|-----------|-------|---------|
| EARLY_GAME_TEAM_COST_CAP | 7 | Prevents new player frustration |
| RANKED_TEAM_COST_CAP | 9 | Allows mid-game flexibility |
| BASE_EXP_REWARD | 50 | Base battle rewards |
| WIN_BONUS_PERCENT | 30 | Incentivizes winning |
| Rarity Weights | 40/40/15/4/1 | Distribution (Common→Legendary) |

### Tuning Example

**Problem**: Players feel weak at Level 1

**Solution**: Increase base stats

```solidity
// In CardFactory._getBaseStatsByRarity()
if (rarity == Rarity.Common) {
    return (8, 8, 8, 10); // ↑ was (6, 6, 6, 8)
}
```

---

## 🔗 INTEGRATION WITH EXISTING CODE

### MyCards Component

Update `MyCards.tsx` to use CardDisplay:

```typescript
import { CardDisplay } from './CardDisplay';
import { Card as CardType } from '../types/game';

export function MyCards() {
  const [cards, setCards] = useState<CardType[]>([]);

  // ... fetch cards ...

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map(card => (
        <CardDisplay key={Number(card.id)} card={card} />
      ))}
    </div>
  );
}
```

### BattleList Component

Already integrated in BattlePage, shows available battles:

```typescript
<BattleList
  onJoinBattle={(battleId) => setActiveBattleId(battleId)}
  currentUserTeamIds={selectedTeam || []}
/>
```

### Start Duel Component

Replace with TeamBuilder:

```typescript
// Old: One card vs one card
// New: Full team-based system
<TeamBuilder onTeamSelected={handleTeamSelected} />
```

---

## 🧪 TESTING

### Contract Testing

```bash
forge test test/CardFactory.t.sol -v
forge test test/Duel.t.sol -v
```

### Frontend Testing

```bash
cd frontend
npm run test
```

---

## 📊 DATA STRUCTURES

### Card on-contract

```solidity
Card {
  id: 1,
  owner: 0x123...,
  name: "Flameburst",
  identity: CardIdentity {
    class: 2,           // Mage
    element: 2,         // Fire
    rarity: 2,          // Rare
    baseAttack: 12,
    baseDefense: 11,
    baseSpeed: 11,
    baseHP: 14,
    skillSetId: 3
  },
  progression: CardProgression {
    level: 5,
    exp: 30,
    wins: 3,
    losses: 1,
    ascensionStage: 1,
    cosmicMetadataPointer: 0
  }
}
```

### Battle on-contract

```solidity
Battle {
  id: 42,
  challenger: 0xABC...,
  opponent: 0xDEF...,
  challengerTeam: [1, 2, 3],      // Card IDs
  opponentTeam: [7, 8, 9],
  status: 1,                       // InProgress
  mode: 1,                         // AutoBattle
  winner: 0xABC...,
  createdAt: 1704067200,
  challengerRewardsCollected: false,
  opponentRewardsCollected: false
}
```

---

## 🐛 TROUBLESHOOTING

### Cards not loading

1. Check contract addresses in constants
2. Verify user wallet is connected
3. Ensure user has cards (mint first)
4. Check browser console for errors

### Team cost miscalculation

1. Verify `calculateTeamCost` matches contract logic
2. Check rarity indexing (0-4)
3. Ensure level bonus formula matches: `level / 2`

### Battle not resolving

1. Check both players have cards
2. Ensure team costs ≤ limit
3. Verify battle status (must be InProgress)
4. Check contract event logs

---

## 📈 NEXT FEATURES (V2+)

- [ ] Turn-based manual combat UI
- [ ] Skill system with 3 moves per class
- [ ] Ranked ladder & ELO rating
- [ ] Tournament brackets
- [ ] Farcaster frame integration
- [ ] Dark class + late-game content
- [ ] Card cosmetics marketplace
- [ ] Guild system
- [ ] Seasonal passes

---

## 📝 REFERENCES

- **Game Design Doc**: See `ARCHITECTURE.md`
- **Contract ABI**: `frontend/src/abi/`
- **Type Definitions**: `frontend/src/types/game.ts`
- **Game Constants**: `frontend/src/utils/constants.ts`
- **Celo Docs**: https://docs.celo.org

---

**Built with 🔥 for Celo. Ship it! 🚀**

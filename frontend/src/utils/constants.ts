import { celo } from "wagmi/chains";
import { duelAbi } from "../abi/Duel";
import { cardFactoryAbi } from "../abi/CardFactory";

// ✅ CELO MAINNET CONFIG
export const CHAIN = celo;

// 🧱 CONTRACT ADDRESSES (update these with your deployed ones on Celo Mainnet)
export const CARD_FACTORY_ADDRESS = "0x12cDb3CA65736FD7bAAd207bB097Dd503612e881" as const;
export const DUEL_ADDRESS = "0xfcEFA436EDdc33DbaA962Db48D797f7F034f47A8" as const;

// 📜 CONTRACT ABIs
export const CARD_FACTORY_ABI = cardFactoryAbi;
export const DUEL_ABI = duelAbi;

// � CARD MAPPINGS
export const CLASS_NAMES = [
  "Warrior",
  "Mage",
  "Rogue",
  "Paladin",
  "Hunter"
] as const;

export const ELEMENT_NAMES = [
  "Fire",
  "Water",
  "Earth",
  "Air",
  "Light",
  "Dark"
] as const;

export const RARITY_NAMES = [
  "Common",
  "Rare",
  "Epic",
  "Legendary"
] as const;

// �🌐 NETWORK URLs
export const CELO_RPC_URL = "https://forno.celo.org";
export const CELO_EXPLORER_URL = "https://celoscan.io";

// 🪙 APP INFO
export const APP_NAME = "Celo Duel Cards";
export const APP_DESCRIPTION = "Mint and battle NFTs on the Celo Mainnet.";

// 🔗 Explorer shortcuts
export const CARD_FACTORY_LINK = `${CELO_EXPLORER_URL}/address/${CARD_FACTORY_ADDRESS}`;
export const DUEL_LINK = `${CELO_EXPLORER_URL}/address/${DUEL_ADDRESS}`;

// ⚙️ Gas settings (tuned for mainnet)
export const GAS_CONFIG = {
  gas: 300_000n,
  gasPrice: 500_000_000n
};

export const CONTRACTS = {
  cardFactory: CARD_FACTORY_ADDRESS,
  duel: DUEL_ADDRESS,
};

// ============ GAME ENUMS ============

/**
 * Card Classes (synced with Solidity enum)
 */
export const CARD_CLASSES = {
  0: "Warrior",     // Tank / Protector
  1: "Ranger",      // Speed DPS
  2: "Mage",        // Burst AoE
  3: "Assassin",    // Single-target killer
  4: "Cleric",      // Healer / Support
  5: "Paladin"      // Tank + Support
} as const;

export type CardClass = keyof typeof CARD_CLASSES;

/**
 * Card Elements
 */
export const CARD_ELEMENTS = {
  0: "Earth",
  1: "Air",
  2: "Fire",
  3: "Lightning",
  4: "Water",
  5: "Light",
  6: "Dark"
} as const;

export type CardElement = keyof typeof CARD_ELEMENTS;

/**
 * Card Rarity Tiers
 */
export const CARD_RARITIES = {
  0: "Common",
  1: "Uncommon",
  2: "Rare",
  3: "Epic",
  4: "Legendary"
} as const;

export type CardRarity = keyof typeof CARD_RARITIES;

/**
 * Rarity colors for UI
 */
export const RARITY_COLORS = {
  Common: "gray",
  Uncommon: "green",
  Rare: "blue",
  Epic: "purple",
  Legendary: "yellow"
} as const;

/**
 * Class descriptions
 */
export const CLASS_DESCRIPTIONS = {
  Warrior: {
    role: "Tank / Protector",
    stats: "High HP, High Defense",
    passive: "Damage reduction vs Lightning"
  },
  Ranger: {
    role: "Speed DPS",
    stats: "High Speed, Medium Attack",
    passive: "Bonus crit chance"
  },
  Mage: {
    role: "Burst AoE",
    stats: "Very high attack, low HP",
    passive: "Damage scales harder with level"
  },
  Assassin: {
    role: "Single-target killer",
    stats: "High speed, high crit",
    passive: "Bonus vs Water targets"
  },
  Cleric: {
    role: "Healer / Support",
    stats: "Balanced",
    passive: "Fire damage resistance"
  },
  Paladin: {
    role: "Tank + Support",
    stats: "Very high HP/Defense",
    passive: "Bonus vs Dark"
  }
} as const;

/**
 * Elemental synergies (amplification & resistance)
 */
export const ELEMENTAL_SYNERGIES = {
  // Amplification (attacker -> defender = boost)
  "Lightning->Water": 0.25,
  "Air->Fire": 0.20,
  "Water->Fire": 0.30,
  
  // Resistance (attacker -> defender = penalty)
  "Light<->Dark": 0.20,
  "Earth<->Lightning": 0.20
} as const;

/**
 * Team cost limits by game mode
 */
export const TEAM_COST_LIMITS = {
  EarlyGame: 7,
  RankedPvP: 9,
  Tournament: 10
} as const;

/**
 * Battle modes
 */
export const BATTLE_MODES = {
  0: "Turn-Based",
  1: "Auto-Battle"
} as const;

/**
 * Battle status
 */
export const BATTLE_STATUS = {
  0: "Waiting for Opponent",
  1: "In Progress",
  2: "Completed"
} as const;

// ✂️ Helper: shorten wallet addresses
export const shortenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;


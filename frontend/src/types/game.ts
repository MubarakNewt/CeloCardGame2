/**
 * Game Types
 * Mirrors Solidity structures for frontend consistency
 */

// ============ ENUMS ============

export enum CardClass {
  Warrior = 0,
  Ranger = 1,
  Mage = 2,
  Assassin = 3,
  Cleric = 4,
  Paladin = 5
}

export enum CardElement {
  Earth = 0,
  Air = 1,
  Fire = 2,
  Lightning = 3,
  Water = 4,
  Light = 5,
  Dark = 6
}

export enum CardRarity {
  Common = 0,
  Uncommon = 1,
  Rare = 2,
  Epic = 3,
  Legendary = 4
}

export enum BattleMode {
  TurnBased = 0,
  AutoBattle = 1
}

export enum BattleStatus {
  WaitingForOpponent = 0,
  InProgress = 1,
  Completed = 2
}

// ============ CARD TYPES ============

export interface CardIdentity {
  class: CardClass;
  element: CardElement;
  rarity: CardRarity;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  baseHP: number;
  skillSetId: bigint;
}

export interface CardProgression {
  level: bigint;
  exp: bigint;
  wins: bigint;
  losses: bigint;
  ascensionStage: number;
  cosmicMetadataPointer: bigint;
}

export interface Card {
  id: bigint;
  owner: string;
  name: string;
  identity: CardIdentity;
  progression: CardProgression;
}

export interface SimpleCard {
  id: bigint;
  name: string;
  class: number;
  element: number;
  rarity: number;
  level: bigint;
  wins: bigint;
  losses: bigint;
}

// ============ BATTLE TYPES ============

export interface Team {
  cardIds: bigint[];
  totalTeamCost: bigint;
}

export interface Battle {
  id: bigint;
  challenger: string;
  opponent: string;
  challengerTeam: Team;
  opponentTeam: Team;
  status: BattleStatus;
  mode: BattleMode;
  winner: string;
  createdAt: bigint;
  challengerRewardsCollected: boolean;
  opponentRewardsCollected: boolean;
}

// ============ COMBAT STATS ============

export interface CardStats {
  attack: number;
  defense: number;
  speed: number;
  hp: number;
}

// ============ UI HELPERS ============

export interface CardDisplayProps {
  card: Card;
  stats?: CardStats;
  showDetails?: boolean;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: (cardId: bigint) => void;
}

export interface BattleDisplayProps {
  battle: Battle;
  cards?: {
    challenger: Card[];
    opponent: Card[];
  };
  isParticipant?: boolean;
}

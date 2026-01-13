// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CardFactory
 * @dev Manages card NFT creation, leveling, and progression
 * 
 * Design Principles:
 * - Immutable identity (class, element, base stats, rarity)
 * - Mutable progression (level, exp, wins/losses, ascension)
 * - Onchain storage of stats only (no strings)
 * - Enums for efficient storage
 */

contract CardFactory {
    // ============ ENUMS ============
    
    enum Class {
        Warrior,    // 0 - Tank / Protector
        Ranger,     // 1 - Speed DPS
        Mage,       // 2 - Burst AoE
        Assassin,   // 3 - Single-target killer
        Cleric,     // 4 - Healer / Support
        Paladin     // 5 - Tank + Support
    }

    enum Element {
        Earth,      // 0
        Air,        // 1
        Fire,       // 2
        Lightning,  // 3
        Water,      // 4
        Light,      // 5
        Dark        // 6
    }

    enum Rarity {
        Common,     // 0
        Uncommon,   // 1
        Rare,       // 2
        Epic,       // 3
        Legendary   // 4
    }

    // ============ STRUCTURES ============

    /**
     * @dev Immutable card identity (set at mint)
     */
    struct CardIdentity {
        Class class;
        Element element;
        Rarity rarity;
        uint8 baseAttack;
        uint8 baseDefense;
        uint8 baseSpeed;
        uint8 baseHP;
        uint256 skillSetId;  // Points to skill configuration
    }

    /**
     * @dev Mutable card progression (changes over time)
     */
    struct CardProgression {
        uint256 level;           // 1-max
        uint256 exp;             // Current EXP towards next level
        uint256 wins;            // Total wins
        uint256 losses;          // Total losses
        uint8 ascensionStage;    // 0-2 (unlocked at lvl 5, 10)
        uint256 cosmicMetadataPointer;  // Points to art evolution metadata
    }

    /**
     * @dev Complete card state
     */
    struct Card {
        uint256 id;
        address owner;
        string name;
        CardIdentity identity;
        CardProgression progression;
    }

    /**
     * @dev Simplified card struct for frontend
     */
    struct SimpleCard {
        uint256 id;
        string name;
        uint8 class;
        uint8 element;
        uint8 rarity;
        uint256 level;
        uint256 wins;
        uint256 losses;
    }

    // ============ STATE ============

    uint256 public cardCount;
    
    mapping(uint256 => Card) public cards;
    mapping(address => uint256[]) public ownerToCards;

    // ============ EVENTS ============

    event CardCreated(
        uint256 indexed id,
        address indexed owner,
        Class indexed classType,
        Element element,
        Rarity rarity,
        string name
    );

    event CardLeveledUp(
        uint256 indexed cardId,
        uint256 newLevel,
        uint8 ascensionStage
    );

    event CardProgressed(
        uint256 indexed cardId,
        uint256 expGained,
        uint256 totalWins,
        uint256 totalLosses
    );

    event CardsMerged(
        uint256 indexed newCardId,
        address indexed owner,
        Class classType,
        Element element,
        Rarity rarity,
        string newName
    );

    // ============ CONSTRUCTOR ============

    constructor() {
        cardCount = 0;
    }

    // ============ MINT / CREATE ============

    /**
     * @notice Mint a new card with randomized class, element, and rarity
     * @param name Player-given card name
     */
    function createCard(string memory name) external {
        cardCount++;
        uint256 newCardId = cardCount;

        // Generate randomized class, element, and rarity
        (Class cardClass, Element cardElement, Rarity cardRarity) = _generateRandomCard(newCardId);

        // Get base stats from rarity
        (uint8 atk, uint8 def, uint8 spd, uint8 hp) = _getBaseStatsByRarity(cardRarity);

        // Create identity
        CardIdentity memory identity = CardIdentity({
            class: cardClass,
            element: cardElement,
            rarity: cardRarity,
            baseAttack: atk,
            baseDefense: def,
            baseSpeed: spd,
            baseHP: hp,
            skillSetId: _getSkillSetIdForClass(cardClass)
        });

        // Create progression (level 1, zero exp, zero wins/losses)
        CardProgression memory progression = CardProgression({
            level: 1,
            exp: 0,
            wins: 0,
            losses: 0,
            ascensionStage: 0,
            cosmicMetadataPointer: 0
        });

        // Store card
        cards[newCardId] = Card({
            id: newCardId,
            owner: msg.sender,
            name: name,
            identity: identity,
            progression: progression
        });

        ownerToCards[msg.sender].push(newCardId);

        emit CardCreated(
            newCardId,
            msg.sender,
            cardClass,
            cardElement,
            cardRarity,
            name
        );
    }

    /**
     * @dev Generate random class, element, and rarity
     */
    function _generateRandomCard(uint256 cardId) internal view returns (Class, Element, Rarity) {
        uint256 seed1 = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, cardId)));
        uint256 seed2 = uint256(keccak256(abi.encodePacked(block.prevrandao, msg.sender, cardId)));
        uint256 seed3 = uint256(keccak256(abi.encodePacked(block.number, msg.sender, cardId)));

        Class randomClass = Class(seed1 % 6);
        Element randomElement = Element(seed2 % 7);
        Rarity randomRarity = _generateRarity(seed3);

        return (randomClass, randomElement, randomRarity);
    }

    /**
     * @dev Rarity distribution: weighted probability
     */
    function _generateRarity(uint256 seed) internal pure returns (Rarity) {
        uint256 roll = seed % 100;

        if (roll < 1) return Rarity.Legendary;     // 1%
        if (roll < 5) return Rarity.Epic;          // 4%
        if (roll < 20) return Rarity.Rare;         // 15%
        if (roll < 60) return Rarity.Uncommon;     // 40%
        return Rarity.Common;                       // 40%
    }

    /**
     * @dev Get base stats from rarity tier
     */
    function _getBaseStatsByRarity(Rarity rarity) internal pure returns (uint8 atk, uint8 def, uint8 spd, uint8 hp) {
        if (rarity == Rarity.Legendary) {
            return (18, 16, 15, 20);
        } else if (rarity == Rarity.Epic) {
            return (15, 14, 13, 17);
        } else if (rarity == Rarity.Rare) {
            return (12, 11, 11, 14);
        } else if (rarity == Rarity.Uncommon) {
            return (9, 9, 9, 11);
        }
        // Common
        return (6, 6, 6, 8);
    }

    /**
     * @dev Get skill set ID based on class (for later skill system)
     */
    function _getSkillSetIdForClass(Class classType) internal pure returns (uint256) {
        // 1-indexed for distinction from null
        if (classType == Class.Warrior) return 1;
        if (classType == Class.Ranger) return 2;
        if (classType == Class.Mage) return 3;
        if (classType == Class.Assassin) return 4;
        if (classType == Class.Cleric) return 5;
        if (classType == Class.Paladin) return 6;
        return 0; // fallback (shouldn't happen)
    }

    // ============ PROGRESSION ============

    /**
     * @notice Add EXP to a card (called by battle contract)
     * @param cardId Card to progress
     * @param expAmount EXP to add
     * @param didWin Whether card's owner won the battle
     */
    function addCardExperience(uint256 cardId, uint256 expAmount, bool didWin) external {
        require(cards[cardId].id != 0, "Card does not exist");
        
        Card storage card = cards[cardId];
        card.progression.exp += expAmount;

        if (didWin) {
            card.progression.wins++;
        } else {
            card.progression.losses++;
        }

        // Check for level up
        _checkLevelUp(cardId);

        emit CardProgressed(
            cardId,
            expAmount,
            card.progression.wins,
            card.progression.losses
        );
    }

    /**
     * @dev Check if card has enough EXP to level up
     */
    function _checkLevelUp(uint256 cardId) internal {
        Card storage card = cards[cardId];
        uint256 expNeeded = _getExpForLevel(card.progression.level);

        if (card.progression.exp >= expNeeded) {
            card.progression.exp -= expNeeded;
            card.progression.level++;

            // Check for ascension unlock
            if (card.progression.level == 5 || card.progression.level == 10) {
                card.progression.ascensionStage++;
            }

            emit CardLeveledUp(
                cardId,
                card.progression.level,
                card.progression.ascensionStage
            );
        }
    }

    /**
     * @dev Get EXP required to reach next level (scaling formula)
     */
    function _getExpForLevel(uint256 currentLevel) internal pure returns (uint256) {
        // EXP needed scales: 100, 150, 200, 250, ...
        return 100 + (currentLevel * 50);
    }

    // ============ MERGE SYSTEM ============

    /**
     * @notice Merge two cards to create a stronger hybrid card
     * @param cardId1 First card (will be consumed)
     * @param cardId2 Second card (will be consumed)
     */
    function mergeCards(uint256 cardId1, uint256 cardId2) external {
        require(cards[cardId1].owner == msg.sender, "Not owner of card 1");
        require(cards[cardId2].owner == msg.sender, "Not owner of card 2");
        require(cardId1 != cardId2, "Cannot merge same card");

        Card storage card1 = cards[cardId1];
        Card storage card2 = cards[cardId2];

        // Randomly pick one of the two classes & elements
        Class mergedClass = (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 2 == 0)
            ? card1.identity.class
            : card2.identity.class;

        Element mergedElement = (uint256(keccak256(abi.encodePacked(block.prevrandao, msg.sender))) % 2 == 0)
            ? card1.identity.element
            : card2.identity.element;

        // New card is one rarity tier higher
        Rarity mergedRarity = Rarity(
            uint8(card1.identity.rarity) < uint8(card2.identity.rarity)
                ? uint8(card2.identity.rarity)
                : uint8(card1.identity.rarity)
        );
        if (uint8(mergedRarity) < 4) {
            mergedRarity = Rarity(uint8(mergedRarity) + 1);
        }

        string memory newName = string(abi.encodePacked(card1.name, "-", card2.name));

        // Create new merged card
        cardCount++;
        uint256 newCardId = cardCount;

        (uint8 atk, uint8 def, uint8 spd, uint8 hp) = _getBaseStatsByRarity(mergedRarity);

        CardIdentity memory identity = CardIdentity({
            class: mergedClass,
            element: mergedElement,
            rarity: mergedRarity,
            baseAttack: atk,
            baseDefense: def,
            baseSpeed: spd,
            baseHP: hp,
            skillSetId: _getSkillSetIdForClass(mergedClass)
        });

        CardProgression memory progression = CardProgression({
            level: 1,
            exp: 0,
            wins: 0,
            losses: 0,
            ascensionStage: 0,
            cosmicMetadataPointer: 0
        });

        cards[newCardId] = Card({
            id: newCardId,
            owner: msg.sender,
            name: newName,
            identity: identity,
            progression: progression
        });

        ownerToCards[msg.sender].push(newCardId);

        // Mark original cards as deleted (set owner to address(0))
        card1.owner = address(0);
        card2.owner = address(0);

        emit CardsMerged(
            newCardId,
            msg.sender,
            mergedClass,
            mergedElement,
            mergedRarity,
            newName
        );
    }

    // ============ GETTERS ============

    /**
     * @notice Get full card data
     */
    function getCard(uint256 cardId) external view returns (Card memory) {
        return cards[cardId];
    }

    /**
     * @notice Get all cards owned by caller
     */
    function getMyCards() external view returns (SimpleCard[] memory) {
        uint256[] memory myIds = ownerToCards[msg.sender];
        SimpleCard[] memory mySimpleCards = new SimpleCard[](myIds.length);
        for (uint256 i = 0; i < myIds.length; i++) {
            Card storage card = cards[myIds[i]];
            mySimpleCards[i] = SimpleCard({
                id: card.id,
                name: card.name,
                class: uint8(card.identity.class),
                element: uint8(card.identity.element),
                rarity: uint8(card.identity.rarity),
                level: card.progression.level,
                wins: card.progression.wins,
                losses: card.progression.losses
            });
        }
        return mySimpleCards;
    }

    /**
     * @notice Get cards owned by specific address
     */
    function getCardsByOwner(address owner) external view returns (Card[] memory) {
        uint256[] memory ids = ownerToCards[owner];
        Card[] memory ownerCards = new Card[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            ownerCards[i] = cards[ids[i]];
        }
        return ownerCards;
    }

    /**
     * @notice Get calculated stats for a card (base + level multiplier)
     */
    function getCardStats(uint256 cardId) external view returns (uint8 attack, uint8 defense, uint8 speed, uint8 hp) {
        Card memory card = cards[cardId];
        require(card.id != 0, "Card does not exist");

        // Stat growth: +2-5% per level
        uint256 levelMultiplier = 100 + (card.progression.level * 3);

        attack = (card.identity.baseAttack * uint8(levelMultiplier)) / 100;
        defense = (card.identity.baseDefense * uint8(levelMultiplier)) / 100;
        speed = (card.identity.baseSpeed * uint8(levelMultiplier)) / 100;
        hp = (card.identity.baseHP * uint8(levelMultiplier)) / 100;

        return (attack, defense, speed, hp);
    }
}

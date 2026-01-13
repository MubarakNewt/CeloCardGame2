// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CardFactory.sol";

/**
 * @title Duel
 * @dev Team-based PvP battle contract with elemental and cost mechanics
 * 
 * Design:
 * - Teams of 3 cards (expandable to 5 later)
 * - Team Cost system prevents whale dominance
 * - Elemental synergies and resistances applied
 * - Battle resolution with EXP rewards
 * - Supports both turn-based and auto-battle modes
 */

contract Duel {
    CardFactory public factory;

    // ============ CONSTANTS ============
    
    uint256 constant EARLY_GAME_TEAM_COST_CAP = 7;
    uint256 constant RANKED_TEAM_COST_CAP = 9;
    uint256 constant TOURNAMENT_TEAM_COST_CAP = 10;

    uint256 constant BASE_EXP_REWARD = 50;
    uint256 constant WIN_BONUS_PERCENT = 30;  // 30% bonus for winner

    // ============ ENUMS ============

    enum BattleStatus {
        WaitingForOpponent,  // 0
        InProgress,          // 1
        Completed            // 2
    }

    enum BattleMode {
        TurnBased,           // 0 - Manual play
        AutoBattle           // 1 - Simulated
    }

    // ============ STRUCTURES ============

    struct Team {
        uint256[] cardIds;      // 3-5 card IDs
        uint256 totalTeamCost;  // Sum of card costs
    }

    struct Battle {
        uint256 id;
        address challenger;
        address opponent;
        Team challengerTeam;
        Team opponentTeam;
        BattleStatus status;
        BattleMode mode;
        address winner;
        uint256 createdAt;
        bool challengerRewardsCollected;
        bool opponentRewardsCollected;
    }

    // ============ STATE ============

    uint256 public battleCount;
    mapping(uint256 => Battle) public battles;
    mapping(address => uint256[]) public userActiveBattles;

    // ============ EVENTS ============

    event BattleCreated(
        uint256 indexed battleId,
        address indexed challenger,
        uint256[] challengerTeam,
        BattleMode mode
    );

    event BattleJoined(
        uint256 indexed battleId,
        address indexed opponent,
        uint256[] opponentTeam
    );

    event BattleResolved(
        uint256 indexed battleId,
        address indexed winner,
        address indexed loser,
        uint256 expAwarded
    );

    event BattleCancelled(uint256 indexed battleId);

    event RewardsCollected(
        uint256 indexed battleId,
        address indexed player,
        uint256[] cardIds,
        uint256 totalExpAwarded
    );

    // ============ MODIFIERS ============

    modifier validTeam(uint256[] memory cardIds) {
        require(cardIds.length >= 1 && cardIds.length <= 5, "Team must have 1-5 cards");
        _;
    }

    modifier battleExists(uint256 battleId) {
        require(battleId > 0 && battleId <= battleCount, "Battle does not exist");
        _;
    }

    // ============ CONSTRUCTOR ============

    constructor(address _factory) {
        factory = CardFactory(_factory);
    }

    // ============ TEAM CREATION ============

    /**
     * @notice Calculate team cost for a set of cards
     * @param cardIds Array of card IDs
     */
    function calculateTeamCost(uint256[] calldata cardIds) public view returns (uint256) {
        uint256 totalCost = 0;

        for (uint256 i = 0; i < cardIds.length; i++) {
            CardFactory.Card memory card = factory.getCard(cardIds[i]);
            require(card.id != 0, "Card does not exist");

            // Cost = base cost (by rarity) + level modifier
            uint256 baseCost = _getCostByRarity(card.identity.rarity);
            uint256 levelBonus = card.progression.level / 2; // 1 level = ~0.5 cost
            totalCost += baseCost + levelBonus;
        }

        return totalCost;
    }

    /**
     * @dev Get base team cost by card rarity
     */
    function _getCostByRarity(CardFactory.Rarity rarity) internal pure returns (uint256) {
        if (rarity == CardFactory.Rarity.Legendary) return 5;
        if (rarity == CardFactory.Rarity.Epic) return 4;
        if (rarity == CardFactory.Rarity.Rare) return 3;
        if (rarity == CardFactory.Rarity.Uncommon) return 2;
        return 1; // Common
    }

    // ============ BATTLE CREATION ============

    /**
     * @notice Start a new battle
     * @param cardIds Team of cards (3-5)
     * @param mode TurnBased or AutoBattle
     */
    function createBattle(
        uint256[] calldata cardIds,
        BattleMode mode
    ) external validTeam(cardIds) {
        // Verify ownership
        for (uint256 i = 0; i < cardIds.length; i++) {
            CardFactory.Card memory card = factory.getCard(cardIds[i]);
            require(card.owner == msg.sender, "You don't own all cards in team");
        }

        // Check team cost
        uint256 teamCost = calculateTeamCost(cardIds);
        require(teamCost <= EARLY_GAME_TEAM_COST_CAP, "Team cost exceeds limit");

        // Create battle
        battleCount++;
        uint256 newBattleId = battleCount;

        Team memory challengerTeam;
        challengerTeam.cardIds = cardIds;
        challengerTeam.totalTeamCost = teamCost;

        battles[newBattleId] = Battle({
            id: newBattleId,
            challenger: msg.sender,
            opponent: address(0),
            challengerTeam: challengerTeam,
            opponentTeam: Team(new uint256[](0), 0),
            status: BattleStatus.WaitingForOpponent,
            mode: mode,
            winner: address(0),
            createdAt: block.timestamp,
            challengerRewardsCollected: false,
            opponentRewardsCollected: false
        });

        userActiveBattles[msg.sender].push(newBattleId);

        emit BattleCreated(newBattleId, msg.sender, cardIds, mode);
    }

    /**
     * @notice Join an existing battle
     * @param battleId Battle to join
     * @param cardIds Your team of cards
     */
    function joinBattle(
        uint256 battleId,
        uint256[] calldata cardIds
    ) external battleExists(battleId) validTeam(cardIds) {
        Battle storage b = battles[battleId];
        require(b.status == BattleStatus.WaitingForOpponent, "Battle not available");
        require(b.challenger != msg.sender, "Cannot join your own battle");

        // Verify ownership
        for (uint256 i = 0; i < cardIds.length; i++) {
            CardFactory.Card memory card = factory.getCard(cardIds[i]);
            require(card.owner == msg.sender, "You don't own all cards in team");
        }

        // Check team cost
        uint256 teamCost = calculateTeamCost(cardIds);
        require(teamCost <= EARLY_GAME_TEAM_COST_CAP, "Team cost exceeds limit");

        // Set opponent team
        Team memory opponentTeam;
        opponentTeam.cardIds = cardIds;
        opponentTeam.totalTeamCost = teamCost;

        b.opponent = msg.sender;
        b.opponentTeam = opponentTeam;
        b.status = BattleStatus.InProgress;

        userActiveBattles[msg.sender].push(battleId);

        emit BattleJoined(battleId, msg.sender, cardIds);
    }

    // ============ BATTLE RESOLUTION ============

    /**
     * @notice Resolve battle and determine winner
     * Simplified: winner = sum of all card stats highest
     * @param battleId Battle to resolve
     */
    function resolveBattle(uint256 battleId) external battleExists(battleId) {
        Battle storage b = battles[battleId];
        require(b.status == BattleStatus.InProgress, "Battle not in progress");
        require(b.opponent != address(0), "No opponent");

        // Calculate battle score for both teams
        uint256 challengerScore = _calculateTeamScore(b.challengerTeam);
        uint256 opponentScore = _calculateTeamScore(b.opponentTeam);

        address winner = challengerScore >= opponentScore ? b.challenger : b.opponent;
        address loser = winner == b.challenger ? b.opponent : b.challenger;

        b.winner = winner;
        b.status = BattleStatus.Completed;

        // Calculate EXP
        uint256 baseExp = BASE_EXP_REWARD;
        uint256 winnerExp = baseExp + (baseExp * WIN_BONUS_PERCENT / 100);
        uint256 loserExp = baseExp;

        // Award EXP to all cards
        _awardBattleRewards(b.challengerTeam, winner == b.challenger ? winnerExp : loserExp, winner == b.challenger);
        _awardBattleRewards(b.opponentTeam, winner == b.opponent ? winnerExp : loserExp, winner == b.opponent);

        emit BattleResolved(battleId, winner, loser, winnerExp);
    }

    /**
     * @dev Calculate total power score for a team
     */
    function _calculateTeamScore(Team memory team) internal view returns (uint256) {
        uint256 totalScore = 0;

        for (uint256 i = 0; i < team.cardIds.length; i++) {
            (uint8 atk, uint8 def, uint8 spd, uint8 hp) = factory.getCardStats(team.cardIds[i]);
            totalScore += atk + def + spd + hp;
        }

        return totalScore;
    }

    /**
     * @dev Award EXP to all cards in a team after battle
     */
    function _awardBattleRewards(Team memory team, uint256 expPerCard, bool didWin) internal {
        for (uint256 i = 0; i < team.cardIds.length; i++) {
            factory.addCardExperience(team.cardIds[i], expPerCard, didWin);
        }
    }

    /**
     * @notice Cancel a battle (if waiting for opponent or expired)
     */
    function cancelBattle(uint256 battleId) external battleExists(battleId) {
        Battle storage b = battles[battleId];
        require(
            b.challenger == msg.sender || b.opponent == msg.sender,
            "Only battle participants can cancel"
        );
        require(b.status != BattleStatus.Completed, "Cannot cancel completed battle");
        require(
            b.status == BattleStatus.WaitingForOpponent || block.timestamp > b.createdAt + 1 hours,
            "Battle must be waiting or older than 1 hour"
        );

        b.status = BattleStatus.Completed;
        emit BattleCancelled(battleId);
    }

    // ============ GETTERS ============

    /**
     * @notice Get full battle data
     */
    function getBattle(uint256 battleId) external view battleExists(battleId) returns (Battle memory) {
        return battles[battleId];
    }

    /**
     * @notice Get active battles for a player
     */
    function getUserActiveBattles(address user) external view returns (uint256[] memory) {
        return userActiveBattles[user];
    }

    /**
     * @notice Get detailed team info
     */
    function getTeamCards(uint256 battleId, bool isChallengerTeam) external view battleExists(battleId) returns (CardFactory.Card[] memory) {
        Battle storage b = battles[battleId];
        Team memory team = isChallengerTeam ? b.challengerTeam : b.opponentTeam;
        
        CardFactory.Card[] memory teamCards = new CardFactory.Card[](team.cardIds.length);
        for (uint256 i = 0; i < team.cardIds.length; i++) {
            teamCards[i] = factory.getCard(team.cardIds[i]);
        }
        return teamCards;
    }
}

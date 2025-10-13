// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CardFactory.sol";

contract Duel {
    CardFactory public factory;

    struct Battle {
        address challenger;
        address opponent;
        uint256 challengerCardId;
        uint256 opponentCardId;
        bool isActive;
        address winner;
    }

    mapping(uint256 => Battle) public battles;
    uint256 public battleCount;

    event BattleStarted(uint256 indexed battleId, address indexed challenger, address indexed opponent);
    event BattleJoined(uint256 indexed battleId, address indexed opponent);
    event BattleResolved(uint256 indexed battleId, address winner, uint256 challengerPower, uint256 opponentPower);

    constructor(address _factory) {
        factory = CardFactory(_factory);
    }

    /// @notice Start a new battle
    function startBattle(uint256 challengerCardId) external {
        CardFactory.Card memory challengerCard = factory.getCard(challengerCardId);
        require(challengerCard.owner == msg.sender, "You don't own this card");

        battleCount++;
        battles[battleCount] = Battle({
            challenger: msg.sender,
            opponent: address(0),
            challengerCardId: challengerCardId,
            opponentCardId: 0,
            isActive: true,
            winner: address(0)
        });

        emit BattleStarted(battleCount, msg.sender, address(0));
    }

    /// @notice Join an existing battle as the opponent
    function joinBattle(uint256 battleId, uint256 opponentCardId) external {
        Battle storage b = battles[battleId];
        require(b.isActive, "Battle not active");
        require(b.opponent == address(0), "Battle already joined");
        require(b.challenger != msg.sender, "You cannot join your own battle");

        CardFactory.Card memory opponentCard = factory.getCard(opponentCardId);
        require(opponentCard.owner == msg.sender, "You don't own this card");

        b.opponent = msg.sender;
        b.opponentCardId = opponentCardId;

        emit BattleJoined(battleId, msg.sender);
    }

    /// @notice Resolve a battle and pick a winner based on power
    function resolveBattle(uint256 battleId) external {
        Battle storage b = battles[battleId];
        require(b.isActive, "Battle already resolved");
        require(b.opponent != address(0), "No opponent yet");

        CardFactory.Card memory card1 = factory.getCard(b.challengerCardId);
        CardFactory.Card memory card2 = factory.getCard(b.opponentCardId);

        require(card1.owner == b.challenger && card2.owner == b.opponent, "Card ownership changed");

        address winner = card1.power >= card2.power ? b.challenger : b.opponent;

        b.isActive = false;
        b.winner = winner;

        emit BattleResolved(battleId, winner, card1.power, card2.power);
    }

    function getBattle(uint256 id) external view returns (Battle memory) {
        return battles[id];
    }
}

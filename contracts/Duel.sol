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
    event BattleResolved(uint256 indexed battleId, address winner, uint256 challengerPower, uint256 opponentPower);

    constructor(address _factory) {
        factory = CardFactory(_factory);
    }

    /// @notice Start a new battle
    function startBattle(address opponent, uint256 challengerCardId, uint256 opponentCardId) external {
        (
            uint256 id1,
            ,
            ,
            address owner1
        ) = factory.cards(challengerCardId);

        (
            uint256 id2,
            ,
            ,
            address owner2
        ) = factory.cards(opponentCardId);

        require(owner1 == msg.sender, "You don't own the challenger card");
        require(owner2 == opponent, "Opponent doesn't own that card");

        battleCount++;
        battles[battleCount] = Battle({
            challenger: msg.sender,
            opponent: opponent,
            challengerCardId: challengerCardId,
            opponentCardId: opponentCardId,
            isActive: true,
            winner: address(0)
        });

        emit BattleStarted(battleCount, msg.sender, opponent);
    }

    /// @notice Resolve a battle and pick a winner based on power
    function resolveBattle(uint256 battleId) external {
        Battle storage b = battles[battleId];
        require(b.isActive, "Battle already resolved");

        ( , , uint256 power1, address owner1) = factory.cards(b.challengerCardId);
        ( , , uint256 power2, address owner2) = factory.cards(b.opponentCardId);

        require(owner1 == b.challenger && owner2 == b.opponent, "Card ownership changed");

        address winner = power1 >= power2 ? b.challenger : b.opponent;

        b.isActive = false;
        b.winner = winner;

        emit BattleResolved(battleId, winner, power1, power2);
    }

    function getBattle(uint256 id) external view returns (Battle memory) {
        return battles[id];
    }
}

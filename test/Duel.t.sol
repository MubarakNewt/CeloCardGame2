// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/CardFactory.sol";
import "../contracts/Duel.sol";

contract DuelTest is Test {
    CardFactory factory;
    Duel duel;

    function setUp() public {
        factory = new CardFactory();
        duel = new Duel(address(factory));

        // ✅ Mint two cards (new version only takes one string argument)
        factory.createCard("Lion");
        factory.createCard("Tiger");
    }

    function testStartAndResolve() public {
        // ✅ Start a new battle
        duel.startBattle(1);

        // ✅ Join the battle
        duel.joinBattle(1, 2);

        // ✅ Resolve the battle
        duel.resolveBattle(1);

        // ✅ Fetch the stored struct properly
        Duel.Battle memory battle = duel.getBattle(1);

        // Assertions
        assertEq(battle.challenger, address(this), "Challenger should be msg.sender");
        assertEq(battle.challengerCardId, 1, "Challenger card ID mismatch");
        assertEq(battle.opponentCardId, 2, "Opponent card ID mismatch");
        assertFalse(battle.isActive, "Battle should be resolved");
        assertTrue(battle.winner != address(0), "Winner should be set");
    }
}

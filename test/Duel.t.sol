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
        factory.createCard("Lion", 8);
        factory.createCard("Tiger", 5);
    }

    function testStartAndResolve() public {
        uint256 battleId = duel.startDuel(1, 2);
        duel.resolveDuel(battleId);
        (,, address winner, bool resolved) = duel.battles(battleId);
        assertTrue(resolved);
        assertEq(winner, address(this));
    }
}

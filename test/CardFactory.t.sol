// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/CardFactory.sol";

contract CardFactoryTest is Test {
    CardFactory factory;

    function setUp() public {
        factory = new CardFactory();
    }

    function testCreateCard() public {
        factory.createCard("Dragon");
        CardFactory.Card[] memory cards = factory.getMyCards();
        assertEq(cards.length, 1);

        // Power is random, so we only assert range
        assertGe(cards[0].power, 20);
        assertLe(cards[0].power, 100);
    }

    function testMergeCards() public {
        factory.createCard("Fire");
        factory.createCard("Ice");
        factory.mergeCards(1, 2);
        CardFactory.Card[] memory cards = factory.getMyCards();

        // We now expect 3 total cards (original 2 + merged)
        assertEq(cards.length, 3);
    }
}

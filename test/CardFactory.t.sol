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

        // Check base attack is within expected range for any rarity
        assertGe(cards[0].identity.baseAttack, 6);  // Common minimum
        assertLe(cards[0].identity.baseAttack, 18); // Legendary maximum
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

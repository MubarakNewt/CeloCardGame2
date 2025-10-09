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
        factory.createCard("Dragon", 10);
        CardFactory.Card[] memory cards = factory.getMyCards();
        assertEq(cards.length, 1);
        assertEq(cards[0].power, 10);
    }

    function testMergeCards() public {
        factory.createCard("Fire", 4);
        factory.createCard("Ice", 6);
        factory.mergeCards(1, 2);
        CardFactory.Card[] memory cards = factory.getMyCards();
        assertEq(cards.length, 3);
    }
}

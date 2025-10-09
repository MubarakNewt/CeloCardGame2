// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CardFactory {
    uint256 public cardCount;

    struct Card {
        uint256 id;
        string name;
        uint256 power;
        address owner;
    }

    mapping(uint256 => Card) public cards;
    mapping(address => uint256[]) public ownerToCards;

    event CardCreated(uint256 indexed id, string name, uint256 power, address owner);
    event CardsMerged(uint256 indexed newCardId, string newName, uint256 newPower);

    constructor() {
        cardCount = 0;
    }

    /// @notice Create a new card
    function createCard(string memory name, uint256 power) public {
        cardCount++;
        cards[cardCount] = Card(cardCount, name, power, msg.sender);
        ownerToCards[msg.sender].push(cardCount);
        emit CardCreated(cardCount, name, power, msg.sender);
    }

    /// @notice Merge two cards you own to create a stronger one
    function mergeCards(uint256 cardId1, uint256 cardId2) public {
        require(cards[cardId1].owner == msg.sender, "Not owner of card 1");
        require(cards[cardId2].owner == msg.sender, "Not owner of card 2");
        require(cardId1 != cardId2, "Cannot merge same card");

        string memory newName = string(abi.encodePacked(cards[cardId1].name, "-", cards[cardId2].name));
        uint256 newPower = (cards[cardId1].power + cards[cardId2].power) / 2 + 1;

        // ✅ Use internal helper function
        _createMergedCard(newName, newPower);
    }

    /// @dev Internal helper used only within the contract
    function _createMergedCard(string memory newName, uint256 newPower) internal {
        cardCount++;
        cards[cardCount] = Card(cardCount, newName, newPower, msg.sender);
        ownerToCards[msg.sender].push(cardCount);
        emit CardsMerged(cardCount, newName, newPower);
    }

    function getMyCards() external view returns (Card[] memory) {
        uint256[] memory myIds = ownerToCards[msg.sender];
        Card[] memory myCards = new Card[](myIds.length);
        for (uint256 i = 0; i < myIds.length; i++) {
            myCards[i] = cards[myIds[i]];
        }
        return myCards;
    }
}

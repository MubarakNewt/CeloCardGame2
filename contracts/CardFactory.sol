// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CardFactory {
    uint256 public cardCount;

    struct Card {
        uint256 id;
        string name;
        string classType;   // Warrior, Mage, etc.
        string element;     // Fire, Water, etc.
        uint256 power;
        address owner;
        uint256 wins;
        uint256 losses;
    }

    mapping(uint256 => Card) public cards;
    mapping(address => uint256[]) public ownerToCards;

    event CardCreated(
        uint256 indexed id,
        string name,
        string classType,
        string element,
        uint256 power,
        address owner
    );

    event CardsMerged(
        uint256 indexed newCardId,
        string newName,
        string classType,
        string element,
        uint256 newPower,
        address owner
    );

    // 🔹 Available warrior classes and elements
    string[] internal classTypes = [
        "Warrior",
        "Mage",
        "Rogue",
        "Archer",
        "Tank",
        "Paladin",
        "Necromancer"
    ];

    string[] internal elements = [
        "Fire",
        "Water",
        "Earth",
        "Air",
        "Light",
        "Dark",
        "Lightning"
    ];

    constructor() {
        cardCount = 0;
    }

    /// @notice Mint a new random card with class, element, and rarity-based power
    function createCard(string memory name) public {
        cardCount++;

        uint256 randClass = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, cardCount))
        ) % classTypes.length;

        uint256 randElement = uint256(
            keccak256(abi.encodePacked(block.prevrandao, msg.sender, cardCount))
        ) % elements.length;

        uint256 power = getRandomPower(msg.sender, cardCount);

        cards[cardCount] = Card({
            id: cardCount,
            name: name,
            classType: classTypes[randClass],
            element: elements[randElement],
            power: power,
            owner: msg.sender,
            wins: 0,
            losses: 0
        });

        ownerToCards[msg.sender].push(cardCount);

        emit CardCreated(
            cardCount,
            name,
            classTypes[randClass],
            elements[randElement],
            power,
            msg.sender
        );
    }

    /// @notice Merge two cards you own to create a stronger hybrid one
    function mergeCards(uint256 cardId1, uint256 cardId2) public {
        require(cards[cardId1].owner == msg.sender, "Not owner of card 1");
        require(cards[cardId2].owner == msg.sender, "Not owner of card 2");
        require(cardId1 != cardId2, "Cannot merge same card");

        // Randomly pick one of the two classTypes & elements
        string memory mergedClass = (uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        ) % 2 == 0)
            ? cards[cardId1].classType
            : cards[cardId2].classType;

        string memory mergedElement = (uint256(
            keccak256(abi.encodePacked(block.prevrandao, msg.sender))
        ) % 2 == 0)
            ? cards[cardId1].element
            : cards[cardId2].element;

        string memory newName = string(
            abi.encodePacked(cards[cardId1].name, "-", cards[cardId2].name)
        );

        // average their power and give a small boost
        uint256 newPower = (cards[cardId1].power + cards[cardId2].power) / 2 + 5;

        _createMergedCard(newName, mergedClass, mergedElement, newPower);
    }

    /// @dev Internal helper used only within the contract
    function _createMergedCard(
        string memory newName,
        string memory classType,
        string memory element,
        uint256 newPower
    ) internal {
        cardCount++;

        cards[cardCount] = Card({
            id: cardCount,
            name: newName,
            classType: classType,
            element: element,
            power: newPower,
            owner: msg.sender,
            wins: 0,
            losses: 0
        });

        ownerToCards[msg.sender].push(cardCount);

        emit CardsMerged(cardCount, newName, classType, element, newPower, msg.sender);
    }

    function getMyCards() external view returns (Card[] memory) {
    uint256[] memory myIds = ownerToCards[msg.sender];
    Card[] memory myCards = new Card[](myIds.length);
    for (uint256 i = 0; i < myIds.length; i++) {
        myCards[i] = cards[myIds[i]];
    }
    return myCards;
}

/// ✅ New getter that returns the full struct
function getCard(uint256 cardId) external view returns (Card memory) {
    return cards[cardId];
}


    // 🔥 Probability-based power generator (20–100 with rarity)
    function getRandomPower(address user, uint256 id) internal view returns (uint256) {
        uint256 rand = uint256(keccak256(abi.encodePacked(user, id, block.timestamp, block.prevrandao))) % 100;

        if (rand < 1) return _randomRange(90, 100); // 1% chance – Legendary
        if (rand < 5) return _randomRange(80, 89);  // 4% chance – Epic
        if (rand < 20) return _randomRange(65, 79); // 15% chance – Rare
        if (rand < 60) return _randomRange(50, 64); // 40% chance – Uncommon
        return _randomRange(20, 49);                // 40% chance – Common
    }

    function _randomRange(uint256 min, uint256 max) internal view returns (uint256) {
        return
            (uint256(
                keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender))
            ) % (max - min + 1)) + min;
    }
}

export const cardFactoryAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addCardExperience",
    "inputs": [
      {
        "name": "cardId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "expAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "didWin",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "cardCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "cards",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "identity",
        "type": "tuple",
        "internalType": "struct CardFactory.CardIdentity",
        "components": [
          {
            "name": "class",
            "type": "uint8",
            "internalType": "enum CardFactory.Class"
          },
          {
            "name": "element",
            "type": "uint8",
            "internalType": "enum CardFactory.Element"
          },
          {
            "name": "rarity",
            "type": "uint8",
            "internalType": "enum CardFactory.Rarity"
          },
          {
            "name": "baseAttack",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "baseDefense",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "baseSpeed",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "baseHP",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "skillSetId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "progression",
        "type": "tuple",
        "internalType": "struct CardFactory.CardProgression",
        "components": [
          {
            "name": "level",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "exp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "wins",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "losses",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "ascensionStage",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "cosmicMetadataPointer",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "createCard",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getCard",
    "inputs": [
      {
        "name": "cardId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct CardFactory.Card",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "owner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "identity",
            "type": "tuple",
            "internalType": "struct CardFactory.CardIdentity",
            "components": [
              {
                "name": "class",
                "type": "uint8",
                "internalType": "enum CardFactory.Class"
              },
              {
                "name": "element",
                "type": "uint8",
                "internalType": "enum CardFactory.Element"
              },
              {
                "name": "rarity",
                "type": "uint8",
                "internalType": "enum CardFactory.Rarity"
              },
              {
                "name": "baseAttack",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "baseDefense",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "baseSpeed",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "baseHP",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "skillSetId",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "progression",
            "type": "tuple",
            "internalType": "struct CardFactory.CardProgression",
            "components": [
              {
                "name": "level",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "exp",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "wins",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "losses",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "ascensionStage",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "cosmicMetadataPointer",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCardStats",
    "inputs": [
      {
        "name": "cardId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "attack",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "defense",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "speed",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "hp",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCardsByOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct CardFactory.Card[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "owner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "identity",
            "type": "tuple",
            "internalType": "struct CardFactory.CardIdentity",
            "components": [
              {
                "name": "class",
                "type": "uint8",
                "internalType": "enum CardFactory.Class"
              },
              {
                "name": "element",
                "type": "uint8",
                "internalType": "enum CardFactory.Element"
              },
              {
                "name": "rarity",
                "type": "uint8",
                "internalType": "enum CardFactory.Rarity"
              },
              {
                "name": "baseAttack",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "baseDefense",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "baseSpeed",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "baseHP",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "skillSetId",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "progression",
            "type": "tuple",
            "internalType": "struct CardFactory.CardProgression",
            "components": [
              {
                "name": "level",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "exp",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "wins",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "losses",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "ascensionStage",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "cosmicMetadataPointer",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMyCards",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct CardFactory.SimpleCard[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "class",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "element",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "rarity",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "level",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "wins",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "losses",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "mergeCards",
    "inputs": [
      {
        "name": "cardId1",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "cardId2",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "ownerToCards",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "CardCreated",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "classType",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum CardFactory.Class"
      },
      {
        "name": "element",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum CardFactory.Element"
      },
      {
        "name": "rarity",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum CardFactory.Rarity"
      },
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CardLeveledUp",
    "inputs": [
      {
        "name": "cardId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "newLevel",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "ascensionStage",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CardProgressed",
    "inputs": [
      {
        "name": "cardId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "expGained",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "totalWins",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "totalLosses",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CardsMerged",
    "inputs": [
      {
        "name": "newCardId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "classType",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum CardFactory.Class"
      },
      {
        "name": "element",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum CardFactory.Element"
      },
      {
        "name": "rarity",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum CardFactory.Rarity"
      },
      {
        "name": "newName",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  }
];

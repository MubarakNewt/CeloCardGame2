export const duelAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_factory",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "battleCount",
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
    "name": "battles",
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
        "name": "challenger",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "opponent",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "challengerTeam",
        "type": "tuple",
        "internalType": "struct Duel.Team",
        "components": [
          {
            "name": "cardIds",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "totalTeamCost",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "opponentTeam",
        "type": "tuple",
        "internalType": "struct Duel.Team",
        "components": [
          {
            "name": "cardIds",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "totalTeamCost",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "status",
        "type": "uint8",
        "internalType": "enum Duel.BattleStatus"
      },
      {
        "name": "mode",
        "type": "uint8",
        "internalType": "enum Duel.BattleMode"
      },
      {
        "name": "winner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "createdAt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "challengerRewardsCollected",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "opponentRewardsCollected",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "calculateTeamCost",
    "inputs": [
      {
        "name": "cardIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
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
    "type": "function",
    "name": "cancelBattle",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createBattle",
    "inputs": [
      {
        "name": "cardIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "mode",
        "type": "uint8",
        "internalType": "enum Duel.BattleMode"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "factory",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract CardFactory"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBattle",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Duel.Battle",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "challenger",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "opponent",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "challengerTeam",
            "type": "tuple",
            "internalType": "struct Duel.Team",
            "components": [
              {
                "name": "cardIds",
                "type": "uint256[]",
                "internalType": "uint256[]"
              },
              {
                "name": "totalTeamCost",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "opponentTeam",
            "type": "tuple",
            "internalType": "struct Duel.Team",
            "components": [
              {
                "name": "cardIds",
                "type": "uint256[]",
                "internalType": "uint256[]"
              },
              {
                "name": "totalTeamCost",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum Duel.BattleStatus"
          },
          {
            "name": "mode",
            "type": "uint8",
            "internalType": "enum Duel.BattleMode"
          },
          {
            "name": "winner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "createdAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "challengerRewardsCollected",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "opponentRewardsCollected",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTeamCards",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "isChallengerTeam",
        "type": "bool",
        "internalType": "bool"
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
    "name": "getUserActiveBattles",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "joinBattle",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "cardIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resolveBattle",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "userActiveBattles",
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
    "name": "BattleCancelled",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BattleCreated",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "challenger",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "challengerTeam",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "mode",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum Duel.BattleMode"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BattleJoined",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "opponent",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "opponentTeam",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BattleResolved",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "winner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "loser",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "expAwarded",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RewardsCollected",
    "inputs": [
      {
        "name": "battleId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "player",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "cardIds",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "totalExpAwarded",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];

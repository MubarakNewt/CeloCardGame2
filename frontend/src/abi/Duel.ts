export const duelAbi = [
  {
    inputs: [{ internalType: "address", name: "_factory", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "uint256", name: "challengerCardId", type: "uint256" }],
    name: "startBattle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "battleId", type: "uint256" },
      { internalType: "uint256", name: "opponentCardId", type: "uint256" },
    ],
    name: "joinBattle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "battleId", type: "uint256" }],
    name: "resolveBattle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getBattle",
    outputs: [
      {
        components: [
          { internalType: "address", name: "challenger", type: "address" },
          { internalType: "address", name: "opponent", type: "address" },
          { internalType: "uint256", name: "challengerCardId", type: "uint256" },
          { internalType: "uint256", name: "opponentCardId", type: "uint256" },
          { internalType: "bool", name: "isActive", type: "bool" },
          { internalType: "address", name: "winner", type: "address" },
        ],
        internalType: "struct Duel.Battle",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "battleCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "battleId", type: "uint256" },
      { indexed: true, internalType: "address", name: "challenger", type: "address" },
      { indexed: true, internalType: "address", name: "opponent", type: "address" },
    ],
    name: "BattleStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "battleId", type: "uint256" },
      { indexed: true, internalType: "address", name: "opponent", type: "address" },
    ],
    name: "BattleJoined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "battleId", type: "uint256" },
      { indexed: false, internalType: "address", name: "winner", type: "address" },
      { indexed: false, internalType: "uint256", name: "challengerPower", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "opponentPower", type: "uint256" },
    ],
    name: "BattleResolved",
    type: "event",
  },
] as const;

export default duelAbi;

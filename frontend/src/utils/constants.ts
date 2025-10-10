import { celo } from "wagmi/chains";
import duelAbi from "../abi/Duel";
import cardFactoryAbi from "../abi/CardFactory";

// ✅ CELO MAINNET CONFIG
export const CHAIN = celo;

// 🧱 CONTRACT ADDRESSES (update these with your deployed ones on Celo Mainnet)
export const CARD_FACTORY_ADDRESS = "0xb9bF073D5413Cb0e1938f0De05EFc2621Bb3AbD4" as const;
export const DUEL_ADDRESS = "0x9c8B984ebB7F957761906f7B3B5f63EBE414001D" as const;

// 📜 CONTRACT ABIs
export const CARD_FACTORY_ABI = cardFactoryAbi;
export const DUEL_ABI = duelAbi;

// 🌐 NETWORK URLs
export const CELO_RPC_URL = "https://forno.celo.org";
export const CELO_EXPLORER_URL = "https://celoscan.io";

// 🪙 APP INFO
export const APP_NAME = "Celo Duel Cards";
export const APP_DESCRIPTION = "Mint and battle NFTs on the Celo Mainnet.";

// 🔗 Explorer shortcuts
export const CARD_FACTORY_LINK = `${CELO_EXPLORER_URL}/address/${CARD_FACTORY_ADDRESS}`;
export const DUEL_LINK = `${CELO_EXPLORER_URL}/address/${DUEL_ADDRESS}`;

// ⚙️ Gas settings (tuned for mainnet)
export const GAS_CONFIG = {
  gas: 300_000n,          // safe default
  gasPrice: 500_000_000n  // 0.5 gwei (mainnet)
};

export const CONTRACTS = {
  cardFactory: CARD_FACTORY_ADDRESS,
  duel: DUEL_ADDRESS,
};


// ✂️ Helper: shorten wallet addresses
export const shortenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

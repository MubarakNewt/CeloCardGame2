// src/components/MyCards.tsx
import {
  useAccount,
  usePublicClient,
} from "wagmi";
import { cardFactoryAbi } from "../abi/CardFactory";
import { CARD_FACTORY_ADDRESS, CLASS_NAMES, ELEMENT_NAMES, RARITY_NAMES } from "../utils/constants";
import { formatCardPower } from "../utils/helpers";
import { Sword, Loader2, Layers } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { onEvent } from "../utils/globalEvents";

interface Card {
  id: bigint;
  name: string;
  class: number;
  element: number;
  rarity: number;
  level: bigint;
  wins: bigint;
  losses: bigint;
}

export const MyCards = ({
  onSelectCard,
}: {
  onSelectCard?: (cardId: number) => void;
}) => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch cards directly from getMyCards()
  const fetchCards = useCallback(async () => {
    if (!address || !publicClient) return;
    setLoading(true);

    try {
      const userCards = (await publicClient.readContract({
        address: CARD_FACTORY_ADDRESS as `0x${string}`,
        abi: cardFactoryAbi,
        functionName: "getMyCards",
        account: address, // ✅ include account to ensure context is correct
      })) as Card[];

      console.log("Fetched cards:", userCards);

      // ⚠️ Defensive: ensure `userCards` is an array before setting state
      if (Array.isArray(userCards)) {
        setCards(userCards);
      } else {
        console.warn("Unexpected data from getMyCards:", userCards);
        setCards([]);
      }
    } catch (err) {
      console.error("Failed to fetch cards:", err);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [address, publicClient]);

  // 🔁 Fetch on load + whenever wallet connects
  useEffect(() => {
    if (isConnected) {
      fetchCards();
    } else {
      setCards([]);
    }
  }, [isConnected, fetchCards]);

  // 👀 Watch for CardCreated and CardsMerged events
  // 👀 Watch for contract events via wagmi + manual event + fallback polling
useEffect(() => {
  if (!publicClient) return;

  // 1️⃣ wagmi live listener for CardCreated
  const unwatchCreated = publicClient.watchContractEvent({
    address: CARD_FACTORY_ADDRESS as `0x${string}`,
    abi: cardFactoryAbi,
    eventName: "CardCreated",
    onLogs: (logs) => {
      console.log("🟢 CardCreated detected via publicClient:", logs);
      setTimeout(fetchCards, 1500); // short delay for RPC sync
    },
  });

  // 2️⃣ wagmi live listener for CardsMerged
  const unwatchMerged = publicClient.watchContractEvent({
    address: CARD_FACTORY_ADDRESS as `0x${string}`,
    abi: cardFactoryAbi,
    eventName: "CardsMerged",
    onLogs: (logs) => {
      console.log("🟢 CardsMerged detected via publicClient:", logs);
      setTimeout(fetchCards, 1500);
    },
  });

  // 3️⃣ Fallback: listen for frontend-dispatched "cardMinted" event
  const localMintHandler = () => {
    console.log("💬 window cardMinted event – refetching cards");
    fetchCards();
  };
  window.addEventListener("cardMinted", localMintHandler);

  return () => {
    unwatchCreated?.();
    unwatchMerged?.();
    window.removeEventListener("cardMinted", localMintHandler);
  };
}, [publicClient, fetchCards]);


  // 💬 Handle global mint-completion refresh
  useEffect(() => {
    const handler = () => {
      console.log("window cardMinted event – refetching");
      fetchCards();
    };
    window.addEventListener("cardMinted", handler);
    return () => window.removeEventListener("cardMinted", handler);
  }, [fetchCards]);

  const handleCardClick = (cardId: number) => {
    setSelectedCardId(cardId);
    onSelectCard?.(cardId);
  };

  useEffect(() => {
  const unsubscribe = onEvent("cardsUpdated", () => {
    console.log("♻️ Received global cardsUpdated event — refreshing cards");
    fetchCards();
  });

  return unsubscribe;
}, [fetchCards]);

  // ---------------- RENDER SECTION ----------------

  if (!isConnected) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700 text-center text-slate-400">
        Connect your wallet to view your cards
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700 flex items-center justify-center gap-2 text-slate-400">
        <Loader2 className="animate-spin" size={20} />
        <span>Loading cards...</span>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700 text-center">
        <Layers className="mx-auto text-slate-600 mb-4" size={48} />
        <p className="text-slate-400">You don't have any cards yet</p>
        <p className="text-slate-500 text-sm mt-2">Mint your first card to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Layers className="text-blue-400" />
        My Cards ({cards.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.id.toString()}
            onClick={() => handleCardClick(Number(card.id))}
            className={`bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg p-6 border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl ${
              selectedCardId === Number(card.id)
                ? "border-green-500 shadow-green-500/50"
                : "border-slate-600 hover:border-slate-500"
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🃏</div>
              <h3 className="text-lg font-bold text-white mb-1">{card.name}</h3>
              <p className="text-sm text-slate-400 mb-2">
                {CLASS_NAMES[card.class] || "Unknown"} • {ELEMENT_NAMES[card.element] || "Unknown"} • {RARITY_NAMES[card.rarity] || "Unknown"}
              </p>
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Sword size={16} />
                <span className="font-semibold">Lv.{card.level.toString()}</span>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Wins: {card.wins.toString()} • Losses: {card.losses.toString()}
              </div>
              <div className="mt-1 text-xs text-slate-500">ID: #{card.id.toString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

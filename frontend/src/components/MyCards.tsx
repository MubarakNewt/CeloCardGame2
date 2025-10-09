// src/components/MyCards.tsx
import {
  useReadContract,
  useAccount,
  usePublicClient,
  useWatchContractEvent,
} from "wagmi";
import { cardFactoryAbi } from "../abi/CardFactory";
import { CARD_FACTORY_ADDRESS } from "../utils/constants";
import { formatCardPower } from "../utils/helpers";
import { Sword, Loader2, Layers } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Card {
  id: bigint;
  name: string;
  power: bigint;
  owner: string;
}

export const MyCards = ({
  onSelectCard,
}: {
  onSelectCard?: (cardId: number) => void;
}) => {
  console.log("MyCards render start");
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const { data: cardCount, refetch, isLoading, error: readError } = useReadContract({
    address: CARD_FACTORY_ADDRESS as `0x${string}`,
    abi: cardFactoryAbi,
    functionName: "cardCount",
  });

  useEffect(() => {
    console.log("cardCounter changed:", cardCount);
  }, [cardCount]);

  // ✅ fixed fetchCards logic
  const fetchCards = useCallback(async () => {
    console.log("fetchCards called", { cardCount, address });
    if (!cardCount || !address || !publicClient) return;

    const totalCards = Number(cardCount);
    const userCards: Card[] = [];

    for (let i = 1; i <= totalCards; i++) {
      try {
        const cardData = (await publicClient.readContract({
          address: CARD_FACTORY_ADDRESS as `0x${string}`,
          abi: cardFactoryAbi,
          functionName: "cards",
          args: [BigInt(i)],
        })) as [bigint, string, bigint, string];

        console.log(`Card ${i} data:`, cardData);

        const [id, name, power, owner] = cardData;

        if (owner.toLowerCase() === address.toLowerCase()) {
          userCards.push({ id, name, power, owner });
        }
      } catch (err) {
        console.error(`Failed to fetch card ${i}:`, err);
      }
    }

    console.log("Fetched userCards:", userCards.length);
    setCards(userCards);
  }, [cardCount, address, publicClient]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useWatchContractEvent({
    address: CARD_FACTORY_ADDRESS as `0x${string}`,
    abi: cardFactoryAbi,
    eventName: "CardCreated", // ✅ your event name in contract
    onLogs() {
      console.log("Detected CardCreated event — refetching");
      fetchCards();
      refetch?.();
    },
  });

  useEffect(() => {
    const handler = () => {
      console.log("window cardMinted event – refetching");
      fetchCards();
      refetch?.();
    };
    window.addEventListener("cardMinted", handler);
    return () => window.removeEventListener("cardMinted", handler);
  }, [fetchCards, refetch]);

  useEffect(() => {
    console.log("MyCards rendered with cards:", cards);
    console.log("Selected card ID:", selectedCardId);
  }, [cards, selectedCardId]);

  const handleCardClick = (cardId: number) => {
    setSelectedCardId(cardId);
    onSelectCard?.(cardId);
  };

  if (!isConnected) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700 text-center text-slate-400">
        Connect your wallet to view your cards
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700 flex items-center justify-center gap-2 text-slate-400">
        <Loader2 className="animate-spin" size={20} />
        <span>Loading cards...</span>
      </div>
    );
  }

  if (readError) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700 text-red-400">
        Failed to read from contract: {(readError as any)?.message ?? String(readError)}
      </div>
    );
  }

  if (!cardCount || cards.length === 0) {
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
              <h3 className="text-lg font-bold text-white mb-2">{card.name}</h3>
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Sword size={16} />
                <span className="font-semibold">{formatCardPower(card.power)}</span>
              </div>
              <div className="mt-3 text-xs text-slate-400">ID: #{card.id.toString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

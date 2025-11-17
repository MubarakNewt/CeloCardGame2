import { useState } from "react";
import { StartDuel } from "./StartDuel";
import { BattleArena } from "./BattleArena";

export default function BattlePage() {
  // 1️⃣ track the selected card
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  // 2️⃣ track the active battle once created
  const [activeBattleId, setActiveBattleId] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">Start a Duel</h1>

      {/* -- Example card selector -- */}
      <div className="flex gap-2">
        {[1, 2, 3].map((id) => (
          <button
            key={id}
            className={`px-3 py-2 rounded ${
              selectedCardId === id ? "bg-green-600" : "bg-gray-700"
            }`}
            onClick={() => setSelectedCardId(id)}
          >
            Select Card #{id}
          </button>
        ))}
      </div>

      {/* -- Start battle button -- */}
      <StartDuel
        selectedCardId={selectedCardId}
        onBattleCreated={(battleId) => setActiveBattleId(battleId)} 
      />

      {/* -- After creation, show arena -- */}
      {activeBattleId && (
        <BattleArena
          battleId={activeBattleId}
          onBack={() => setActiveBattleId(null)}
        />
      )}
    </div>
  );
}

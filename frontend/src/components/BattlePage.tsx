import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { SimpleCard, BattleMode } from "../types/game";
import { TeamBuilder } from "./TeamBuilder";
import { BattleArena } from "./BattleArena";
import { BattleList } from "./BattleList";

export default function BattlePage() {
  const { address, isConnected } = useAccount();

  // Game state
  const [myCards] = useState<SimpleCard[]>([]);
  const [_selectedTeam, setSelectedTeam] = useState<bigint[] | null>(null);
  const [activeBattleId, setActiveBattleId] = useState<number | null>(null);
  const [battleMode, setBattleMode] = useState<BattleMode>(BattleMode.AutoBattle);
  const [loading, setLoading] = useState(false);

  // Load user's cards when connected
  useEffect(() => {
    if (isConnected && address) {
      loadMyCards();
    }
  }, [isConnected, address]);

  const loadMyCards = async () => {
    try {
      setLoading(true);
      // TODO: Call factory contract to get user's cards
      // const cards = await factory.getMyCards();
      // setMyCards(cards);
    } catch (error) {
      console.error("Failed to load cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSelected = async (_cardIds: bigint[]) => {
    try {
      setLoading(true);
      // TODO: Call duel contract to create battle
      // const battleId = await duel.createBattle(_cardIds, battleMode);
      // setActiveBattleId(battleId);
      // setSelectedTeam(_cardIds);
    } catch (error) {
      console.error("Failed to create battle:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Connect your wallet to start battling</p>
      </div>
    );
  }

  // Show battle arena if active
  if (activeBattleId) {
    return (
      <BattleArena
        battleId={activeBattleId}
        onBack={() => {
          setActiveBattleId(null);
          setSelectedTeam(null);
          loadMyCards();
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">⚔️ Battle Arena</h1>
        <p className="text-gray-400">Build a team and challenge another player</p>
      </div>

      {/* Battle mode selector */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <p className="text-sm font-bold text-gray-300 mb-3">Battle Mode</p>
        <div className="flex gap-3">
          <button
            onClick={() => setBattleMode(BattleMode.TurnBased)}
            className={`px-4 py-2 rounded font-bold transition-all ${
              battleMode === BattleMode.TurnBased
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Turn-Based (Manual)
          </button>
          <button
            onClick={() => setBattleMode(BattleMode.AutoBattle)}
            className={`px-4 py-2 rounded font-bold transition-all ${
              battleMode === BattleMode.AutoBattle
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Auto-Battle (Simulated)
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {battleMode === BattleMode.TurnBased
            ? "⚡ Skill-based: You control every action"
            : "🤖 Fast & casual: Let the algorithm decide"}
        </p>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team builder */}
        <div>
          {loading ? (
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 text-center">
              <p className="text-gray-400">Loading cards...</p>
            </div>
          ) : myCards.length > 0 ? (
            <TeamBuilder
              availableCards={myCards}
              onTeamSelected={handleTeamSelected}
              maxTeamSize={3}
              disabled={loading}
            />
          ) : (
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 text-center">
              <p className="text-gray-400 mb-4">You don't have any cards yet</p>
              <a href="/mint" className="text-blue-400 hover:text-blue-300">
                Mint a card to get started
              </a>
            </div>
          )}
        </div>

        {/* Available battles */}
        <div>
          <BattleList
            onSelectBattle={(battleId) => setActiveBattleId(battleId)}
          />
        </div>
      </div>
    </div>
  );
}

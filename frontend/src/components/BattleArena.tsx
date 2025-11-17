import { useEffect, useState, useCallback } from "react";
import { usePublicClient, useWatchContractEvent } from "wagmi";
import { duelAbi } from "../abi/Duel";
import { DUEL_ADDRESS } from "../utils/constants";

export const BattleArena = ({
  battleId,
  onBack,
}: {
  battleId: number;
  onBack: () => void;
}) => {

  const publicClient = usePublicClient();
  const [battle, setBattle] = useState<any>(null);

  // Fetch battle using passed battleId
  const fetchBattle = useCallback(
    async (id: bigint) => {
      if (!publicClient) return;

      const battleData = await publicClient.readContract({
        address: DUEL_ADDRESS as `0x${string}`,
        abi: duelAbi,
        functionName: "getBattle",
        args: [id],
      });

      console.log("Fetched battle:", battleData);
      setBattle(battleData);
    },
    [publicClient]
  );

  // Fetch the battle as soon as the component loads
  useEffect(() => {
    if (battleId) {
      fetchBattle(BigInt(battleId));
    }
  }, [battleId, fetchBattle]);

  // Optional: watch for updates
  useWatchContractEvent({
    address: DUEL_ADDRESS as `0x${string}`,
    abi: duelAbi,
    eventName: "BattleJoined",
    onLogs: () => {
      fetchBattle(BigInt(battleId));
    },
  });

  useWatchContractEvent({
    address: DUEL_ADDRESS as `0x${string}`,
    abi: duelAbi,
    eventName: "BattleResolved",
    onLogs: () => {
      fetchBattle(BigInt(battleId));
    },
  });

  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 text-white">
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 bg-slate-600 rounded hover:bg-slate-500"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Battle Arena — Battle #{battleId}
      </h2>

      {battle ? (
        <div>
          <p>Challenger: {battle.challenger}</p>
          <p>Opponent: {battle.opponent || "Waiting..."}</p>
          <p>Active: {battle.isActive ? "Yes" : "No"}</p>
          {battle.winner !== "0x0000000000000000000000000000000000000000" && (
            <p className="text-green-400 mt-2">
              Winner: {battle.winner}
            </p>
          )}
        </div>
      ) : (
        <p className="text-slate-400">Loading battle...</p>
      )}
    </div>
  );
};

export default BattleArena;

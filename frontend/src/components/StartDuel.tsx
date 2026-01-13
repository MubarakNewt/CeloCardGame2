import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
  useWatchContractEvent,
} from "wagmi";
import { decodeEventLog } from "viem"; // 👈 ADD THIS
import { duelAbi } from "../abi/Duel";
import { DUEL_ADDRESS } from "../utils/constants";
import { Swords, Loader2 } from "lucide-react";

export const StartDuel = ({
  selectedCardId,
  onBattleCreated,
}: {
  selectedCardId: number | null;
  onBattleCreated?: (battleId: number) => void;
}) => {
  const { writeContract, data, isPending, isError, error } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [newBattleId, setNewBattleId] = useState<number | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!data) return;
    const maybeHash =
      typeof data === "string"
        ? (data as `0x${string}`)
        : (data as any)?.hash ?? (data as any)?.transactionHash;
    setTxHash(maybeHash);
  }, [data]);

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // ✅ decode logs with viem utility
  useEffect(() => {
    const fetchBattleId = async () => {
      if (!isSuccess || !txHash || !publicClient) return;
      try {
        const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
        const logs = receipt.logs
          .map((log) => {
            try {
              return decodeEventLog({
                abi: duelAbi,
                eventName: "BattleStarted",
                data: log.data,
                topics: log.topics,
              });
            } catch {
              return null;
            }
          })
          .filter(Boolean);

        if (logs.length > 0) {
          const last = logs[logs.length - 1];
          const battleId = Number((last as any).args?.battleId);
          console.log("🎯 BattleStarted detected:", battleId);
          setNewBattleId(battleId);
          if (onBattleCreated) onBattleCreated(battleId);
        } else {
          console.warn("⚠️ No BattleStarted event found");
        }
      } catch (err) {
        console.error("Error decoding logs:", err);
      }
    };

    fetchBattleId();
  }, [isSuccess, txHash, publicClient, onBattleCreated]);

  useWatchContractEvent({
    address: DUEL_ADDRESS as `0x${string}`,
    abi: duelAbi,
    eventName: "BattleStarted",
    onLogs: (logs: any[]) => {
      logs.forEach((log) => {
        const battleId = Number(log.args?.battleId);
        console.log("⚔️ Detected BattleStarted (live):", battleId);
        setNewBattleId(battleId);
        if (onBattleCreated) onBattleCreated(battleId);
      });
    },
  });

  const handleStartDuel = async () => {
    if (selectedCardId === null) {
      alert("Select a card first!");
      return;
    }
    try {
      await writeContract({
        address: DUEL_ADDRESS as `0x${string}`,
        abi: duelAbi,
        functionName: "createBattle",
        args: [[BigInt(selectedCardId)], 0], // 0 for TurnBased mode
      });
    } catch (err) {
      console.error("Start duel failed:", err);
    }
  };

  return (
    <div className="text-center space-y-4">
      <button
        onClick={handleStartDuel}
        className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-700 transition-colors"
        disabled={isPending || isConfirming}
      >
        {isPending || isConfirming ? (
          <span className="flex items-center gap-2 justify-center">
            <Loader2 className="animate-spin" />
            Starting Battle...
          </span>
        ) : (
          <span className="flex items-center gap-2 justify-center">
            <Swords />
            Start Battle
          </span>
        )}
      </button>

      {isSuccess && txHash && (
        <div className="p-3 bg-green-900/20 border border-green-500 rounded">
          <p className="text-green-200 text-sm">
            ✅ Battle started — tx confirmed!
          </p>
          {newBattleId && (
            <p className="text-green-400 mt-1 text-sm">
              Battle ID: #{newBattleId}
            </p>
          )}
        </div>
      )}

      {isError && (
        <div className="p-3 bg-red-900/20 border border-red-500 rounded">
          <p className="text-red-400 text-sm">
            {error?.message || "Failed to start battle"}
          </p>
        </div>
      )}
    </div>
  );
};

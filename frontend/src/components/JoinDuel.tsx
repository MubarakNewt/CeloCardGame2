import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { duelAbi } from "../abi/Duel";
import { DUEL_ADDRESS } from "../utils/constants";
import { getExplorerUrl } from "../utils/helpers";
import { Loader2, ExternalLink, UserPlus } from "lucide-react";

interface JoinDuelProps {
  selectedCardId: number | null;
  selectedBattleId?: number; // ✅ add this new prop
}

export const JoinDuel = ({ selectedCardId, selectedBattleId }: JoinDuelProps) => {
  const [battleId, setBattleId] = useState("");
  const { isConnected } = useAccount();
  const { writeContract, data, isPending, isError, error } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  // ✅ When a battle is selected from BattleList, auto-fill its ID
  useEffect(() => {
    if (selectedBattleId !== undefined) {
      setBattleId(String(selectedBattleId));
    }
  }, [selectedBattleId]);

  useEffect(() => {
    if (!data) return;
    const maybeHash =
      typeof data === "string"
        ? (data as `0x${string}`)
        : (data as any)?.hash ?? (data as any)?.transactionHash;

    if (maybeHash?.startsWith("0x")) {
      setTxHash(maybeHash as `0x${string}`);
    }

    console.log("writeContract data:", data, "-> txHash:", maybeHash);
  }, [data]);

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleJoin = async () => {
    if (!isConnected || selectedCardId === null || !battleId.trim()) return;
    try {
      await writeContract({
        address: DUEL_ADDRESS as `0x${string}`,
        abi: duelAbi,
        functionName: "joinBattle",
        args: [BigInt(battleId), BigInt(selectedCardId)],
      });
    } catch (err) {
      console.error("Join failed:", err);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
      <div className="mb-2 text-sm text-slate-400">Battle ID</div>

      <input
        value={battleId}
        onChange={(e) => setBattleId(e.target.value)}
        placeholder="Enter or select a battle ID"
        className="w-full px-3 py-2 mb-4 rounded bg-slate-700 text-white"
      />

      <button
        onClick={handleJoin}
        className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 transition"
        disabled={isPending || isConfirming}
      >
        {isPending || isConfirming ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" />
            Joining...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <UserPlus />
            Join
          </span>
        )}
      </button>

      {isSuccess && txHash && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded-lg">
          <p className="text-green-200 text-sm">
            Joined battle — tx confirmed.
          </p>
          <a
            href={getExplorerUrl(txHash)}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline flex items-center gap-1"
          >
            View tx
            <ExternalLink className="inline-block w-4 h-4" />
          </a>
        </div>
      )}

      {isError && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg">
          <p className="text-red-400 text-sm">
            {error?.message || "Failed to join battle"}
          </p>
        </div>
      )}
    </div>
  );
};

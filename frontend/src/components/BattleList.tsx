import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { duelAbi } from "../abi/Duel";
import { DUEL_ADDRESS } from "../utils/constants";
import { Swords, Loader2 } from "lucide-react";

export const BattleList = ({
  onSelectBattle,
}: {
  onSelectBattle: (battleId: number) => void;
}) => {
  const [battles, setBattles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchBattles = async () => {
      if (!publicClient) return;
      setLoading(true);
      try {
        // 1️⃣ Get the total number of battles
        const count = await publicClient.readContract({
          address: DUEL_ADDRESS as `0x${string}`,
          abi: duelAbi,
          functionName: "battleCount",
        });

        const ids = Array.from({ length: Number(count) }, (_, i) => i + 1);

        // 2️⃣ Fetch all battles in parallel
        const results = await Promise.all(
          ids.map(async (id) => {
            const b = await publicClient.readContract({
              address: DUEL_ADDRESS as `0x${string}`,
              abi: duelAbi,
              functionName: "getBattle",
              args: [BigInt(id)],
            });
            return { id, ...b };
          })
        );

        // 3️⃣ Filter only open battles (active + no opponent)
        const openBattles = results.filter(
          (b: any) =>
            b.isActive &&
            b.opponent === "0x0000000000000000000000000000000000000000"
        );

        setBattles(openBattles);
      } catch (err) {
        console.error("Error fetching battles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBattles();
  }, [publicClient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-slate-400">
        <Loader2 className="animate-spin mr-2" /> Loading open battles...
      </div>
    );
  }

  if (battles.length === 0) {
    return (
      <p className="text-slate-400 text-center py-6">
        No open battles yet. Be the first to start one!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {battles.map((b) => (
        <div
          key={b.id}
          className="bg-slate-800 border border-slate-700 p-4 rounded-lg flex items-center justify-between hover:border-emerald-500 transition"
        >
          <div>
            <p className="text-white font-semibold">Battle #{b.id}</p>
            <p className="text-slate-400 text-sm">
              Challenger: {b.challenger?.slice(0, 6)}...{b.challenger?.slice(-4)}
            </p>
          </div>
          <button
            onClick={() => onSelectBattle(b.id)}
            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-1"
          >
            <Swords size={16} />
            Join
          </button>
        </div>
      ))}
    </div>
  );
};

import React, { useState } from "react";
import { useWriteContract, usePublicClient } from "wagmi";
import { cardFactoryAbi } from "../abi/CardFactory";
import { CARD_FACTORY_ADDRESS } from "../utils/constants";
import { Loader2, CheckCircle } from "lucide-react";

// small delay helper
async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// poll receipt manually for better error handling
async function waitForReceiptWithPolling(publicClient: any, hash: `0x${string}`, {
  interval = 2000,
  timeout = 120_000,
} = {}) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const receipt = await publicClient.getTransactionReceipt({ hash });
      if (receipt) return receipt;
    } catch (err: any) {
      console.error("getTransactionReceipt error:", err);
      if (String(err).includes("400")) throw err;
    }
    await sleep(interval);
  }
  throw new Error("Timeout waiting for tx receipt");
}

export const MintCard: React.FC = () => {
  const [cardName, setCardName] = useState("");
  const [cardPower, setCardPower] = useState<bigint>(10n);
  const [busy, setBusy] = useState(false);
  const [successHash, setSuccessHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const handleMint = async () => {
    setError(null);
    if (!cardName.trim()) return setError("Enter a card name");
    if (cardPower <= 0) return setError("Power must be greater than 0");

    setBusy(true);
   try {
  // 🧠 Step 1: Simulate first — checks for reverts, invalid args, etc.
   if (!publicClient) throw new Error("Public client not ready");
  const simulation = await publicClient.simulateContract({
    address: CARD_FACTORY_ADDRESS as `0x${string}`,
    abi: cardFactoryAbi,
    functionName: "createCard",
    args: [cardName, cardPower],
    account: "0xE3F1864E378057c77064B50f948F08525C190157", // 👈 your connected wallet
  });

  console.log("Simulation successful:", simulation);

  // 🪙 Step 2: Now actually send the tx
  const txResponse = await writeContractAsync({
    address: CARD_FACTORY_ADDRESS as `0x${string}`,
    abi: cardFactoryAbi,
    functionName: "createCard",
    args: [cardName, cardPower],
  });


      const rawHash =
        typeof txResponse === "string"
          ? txResponse
          : (txResponse as any)?.hash ?? (txResponse as any)?.transactionHash;

      if (!rawHash) throw new Error("No tx hash returned from writeContract");
      const txHash = (rawHash as string).startsWith("0x")
        ? (rawHash as `0x${string}`)
        : (`0x${rawHash}` as `0x${string}`);

      console.log("writeContract data:", txHash);

      // Wait for confirmation
      const receipt = await waitForReceiptWithPolling(publicClient, txHash, {
        interval: 2000,
        timeout: 120_000,
      });

      console.log("tx receipt:", receipt);
      if ((receipt as any).status === 0) {
        setError("Transaction reverted on-chain.");
      } else {
        setSuccessHash(txHash);
        window.dispatchEvent(new Event("cardMinted"));
      }
    } catch (err: any) {
      console.error("Mint flow error:", err);
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  };

  

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
      <h3 className="text-white mb-3 text-lg font-semibold">Mint a New Card</h3>

      <div className="flex flex-col gap-3">
        <input
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Card name"
          className="w-full p-2 rounded bg-slate-700 text-white placeholder-gray-400"
        />

        <input
          type="number"
          value={cardPower.toString()} // ✅ convert bigint to string for input display
          onChange={(e) => setCardPower(BigInt(e.target.value || "0"))} // ✅ convert back to bigint
          className="w-full p-2 mb-3 rounded bg-slate-700 text-white"
        />

        <button
          onClick={handleMint}
          disabled={busy}
          className={`px-4 py-2 rounded text-white font-medium ${busy ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
        >
          {busy ? (
            <span className="flex items-center gap-2 justify-center">
              <Loader2 className="animate-spin" /> Minting...
            </span>
          ) : (
            "Mint Card"
          )}
        </button>

        {successHash && (
          <div className="mt-3 text-green-300 flex items-center gap-2">
            <CheckCircle /> Mint confirmed —{" "}
            {String(successHash).slice(0, 18)}...
          </div>
        )}

        {error && (
          <div className="mt-3 text-red-300 border border-red-400 p-2 rounded">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { WalletProvider } from "./context/WalletContext";
import { ConnectWalletButton } from "./components/ConnectWalletButton";
import { MintCard } from "./components/MintCard";
import { MyCards } from "./components/MyCards";
import { StartDuel } from "./components/StartDuel";
import { JoinDuel } from "./components/JoinDuel";
import { BattleList } from "./components/BattleList"; // ✅ Import new component
import { Swords } from "lucide-react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { celo } from "wagmi/chains";

function App() {
  const { isConnected } = useAccount();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"mint" | "duel">("mint");
  const [selectedBattleId, setSelectedBattleId] = useState<number | null>(null); // ✅ Track battle to join
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    const handleSwitch = async () => {
      if (isConnected && chainId !== celo.id) {
        try {
          alert("Please switch to Celo Mainnet in MetaMask!");
          await switchChain({ chainId: celo.id });
        } catch (error) {
          console.error("Error switching chain:", error);
        }
      }
    };
    handleSwitch();
  }, [isConnected, chainId]);

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* ─── Navbar ──────────────────────────────── */}
        <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Swords className="text-orange-400" size={32} />
                <h1 className="text-2xl font-bold text-white">Merge Cards Duel</h1>
              </div>
              <ConnectWalletButton />
            </div>
          </div>
        </nav>

        {/* ─── Main Content ──────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setActiveTab("mint")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "mint"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Mint Cards
            </button>

            <button
              onClick={() => setActiveTab("duel")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "duel"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Battle Arena
            </button>
          </div>

          {/* ─── Mint Section ──────────────────────────────── */}
          {activeTab === "mint" ? (
            <div className="space-y-8">
              <div className="flex justify-center">
                <MintCard />
              </div>
              <MyCards onSelectCard={setSelectedCardId} />
            </div>
          ) : (
            /* ─── Battle Arena Section ──────────────────────────────── */
            <div className="space-y-8">
              <MyCards onSelectCard={setSelectedCardId} />

              {/* Show existing open battles */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  🔥 Open Battles
                </h2>
                <BattleList onSelectBattle={setSelectedBattleId} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Start a New Battle
                  </h3>
                  <StartDuel selectedCardId={selectedCardId} />
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Join an Existing Battle
                  </h3>
                  <JoinDuel
                    selectedCardId={selectedCardId}
                    selectedBattleId={selectedBattleId || undefined} // ✅ Auto-fill from list
                  />
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ─── Footer ──────────────────────────────── */}
        <footer className="border-t border-slate-700 mt-16 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-slate-400 text-sm">
              Powered by Celo Blockchain
            </p>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App;

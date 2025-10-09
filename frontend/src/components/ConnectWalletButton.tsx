import { useConnect, useDisconnect, useAccount } from "wagmi";
import { shortenAddress } from "../utils/helpers";
import { Wallet, LogOut } from "lucide-react";

export const ConnectWalletButton = () => {
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const handleConnect = async () => {
    if (!connectors.length) return console.error("No WalletConnect connector found.");
    await connect({ connector: connectors[0] });
  };

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <LogOut size={20} />
        <span>{shortenAddress(address)}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isPending}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet size={20} />
      <span>{isPending ? "Connecting..." : "Connect Wallet"}</span>
    </button>
  );
};

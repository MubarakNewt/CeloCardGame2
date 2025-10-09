import { createConfig, http } from "wagmi";
import { celo } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [celo],
  connectors: [metaMask()],
  transports: {
    [celo.id]: http("https://forno.celo.org"),
  },
  ssr: false,
});

export const shortenAddress = (address: string, chars = 4): string =>
  `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;

export const formatCardPower = (power: bigint): string => power.toString();

export const getExplorerUrl = (txHash: string, type: "tx" | "address" = "tx"): string =>
  `https://celoscan.io/${type}/${txHash}`;

export const formatEtherValue = (value: bigint): string =>
  (Number(value) / 1e18).toFixed(4);

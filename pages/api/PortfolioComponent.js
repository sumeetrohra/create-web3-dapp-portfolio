import { Alchemy, Network } from "alchemy-sdk";
import { BigNumber } from "ethers";

export const networks = {
  1: Network.ETH_MAINNET,
  5: Network.ETH_GOERLI,
  137: Network.MATIC_MAINNET,
  80001: Network.MATIC_MUMBAI,
  10: Network.OPT_MAINNET,
  420: Network.OPT_GOERLI,
  42161: Network.ARB_MAINNET,
  421613: Network.ARB_GOERLI,
  1101: Network.POLYGONZKEVM_MAINNET,
  1442: Network.POLYGONZKEVM_TESTNET,
};

export const fetchPortfolio = async (chainId, address) => {
  const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: networks[chainId],
  };
  const alchemy = new Alchemy(config);
  // Replace with your Alchemy API key:
  const balances = await alchemy.core.getTokenBalances(address);

  const nonZero = balances.tokenBalances.filter(
    (b) =>
      b.tokenBalance !==
      "0x0000000000000000000000000000000000000000000000000000000000000000"
  );
  const data = await Promise.all(
    nonZero.map(async (i) => ({
      ...i,
      tokenData: await alchemy.core.getTokenMetadata(i.contractAddress),
    }))
  );
  return data.map((b) => {
    const tb = BigNumber.from(b.tokenBalance);
    const decimalsBn = BigNumber.from(b.tokenData.decimals);
    const divisor = BigNumber.from(10).pow(decimalsBn);
    const beforeDecimal = tb.div(divisor);
    const afterDecimal = tb.mod(divisor);
    return {
      ...b,
      tokenBalance: beforeDecimal.toString() + "." + afterDecimal.toString(),
    };
  });
};

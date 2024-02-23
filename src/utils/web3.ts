import Web3 from "web3";
import {
  BlockNumberOrTag,
  EIP1193Provider,
  EthExecutionAPI,
  Numbers,
  SupportedProviders,
  Web3EthExecutionAPI,
} from "web3-types";
import { fromWei } from "web3-utils";

export const wEthereum =
  window.ethereum as EIP1193Provider<Web3EthExecutionAPI>;

const TOKEN_ADDRESS = {
  USDC_TOKEN: "0x64544969ed7ebf5f083679233325356ebe738930",
} as const;

export function checkEtherProvider(): boolean {
  let injectedProvider = false;
  if (typeof window.ethereum !== "undefined") {
    injectedProvider = true;
  }
  return injectedProvider ? !!window.ethereum : false;
}

// export async function connectWallet(): Promise<string | undefined> {
//   try {
//     if (!checkEtherProvider()) {
//       throw new Error("Provider not installed !");
//     }

//     const res = await window.ethereum?.request({
//       method: "eth_requestAccounts",
//     });

//     return res[0];
//   } catch (error) {
//     console.log("error", error);
//   }
// }

export async function getAccountBalance(
  address: string,
  blockNumber: BlockNumberOrTag
): Promise<string | undefined> {
  try {
    if (!checkEtherProvider()) {
      throw new Error("Provider not installed !");
    }

    const resData = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, blockNumber],
    });

    if (resData) {
      const balanceValue = fromWei(resData, "ether");

      return balanceValue;
    }
    return "0";
  } catch (error) {
    console.log("error", error);
  }
}

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const formatAddress = (address: string) => {
  return address.slice(0, 5) + "..." + address.slice(-5);
};

const initWeb3 = (
  providerOrContext: string | SupportedProviders<EthExecutionAPI> | undefined
) => {
  return new Web3(providerOrContext);
};

const createBSCTestnetContract = (provider: Web3) => {
  return new provider.eth.Contract(
    [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
    ],
    TOKEN_ADDRESS.USDC_TOKEN
  );
};

export const c98Web3 = initWeb3(window.ethereum);
// export const c98Web3 = initWeb3(
//   "https://data-seed-prebsc-1-s1.binance.org:8545"
// );

export const contractUSDC = createBSCTestnetContract(c98Web3);

export async function getUSDCBalance(walletAddress: string) {
  const result = await contractUSDC.methods
    .balanceOf(walletAddress)
    .call<Numbers>();
  console.log("result", result);

  return {
    wei: fromWei(result, "wei"),
    ether: fromWei(result, "ether"),
  };
}

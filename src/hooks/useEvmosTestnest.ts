import {
  GasPrice,
  SigningStargateClient,
  StargateClient,
} from "@cosmjs/stargate";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { useEffect, useState } from "react";
import chainData from "utils/chain.json";
import { getAccountBalance } from "utils/web3";
import { BlockTags } from "web3-types";
import { toNumber } from "web3-utils";
// import { DirectSecp256k1HdWallet, DirectSecp256k1Wallet, OfflineDirectSigner } from "@cosmjs/proto-signing"

export type TChainInfo = (typeof chainData)[number];
type Props = {};

interface IWallet {
  account: string;
  chainId: string;
  balance: string;
  chainInfo?: TChainInfo;
}

const rpcLocal = "https://rpc.sentry-01.theta-testnet.polypore.xyz/";

const toAddress = "cosmos10yqr2wp40lyatnrv06zehq2df0amwzh6rqkg6a"; //TEST 2

export const isInjectedProvider =
  window.coin98 || window.ethereum || window.ethereum?.isCoin98;
const initWallet = {
  account: "",
  balance: "",
  chainId: "",
};
export function useEvmosTestnest() {
  const [wallet, setWallet] = useState<IWallet>(initWallet);

  // async function sendTransaction(data: any) {
  //   const txObj: Transaction = {
  //     from: data.from,
  //     to: data.to,
  //     data: utf8ToHex(data.data || ""),
  //     value: toWei(data.amount, "ether"),
  //   };

  //   return c98Web3.eth.sendTransaction(txObj);
  // }

  // async function sendTransactionWithPrivateKey(data: any, privateKey: string) {
  //   try {
  //     const account = c98Web3.eth.accounts.privateKeyToAccount(
  //       privateKey as string
  //     );

  //     const rawTransaction: Transaction = {
  //       // nonce: await c98Web3.eth.getTransactionCount(account.address),
  //       from: account.address,
  //       to: data.to,
  //       data: utf8ToHex(data.data || "anh ba hung"),

  //       // value: toHex(toWei(data.amount, "ether")),
  //       value: toWei(data.amount, "ether"),

  //       // gasLimit: toWei(7.5, "gwei"),
  //       // gasPrice: toWei(7.5, "gwei"),
  //       gasPrice: await c98Web3.eth.getGasPrice(),
  //       // gas: 1,
  //       // maxPriorityFeePerGas: "",
  //       // maxFeePerGas: "",
  //       // gasPrice: toWei("100", "gwei"),
  //       // nonce: "string",
  //     };

  //     const estimateGas = await c98Web3.eth.estimateGas(
  //       rawTransaction,
  //       BlockTags.LATEST,
  //       {
  //         number: FMT_NUMBER.NUMBER,
  //         bytes: FMT_BYTES.HEX,
  //       }
  //     );

  //     rawTransaction.gasLimit = estimateGas;
  //     // "The following properties are invalid for the transaction type 0x2: gasPrice"

  //     const signedTransaction = await c98Web3.eth.accounts.signTransaction(
  //       rawTransaction,
  //       account.privateKey
  //     );

  //     console.log("signedTransaction", signedTransaction);

  //     // 5th - send the signed transaction
  //     return c98Web3.eth.sendSignedTransaction(
  //       signedTransaction.rawTransaction
  //     );
  //   } catch (error) {
  //     console.log("error?", { error });
  //   }
  // }

  // async function getAccount(): Promise<string[]> {
  //   try {
  //     if (isInjectedProvider) {
  //       // const accounts = await web3.eth.requestAccounts();

  //       const accounts = await window.ethereum.request({
  //         method: "eth_accounts",
  //       });
  //       return accounts || [];
  //     } else {
  //       throw new Error("Provider not install");
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //     return [];
  //   }
  // }
  // async function requestAccount() {
  //   if (isInjectedProvider) {
  //     try {
  //       const accounts = await wEthereum.request({
  //         method: "eth_requestAccounts",
  //       });

  //       console.log("accounts", accounts);
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   }
  // }

  async function updateWallet(account: string) {
    const balance = (await getAccountBalance(account, BlockTags.LATEST)) || "0";
    const chainId = await window.ethereum!.request({
      method: "eth_chainId",
    });

    const chainNumber = toNumber(chainId);
    const chainInfo = chainData.find((item) => item.chainId === chainNumber);

    setWallet({ account, balance, chainId: `${chainNumber}`, chainInfo });
  }

  useEffect(() => {
    const refreshAccounts = (accounts: string[] | undefined) => {
      if (accounts?.length) {
        updateWallet(accounts[0]);
      } else {
        setWallet(initWallet);
      }
    };

    const getProvider = async () => {
      // if (isInjectedProvider) {
      //   const client = await StargateClient.connect(rpcLocal);
      //   const testChainId = await client.getChainId();
      //   console.log("testChainId", testChainId);
      //   const getBalances = (address: string): Promise<readonly Coin[]> => {
      //     return client.getAllBalances(address);
      //   };
      //   await window.keplr?.enable(testChainId);
      //   const key = await window.keplr?.getKey(testChainId);
      //   console.log("key", key);
      //   const offlineSigner = window.keplr?.getOfflineSigner(testChainId);
      //   if (offlineSigner) {
      //     console.log("run ");
      //     const accountData = (await offlineSigner.getAccounts())[0];
      //     console.log("accountData.address", accountData.address);
      //     const signingClient = await SigningStargateClient.connectWithSigner(
      //       rpcLocal,
      //       offlineSigner
      //     );
      //     console.log("balance", await getBalances(accountData.address));
      //     // GasPrice.fromString("1stake")
      //   }
      // }
    };

    getProvider();
    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
    };
  }, []);

  async function sendToTest2(faucetAddress = toAddress) {
    if (isInjectedProvider) {
      const client = await StargateClient.connect(rpcLocal);
      const testChainId = await client.getChainId();

      console.log("testChainId", testChainId);

      const getBalances = (address: string): Promise<readonly Coin[]> => {
        return client.getAllBalances(address);
      };

      await window.keplr?.enable(testChainId);
      const key = await window.keplr?.getKey(testChainId);
      console.log("key", key);

      const offlineSigner = window.keplr?.getOfflineSigner(testChainId);

      if (offlineSigner) {
        console.log("run ");

        const accountData = (await offlineSigner.getAccounts())[0];
        console.log("accountData.address", accountData.address);

        const signingClient = await SigningStargateClient.connectWithSigner(
          rpcLocal,
          offlineSigner,
          {
            gasPrice: GasPrice.fromString("61000uatom"),
          }
        );

        console.log("balance", await getBalances(accountData.address));
        // console.log("GasPrice", GasPrice.fromString("10uatom"));

        const sendResult = await signingClient.sendTokens(
          accountData.address,
          faucetAddress,
          [
            {
              denom: "uatom",
              amount: "20",
            },
          ],
          {
            amount: [
              {
                amount: "2587",
                denom: "uatom",
              },
            ],
            gas: "200000",
          }
        );

        console.log(sendResult);
      }
    }

    // Print the result to the console
  }

  // useEffect(() => {
  //   const onAnnounceProvider = (event: EIP6963AnnounceProviderEvent) => {
  //     if (event.detail.info.rdns === RDNS_C98) {
  //       web3Ref.current = new Web3(window.ethereum);
  //     }
  //   };

  //   window.addEventListener(
  //     "eip6963:announceProvider",
  //     onAnnounceProvider as EventListener
  //   );

  //   window.dispatchEvent(new Event("eip6963:requestProvider"));

  //   return () => {
  //     window.removeEventListener(
  //       "eip6963:announceProvider",
  //       onAnnounceProvider as EventListener
  //     );
  //   };
  // }, []);

  return {
    wallet,
    sendToTest2,
  };
}

export default useEvmosTestnest;

// {
//   "stakeCurrency": {
//     "coinDenom": "TEVMOS",
//     "coinMinimalDenom": "atevmos",
//     "coinDecimals": 18
//   },
//   "bech32Config": {
//     "bech32PrefixAccAddr": "evmos",
//     "bech32PrefixAccPub": "evmospub",
//     "bech32PrefixValAddr": "evmosvaloper",
//     "bech32PrefixValPub": "evmosvaloperpub",
//     "bech32PrefixConsAddr": "evmosvalcons",
//     "bech32PrefixConsPub": "evmosvalconspub"
//   },
//   "currencies": [
//     {
//       "coinDenom": "TEVMOS",
//       "coinMinimalDenom": "atevmos",
//       "coinDecimals": 18
//     }
//   ],
//   "feeCurrencies": [
//     {
//       "coinDenom": "TEVMOS",
//       "coinMinimalDenom": "atevmos",
//       "coinDecimals": 18,
//       "gasPriceStep": {
//         "low": 25000000000,
//         "average": 25000000000,
//         "high": 40000000000
//       }
//     }
//   ],
//   "bip44": {
//     "coinType": 60
//   },
//   "chainId": "evmos_9000-4",
//   "chainName": "Evmos Testnet",
//   "rpc": "https://tendermint.bd.evmos.dev:26657",
//   "rest": "https://rest.bd.evmos.dev:1317",
//   "beta": true,
//   "features": [
//     "ibc-transfer",
//     "ibc-go",
//     "eth-address-gen",
//     "eth-key-sign"
//   ]
// }

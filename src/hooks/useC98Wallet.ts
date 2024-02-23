import { useEffect, useState } from "react";
import chainData from "utils/chain.json";
import { c98Web3, getAccountBalance, wEthereum } from "utils/web3";
import { BlockTags, FMT_BYTES, FMT_NUMBER, Transaction } from "web3-types";
import { toNumber, toWei, utf8ToHex } from "web3-utils";

export type TChainInfo = (typeof chainData)[number];
type Props = {};

interface IWallet {
  account: string;
  chainId: string;
  balance: string;
  chainInfo?: TChainInfo;
}

export const isInjectedProvider =
  window.coin98 || window.ethereum || window.ethereum?.isCoin98;
const initWallet = {
  account: "",
  balance: "",
  chainId: "",
};
export function useC98Wallet() {
  const [wallet, setWallet] = useState<IWallet>(initWallet);

  async function sendTransaction(data: any) {
    const txObj: Transaction = {
      from: data.from,
      to: data.to,
      data: utf8ToHex(data.data || ""),
      value: toWei(data.amount, "ether"),

      // gas: toWei("7.5", "gwei"),
      // gasPrice: toWei("100", "gwei"),
      // nonce: "string",
    };

    return c98Web3.eth.sendTransaction(txObj);
  }

  async function sendTransactionWithPrivateKey(data: any, privateKey: string) {
    try {
      const account = c98Web3.eth.accounts.privateKeyToAccount(
        privateKey as string
      );

      const rawTransaction: Transaction = {
        // nonce: await c98Web3.eth.getTransactionCount(account.address),
        from: account.address,
        to: data.to,
        data: utf8ToHex(data.data || "anh ba hung"),

        // value: toHex(toWei(data.amount, "ether")),
        value: toWei(data.amount, "ether"),

        // gasLimit: toWei(7.5, "gwei"),
        // gasPrice: toWei(7.5, "gwei"),
        gasPrice: await c98Web3.eth.getGasPrice(),
        // gas: 1,
        // maxPriorityFeePerGas: "",
        // maxFeePerGas: "",
        // gasPrice: toWei("100", "gwei"),
        // nonce: "string",
      };

      const estimateGas = await c98Web3.eth.estimateGas(
        rawTransaction,
        BlockTags.LATEST,
        {
          number: FMT_NUMBER.NUMBER,
          bytes: FMT_BYTES.HEX,
        }
      );

      rawTransaction.gasLimit = estimateGas;
      // "The following properties are invalid for the transaction type 0x2: gasPrice"

      const signedTransaction = await c98Web3.eth.accounts.signTransaction(
        rawTransaction,
        account.privateKey
      );

      console.log("signedTransaction", signedTransaction);

      // 5th - send the signed transaction
      return c98Web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );
    } catch (error) {
      console.log("error?", { error });
    }
  }

  async function getAccount(): Promise<string[]> {
    try {
      if (isInjectedProvider) {
        // const accounts = await web3.eth.requestAccounts();

        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        return accounts || [];
      } else {
        throw new Error("Provider not install");
      }
    } catch (error) {
      console.log("error", error);
      return [];
    }
  }
  async function requestAccount() {
    if (isInjectedProvider) {
      try {
        const accounts = await wEthereum.request({
          method: "eth_requestAccounts",
        });

        console.log("accounts", accounts);
      } catch (error) {
        console.log("error", error);
      }
    }
  }

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
      if (isInjectedProvider) {
        const accounts = await getAccount();

        refreshAccounts(accounts);
        window.ethereum.on("accountsChanged", refreshAccounts);
      }
    };

    getProvider();
    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
    };
  }, []);

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
    sendTransaction,
    getAccount,
    requestAccount,
    wallet,
    sendTransactionWithPrivateKey,
  };
}

export default useC98Wallet;

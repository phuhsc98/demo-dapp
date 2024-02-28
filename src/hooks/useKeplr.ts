import {
  MsgTransferEncodeObject,
  SigningStargateClient,
} from "@cosmjs/stargate";
import type {
  Coin,
  AccountData as IAccountData,
  ChainInfo as IChainInfo,
} from "@keplr-wallet/types";
import { useEffect, useState } from "react";
import { TBalance, formatCosmos, toMinimalDenomCosmos } from "utils/format";

import {
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";

import { Buffer } from "buffer";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { getKeplrFromWindow } from "utils/getKeplrFromWindow";
// import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";

export function useKeplr({ chainInfo }: { chainInfo: IChainInfo }) {
  const { chainId, rpc } = chainInfo;

  const [signingClient, setSigningClient] = useState<SigningStargateClient>();
  const [signingWasmClient, setSigningWasmClient] =
    useState<SigningCosmWasmClient>();
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<IAccountData>();
  const [balance, setBalance] = useState<TBalance>();

  const init = async () => {
    try {
      // setIsLoading(true);
      const keplr = await getKeplrFromWindow();

      if (keplr) {
        try {
          await keplr.experimentalSuggestChain(chainInfo);
          await keplr.enable(chainId);
          const offlineSigner = window.keplr?.getOfflineSigner(chainId);

          if (offlineSigner) {
            const signingClient = await SigningStargateClient.connectWithSigner(
              rpc,
              offlineSigner
            );

            const signingWasmClient =
              await SigningCosmWasmClient.connectWithSigner(rpc, offlineSigner);

            const account = (await offlineSigner.getAccounts())[0];

            if (account) {
              setAccount(account);
            }
            setSigningClient(signingClient);
            setSigningWasmClient(signingWasmClient);
          }
        } catch (e) {
          if (e instanceof Error) {
            console.log(e.message);
          }
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // const sendBalance = async () => {
  //   if (window.keplr) {
  //     const key = await window.keplr.getKey(OsmosisChainInfo.chainId);
  //     const protoMsgs = {
  //       typeUrl: "/cosmos.bank.v1beta1.MsgSend",
  //       value: MsgSend.encode({
  //         fromAddress: key.bech32Address,
  //         toAddress: recipient,
  //         amount: [
  //           {
  //             denom: "uosmo",
  //             amount: DecUtils.getTenExponentN(6)
  //               .mul(new Dec(amount))
  //               .truncate()
  //               .toString(),
  //           },
  //         ],
  //       }).finish(),
  //     };

  //     try {
  //       const gasUsed = await simulateMsgs(
  //         OsmosisChainInfo,
  //         key.bech32Address,
  //         [protoMsgs],
  //         [{ denom: "uosmo", amount: "236" }]
  //       );

  //       if (gasUsed) {
  //         await sendMsgs(
  //           window.keplr,
  //           OsmosisChainInfo,
  //           key.bech32Address,
  //           [protoMsgs],
  //           {
  //             amount: [{ denom: "uosmo", amount: "236" }],
  //             gas: Math.floor(gasUsed * 1.5).toString(),
  //           }
  //         );
  //       }
  //     } catch (e) {
  //       if (e instanceof Error) {
  //         console.log(e.message);
  //       }
  //     }
  //   }
  // };

  async function syncAccountBalance(address?: string) {
    const searchAddress = address || account?.address;
    if (searchAddress) {
      const balance = await getBalance(searchAddress);
      if (balance) {
        setBalance(formatCosmos(balance));
      }
    }
  }

  async function getBalance(address: string, searchDenom?: string) {
    if (signingClient) {
      let balance: Coin;
      if (searchDenom) {
        balance = await signingClient.getBalance(address, searchDenom);
      } else {
        balance = (await signingClient.getAllBalances(address))[0];
      }
      return balance;
    }
  }

  async function sendToken(to: string, amount: string) {
    try {
      if (signingClient && account) {
        const result = await signingClient.sendTokens(
          account.address,
          to,
          [toMinimalDenomCosmos({ denom: "uosmo", amount: amount })],
          {
            amount: [{ denom: "uosmo", amount: "2587" }],
            gas: "200000",
          }
        );

        syncAccountBalance();
        return result;
        //
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  async function sendTxSmartContract() {
    try {
      if (signingWasmClient && account) {
        const testSmartContract =
          "osmo1wpahf5cuy6yzzmmrkdc0xv2ta95wzfj2lk0jpyvtumq9qrfq3q8sse0r2e";

        const msgSm: MsgExecuteContractEncodeObject = {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: MsgExecuteContract.fromPartial({
            sender: account.address,
            contract: testSmartContract,
            // msg: ,
            msg: Buffer.from(
              JSON.stringify({
                increase_allowance: {
                  spender: "osmo10yqr2wp40lyatnrv06zehq2df0amwzh6tm9cv0",
                  amount: "70000",
                },
              })
            ),
            funds: [toMinimalDenomCosmos({ denom: "uosmo", amount: "5" })],
          }),
        };

        const simulateData = await signingWasmClient.simulate(
          account.address,
          [msgSm],
          ""
        );

        // // // Sign and broadcast the transaction
        const result3 = await signingWasmClient.signAndBroadcast(
          account.address,
          [msgSm],
          {
            amount: [{ denom: "uosmo", amount: "2587" }],
            gas: `${simulateData + 5000}`,
          }
        );
        return result3;
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function sendTxIBC() {
    try {
      if (signingClient && account) {
        const msgSm: MsgTransferEncodeObject = {
          typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
          value: {
            sender: account.address,
            receiver: "neutron1ltv3ygz0f5y2943ez5suf5tj5qmzl8kwp4ve3u",
            sourcePort: "transfer",
            sourceChannel: "channel-4172",
            token: toMinimalDenomCosmos({ denom: "uosmo", amount: "5" }),
            timeoutHeight: {
              revisionHeight: BigInt(await signingClient.getHeight()),
              revisionNumber: BigInt(10),
            },
          },
        };

        const simulateData = await signingClient.simulate(
          account.address,
          [msgSm],
          ""
        );

        const transferResult = await signingClient.signAndBroadcast(
          account.address,
          [msgSm],
          {
            amount: [{ denom: "uosmo", amount: "2587" }],
            gas: `${simulateData + 5000}`,
          }
        );

        return transferResult;
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    init();

    window.addEventListener("keplr_keystorechange", init);

    return () => {
      window.removeEventListener("keplr_keystorechange", init);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && account?.address) {
      syncAccountBalance();
    }
  }, [isLoading, account]);

  return {
    signingClient,
    isLoading,
    account,
    balance,
    //
    getBalance,
    syncAccountBalance,
    sendToken,
    sendTxSmartContract,
    sendTxIBC,
  };
}

export default useKeplr;

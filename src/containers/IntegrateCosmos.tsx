import type { DeliverTxResponse } from "@cosmjs/stargate";
import CosmosTxDeliver from "components/CosmosTxDeliver";
import TransactionWithWallet from "components/TransactionWithWallet";
import useKeplr from "hooks/useKeplr";
import { useState } from "react";
import chainInfo from "utils/osmosis-testnet.json";

type Props = {};

function IntegrateCosmos({}: Props) {
  const {
    isLoading,
    account,
    balance,
    sendToken,
    sendTxSmartContract,
    sendTxIBC,
  } = useKeplr({
    chainInfo: chainInfo,
  });

  const [viewTxDeliver, setViewTxDeliver] = useState<DeliverTxResponse>();

  return (
    <div>
      {isLoading ? (
        "loading..."
      ) : (
        <>
          <div>Address: {account?.address}</div>
          <div>
            {/* Balance: {balance?.amount} {balance?.denom} */}
            Balance: {balance?.displayValue} {balance?.coinDenom}
          </div>

          <hr />

          <div>
            <h4>Transaction with wallet</h4>
            <i>osmo10yqr2wp40lyatnrv06zehq2df0amwzh6tm9cv0</i>
            <TransactionWithWallet
              onSubmit={async (value) => {
                try {
                  sendToken(value.to, value.amount).then((data) =>
                    setViewTxDeliver(data)
                  );
                } catch (error) {}
              }}
            />
            <hr />
            <button
              onClick={() => {
                sendTxSmartContract().then((data) => setViewTxDeliver(data));
              }}
            >
              sendTxSmartContract
            </button>
            <hr />
            <button
              onClick={() => {
                sendTxIBC().then((data) => setViewTxDeliver(data));
              }}
            >
              sendTxIBC
            </button>

            <hr />

            <CosmosTxDeliver data={viewTxDeliver} />
          </div>
        </>
      )}
    </div>
  );
}

export default IntegrateCosmos;

import { CheckBalanceUSDC } from "components/CheckBalanceUSDC";
import IntegrateSmartContract from "components/IntegrateSmartContract";
import { TransactionReceipt } from "components/TransactionReceipt";
import TransactionWithPrivateKey from "components/TransactionWithPrivateKey";
import TransactionWithWallet from "components/TransactionWithWallet";
import useC98Wallet, { isInjectedProvider } from "hooks/useC98Wallet";
import { useState } from "react";
import type { TransactionReceipt as TTransactionReceipt } from "web3-types";

function App() {
  const {
    sendTransaction,
    requestAccount,
    wallet,
    sendTransactionWithPrivateKey,
  } = useC98Wallet();
  const [receipt, setReceipt] = useState<TTransactionReceipt>();
  const [receiptPrivate, setReceiptPrivate] = useState<TTransactionReceipt>();
  return (
    <div>
      {!isInjectedProvider && <div>Not install wallet</div>}
      {isInjectedProvider && !wallet.account && (
        <button onClick={requestAccount}>Connect Wallet</button>
      )}

      {wallet.account && (
        <>
          <div>
            <h4>Wallet connected</h4>
            <div>Address: {wallet.account}</div>
            <div>
              Balance: {wallet.balance}{" "}
              {wallet.chainInfo?.nativeCurrency.symbol}
            </div>
            <div>ChainId: {wallet.chainId}</div>
          </div>
          <hr />
          <div>
            <h4>Transaction with wallet</h4>
            <TransactionWithWallet
              onSubmit={async (value) => {
                setReceipt(undefined);
                try {
                  const receiptRes = await sendTransaction({
                    ...value,
                    from: wallet.account,
                  });
                  setReceipt(receiptRes);
                } catch (error) {}
              }}
            />
            <TransactionReceipt data={receipt} />
          </div>
          <hr />
          <div>
            <h4>Transaction with private key</h4>
            <TransactionWithPrivateKey
              onSubmit={async (value) => {
                try {
                  setReceiptPrivate(undefined);
                  const receiptRes = await sendTransactionWithPrivateKey(
                    {
                      ...value,
                    },
                    value.privateKey
                  );
                  setReceiptPrivate(receiptRes);
                } catch (error) {}
              }}
            />
            <TransactionReceipt data={receiptPrivate} />
          </div>
          <hr />
          <CheckBalanceUSDC />
          <hr />
          <IntegrateSmartContract />
        </>
      )}
    </div>
  );
}

export default App;

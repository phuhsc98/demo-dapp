import { useState } from "react";
import { c98Web3 } from "utils/web3";
import type { TransactionReceipt as TTransactionReceipt } from "web3-types";
import TransactionReceipt from "./TransactionReceipt";
type Props = {};

const integrateContract = "0xc06fdEbA4F7Fa673aCe5E5440ab3d495133EcE7a";
const contractTest = new c98Web3.eth.Contract(
  [
    {
      inputs: [],
      name: "get",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "data", type: "string" }],
      name: "set",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  integrateContract
);

export function IntegrateSmartContract({}: Props) {
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState<TTransactionReceipt>();

  const [errorMessage, setErrorMessage] = useState("");

  async function handleSend() {
    setErrorMessage("");
    try {
      if (!message.length) return;
      setReceipt(undefined);
      const rawData = contractTest.methods.set(message).encodeABI();

      const currentAccount = await c98Web3.eth.getAccounts();

      const receipt = await c98Web3.eth.sendTransaction({
        from: currentAccount[0],
        to: integrateContract,
        input: rawData,
      });

      setReceipt(receipt);
    } catch (error) {
      console.log("error", { error });
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  }
  return (
    <div>
      <h4>Integrate with 0xc06fdEbA4F7Fa673aCe5E5440ab3d495133EcE7a</h4>
      <div>
        <label>Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />

        <button onClick={handleSend}>Send message</button>
      </div>
      <div>{errorMessage}</div>
      <TransactionReceipt data={receipt} />
    </div>
  );
}

export default IntegrateSmartContract;

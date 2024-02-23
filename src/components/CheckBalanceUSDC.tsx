import { useState } from "react";
import { getUSDCBalance } from "utils/web3";
import { isAddress } from "web3-validator";

type Props = {};
const initBalance = {
  wei: "0",
  ether: "0",
};
export function CheckBalanceUSDC({}: Props) {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(initBalance);

  const [errorMessage, setErrorMessage] = useState("");

  // getUSDCBalance
  async function handleGetBalance() {
    setErrorMessage("");
    try {
      if (!isAddress(address)) {
        throw new Error("Invalid address");
      }
      const result = await getUSDCBalance(address);
      setBalance(result);
    } catch (error) {
      console.log("error", { error });
      setBalance(initBalance);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  }
  return (
    <div>
      <h4>Check USDC Balance</h4>
      <div>
        <div>Example: 0xDdf269bF44f86570beD9A7ef514620A31eB634D6</div>
        <label>Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />

        <button onClick={handleGetBalance}>get balance</button>
      </div>
      <div>
        <div>Result : {balance.ether} USDC</div>
        <span style={{ color: "red" }}>{errorMessage}</span>
      </div>
    </div>
  );
}

export default CheckBalanceUSDC;

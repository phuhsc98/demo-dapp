import type {
  Numbers,
  TransactionReceipt as TTransactionReceipt,
} from "web3-types";
import { fromWei } from "web3-utils";

type Props = {
  data?: TTransactionReceipt;
};
type TReceiptKey = keyof TTransactionReceipt;

function formatWei(key: TReceiptKey, value: unknown): string {
  const listToEther: TReceiptKey[] = ["cumulativeGasUsed", "gasUsed"];

  const listToGWei: TReceiptKey[] = [
    "cumulativeGasUsed",
    "gasUsed",
    "effectiveGasPrice",
  ];
  if (listToEther.includes(key)) {
    return `${fromWei(value as Numbers, "ether")} BNB`;
  }
  if (listToGWei.includes(key)) {
    return `${fromWei(value as Numbers, "gwei")} Gwei`;
  }

  return `${value}`;
}

export function TransactionReceipt({ data }: Props) {
  if (!data) return null;
  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <div>
          <b>{key}</b> : {formatWei(key as TReceiptKey, value)}
        </div>
      ))}
    </div>
  );
}

export default TransactionReceipt;

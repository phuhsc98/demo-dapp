import { FormEvent } from "react";

type Props = {
  onSubmit: (data: ITransactionWithPrivateKey) => Promise<void> | void;
};

interface ITransactionWithPrivateKey {
  from: string;
  to: string;
  amount: string;
  privateKey: string;
}
// 0x0c5524ec0f8d76a53b459fad5c4911bb62e7bd97e2b0682f2ce1f6e6f4a257df
function TransactionWithPrivateKey({ onSubmit }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      from: "",
      to: formData.get("to") as string,
      amount: formData.get("amount") as string,
      privateKey: formData.get("privateKey") as string,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="privateKey">Private Key</label>
        <input name="privateKey" />
      </div>
      <div>
        <label htmlFor="to">To address</label>
        <input name="to" />
      </div>
      <div>
        <label htmlFor="amount">Amount</label>
        <input name="amount" />
      </div>

      <button type="submit">Send Transaction</button>
    </form>
  );
}

export default TransactionWithPrivateKey;

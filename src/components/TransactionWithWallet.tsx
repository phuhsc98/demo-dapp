import { FormEvent } from "react";

type Props = {
  onSubmit: (data: ITransactionWithWallet) => Promise<void> | void;
};

interface ITransactionWithWallet {
  to: string;
  amount: string;
}

function TransactionWithWallet({ onSubmit }: Props) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      to: formData.get("to") as string,
      amount: formData.get("amount") as string,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
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

export default TransactionWithWallet;

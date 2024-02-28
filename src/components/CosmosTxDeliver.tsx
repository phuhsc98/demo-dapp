import type { DeliverTxResponse } from "@cosmjs/stargate";

type Props = {
  data?: DeliverTxResponse;
};

type TDeliverTx = keyof DeliverTxResponse;

function formatData(key: TDeliverTx, value: unknown) {
  const normalKey: TDeliverTx[] = [
    "code",
    "gasUsed",
    "gasWanted",
    "height",
    "rawLog",
    "transactionHash",
    "txIndex",
  ];

  if (key === "msgResponses") {
    return (
      <div>
        {(value as DeliverTxResponse["msgResponses"]).map((item) => (
          <div>
            typeUrl : {item.typeUrl}
            {/* tx : {RequestDeliverTx.decode(item.value).tx} */}
          </div>
        ))}
      </div>
    );
  }

  if (!normalKey.includes(key)) {
    return "-";
  }
  return `${value}`;
}

export function CosmosTxDeliver({ data }: Props) {
  if (!data) return null;

  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <div>
          <b>{key}</b> : {formatData(key as TDeliverTx, value)}
        </div>
      ))}
    </div>
  );
}

export default CosmosTxDeliver;

import { Decimal } from "@cosmjs/math";
import { ChainInfo, Coin, Currency } from "@keplr-wallet/types";
import cosmosHubInfo from "./cosmos-hub-testnet.json";
import neutronInfo from "./neutron-testnet.json";
import osmosisInfo from "./osmosis-testnet.json";

export type TBalance = {
  coin: Coin;
  displayValue: number | string;
} & Currency;

const infoChainByCoin: Record<string, ChainInfo> = {
  osmo: osmosisInfo,
  uosmo: osmosisInfo,

  uatom: cosmosHubInfo,
  atom: cosmosHubInfo,
  untrn: neutronInfo,
  ntrn: neutronInfo,
};

export function formatCosmos(coin: Coin): TBalance {
  const currencyInfo = infoChainByCoin[coin.denom] || cosmosHubInfo;

  const stakeCurrency: Currency = currencyInfo.stakeCurrency || {
    coinDecimals: 0,
    coinDenom: "",
    coinMinimalDenom: "",
  };
  return {
    coin: coin,
    displayValue: Decimal.fromAtomics(
      coin.amount,
      stakeCurrency.coinDecimals
    ).toFloatApproximation(),
    ...stakeCurrency,
  };
}

export function toMinimalDenomCosmos(coin: Coin): Coin {
  const currencyInfo = infoChainByCoin[coin.denom] || cosmosHubInfo;

  const stakeCurrency: Currency = currencyInfo.stakeCurrency || {
    coinDecimals: 0,
    coinDenom: "",
    coinMinimalDenom: "",
  };
  return {
    amount: Decimal.fromUserInput(coin.amount, stakeCurrency.coinDecimals)
      .atomics,
    denom: coin.denom,
  };
}

import { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  interface Window extends KeplrWindow {
    ethereum?: any;
    coin98?: any;
  }
}

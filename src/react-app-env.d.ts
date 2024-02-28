/// <reference types="react-scripts" />

// export type { EIP1193Provider } from "web3-types";

interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

// interface EIP1193Provider {
//   isStatus?: boolean;
//   host?: string;
//   path?: string;
//   sendAsync?: (
//     request: { method: string; params?: Array<unknown> },
//     callback: (error: Error | null, response: unknown) => void
//   ) => void;
//   send?: (
//     request: { method: string; params?: Array<unknown> },
//     callback: (error: Error | null, response: unknown) => void
//   ) => void;
//   request: (request: {
//     method: string;
//     params?: Array<unknown>;
//   }) => Promise<unknown>;
// }

type EIP6963AnnounceProviderEvent = CustomEvent<EIP6963ProviderDetail>;

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider & { currentChain: string };
}

// interface Window {
//   ethereum?: EIP1193Provider;
//   coin98?: any;
// }

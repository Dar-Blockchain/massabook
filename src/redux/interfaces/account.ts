import { Wallet } from "@massalabs/wallet-provider";
import { Provider } from "@massalabs/massa-web3";
import { WalletName } from "@massalabs/wallet-provider";

export interface AccountStoreState {
  connectedAccount?: Provider;
  massaProvider?: Provider;
  accounts?: Provider[];
  currentWallet?: Wallet;
  wallets: Wallet[];
  isFetching: boolean;
  accountObserver?: {
    unsubscribe: () => void;
  };
  networkObserver?: {
    unsubscribe: () => void;
  };
  chainId?: string;
  selectedWallet?: WalletName | undefined;
}

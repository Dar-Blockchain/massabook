import { ReactNode, useEffect } from "react";
import {
  setWallet,
  setWallets,
  setConnectedAccount,
} from "../redux/slices/accountSlice";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Wallet, getWallets, WalletName } from "@massalabs/wallet-provider";

const MassaInitializer: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  // const { currentWallet, connectedAccount } = useSelector(
  //   (state: RootState) => state.account
  // );

  let pollingInterval: NodeJS.Timeout | null = null;

  async function initAccountStore() {
    const massaWallets = await getWallets();

    console.log("Available wallets:", massaWallets);
    dispatch(setWallets(massaWallets));
    const storedWalletName = localStorage.getItem("wallet");
    console.log("Stored wallet in local storage:", storedWalletName);

    if (storedWalletName) {
      const selectedWallet = massaWallets.find(
        (wallet: Wallet) => wallet.name() === storedWalletName
      );

      if (selectedWallet) {
        dispatch(setWallet(selectedWallet));

        // setupAccountListener(selectedWallet);
      }
    }
  }

  // const setupAccountListener = (wallet: Wallet) => {
  //   if (wallet.name() === WalletName.Bearby) {
  //     const accountObserver = wallet.listenAccountChanges(
  //       async (newAddress: string) => {
  //         console.log("Bearby wallet account changed too", newAddress);

  //         const accounts = await wallet.accounts();
  //         const newAccount = accounts.find((acc) => acc.address === newAddress);

  //         if (newAccount) {
  //           dispatch(setConnectedAccount(newAccount));
  //         } else {
  //           console.warn("Account not found after account change.");
  //           dispatch(setConnectedAccount(undefined));
  //         }
  //       }
  //     );

  //     return () => {
  //       if (accountObserver) {
  //         accountObserver.unsubscribe();
  //       }
  //     };
  //   }
  // };

  useEffect(() => {
    initAccountStore();
  }, []);

  return <>{children}</>;
};

export default MassaInitializer;

import { ReactNode, useEffect } from "react";
import { setWallet, setWallets } from "../redux/slices/accountSlice";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { Wallet, getWallets } from "@massalabs/wallet-provider";

const MassaInitializer: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

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
      }
    }
  }

  useEffect(() => {
    initAccountStore();
  }, []);

  return <>{children}</>;
};

export default MassaInitializer;

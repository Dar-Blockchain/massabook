// accountSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountStoreState } from "../interfaces/account";
import { Wallet, WalletName } from "@massalabs/wallet-provider";
import { Provider } from "@massalabs/massa-web3";
import { toast } from "react-toastify";

const initialState: AccountStoreState = {
  accounts: undefined,
  connectedAccount: undefined,
  accountObserver: undefined,
  networkObserver: undefined,
  currentWallet: undefined,
  wallets: [],
  isFetching: false,
  chainId: undefined,
  selectedWallet: undefined,
};

export const setWallet = createAsyncThunk(
  "account/setWallet",
  async (wallet: Wallet | undefined, { dispatch, getState }) => {
    const state = getState() as { account: AccountStoreState };

    if (state.account.currentWallet?.name() !== wallet?.name()) {
      state.account.accountObserver?.unsubscribe();
      state.account.networkObserver?.unsubscribe();
      dispatch(
        setObservers({ accountObserver: undefined, networkObserver: undefined })
      );
    }

    if (!wallet) {
      dispatch(setCurrentWallet(undefined));
      dispatch(setConnectedAccount(undefined));
      localStorage.removeItem("wallet");
      localStorage.removeItem("massastation_account");
      localStorage.removeItem("bearby_account");
      dispatch(setSelectedWallet(undefined));
      dispatch(setAccounts([]));
      return;
    }

    // Set current wallet before any further actions
    dispatch(setCurrentWallet(wallet));

    // Bearby wallet logic
    if (wallet.name() === WalletName.Bearby) {
      try {
        await wallet.connect();
        const accounts = await wallet.accounts();
        console.log("Accounts:", accounts);

        const newAccount = accounts[0];
        dispatch(setConnectedAccount(newAccount));

        // const accountObserver = wallet.listenAccountChanges(
        //   (newAddress: string) => {
        //     const currentState = getState() as { account: AccountStoreState };
        //     handleBearbyAccountChange(
        //       newAddress,
        //       currentState.account,
        //       dispatch
        //     );
        //   }
        // );

        const accountObserver = wallet.listenAccountChanges(
          async (newAddress: string) => {
            console.log("Account changed to:", newAddress);
            const currentState = getState() as { account: AccountStoreState };

            try {
              await handleBearbyAccountChange(
                newAddress,
                currentState.account,
                dispatch
              );
              console.log(
                "Updated connected account in state:",
                currentState.account.connectedAccount
              );
            } catch (error) {
              console.error("Error handling account change:", error);
            }
          }
        );

        const networkObserver = wallet.listenNetworkChanges(async () => {
          // el feature hethi available fi bearby
        });

        dispatch(setAccounts(accounts));
        dispatch(setObservers({ accountObserver, networkObserver }));
        localStorage.setItem("wallet", wallet.name());
      } catch (error) {
        console.error("Error connecting to Bearby wallet:", error);
        toast.error(`Check your Bearby wallet!`);
      }
    } else if (wallet.name() === WalletName.MassaStation) {
      // MassaStation wallet logic
      const accounts = await wallet.accounts();
      dispatch(setAccounts(accounts));
      const massastationAccount = localStorage.getItem("massastation_account");

      let selectedAccount = accounts[0];

      if (massastationAccount) {
        const selectedIndex = accounts.findIndex(
          (account) => account.address === massastationAccount
        );
        if (selectedIndex !== -1) {
          selectedAccount = accounts[selectedIndex];
        }
      }

      dispatch(setConnectedAccount(selectedAccount));

      localStorage.setItem("massastation_account", selectedAccount.address);
      localStorage.setItem("wallet", wallet.name());
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setWallets: (state, action: PayloadAction<Wallet[]>) => {
      state.wallets = action.payload;
      if (
        !state.wallets.some((w) => w.name() === state.currentWallet?.name())
      ) {
        state.currentWallet = undefined;
        state.connectedAccount = undefined;
        state.accounts = undefined;
      }
    },
    setCurrentWallet: (state, action: PayloadAction<Wallet | undefined>) => {
      state.currentWallet = action.payload;
      state.isFetching = false;
    },
    setConnectedAccount: (
      state,
      action: PayloadAction<Provider | undefined>
    ) => {
      state.connectedAccount = action.payload;
      console.log("Updated connected account:", action.payload);
    },
    setAccounts: (state, action: PayloadAction<Provider[]>) => {
      state.accounts = action.payload;
    },
    setChainId: (state, action: PayloadAction<string>) => {
      state.chainId = action.payload;
    },
    setSelectedWallet: (
      state,
      action: PayloadAction<WalletName | undefined>
    ) => {
      state.selectedWallet = action.payload;
    },
    setObservers: (
      state,
      action: PayloadAction<{
        accountObserver?: { unsubscribe: () => void };
        networkObserver?: { unsubscribe: () => void };
      }>
    ) => {
      state.accountObserver = action.payload.accountObserver;
      state.networkObserver = action.payload.networkObserver;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setWallet.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(setWallet.fulfilled, (state) => {
      state.isFetching = false;
    });
    builder.addCase(setWallet.rejected, (state) => {
      state.isFetching = false;
    });
  },
});

export const {
  setWallets,
  setCurrentWallet,
  setConnectedAccount,
  setAccounts,
  setChainId,
  setSelectedWallet,
  setObservers,
} = accountSlice.actions;

export default accountSlice.reducer;

// Function to handle Bearby account change
async function handleBearbyAccountChange(
  newAddress: string,
  state: AccountStoreState,
  dispatch: any
) {
  const { connectedAccount, currentWallet } = state;
  const oldAddress = connectedAccount?.address;

  if (newAddress !== oldAddress) {
    const newAccounts = await currentWallet?.accounts();
    if (newAccounts?.length) {
      const newAccount = newAccounts[0];
      dispatch(setConnectedAccount(newAccount));
    }
  }
}

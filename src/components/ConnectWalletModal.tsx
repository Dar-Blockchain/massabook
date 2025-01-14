import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWallet, setWallet } from "../redux/slices/accountSlice";
import SelectMassaWallet from "./SelectMassaWallet";
import { AppDispatch, RootState } from "../redux/store";
import { Wallet, WalletName } from "@massalabs/wallet-provider";
import { useNavigate } from "react-router-dom";
import { MASSA_STATION_INSTALL } from "../constants";

type Props = {
  openConnectWalletModal: boolean;
  setOpenConnectWalletModal: (open: boolean) => void;
};

const ConnectWalletModal = ({
  openConnectWalletModal,
  setOpenConnectWalletModal,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentWallet, wallets, isFetching, connectedAccount } = useSelector(
    (state: RootState) => state.account
  );
  const navigate = useNavigate();

  const handleClose = () => {
    setOpenConnectWalletModal(false);
  };
  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
  // const [selectedWalletName, setSelectedWalletName] = useState(
  //   currentWallet?.name()
  // );
  if (!openConnectWalletModal) return null;
  // if ((!currentWallet && !isFetching) || (currentWallet && !connectedAccount)) {
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(156, 156, 171, 0.5)",
          // backgroundColor: "white",
          zIndex: 10000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
        onClick={handleClose}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
            // border: "1px solid #d3d3d3",
            padding: "29px 24px 24px",
            // padding: "15px",
            maxWidth: "360px",
            width: "100%",
            mx: { xs: "20px", sm: "0" },
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.02)",
          }}
          onClick={stopPropagation}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <Box></Box>
            <Typography
              variant="h5"
              sx={{ color: (theme) => theme.palette.neutral.dark, mb: 2 }}
              fontWeight={500}
            >
              Connect Wallet
            </Typography>
            {/* <IconButton onClick={handleClose}> */}
            <Box onClick={handleClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <g clipPath="url(#clip0_640_30013)">
                  <path
                    d="M15 5L5 15"
                    stroke="#9C9CAB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 5L15 15"
                    stroke="#9C9CAB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_640_30013">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Box>
            {/* </IconButton> */}
          </Box>

          <Box>
            <SelectMassaWallet
              onClick={async (walletName) => {
                console.log(
                  "Selected wallet loking for name exactly:",
                  walletName
                );
                // setSelectedWalletName(walletName as unknown as WalletName);
                const wallet = wallets.find(
                  (w: Wallet) =>
                    w.name() === (walletName as unknown as WalletName)
                );
                console.log("Available wallets:", wallets);
                console.log("Selected wallet:", wallet?.name());
                if (wallet) {
                  await dispatch(setWallet(wallet));
                } else {
                  alert("Please launch your Massa wallet.");
                }
              }}
            />
          </Box>
          <Typography
            variant="body1"
            sx={{
              mt: 1,
              color: (theme) => theme.palette.neutral.medium,
              cursor: "pointer",
              ":hover": {
                color: (theme) => theme.palette.neutral.dark,
              },
            }}
            onClick={() => {
              window.open(MASSA_STATION_INSTALL, "_blank");
            }}
          >
            I don’t have a wallet
          </Typography>
        </Box>
      </Box>
    </>
  );
};
//   return null;
// };

export default ConnectWalletModal;

// import { Box, Typography, Button } from "@mui/material";
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setProvider } from "../redux/slices/accountSlice";
// import SelectMassaWallet from "./SelectMassaWallet";
// import { SUPPORTED_MASSA_WALLETS } from "../constants";
// import { AppDispatch, RootState } from "../redux/store";

// type Props = {};

// const ConnectWalletModal = (props: Props) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { currentProvider, providers, isFetching, connectedAccount } =
//     useSelector((state: RootState) => state.account);
//   const [selectedProvider, setSelectedProvider] = useState<
//     SUPPORTED_MASSA_WALLETS | undefined
//   >(currentProvider?.name() as SUPPORTED_MASSA_WALLETS);

//   if (
//     (!currentProvider && !isFetching) ||
//     (currentProvider && !connectedAccount)
//   ) {
//     return (
//       <Box
//         sx={{
//           position: "fixed",
//           inset: 0,
//           backgroundColor: (theme) =>
//             theme.palette.mode === "dark"
//               ? "rgba(0, 0, 0, 0.8)"
//               : "rgba(255, 255, 255, 0.8)",
//           zIndex: 1300,
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Box
//           sx={{
//             backgroundColor: (theme) => theme.palette.background.alt,
//             color: (theme) => theme.palette.text.primary,
//             borderRadius: "12px",
//             padding: { xs: "24px", sm: "48px" },
//             textAlign: "center",
//             boxShadow: 3,
//             maxWidth: "600px",
//             width: "90%",
//           }}
//         >
//           <Typography
//             variant="h2"
//             sx={{ mb: 2, color: (theme) => theme.palette.primary.main }}
//           >
//             Welcome to MassaNet
//           </Typography>
//           <Typography variant="body1" sx={{ mb: 4 }}>
//             The first fully on-chain social network built on the Massa
//             blockchain. Connect, share, and engage with others in a
//             decentralized way.
//           </Typography>
//           <SelectMassaWallet
//             onClick={(providerName) => {
//               setSelectedProvider(providerName);
//               const provider = providers.find((p) => p.name() === providerName);
//               if (provider) {
//                 dispatch(setProvider(provider));
//               } else {
//                 alert("Launch your Massa wallet");
//               }
//             }}
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{
//               mt: 3,
//               textTransform: "none",
//               fontSize: "16px",
//               fontWeight: "bold",
//               borderRadius: "8px",
//               px: 3,
//               py: 1.5,
//             }}
//           >
//             Connect Wallet
//           </Button>
//         </Box>
//       </Box>
//     );
//   }
//   return null;
// };

// export default ConnectWalletModal;

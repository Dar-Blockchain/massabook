import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../FlexBetween";
import { setMode, setUser } from "../../redux/slices/userSlice";
import { AppDispatch, RootState } from "../../redux/store";
import {
  setAccounts,
  setConnectedAccount,
  setCurrentWallet,
  setSelectedWallet,
} from "../../redux/slices/accountSlice";
import { shortenAddress } from "../../lib/utils";
import { WalletName } from "@massalabs/wallet-provider";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { currentWallet, accounts, connectedAccount } = useSelector(
    (state: RootState) => state.account
  );
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const [selectedAccount, setSelectedAccount] = useState(
    connectedAccount?.address || ""
  );
  console.log("connected account address", connectedAccount?.address);

  // const fullName = `${user.firstName} ${user.lastName}`;
  // const fullName = shortenAddress(user.user?.address || "", 3);

  const handleAccountChange = async (selectedAddress: string) => {
    setSelectedAccount(selectedAddress);
    if (currentWallet?.name() === WalletName.MassaStation) {
      const newAccount = (accounts ?? []).find(
        (acc) => acc.address === selectedAddress
      );

      if (newAccount) {
        console.log("Switching to account:", newAccount.address);
        // Update Redux state with the new account
        dispatch(setConnectedAccount(newAccount));
        // Optionally update localStorage
        localStorage.setItem("massastation_account", newAccount.address);
        // Optionally refresh the app state
        navigate("/home");
      }
    }
  };

  const handleMassaWalletDisconnect = async () => {
    setSelectedWallet(undefined);
    console.log("Disconnecting from Massa Wallet...");
    console.log("Current wallet name:", currentWallet?.name());
    if (currentWallet?.name() === WalletName.Bearby) {
      console.log("inside bearby");
      await currentWallet?.disconnect();
      console.log("inside bearby after await");
    }
    if (currentWallet?.name() === WalletName.MassaStation) {
      localStorage.removeItem("massastation_account");
      localStorage.removeItem("wallet");
      dispatch(setAccounts([]));
      dispatch(setConnectedAccount(undefined));
    }
    await dispatch(setCurrentWallet(undefined));
    await dispatch(setUser(null));
    console.log("Navigating to /");
    // navigate("/", { replace: true });
    setTimeout(() => navigate("/", { replace: true }), 100);
    // window.location.href = "/";
  };

  useEffect(() => {
    setSelectedAccount(connectedAccount?.address || "");
  }, [connectedAccount]);

  return (
    <FlexBetween
      padding="1rem 6%"
      sx={{
        backgroundColor: alt,
      }}
    >
      <FlexBetween gap="1.75rem">
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/home")}
        >
          <Box
            component="img"
            src="/assets/images/massa.jpg"
            sx={{ width: 40, height: 40, borderRadius: "50%" }}
          />
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            // onClick={() => navigate("/home")}
            sx={{
              color: (theme) => theme.palette.neutral.dark,
              // "&:hover": {
              //   color: primaryLight,
              //   cursor: "pointer",
              // },
            }}
          >
            Massabook
          </Typography>
        </Box>
        {isNonMobileScreens && (
          <FlexBetween
            sx={{
              backgroundColor: neutralLight,
            }}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <Message sx={{ fontSize: "25px" }} />
          <Notifications sx={{ fontSize: "25px" }} />
          <Help sx={{ fontSize: "25px" }} />

          <FormControl variant="standard">
            <Select
              value={selectedAccount}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              {currentWallet?.name() === WalletName.MassaStation ? (
                (accounts ?? []).map((account) => (
                  <MenuItem
                    key={account.address}
                    value={account.address}
                    onClick={() => handleAccountChange(account.address)}
                  >
                    {/* {account.accountName}  */}
                    {shortenAddress(account.address, 3)}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={selectedAccount}>
                  <Typography>{shortenAddress(selectedAccount, 3)}</Typography>
                </MenuItem>
              )}
              <MenuItem
                //  onClick={() => dispatch(setLogout())}
                onClick={handleMassaWalletDisconnect}
              >
                Log Out
              </MenuItem>
            </Select>
          </FormControl>
          {/* <Avatar
            src={user.user?.avatar || "/images/avatar default.png"}
            alt={user.user?.name || "Placeholder Avatar"}
            sx={{
              width: 40,
              height: 40,
              cursor: "pointer",
              "&:hover": {
                border: `2px solid ${primaryLight}`,
              },
            }}
          /> */}
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          sx={{
            backgroundColor: background,
          }}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard">
              <Select
                value={selectedAccount}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                {currentWallet?.name() === WalletName.MassaStation ? (
                  (accounts ?? []).map((account) => (
                    <MenuItem
                      key={account.address}
                      value={account.address}
                      onClick={() => handleAccountChange(account.address)}
                    >
                      {/* {account.accountName}  */}
                      {shortenAddress(account.address, 3)}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={selectedAccount}>
                    <Typography>
                      {shortenAddress(selectedAccount, 3)}
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem onClick={handleMassaWalletDisconnect}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;

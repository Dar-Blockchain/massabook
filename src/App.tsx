import "./App.css";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import {
  Backdrop,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { themeSettings } from "./theme";
import { AppDispatch, RootState } from "./redux/store";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/homePage";
import ProfilePage from "./components/profilePage";
import {
  checkUserProfile,
  getUserContract,
  getUserProfile,
} from "./redux/slices/userSlice";
import ProfileSetupPage from "./components/ProfileSetupPage";
// import { useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import { useNavigate } from "react-router-dom";
import CreatePage from "./components/createPagePage";
import LearnMorePage from "./components/LearnMorePage";
import UpdateProfilePage from "./components/UpdateProfile";

function App() {
  const mode = useSelector((state: RootState) => state.user.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const dispatch = useDispatch<AppDispatch>();
  const { currentWallet, connectedAccount } = useSelector(
    (state: RootState) => state.account
  );
  // const user = useSelector((state: RootState) => state.user.user);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccount = async () => {
      if (currentWallet && connectedAccount) {
        // Use the connected account's address as the userId
        const userContractAddress = await dispatch(
          getUserContract(connectedAccount.address)
        ).unwrap();

        if (userContractAddress) {
          console.log(
            "User account exists; navigate to home and the address is",
            userContractAddress
          );
          // User account exists; navigate to home
          navigate("/home");
          const fetchProfile = async () => {
            if (connectedAccount) {
              try {
                // Dispatch the thunk with the user's address.
                await dispatch(
                  getUserProfile(connectedAccount.address)
                ).unwrap();
                // Now the Redux store's user property is populated.
                navigate("/home");
              } catch (error) {
                console.error("Failed to fetch user profile:", error);
                // Optionally redirect to profile setup if profile is missing.
                navigate("/profile-setup");
              }
            }
          };
          fetchProfile();
        } else {
          // No user contract found; redirect to profile setup page
          navigate("/profile-setup");
        }
      }
    };
    checkAccount();
  }, [currentWallet, connectedAccount]);

  // useEffect(() => {
  //   console.log("currentWallet&&&&", currentWallet);
  //   console.log("connectedAccount&&&&&", connectedAccount);
  //   const checkProfile = async () => {
  //     if (currentWallet && connectedAccount?.address) {
  //       setIsCheckingProfile(true);
  //       await dispatch(checkUserProfile());
  //       setIsCheckingProfile(false);
  //       navigate("/home");
  //     }
  //   };
  //   checkProfile();
  // }, [currentWallet, connectedAccount, dispatch]);

  return (
    <>
      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* <ConnectWalletModal /> */}
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 9999,
            }}
            open={isCheckingProfile}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/learn-more" element={<LearnMorePage />} />

            <Route path="/profile-setup" element={<ProfileSetupPage />} />
            <Route path="/update-profile" element={<UpdateProfilePage />} />
            <Route path="/home" element={<HomePage />} />

            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/create-page" element={<CreatePage />} />
          </Routes>
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;

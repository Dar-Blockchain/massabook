import { Backdrop, Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/SuggestedPagesWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkUserProfile } from "../../redux/slices/userSlice";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const { currentWallet, connectedAccount } = useSelector(
    (state: RootState) => state.account
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  useEffect(() => {
    const verifyUserProfile = async () => {
      if (currentWallet && connectedAccount) {
        const profile = await dispatch(checkUserProfile()).unwrap();

        if (profile === null) {
          console.log(
            "First-time login detected, redirecting to /profile-setup"
          );
          navigate("/profile-setup");
        }
      }
      setIsCheckingProfile(false);
    };

    verifyUserProfile();
  }, [currentWallet, connectedAccount, dispatch, navigate]);

  useEffect(() => {
    if (user == null) {
      console.log("User is null, redirecting to /");
      navigate("/");
    }
    console.log("user", user);
  }, [user, navigate]);

  return (
    <Box>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 9999,
        }}
        open={isCheckingProfile}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget
            userId={user?.address ?? ""}
            picturePath={user?.avatar ?? ""}
          />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user?.avatar ?? ""} />
          <PostsWidget userId={user?.address} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={user?.address} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;

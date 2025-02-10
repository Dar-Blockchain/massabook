import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/SuggestedPagesWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import { RootState } from "../../redux/store";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { checkUserProfile } from "../../redux/slices/userSlice";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  // const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  // const { currentWallet, connectedAccount } = useSelector(
  //   (state: RootState) => state.account
  // );

  // const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  // this is juust mocked data for now
  const posts = [
    {
      _id: "1",
      userId: "1",
      firstName: "John",
      lastName: "Doe",
      description: "Hello World",
      location: "Tunis, Tunisia",
      picturePath: "/assets/images/rock.jpg",
      userPicturePath: "/assets/images/avatar default.png",
      likes: {
        "1": true,
      },
      comments: [],
    },
    {
      _id: "2",
      userId: "2",
      firstName: "Jane",
      lastName: "Doe",
      description: "Hello World",
      location: "Tunis, Tunisia",
      picturePath: "/assets/images/butterfly.jpg",
      userPicturePath: "/assets/images/avatar default.png",
      likes: {
        "1": true,
      },
      comments: [],
    },
    {
      _id: "3",
      userId: "3",
      firstName: "John",
      lastName: "Smith",
      description: "Hello World",
      location: "Tunis, Tunisia",
      picturePath: "/assets/images/birds.jpg",
      userPicturePath: "/assets/images/avatar default.png",
      likes: {
        "1": true,
      },
      comments: ["This is a first comment", "This is a second comment"],
    },
  ];

  return (
    <Box>
      {/* <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 9999,
        }}
        open={isCheckingProfile}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
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
          <PostsWidget userId={user?.address} posts={posts} />
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

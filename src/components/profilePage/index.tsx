import { Box, useMediaQuery } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ProfilePage = () => {
  // const [user, setUser] = useState(null);
  const user = useSelector((state: RootState) => state.user.user);
  const { userId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  // const user = {
  //   firstName: "Farouk",
  //   lastName: "Allani",
  //   location: "Tunis, Tunisia",
  //   occupation: "Software Engineer",
  //   picturePath: "https://randomuser.me/api/portraits",
  //   viewedProfile: 100,
  //   impressions: 1000,
  //   friends: [],
  // };

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={user.address} picturePath={user.avatar} />
          <Box m="2rem 0" />
          <FriendListWidget userId={user.address} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={""} />
          <Box m="2rem 0" />
          <PostsWidget userId={user.address} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;

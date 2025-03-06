import { Box, useMediaQuery } from "@mui/material";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect } from "react";
import { fetchUserPosts } from "../../redux/slices/userSlice";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { userId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const dispatch = useDispatch<AppDispatch>();
  const { posts } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserPosts(userId));
    }
  }, [userId, dispatch]);

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
          <PostsWidget userId={userId} isProfile posts={posts} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;

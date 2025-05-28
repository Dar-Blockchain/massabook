import { Box, useMediaQuery } from "@mui/material";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/ProfilePostsWidget";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect,useState } from "react";
// import { fetchUserPosts } from "../../redux/slices/userSlice";
import { getContractAddressForUser,getProfile, getUserPosts } from "../../services/getProfile";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [profile,setProfile] = useState<any>(null)
  const [posts,setPosts] = useState<any>(null)

  const { userId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
 // const dispatch = useDispatch<AppDispatch>();
  //const posts = useSelector((state: RootState) => state.user);
  const { connectedAccount } = useSelector(
    (state: RootState) => state.account
  );
  console.log(posts,"1111111")
  // useEffect(() => {
  //   if (userId) {
  //     dispatch(fetchUserPosts(userId));
  //   }
  // }, [userId, dispatch]);

  useEffect(() => {
    async function getUserP(){
      if(userId && connectedAccount){
      const userProfile = await getContractAddressForUser(userId,connectedAccount);
      const  profile = await getProfile(userId,userProfile,connectedAccount)
      const posts = await getUserPosts(userId,userProfile,connectedAccount)
      setPosts(posts)
      setProfile(profile)
      console.log(profile,"1aaaaaaaa")
      }
    }
    getUserP()

    console.log(profile,"0aaaaaaaa")

  }, [userId,connectedAccount]);
  if (!user) return null;

  return (
    profile ? (
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
            <UserWidget userId={profile.address} picturePath={profile.avatar} name={profile.firstName + " " + profile.lastName} city={profile.city} country={profile.country} bio={profile.bio} telegram={profile.telegram} twitter={profile.xHandle}/>
            <Box m="2rem 0" />
            <FriendListWidget userId={user.address} />
          </Box>
          <Box
            flexBasis={isNonMobileScreens ? "42%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            <MyPostWidget picturePath={profile.avatar} />
            <Box m="2rem 0" />
            <PostsWidget userId={userId} isProfile={true} posts={posts} friPosts={posts} />
          </Box>
        </Box>
      </Box>
    ) : null // Instead of showing "Loading..." it will render nothing
  );
  
};

export default ProfilePage;

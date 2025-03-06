import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch,RootState } from "../../redux/store";
import {getContractAddressForUser,getProfile} from "../../services/getProfile"
// import { setPosts } from "state";
import PostWidget from "./PostWidget";

type PostsWidgetProps = {
  userId: string | undefined;
  isProfile?: boolean;
  // posts: {
  //   _id: string;
  //   userId: string;
  //   firstName: string;
  //   lastName: string;
  //   description: string;
  //   location: string;
  //   picturePath: string;
  //   userPicturePath: string;
  //   likes: Record<string, boolean>;
  //   comments: string[];
  // }[];
  posts: any[];
};

const PostsWidget = ({
  userId,
  isProfile = false,
  posts,
}: PostsWidgetProps) => {
  const { currentWallet, connectedAccount } = useSelector(
    (state: RootState) => state.account
  );
  const {user} = useSelector(
    (state: RootState) => state.user
  );
  useEffect(() => {
        // Use the connected account's address as the userId

          // User account exists; navigate to home
          const fetchProfile = async () => {
            if (connectedAccount) {
            const profileAddress = await getContractAddressForUser(userId,connectedAccount)
            console.log("this is new "+profileAddress)
         
            
              try {
                const profile =await getProfile(userId,profileAddress,connectedAccount)
                console.log("profile new "+profile)
              } catch (error) {
                console.error("Failed to fetch user profile:", error);
                // Optionally redirect to profile setup if profile is missing.
              }
            
          };
        }
          fetchProfile();
        
      
  }, [currentWallet, connectedAccount]);
  return (
    <>
      {posts?.map(
        ({
          id,
          userId,
          // author,
          // lastName,
          text,
          // location,
          image,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={id}
            postId={id}
            postUserId={userId}
            name={user?.firstName+" "+user?.lastName}
            description={text}
            location={user?.city}
            picturePath={image || "/assets/images/rock.jpg"}
            userPicturePath={
              userPicturePath || "/assets/images/avatar default.png"
            }
            likes={likes || { "1": true }}
            comments={comments || []}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;

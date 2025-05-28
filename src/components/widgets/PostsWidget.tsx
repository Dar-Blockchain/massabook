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
  friPosts: any[];
};

const PostsWidget = ({
  userId,
  isProfile = false,
  posts,
  friPosts
}: PostsWidgetProps) => {
  const { currentWallet, connectedAccount } = useSelector(
    (state: RootState) => state.account
  );
  const {user} = useSelector(
    (state: RootState) => state.user
  );
  console.log(posts,"...............")
  console.log(friPosts,"...............")

  useEffect(() => {
    // Use the connected account's address as the userId

      // User account exists; navigate to home
      const fetchPosts = async () => {
        if (connectedAccount) {
        friPosts.map(async (friPost) => {
          console.log(friPost);
        })
        
      };
    }
      fetchPosts();
    
  
}, [currentWallet, connectedAccount]);

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
      {friPosts?.map(
        ({
          id,
          author,
          // author,
          authorName,
          authorAvatar,
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
            postUserId={author}
            name={authorName}
            description={text}
            location={user?.city}
            picturePath={image!="https://" && image!="" ? image :  "/assets/images/rock.jpg"}
            userPicturePath={
              authorAvatar || "/assets/images/avatar default.png"
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

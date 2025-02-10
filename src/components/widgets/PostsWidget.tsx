// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
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
            name={`Farouk Allani`}
            description={text}
            location={"Tunis, Tunisia"}
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

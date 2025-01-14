// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setPosts } from "state";
import PostWidget from "./PostWidget";

type PostsWidgetProps = {
  userId: string | undefined;
  isProfile?: boolean;
};

const PostsWidget = ({ userId, isProfile = false }: PostsWidgetProps) => {
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
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;

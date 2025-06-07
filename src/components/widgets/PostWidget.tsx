import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Collapse,
  TextField,
  Button,
} from "@mui/material";

import { useEffect, useState } from "react";
import WidgetWrapper from "../WidgetWrapper";
import Friend from "../Friend";
import FlexBetween from "../FlexBetween";
import { commentPost, getLikesofPost, getFactoryPostComments, likePost, testDeletePost } from "../../services/getProfile";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserImage from "../UserImage";
import { useNavigate } from "react-router-dom";

type PostWidgetProps = {
  postId: string;
  postUserId: string;
  name: string;
  description: string;
  location: string | undefined;
  picturePath: string;
  userPicturePath: string;
  likes: Record<string, boolean>;
  comments: number;
};

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}: PostWidgetProps) => {
  const [isComments, setIsComments] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [fetchedComments, setFetchedComments] = useState<any>(null);
  const [likesCount, setLikesCount] = useState(0);

  const isLiked = true;
  const likeCount = 5;
  const { currentWallet, connectedAccount } = useSelector(
    (state: RootState) => state.account
  );
  const { palette } = useTheme();
  const navigate = useNavigate();

  const main = palette.neutral.main;
  const primary = palette.primary.main;
  
  const handleAddComment = async() => {
    const resp = await commentPost(connectedAccount,postUserId,newComment,postId)
    setNewComment("");
  };
  useEffect(() => {
    const getLikes = async() => {
      const _likes = await getLikesofPost(connectedAccount,postUserId,postId)
      console.log(_likes,"likes")
      setLikesCount(_likes.length)
    }
    getLikes()
  },[connectedAccount])
  const handleLikes = async() => {
    await likePost(connectedAccount,postUserId,postId)
  }
  const handleDeletePost = async() => {
    try {
      if (!connectedAccount) {
        console.error('No connected account');
        return;
      }
      
      const success = await testDeletePost(connectedAccount, BigInt(postId));
      if (success) {
        console.log('Post deleted successfully');
        // You might want to trigger a refresh of posts here
        window.location.reload(); // Simple refresh, consider using a more elegant state update
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  }
  const handlegetCommants = async() => {
    if(!isComments){  
      console.log(connectedAccount,"77777777777777")
      console.log(postUserId,"postUserId")
      console.log(postId,"postId")

    const _comments = await getFactoryPostComments(connectedAccount,postUserId, BigInt(postId));
    console.log(_comments);
    setFetchedComments(_comments);
    setIsComments(true);
    }
    else{
      setIsComments(false);
    }
  }
  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${picturePath}`}
        />
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => handleLikes()}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likesCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => handlegetCommants()}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{fetchedComments ? fetchedComments.length : comments}</Typography> 
          
          </FlexBetween>
        </FlexBetween>

        {/* Show delete button only for post owner */}
        {connectedAccount?.address === postUserId && (
          <IconButton 
            onClick={handleDeletePost}
            sx={{ 
              color: palette.neutral.medium,
              "&:hover": {
                color: palette.error.main,
              }
            }}
          >
            <DeleteOutlined />
          </IconButton>
        )}
      </FlexBetween>

      {/* Smooth transition for comments and input field */}
      <Collapse in={isComments} timeout="auto" unmountOnExit>
        <Box mt="0.5rem">
          {fetchedComments?.map((comment:any, i:any) => (
            <Box key={`${comment.id}-${i}`}>
              <Divider />
              <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={comment.commenterAvatar} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${comment.commenter}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {comment.commenterName}
          </Typography>
          <Typography  fontSize="0.75rem">
            {comment.text}
          </Typography>
        </Box>
      </FlexBetween>
      {/* <IconButton
        // onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton> */}
    </FlexBetween>
              
            </Box>
          ))}
          {/* {comments?.length > 0 && <Divider />} */}

          {/* Add a new comment input */}
          <Box
            display="flex"
            alignItems="center"
            gap="0.5rem"
            mt="1rem"
            pl="1rem"
            pr="1rem"
          >
            <TextField
              variant="outlined"
              placeholder="Add a comment..."
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <Button
              // variant="contained"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              sx={{
                color: palette.background.alt,
                backgroundColor: palette.primary.main,
                borderRadius: "8px",
                textTransform: "none",
                "&.Mui-disabled": {
                  color: "white",
                },
              }}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Collapse>
    </WidgetWrapper>
  );
};

export default PostWidget;

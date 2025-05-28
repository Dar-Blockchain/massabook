import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
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

import { useState } from "react";
import WidgetWrapper from "../WidgetWrapper";
import Friend from "../Friend";
import FlexBetween from "../FlexBetween";
import { commentPost, getPostComments } from "../../services/getProfile";
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
  comments: string[];
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
}: PostWidgetProps) => {
  const [isComments, setIsComments] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<any>(null);


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
  const handlegetCommants = async() => {
    if(!isComments){  
      console.log(connectedAccount,"77777777777777")
    const _comments = await getPostComments(connectedAccount,postUserId, postId);
    console.log(_comments);
    setComments(_comments);
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
            <IconButton>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => handlegetCommants()}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            {/* <Typography>{comments?.length}</Typography> */}
            <IconButton>
              {/* Repost/Forward Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M5 4a2 2 0 0 0-2 2v6H0l4 4l4-4H5V6h7l2-2zm10 4h-3l4-4l4 4h-3v6a2 2 0 0 1-2 2H6l2-2h7z"
                ></path>
              </svg>
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {/* Smooth transition for comments and input field */}
      <Collapse in={isComments} timeout="auto" unmountOnExit>
        <Box mt="0.5rem">
          {comments?.map((comment:any, i:any) => (
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

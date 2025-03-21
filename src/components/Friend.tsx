import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
// import { RootState } from "../redux/store";

type FriendProps = {
  friendId: string;
  name: string;
  subtitle: string | undefined;
  userPicturePath: string;
};

const Friend = ({ friendId, name, subtitle, userPicturePath }: FriendProps) => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const friends = [
    {
      _id: "1",
      name: "John Doe",
      subtitle: "Software Engineer",
      userPicturePath: "https://randomuser.me/api/portraits",
    },
    {
      _id: "2",
      name: "Jane Doe",
      subtitle: "Software Engineer",
      userPicturePath: "https://randomuser.me/api/portraits",
    },
    {
      _id: "3",
      name: "John Smith",
      subtitle: "Software Engineer",
      userPicturePath: "https://randomuser.me/api/portraits",
    },
  ];

  const isFriend = friends.find((friend) => friend._id === friendId);

  // const patchFriend = async () => {
  //   const response = await fetch(
  //     `http://localhost:3001/users/${_id}/${friendId}`,
  //     {
  //       method: "PATCH",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   const data = await response.json();
  //   dispatch(setFriends({ friends: data }));
  // };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
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
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
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
  );
};

export default Friend;

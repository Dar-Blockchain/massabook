import {
  EditOutlined,
  LocationOnOutlined,
  Telegram,
  X,
  InfoOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "../WidgetWrapper";
import FlexBetween from "../FlexBetween";
import UserImage from "../UserImage";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { getFollowersNBR } from "../../services/getProfile";

type UserWidgetProps = {
  userId: string;
  picturePath: string;
  name : string;
  city:string;
  country:string;
  bio:string;
  telegram:string;
  twitter:string;
};

const UserWidget = ({ userId, picturePath,name,city,country ,bio,telegram,twitter}: UserWidgetProps) => {
  // const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  // const token = useSelector((state: RootState) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const [NbFollows, setNbFollows] = useState(0);
  const { connectedAccount } = useSelector(
    (state: RootState) => state.account
  );

  // Check if the current user is viewing their own profile
  const isOwnProfile = connectedAccount?.address === userId;

  useEffect(() => {
    const fetchNBFollowers = async () => {
      if (userId && connectedAccount) {
        try {
          const nbr = await getFollowersNBR(connectedAccount,userId);
          setNbFollows(Number(nbr));
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // Optionally redirect to profile setup if profile is missing.
        }
      }
    };
    fetchNBFollowers();
    }, [userId,connectedAccount]);
  const userMock = {
    firstName: "Farouk",
    lastName: "Allani",
    location: "Tunis, Tunisia",
    occupation: "Software Engineer",
    viewedProfile: 100,
    impressions: 1000,
    friends: [],
  };

  if (!userMock) {
    return null;
  }

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box onClick={() => navigate(`/profile/${userId}`)}>
            <Typography
              variant="h4"
              color={dark}
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
            {/* <Typography color={medium}>{friends.length} friends</Typography> */}
          </Box>
        </FlexBetween>
        {isOwnProfile && (
          <IconButton
            onClick={() => navigate(`/update-profile`)}
            sx={{ cursor: "pointer" }}
          >
            <EditOutlined />
          </IconButton>
        )}
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="medium" sx={{ color: main }} />
          <Typography color={medium}>
            {city}, {country || "No location"}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <InfoOutlined fontSize="medium" sx={{ color: main }} />
          <Typography color={medium}>{bio}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Total Followers</Typography>
          <Typography color={main} fontWeight="500">
            {NbFollows}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography
          fontSize="1rem"
          color={main}
          fontWeight="500"
          mb="1rem"
          textAlign="left"
        >
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            {/* <img src="../assets/twitter.png" alt="twitter" /> */}
            <X sx={{ color: main }} />
            <Box>
              <Typography color={main} fontWeight="500" textAlign="left">
                X
              </Typography>
              <Typography color={medium}>
                {twitter || "No X account"}
              </Typography>
            </Box>
          </FlexBetween>
          {/* <IconButton
            onClick={() => navigate(`/update-profile`)}
            sx={{ cursor: "pointer" }}
          >
            <EditOutlined sx={{ color: main }} />
          </IconButton> */}
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <Telegram sx={{ color: main }} />
            {/* <img src="../assets/linkedin.png" alt="linkedin" /> */}
            <Box>
              <Typography color={main} fontWeight="500" textAlign="left">
                Telegram
              </Typography>
              <Typography color={medium}>
                {" "}
                {telegram || "No Telegram account"}{" "}
              </Typography>
            </Box>
          </FlexBetween>
          {/* <IconButton
            onClick={() => navigate(`/update-profile`)}
            sx={{ cursor: "pointer" }}
          >
            <EditOutlined sx={{ color: main }} />
          </IconButton> */}
        </FlexBetween>
      </Box>
      <Divider />

      {/* FIFTH ROW - Create Page CTA */}
     
    </WidgetWrapper>
  );
};

export default UserWidget;

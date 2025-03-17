import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  Telegram,
  X,
  AddCircleOutline,
  Biotech,
  InfoOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  IconButton,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "../WidgetWrapper";
import FlexBetween from "../FlexBetween";
import UserImage from "../UserImage";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type UserWidgetProps = {
  userId: string;
  picturePath: string;
  name : string;
  city:string;
  country:string;
  bio:string;
};

const UserWidget = ({ userId, picturePath,name,city,country ,bio}: UserWidgetProps) => {
  // const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  // const token = useSelector((state: RootState) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const user = useSelector((state: RootState) => state.user.user);

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

  const { location, occupation, viewedProfile, impressions, friends } =
    userMock;

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
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        {/* <IconButton
          onClick={() => navigate(`/update-profile`)}
          sx={{ cursor: "pointer" }}
        >
          <ManageAccountsOutlined />
        </IconButton> */}
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
            250
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Communities Joined</Typography>
          <Typography color={main} fontWeight="500">
            8
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
                {user?.xHandle || "No X account"}
              </Typography>
            </Box>
          </FlexBetween>
          <IconButton
            onClick={() => navigate(`/update-profile`)}
            sx={{ cursor: "pointer" }}
          >
            <EditOutlined sx={{ color: main }} />
          </IconButton>
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
                {user?.telegram || "No Telegram account"}{" "}
              </Typography>
            </Box>
          </FlexBetween>
          <IconButton
            onClick={() => navigate(`/update-profile`)}
            sx={{ cursor: "pointer" }}
          >
            <EditOutlined sx={{ color: main }} />
          </IconButton>
        </FlexBetween>
      </Box>
      <Divider />

      {/* FIFTH ROW - Create Page CTA */}
      <Box p="1rem 0">
        <Typography
          fontSize="1rem"
          color={main}
          fontWeight="500"
          mb="0.5rem"
          textAlign="left"
        >
          Grow Your Presence
        </Typography>
        <Button
          // variant="contained"
          // color="primary"
          // startIcon={<AddCircleOutline />}
          onClick={() => navigate("/create-page")}
          // fullWidth
          sx={{
            textTransform: "none",
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "8px",
          }}
        >
          <AddCircleOutline sx={{ marginRight: "5px" }} />
          Create a New Page
        </Button>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;

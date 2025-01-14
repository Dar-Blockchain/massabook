import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  Collapse,
} from "@mui/material";

import Dropzone from "react-dropzone";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import WidgetWrapper from "../WidgetWrapper";
import FlexBetween from "../FlexBetween";
import UserImage from "../UserImage";

type MyPostWidgetProps = {
  picturePath: string;
};

const MyPostWidget = ({ picturePath }: MyPostWidgetProps) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const user = useSelector((state: RootState) => state.user);

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage
          image={user.user?.avatar || "/assets/images/avatar default.png"}
        />
        <InputBase
          placeholder="What's on your mind..."
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>

      {/* Smoothly collapse/expand the image upload area */}
      <Collapse in={isImage} timeout="auto" unmountOnExit>
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <Typography color={palette.neutral.main}>
                      Add Image Here
                    </Typography>
                  ) : (
                    <FlexBetween>
                      <Typography color={palette.neutral.main}>
                        {image.name}
                      </Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ marginLeft: "1rem" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      </Collapse>

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween
          gap="0.25rem"
          onClick={() => setIsImage(!isImage)}
          sx={{ "&:hover": { cursor: "pointer", color: medium } }}
        >
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography color={mediumMain}>Image</Typography>
        </FlexBetween>

        <Button
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;

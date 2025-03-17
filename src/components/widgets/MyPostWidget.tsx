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
  CircularProgress,
} from "@mui/material";

import Dropzone from "react-dropzone";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import WidgetWrapper from "../WidgetWrapper";
import FlexBetween from "../FlexBetween";
import UserImage from "../UserImage";
import { createUserPost } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";

type MyPostWidgetProps = {
  picturePath: string;
};

const MyPostWidget = ({ picturePath }: MyPostWidgetProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [postText, setPostText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>("");

  const [image, setImage] = useState<File | null>(null);
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const user = useSelector((state: RootState) => state.user);

  const handlePost = async () => {
    console.log("aaaaa")
    if (!postText.trim() && !imageURL) return;
    setLoading(true);

    try {
      // Convert image to base64 if exists
      const imageBase64 = imageURL ? imageURL  : "";

      await dispatch(
        createUserPost({
          text: postText,
          image: imageBase64 || "", // Or handle IPFS upload here
        })
      ).unwrap();

      setPostText("");
      setImage(null);
      setImagePreview(null);
      setIsImage(false);
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImage(file);
      // Create an image preview URL
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage
          image={picturePath || "/assets/images/avatar default.png"}
        />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPostText(e.target.value)}
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
           <FlexBetween gap="1.5rem">
       
        <InputBase
          placeholder="Image URL"
          onChange={(e) => setImageURL(e.target.value)}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
         
          {/* Optionally display an image preview */}
          {imagePreview && (
            <Box mt="1rem">
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            </Box>
          )}
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
          onClick={handlePost}
          //disabled={!postText.trim() && !image}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "POST"}
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;

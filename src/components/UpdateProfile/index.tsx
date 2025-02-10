// ProfileSetupPage.tsx

import {
  Box,
  Button,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
  Grid,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserAccount,
  Profile,
  updateProfile,
} from "../../redux/slices/userSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import WidgetWrapper from "../WidgetWrapper";

const UpdateProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connectedAccount } = useSelector((state: RootState) => state.account);
  const { user } = useSelector((state: RootState) => state.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [telegram, setTelegram] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { palette } = useTheme();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setBio(user.bio);
      setCountry(user.country);
      setCity(user.city);
      setTelegram(user.telegram);
      setXHandle(user.xHandle);
      setAvatarBase64(user.avatar);
    }
  }, [user]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarBase64(result);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast.error("Failed to read the selected image.");
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connectedAccount) {
      toast.error("No connected account");
      return;
    }

    if (!avatarBase64) {
      toast.error("Please upload an avatar image before saving.");
      return;
    }

    console.log("avatar base64", avatarBase64);

    const profileData = new Profile(
      connectedAccount.address,
      firstName,
      lastName,
      avatarBase64,
      bio,

      country,
      city,
      telegram,
      xHandle
    );

    setLoading(true);

    try {
      await toast.promise(dispatch(updateProfile(profileData)).unwrap(), {
        pending: "Saving profile...",
        success: "Profile saved successfully!",
        error: "Failed to save profile.",
      });

      window.location.href = "/home";
      // navigate("/home");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (!connectedAccount) {
  //     console.error("No connected account found, redirecting to /");
  //     navigate("/");
  //   }
  // }, [connectedAccount, navigate]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Navbar />

      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        padding="2rem 6%"
        sx={{ minHeight: "calc(100vh - 64px)" }}
      >
        <Box
          width={{ xs: "100%", sm: "80%", md: "60%" }}
          display="flex"
          flexDirection="column"
          gap="2rem"
        >
          <WidgetWrapper>
            <Typography
              variant="h5"
              fontWeight="500"
              mb="1.5rem"
              textAlign="center"
            >
              Update Profile
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="First Name"
                    fullWidth
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    margin="normal"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                  <TextField
                    label="Last Name"
                    fullWidth
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    margin="normal"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />

                  <TextField
                    label="Bio"
                    fullWidth
                    multiline
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    margin="normal"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />

                  <TextField
                    label="Country"
                    fullWidth
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    margin="normal"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />

                  <TextField
                    label="City"
                    fullWidth
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    margin="normal"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={6}>
                  {/* Dropzone area for avatar upload */}
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: "2px dashed #ccc",
                      borderRadius: "8px",
                      padding: "1rem",
                      textAlign: "center",
                      cursor: "pointer",
                      my: "1rem",
                      backgroundColor: isDragActive
                        ? "#f0f0f0"
                        : palette.mode === "dark"
                        ? "#333"
                        : "#fff",
                    }}
                  >
                    <input {...getInputProps()} />
                    {avatarBase64 ? (
                      <Box>
                        <Typography variant="body1" mb={1}>
                          Image selected:
                        </Typography>
                        <img
                          src={avatarBase64}
                          alt="Selected avatar"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            borderRadius: "8px",
                          }}
                        />
                      </Box>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        {isDragActive
                          ? "Drop the image here..."
                          : "Drag & drop an avatar image, or click to select"}
                      </Typography>
                    )}
                  </Box>

                  <TextField
                    label="Telegram"
                    fullWidth
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    margin="normal"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />

                  <TextField
                    label="X Handle"
                    fullWidth
                    value={xHandle}
                    onChange={(e) => setXHandle(e.target.value)}
                    margin="normal"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="center" mt={3}>
                <Button
                  type="submit"
                  sx={{
                    textTransform: "none",
                    color: palette.background.alt,
                    backgroundColor: palette.primary.main,
                    borderRadius: "8px",
                    width: "fit-content",
                    px: "1.5rem",
                  }}
                  disabled={loading}
                >
                  Update Profile
                </Button>
              </Box>
            </form>
          </WidgetWrapper>
        </Box>
      </Box>
    </>
  );
};

export default UpdateProfilePage;

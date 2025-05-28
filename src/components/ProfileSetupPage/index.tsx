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
  Chip,
  FormHelperText,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserAccount, Profile } from "../../redux/slices/userSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
// import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import WidgetWrapper from "../WidgetWrapper";

const ProfileSetupPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connectedAccount } = useSelector((state: RootState) => state.account);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [telegram, setTelegram] = useState("");
  const [xHandle, setXHandle] = useState("");
  // const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [avatarURL, setavatarURL] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  const { palette } = useTheme();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [topicsError, setTopicsError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const suggestedTopics = [
    "Blockchain Fundamentals",
    "Smart Contracts",
    "DeFi",
    "NFTs",
    "Web3 Development",
    "Crypto Investing",
    "DAOs",
    "Metaverse",
    "AI & Blockchain",
    "Cybersecurity",
    "Decentralized Storage",
    "Tokenomics",
    "DApp Development",
    "Web3 Gaming",
    "Regulatory Compliance",
  ];

  const handleTopicClick = (topic: string) => {
    const isSelected = selectedTopics.includes(topic);
    let newTopics: string[];

    if (isSelected) {
      newTopics = selectedTopics.filter((t) => t !== topic);
    } else {
      if (selectedTopics.length >= 5) return;
      newTopics = [...selectedTopics, topic];
    }

    setSelectedTopics(newTopics);

    // Validation
    if (newTopics.length < 3) {
      setTopicsError(
        `Select at least 3 topics (${3 - newTopics.length} more needed)`
      );
    } else {
      setTopicsError("");
    }
  };

  // const onDrop = useCallback((acceptedFiles: File[]) => {
  //   const file = acceptedFiles[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const result = reader.result as string;
  //     setAvatarBase64(result);
  //   };
  //   reader.onerror = (error) => {
  //     console.error("Error reading file:", error);
  //     toast.error("Failed to read the selected image.");
  //   };
  //   reader.readAsDataURL(file);
  // }, []);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   accept: {
  //     "image/*": [],
  //   },
  //   multiple: false,
  // });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connectedAccount) {
      toast.error("No connected account");
      return;
    }

    if (!avatarURL) {
      toast.error("Please add an avatar image URL before saving.");
      return;
    }

    const profileData = new Profile(
      connectedAccount.address,
      firstName,
      lastName,
      avatarURL,
      bio,
      country,
      city,
      telegram,
      xHandle
    );

    setLoading(true);

    try {
      await toast.promise(dispatch(createUserAccount(profileData)).unwrap(), {
        pending: "Saving profile...",
        success: "Profile saved successfully!",
        error: "Failed to save profile.",
      });

      setIsModalOpen(true);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = "/home";
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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

      <Dialog 
        open={isModalOpen} 
        onClose={() => {}} 
        disableEscapeKeyDown
      >
        <DialogTitle>Profile Creation In Progress</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your profile is being created on the blockchain. This may take a few moments.
            You will be automatically redirected to the home page in {countdown} seconds.
          </DialogContentText>
        </DialogContent>
      </Dialog>

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
              Set Up Your Profile
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
                  {/* <Box
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
                  </Box> */}
                  <TextField
                    label="Avatar URL"
                    fullWidth
                    value={avatarURL}
                    onChange={(e) => setavatarURL(e.target.value)}
                    margin="normal"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
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
              <Grid item xs={12}>
                <Box mt={2}>
                  <Typography variant="body1" fontWeight="500" mb={1}>
                    Select Interests (3-5 topics)
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      border: `1px solid ${palette.neutral.medium}`,
                      borderRadius: "8px",
                      p: 1.5,
                      backgroundColor: palette.background.paper,
                    }}
                  >
                    {suggestedTopics.map((topic) => {
                      const isSelected = selectedTopics.includes(topic);
                      const isDisabled =
                        !isSelected && selectedTopics.length >= 5;

                      return (
                        <Chip
                          key={topic}
                          label={topic}
                          onClick={() => handleTopicClick(topic)}
                          variant={isSelected ? "filled" : "outlined"}
                          color={isSelected ? "primary" : "default"}
                          disabled={isDisabled}
                          sx={{
                            borderRadius: "4px",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                              backgroundColor: isSelected
                                ? palette.primary.light
                                : palette.background.default,
                            },
                          }}
                        />
                      );
                    })}
                  </Box>
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <FormHelperText error={!!topicsError}>
                      {topicsError || `${selectedTopics.length}/5 selected`}
                    </FormHelperText>
                    <Typography variant="caption" color="textSecondary">
                      {selectedTopics.length < 3
                        ? "Minimum 3 required"
                        : "Maximum 5 allowed"}
                    </Typography>
                  </Box>
                </Box>
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
                  Create Account
                </Button>
              </Box>
            </form>
          </WidgetWrapper>
        </Box>
      </Box>
    </>
  );
};

export default ProfileSetupPage;

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import WidgetWrapper from "../WidgetWrapper";

const categories = [
  "Technology",
  "Art",
  "Gaming",
  "Music",
  "Education",
  "Business",
  "Health",
  "Lifestyle",
  "Other",
];

const CreatePage = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;

  const [pageName, setPageName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [privacy, setPrivacy] = useState<"Public" | "Private">("Public");
  const [image, setImage] = useState<File | null>(null);
  const [moderators, setModerators] = useState<string[]>([""]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleModeratorChange = (index: number, value: string) => {
    const newModerators = [...moderators];
    newModerators[index] = value;
    setModerators(newModerators);
  };

  const addModerator = () => {
    setModerators([...moderators, ""]);
  };

  const removeModerator = (index: number) => {
    const newModerators = [...moderators];
    newModerators.splice(index, 1);
    setModerators(newModerators);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!pageName.trim()) newErrors.pageName = "Page name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!category) newErrors.category = "Category is required.";
    // Validate moderator wallet addresses if provided
    moderators.forEach((mod, idx) => {
      if (mod && !/^0x[a-fA-F0-9]{40}$/.test(mod)) {
        newErrors[`moderator_${idx}`] = "Invalid wallet address.";
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const pageData = {
      pageName,
      description,
      category,
      privacy,
      image,
      moderators: moderators.filter((mod) => mod.trim() !== ""),
    };

    console.log("Page Data:", pageData);
    setOpenSnackbar(true);
    // navigate(`/pages/${newPageId}`);

    setIsSubmitting(false);
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box>
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
              color={dark}
              fontWeight="500"
              mb="1.5rem"
              textAlign="center"
            >
              Create a New Page
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Left Column (on md+): Page Name, Description, Category */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Page Name"
                    variant="outlined"
                    fullWidth
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    error={Boolean(errors.pageName)}
                    helperText={errors.pageName}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />

                  <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={Boolean(errors.description)}
                    helperText={errors.description}
                    sx={{
                      mt: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />

                  <TextField
                    select
                    label="Category"
                    variant="outlined"
                    fullWidth
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    error={Boolean(errors.category)}
                    helperText={errors.category}
                    sx={{
                      mt: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    {categories.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Right Column (on md+): Privacy, Image, Moderators, Submit */}
                <Grid item xs={12} md={6}>
                  <FormControl
                    component="fieldset"
                    error={Boolean(errors.privacy)}
                    sx={{ width: "100%" }}
                  >
                    <FormLabel
                      component="legend"
                      sx={{ mb: 1, textAlign: "left" }}
                    >
                      Privacy Setting
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-label="privacy"
                      name="privacy"
                      value={privacy}
                      onChange={(e) =>
                        setPrivacy(e.target.value as "Public" | "Private")
                      }
                    >
                      <FormControlLabel
                        value="Public"
                        control={<Radio />}
                        label="Public"
                      />
                      <FormControlLabel
                        value="Private"
                        control={<Radio />}
                        label="Private"
                      />
                    </RadioGroup>
                    {errors.privacy && (
                      <Typography variant="caption" color="error">
                        {errors.privacy}
                      </Typography>
                    )}
                  </FormControl>

                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      mt: 2,
                      textTransform: "none",
                      borderRadius: "8px",
                      justifyContent: "flex-start",
                    }}
                  >
                    {image ? "Change Image" : "Upload Image (Optional)"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImage(e.target.files[0]);
                        }
                      }}
                    />
                  </Button>
                  {image && (
                    <Typography variant="body2" color={medium} mt={1}>
                      Selected File: {image.name}
                    </Typography>
                  )}

                  <Box mt={3}>
                    <Typography
                      variant="h6"
                      color={medium}
                      mb="0.5rem"
                      textAlign="left"
                    >
                      Moderators (Optional)
                    </Typography>
                    {moderators.map((mod, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        gap="0.5rem"
                        mb="0.5rem"
                      >
                        <TextField
                          label={`Moderator ${index + 1} Wallet Address`}
                          variant="outlined"
                          fullWidth
                          value={mod}
                          onChange={(e) =>
                            handleModeratorChange(index, e.target.value)
                          }
                          error={Boolean(errors[`moderator_${index}`])}
                          helperText={errors[`moderator_${index}`]}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                            },
                          }}
                        />
                        {moderators.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => removeModerator(index)}
                          >
                            <RemoveCircleOutline />
                          </IconButton>
                        )}
                        {index === moderators.length - 1 && (
                          <IconButton color="primary" onClick={addModerator}>
                            <AddCircleOutline />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </form>
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                type="submit"
                disabled={isSubmitting}
                sx={{
                  textTransform: "none",
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  borderRadius: "8px",
                  width: "fit-content",
                  px: "1.5rem",
                }}
              >
                <AddCircleOutline sx={{ marginRight: "5px" }} />
                {isSubmitting ? "Creating..." : "Create Page"}
              </Button>
            </Box>
          </WidgetWrapper>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Page created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreatePage;

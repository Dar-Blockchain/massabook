// src/components/AddFriendModal.tsx

import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { MASSA_STATION_INSTALL } from "../constants";

type Props = {
  open: boolean;
  handleClose: () => void;
  onAddFriend: (walletAddress: string) => void;
};

const AddFriendModal = ({ open, handleClose, onAddFriend }: Props) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleAdd = () => {
    // const walletAddressRegex = /^0x[a-fA-F0-9]{40}$/;

    // if (!walletAddress.trim()) {
    //   setError("Wallet address is required.");
    //   return;
    // }

    // if (!walletAddressRegex.test(walletAddress)) {
    //   setError("Invalid wallet address format.");
    //   return;
    // }

    console.log("Adding friend with wallet address:", walletAddress);
    onAddFriend(walletAddress);
    setSnackbarMessage("Friend request sent successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setWalletAddress("");
    setError("");
    handleClose();
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      {open && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(156, 156, 171, 0.5)",
            zIndex: 10000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
          onClick={handleClose}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "29px 24px 24px",
              maxWidth: "500px",
              width: "100%",
              mx: { xs: "20px", sm: "0" },
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.02)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                mb: 2,
              }}
            >
              <Box></Box>
              <Typography
                variant="h5"
                sx={{ color: (theme) => theme.palette.neutral.dark }}
                fontWeight={500}
              >
                Add Friend
              </Typography>
              <IconButton onClick={handleClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_640_30013)">
                    <path
                      d="M15 5L5 15"
                      stroke="#9C9CAB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 5L15 15"
                      stroke="#9C9CAB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_640_30013">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </IconButton>
            </Box>

            <Box>
              <TextField
                label="Friend's Wallet Address"
                variant="outlined"
                fullWidth
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: "8px",
                    },
                  },
                }}
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                error={Boolean(error)}
                helperText={error}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                }}
                onClick={() => {
                  setWalletAddress("");
                  setError("");
                  handleClose();
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  cursor: "pointer",
                  color: "#fff",
                  textTransform: "none",
                  borderRadius: "8px",
                }}
                onClick={handleAdd}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Snackbar for Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddFriendModal;

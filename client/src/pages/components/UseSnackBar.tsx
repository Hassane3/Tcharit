import { Snackbar, SnackbarCloseReason } from "@mui/material";
import React, { useState } from "react";

interface useSnackBarProps {
  isSnackOpen: boolean;
  setIsSnackOpen: (state: boolean) => void;
  snackMessage: string;
}
const UseSnackBar = (props: useSnackBarProps) => {
  const { isSnackOpen, setIsSnackOpen, snackMessage } = props;
  // MUI SnackBar
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      sx={{ div: { justifyContent: "center" } }}
      open={isSnackOpen}
      onClose={handleClose}
      message={snackMessage}
      autoHideDuration={3000}
    />
  );
};

export default UseSnackBar;

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomDialog({ dialog, handleCloseDialog }) {
  return (
    <Dialog
      open={dialog.open}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
      sx={{
        "& .MuiDialog-paper": {
          width: "400px", // Custom width
          minHeight: "200px", // Custom height
          padding: "16px", // Dialog padding
          borderRadius: "12px", // Rounded corners
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Shadow effect
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: dialog.type === "success" ? "#4caf50" : "#f44336",
          color: "#fff",
          fontWeight: "bold",
          padding: "16px",
          position: "relative", // To position the close icon correctly
        }}
      >
        {dialog.type === "success" ? (
          <CheckCircleIcon sx={{ mr: 1 }} />
        ) : (
          <ErrorIcon sx={{ mr: 1 }} />
        )}
        {dialog.title}
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#fff",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center", // Center-align the message
          padding: "24px 16px", // Top-bottom and side padding
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            marginBottom: "8px", // Space below the message
          }}
        >
          {dialog.message}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

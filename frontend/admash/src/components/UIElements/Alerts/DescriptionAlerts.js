"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import AlertTitle from "@mui/material/AlertTitle";

// Dynamic version of the DescriptionAlerts component
const DescriptionAlerts = ({ alertType, alertMessage, alertTitle }) => {
  if (!alertType || !alertMessage) return null; // Prevent rendering if required props are missing

  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
        <Typography
          as="h4"
          sx={{
            fontSize: 18,
            fontWeight: 500,
            mb: "10px",
          }}
        >
          Notification
        </Typography>

        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity={alertType}>
            {alertTitle && <AlertTitle>{alertTitle}</AlertTitle>}
            {alertMessage}
          </Alert>
        </Stack>
      </Card>
    </>
  );
};

/* Original Static Alerts (Commented Out)
<Card
  sx={{
    boxShadow: "none",
    borderRadius: "10px",
    p: "25px",
    mb: "15px",
  }}
>
  <Typography
    as="h3"
    sx={{
      fontSize: 18,
      fontWeight: 500,
      mb: "10px",
    }}
  >
    Description Alerts
  </Typography>

  <Stack sx={{ width: "100%" }} spacing={2}>
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      This is an error alert — <strong>check it out!</strong>
    </Alert>

    <Alert severity="warning">
      <AlertTitle>Warning</AlertTitle>
      This is a warning alert — <strong>check it out!</strong>
    </Alert>

    <Alert severity="info">
      <AlertTitle>Info</AlertTitle>
      This is an info alert — <strong>check it out!</strong>
    </Alert>

    <Alert severity="success">
      <AlertTitle>Success</AlertTitle>
      This is a success alert — <strong>check it out!</strong>
    </Alert>
  </Stack>
</Card>
*/

export default DescriptionAlerts;

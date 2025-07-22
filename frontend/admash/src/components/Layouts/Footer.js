"use client";

import React from "react";
import { Stack, Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <>
      <Stack
        sx={{
          backgroundColor: "#fff",
          p: "25px",
          borderRadius: "10px 10px 0 0",
          textAlign: "center",
          mt: "15px"
        }}
        className="footer"
      >
        <Box>
        <Typography>
          © {new Date().getFullYear()} <strong>ZuciTech</strong> – Simplify. Succeed. Accelerate. Deliver.
        </Typography>

        </Box>
      </Stack>
    </>
  );
};

export default Footer;

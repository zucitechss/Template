"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Typography,
  Box,
  Button
} from "@mui/material";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("permissions");
  }, []);

  return (
    <div className="authenticationBox">
      <Box
        component="main"
        sx={{
          padding: "70px 0 100px",
        }}
      >
        <Box
          sx={{
            background: "#fff",
            padding: "30px 20px",
            borderRadius: "10px",
            maxWidth: "510px",
            ml: "auto",
            mr: "auto",
            textAlign: "center",
          }}
        >
          <Box>
            <Image
              src="/images/zucitech_cover.jpg"
              alt="Black logo"
              className="black-logo"
              width={547}
              height={31}
            />
            <Image
              src="/images/logo-white.png"
              alt="White logo"
              className="white-logo"
              width={147}
              height={41}
            />
          </Box>

          <Box mt={4} mb={4}>
            <Image
              src="/images/coffee.png"
              alt="Coffee"
              width={111}
              height={106}
            />
          </Box>

          {/* ✅ Replace static text with URL-provided message */}
          <Typography as="h1" fontSize="20px" fontWeight="500" mb={1}>
            {message ? `🔒 ${message}` : "You are Logged Out"}
          </Typography>

          {!message && (
            <Typography>
             Your loan journey starts here – Welcome to ZuciTech.
            </Typography>
          )}

          <Button
            onClick={() => router.push("/authentication/sign-in")}
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              textTransform: "capitalize",
              borderRadius: "8px",
              fontWeight: "500",
              fontSize: "16px",
              padding: "12px 10px",
              color: "#fff !important",
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </div>
  );
}

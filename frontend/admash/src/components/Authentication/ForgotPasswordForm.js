"use client";
import React, { useState } from "react";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "@/components/Authentication/Authentication.module.css";
import Image from "next/image";
import axios from "axios";

const ForgotPasswordForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email }
      );
      setMessage(response.data);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    let hasError = false;

    if (!otp) {
      setOtpError("OTP is required.");
      hasError = true;
    } else {
      setOtpError("");
    }

    if (!newPassword) {
      setPasswordError("New Password is required.");
      hasError = true;
    } else if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm Password is required.");
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );
      setMessage(response.data.message);
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authenticationBox">
      <Box
        component="main"
        sx={{
          maxWidth: "510px",
          ml: "auto",
          mr: "auto",
          padding: "50px 0 100px",
        }}
      >
        <Grid item xs={12}>
          <Box>
            <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
              {step === 1
                ? "Forgot Password?"
                : step === 2
                ? "Enter OTP"
                : "Password Reset Successful"}
              <Image
                src="/images/favicon.png"
                alt="favicon"
                className={styles.favicon}
                width={30}
                height={30}
              />
            </Typography>

            {message && (
              <Typography fontSize="15px" color="green" mb="15px">
                {message}
              </Typography>
            )}

            {step === 1 && (
              <Typography fontSize="15px" mb="30px">
                Enter your email and we’ll send you instructions to reset your
                password.
              </Typography>
            )}

            <Box component="form" noValidate>
              {step === 1 && (
                <Box
                  sx={{
                    background: "#fff",
                    padding: "30px 20px",
                    borderRadius: "10px",
                    mb: "20px",
                  }}
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                      >
                        Email
                      </Typography>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!emailError}
                        helperText={emailError}
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 1,
                      textTransform: "capitalize",
                      borderRadius: "8px",
                      fontWeight: "500",
                      fontSize: "16px",
                      padding: "12px 10px",
                      color: "#fff !important",
                    }}
                    onClick={handleEmailSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </Box>
              )}

              {step === 2 && (
                <Box>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="otp"
                        label="Enter OTP"
                        name="otp"
                        autoComplete="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        error={!!otpError}
                        helperText={otpError}
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="newPassword"
                        label="New Password"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="confirmPassword"
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!confirmPasswordError}
                        helperText={confirmPasswordError}
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 1,
                      textTransform: "capitalize",
                      borderRadius: "8px",
                      fontWeight: "500",
                      fontSize: "16px",
                      padding: "12px 10px",
                      color: "#fff !important",
                    }}
                    onClick={handleOtpSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </Box>
              )}

              {step === 3 && (
                <Box>
                  <Typography fontSize="15px" mb="20px">
                    Your password has been reset successfully. You can now{" "}
                    <Link
                      href="/authentication/sign-in/"
                      className="primaryColor text-decoration-none"
                    >
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Box>
    </div>
  );
};

export default ForgotPasswordForm;

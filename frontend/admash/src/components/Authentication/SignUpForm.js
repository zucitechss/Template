"use client";

import React, { useState } from "react";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import {
  Typography,
  Tooltip,
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "@/components/Authentication/Authentication.module.css";

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({ open: false, type: "", message: "", title: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });
  const router = useRouter();

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false });
  };

  const validate = (userData) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userData.firstName) {
      errors.firstName = "First name is required";
    }

    if (!userData.lastName) {
      errors.lastName = "Last name is required";
    }

    if (!userData.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(userData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!userData.password) {
      errors.password = "Password is required";
    } else if (userData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const userData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
    };

    const validationErrors = validate(userData);

    // Mark all fields as touched to trigger error display
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          username: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          password: userData.password,
          roles: "Customer", // Setting default role to "Customer"
        }
      );

      setDialog({
        open: true,
        type: "success",
        title: "Success",
        message: "Registration successful! Redirecting to the sign-in page...",
      });

      setTimeout(() => {
        router.push("/authentication/sign-in");
      }, 2000);
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.response && error.response.data) {
        errorMessage = error.response.data;
      }
      setDialog({
        open: true,
        type: "error",
        title: "Error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [field]: true,
    }));
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
        <Dialog open={dialog.open} onClose={handleCloseDialog}>
          <DialogTitle>
            {dialog.title}
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>{dialog.message}</DialogContent>
        </Dialog>

        <Grid item xs={12} md={12} lg={12} xl={12}>
          <Box>
            <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
              Sign Up{" "}
              <Image
                src="/images/favicon.png"
                alt="favicon"
                className={styles.favicon}
                width={30}
                height={30}
              />
            </Typography>
            <Typography fontSize="15px" mb="30px">
              Already have an account?{" "}
              <Link
                href="/authentication/sign-in"
                className="primaryColor text-decoration-none"
              >
                Sign in
              </Link>
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit}>
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
                    <TextField
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      error={touched.firstName && !!errors.firstName}
                      helperText={touched.firstName && errors.firstName}
                      onBlur={() => handleBlur("firstName")}
                      InputProps={{
                        style: { borderRadius: 8 },
                        endAdornment: (
                          <InputAdornment position="end">
                            {touched.firstName && errors.firstName ? (
                              <Tooltip title={errors.firstName}>
                                <ErrorIcon color="error" />
                              </Tooltip>
                            ) : (
                              touched.firstName && (
                                <Tooltip title="Valid first name">
                                  <CheckCircleIcon color="success" />
                                </Tooltip>
                              )
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      error={touched.lastName && !!errors.lastName}
                      helperText={touched.lastName && errors.lastName}
                      onBlur={() => handleBlur("lastName")}
                      InputProps={{
                        style: { borderRadius: 8 },
                        endAdornment: (
                          <InputAdornment position="end">
                            {touched.lastName && errors.lastName ? (
                              <Tooltip title={errors.lastName}>
                                <ErrorIcon color="error" />
                              </Tooltip>
                            ) : (
                              touched.lastName && (
                                <Tooltip title="Valid last name">
                                  <CheckCircleIcon color="success" />
                                </Tooltip>
                              )
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      onBlur={() => handleBlur("email")}
                      InputProps={{
                        style: { borderRadius: 8 },
                        endAdornment: (
                          <InputAdornment position="end">
                            {touched.email && errors.email ? (
                              <Tooltip title={errors.email}>
                                <ErrorIcon color="error" />
                              </Tooltip>
                            ) : (
                              touched.email && (
                                <Tooltip title="Valid email address">
                                  <CheckCircleIcon color="success" />
                                </Tooltip>
                              )
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="password"
                      label="Password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      onBlur={() => handleBlur("password")}
                      InputProps={{
                        style: { borderRadius: 8 },
                        endAdornment: (
                          <InputAdornment position="end">
                            {touched.password && errors.password ? (
                              <Tooltip title={errors.password}>
                                <ErrorIcon color="error" />
                              </Tooltip>
                            ) : (
                              touched.password && (
                                <Tooltip title="Valid password">
                                  <CheckCircleIcon color="success" />
                                </Tooltip>
                              )
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
		              <Grid container fullWidth alignItems="center" spacing={2} sx={{ my: 2 }} >
                  <Grid item xs={6} sm={6}>
                    <FormControlLabel
                      control={<Checkbox value="allowExtraEmails" color="primary" />}
                      label="I want to receive updates via email."
                    />
                  </Grid>
		              <Grid item xs={6} sm={6} textAlign="end">
                    <Link href="/authentication/forgot-password" className="primaryColor text-decoration-none">
                      Forgot your password?
                    </Link>
                  </Grid>
		              </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      disabled={loading}
                      fullWidth
                      size="large"
                      variant="contained"
                      className="btn primaryBtnBgColor"
                      sx={{ borderRadius: 8 }}
                    >
                      {loading ? "Signing Up..." : "Sign Up"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
    </div>
  );
};

export default SignUpForm;

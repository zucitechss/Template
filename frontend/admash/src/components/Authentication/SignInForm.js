"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { Typography, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import styles from "@/components/Authentication/Authentication.module.css";
import Image from "next/image";
import axios from "axios";
import DescriptionAlerts from "../UIElements/Alerts/DescriptionAlerts"; // relative path
import { useRouter } from "next/navigation";

import InputAdornment from "@mui/material/InputAdornment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import { jwtDecode } from "jwt-decode"; // ✅ correct


const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({ email: false, password: false }); // Added touched state
  const router = useRouter();
  const alertRef = useRef(null); // Create a reference for the alert

  const validate = (loginData) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!loginData.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(loginData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!loginData.password) {
      errors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  
    const loginData = {
      email: data.get("email"),
      password: data.get("password"),
    };
  
    const validationErrors = validate(loginData);
  
    // Mark all fields as touched to trigger error display
    setTouched({
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
      setAlert({ type: "", message: "" });
  
      // Send login request to backend
      const response = await axios.post("http://localhost:8080/api/auth/login", loginData);
  
      // Check if the response has a token
      console.log("Response from backend:", response.data);
  
      // Assuming the backend sends the JWT token in response.data.token
      if (response.data && response.data.token) {

      const { token, role, permissions } = response.data;

      const decoded = jwtDecode(token);
      console.log("Decoded token............:", decoded); // should include email, roles, permissions
      const parsedRoles = decoded.roles || [];
      const parsedPermissions = decoded.permissions || [];

      //console.log("Decoded Roles:", parsedRoles);
      //console.log("Decoded Permissions:", parsedPermissions);
      //console.log("parsedRoles[0]:", parsedRoles[0]);
      //console.log("typeof parsedRoles[0]:", typeof parsedRoles[0]);



      // Save in localStorage
      localStorage.setItem("token", token);
      //localStorage.setItem("roles", JSON.stringify(parsedRoles));  // Store roles as JSON array
      //localStorage.setItem("permissions", JSON.stringify(parsedPermissions)); // ⬅️ New
  
        setAlert({
          type: "success",
          message: "Login successful! Redirecting...",
          title: "Success",
        });
  
        // Scroll to the alert
        setTimeout(() => {
          if (alertRef.current) {
            alertRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
  
        // Redirect after a short delay to give time for the alert to show
// Redirect based on role
switch (parsedRoles[0]) {
  case "APPLICANT":
    router.push("/loanapplication");
    break;
  case "ADMIN":
    router.push("/adminpanel/roleaccess/");
    break;
  case "MANAGER":
    router.push("/managerpanel/Loan-Approval/");
    break;
  case "LOAN_OFFICER":
    router.push("/loanofficerapproval/Loan-Approval/");
    break;
  default:
    setAlert({
      type: "error",
      message: "Unknown user role. Please contact support.",
    });
    break;
}
      } else {
        throw new Error("Token not found in the response.");
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.response && error.response.data) {
        errorMessage = error.response.data;
      }
  
      setAlert({
        type: "error",
        message: errorMessage,
        title: "Error",
      });
  
      // Scroll to the alert
      setTimeout(() => {
        if (alertRef.current) {
          alertRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
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
        {alert.message && (
          <div ref={alertRef}>
            <DescriptionAlerts
              alertType={alert.type}
              alertMessage={alert.message}
              alertTitle={alert.title}
            />
          </div>
        )}

        <Grid item xs={12} md={12} lg={12} xl={12}>
          <Box>
            <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
              Sign In{" "}
              <Image
                src="/images/favicon.png"
                alt="favicon"
                className={styles.favicon}
                width={30}
                height={30}
              />
            </Typography>

            <Typography fontSize="15px" mb="30px">
              Don't have an account?{" "}
              <Link
                href="/authentication/sign-up"
                className="primaryColor text-decoration-none"
              >
                Sign up
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
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      onBlur={() => handleBlur("email")}
                      InputProps={{
                        style: { borderRadius: 8 },
                        endAdornment: (
                          <InputAdornment position="end">
                            {touched.email && errors.email ? (
                              <Tooltip
                                title={errors.email || "Invalid email address"}
                                placement="top"
                              >
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
                    <Typography
                      component="label"
                      sx={{
                        fontWeight: "500",
                        fontSize: "14px",
                        mb: "10px",
                        display: "block",
                      }}
                    >
                      Password
                    </Typography>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      onBlur={() => handleBlur("password")}
                      InputProps={{
                        style: { borderRadius: 8 },
                        endAdornment: (
                          <InputAdornment position="end">
                            {touched.password && errors.password ? (
                              <Tooltip
                                title={
                                  errors.password ||
                                  "Password does not meet criteria"
                                }
                                placement="bottom"
                              >
                                <ErrorIcon color="error" />
                              </Tooltip>
                            ) : (
                              touched.password && (
                                <Tooltip title="Password is valid">
                                  <CheckCircleIcon color="success" />
                                </Tooltip>
                              )
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={6} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="Remember me."
                  />
                </Grid>

                <Grid item xs={6} sm={6} textAlign="end">
                  <Link
                    href="/authentication/forgot-password"
                    className="primaryColor text-decoration-none"
                  >
                    Forgot your password?
                  </Link>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "16px",
                  padding: "12px 10px",
                  color: "#fff !important",
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Box>
    </div>
  );
};

export default SignInForm;

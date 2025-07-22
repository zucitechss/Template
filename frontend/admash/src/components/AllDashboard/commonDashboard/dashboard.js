"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";

const roles = ["Applicant", "Loan Officer", "Manager", "Admin"];

const features = [
  "JWT-Based Authentication",
  "Spring Boot + MySQL Backend",
  "Azure Blob Storage for File Uploads",
  "OTP Email Verification",
  "Role-Based Access Control",
  "Secure Login & Registration",
  "Forgot Password Flow",
  "Dashboard Access via Token Validation",
];

const techStack = [
  "Frontend: Next.js, React, Material UI",
  "Backend: Spring Boot (Java)",
  "Database: MySQL",
  "Storage: Azure Blob Storage (BLOBs)",
  "Security: JWT Tokens & Role Guards",
  "Email: SMTP for OTP Verification",
];

const workflowSteps = [
  "Register and verify email via OTP",
  "Login and receive JWT with assigned role",
  "Applicant submits loan application with documents",
  "Loan Officer reviews & validates the application",
  "Manager evaluates & approves/rejects the loan",
  "Admin oversees system & manages users/roles",
];

const DashboardIntro = () => {
  return (
    <Box p={4} sx={{ background: "#f9fafc", minHeight: "100vh" }}>
      {/* Welcome Section */}
      <Paper elevation={0} sx={{ p: 4, textAlign: "center", background: "#f3f6fd" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to ZuciTech Loan Management System
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Simplify | Succeed | Accelerate | Deliver
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: "800px", margin: "0 auto", mt: 2 }}>
          This platform offers a unified solution for managing loan applications with modern architecture, high security, and efficient workflows.
        </Typography>
      </Paper>

      {/* About This Project */}
      <Typography variant="h5" mt={6} mb={2}>
        📘 About This Project
      </Typography>
      <Paper sx={{ p: 3, backgroundColor: "#ffffff", mb: 4 }}>
        <Typography color="text.secondary">
          ZuciTech's Loan Management System is designed for financial institutions to manage
          loan workflows from application to approval with robust security and role-based access.
          It offers a modern, scalable, and secure architecture using industry-proven technologies.
        </Typography>
      </Paper>

      {/* User Roles */}
      <Typography variant="h5" mt={4} mb={2}>
        👥 User Roles Overview
      </Typography>
      <Grid container spacing={3}>
        {roles.map((role, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: "100%", backgroundColor: "#fefefe" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="medium" color="primary">
                  {role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {role === "Applicant" && "Submit loan applications"}
                  {role === "Loan Officer" && "Review and process loans"}
                  {role === "Manager" && "Approve and monitor team performance"}
                  {role === "Admin" && "Manage users and system settings"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Key Features */}
      <Typography variant="h5" mt={6} mb={2}>
        🚀 Key Features
      </Typography>
      <Paper sx={{ p: 3, backgroundColor: "#ffffff", mb: 4 }}>
        <Grid container spacing={2}>
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography>{feature}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Technology Stack */}
      <Typography variant="h5" mt={6} mb={2}>
        🛠️ Technology Stack
      </Typography>
      <Paper sx={{ p: 3, backgroundColor: "#ffffff", mb: 4 }}>
        <Grid container spacing={2}>
          {techStack.map((tech, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Chip
                label={tech}
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  width: "100%",
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Application Workflow */}
      <Typography variant="h5" mt={6} mb={2}>
        🔄 Application Workflow
      </Typography>
      <Timeline position="alternate">
        {workflowSteps.map((step, idx) => (
          <TimelineItem key={idx}>
            <TimelineSeparator>
              <TimelineDot
                color={
                  idx % 3 === 0
                    ? "primary"
                    : idx % 3 === 1
                    ? "secondary"
                    : "warning"
                }
              />
              {idx !== workflowSteps.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">{step}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      {/* Security Section */}
      <Typography variant="h5" mt={6} mb={2}>
        🔐 Security & Access Control
      </Typography>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: "#e8f5e9",
          border: "1px solid #c8e6c9",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          All protected pages are guarded with JWT token validation and role-based
          routing. Only users with valid credentials can access specific sections.
          OTP-based email verification ensures added security during registration and password recovery.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DashboardIntro;

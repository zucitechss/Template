"use client";

import { useForm } from "../../context/FormContext";
import { Box, Typography, CircularProgress, Stepper, Step, StepLabel } from "@mui/material";

const ProgressBar = () => {
  const { currentStep, formData } = useForm();

  const steps = [
    { label: "Personal Info", key: "personalInfo" },
    { label: "Employment Info", key: "employmentInfo" },
    { label: "Financial Info", key: "financialInfo" },
    { label: "Loan Info", key: "loanInfo" },
    { label: "Documents", key: "documents" },
    { label: "Preview", key: "preview" }
  ];

  const isStepCompleted = (key) => {
    const sectionData = formData[key];
    return sectionData && Object.values(sectionData).every(value => value !== "" && value !== null);
  };

  const getProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        width: "100%",
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "600",
          mb: 2,
          color: "#333",
          textAlign: "center",
        }}
      >
        Application Progress
      </Typography>
      
      {/* Circular Progress Bar */}
      <Box sx={{ position: "relative", textAlign: "center", mb: 2 }}>
        <CircularProgress
          variant="determinate"
          value={getProgress()}
          size={100}
          thickness={4}
          sx={{
            color: "#1976d2",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#1976d2",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {Math.round(getProgress())}%
        </Box>
      </Box>

      {/* Stepper */}
      <Stepper
        activeStep={currentStep - 1}
        alternativeLabel
        sx={{
          width: "90%",
          "& .MuiStepIcon-root": {
            color: "#1976d2",
          },
          "& .MuiStepIcon-completed": {
            color: "green",
          },
          "& .MuiStepIcon-active": {
            color: "blue",
          },
        }}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel sx={{ color: isStepCompleted(step.key) ? "green" : "black" }}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ProgressBar;

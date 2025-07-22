"use client";

import { useForm } from "../../context/FormContext";
import React, { useState } from "react";
import { TextField, Box, Button, Grid, Typography, MenuItem } from "@mui/material";

const LoanInfo = () => {
  const { formData, updateFormData, nextStep, prevStep } = useForm();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    updateFormData("loanInfo", { [e.target.name]: e.target.value });

    // Clear error for the field being updated
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    const { loanType, loanAmount, tenure, emiDate } = formData?.loanInfo || {};

    if (!loanType) newErrors.loanType = "Loan Type is required.";
    if (!loanAmount || loanAmount <= 0) newErrors.loanAmount = "Loan Amount must be greater than 0.";
    if (!tenure) newErrors.tenure = "Tenure is required.";
    if (!emiDate) newErrors.emiDate = "EMI Date is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) nextStep();
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, margin: "auto", textAlign: "center", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Loan Information
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Loan Type */}
          <Grid item xs={12}>
            <TextField
              select
              label="Loan Type"
              name="loanType"
              value={formData?.loanInfo?.loanType || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.loanType}
              helperText={errors.loanType}
            >
              <MenuItem value="">Select Loan Type</MenuItem>
              <MenuItem value="Home">Home</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
              <MenuItem value="Car">Car</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
            </TextField>
          </Grid>

          {/* Loan Amount */}
          <Grid item xs={12}>
            <TextField
              label="Loan Amount"
              name="loanAmount"
              type="number"
              value={formData?.loanInfo?.loanAmount || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.loanAmount}
              helperText={errors.loanAmount}
            />
          </Grid>

          {/* Tenure */}
          <Grid item xs={12}>
            <TextField
              select
              label="Tenure (Months)"
              name="tenure"
              value={formData?.loanInfo?.tenure || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.tenure}
              helperText={errors.tenure}
            >
              <MenuItem value="">Select Tenure</MenuItem>
              {[3, 6, 9, 12, 24].map((months) => (
                <MenuItem key={months} value={months}>
                  {months} Months
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* EMI Date */}
          <Grid item xs={12}>
            <TextField
              label="EMI Date"
              name="emiDate"
              type="date"
              value={formData?.loanInfo?.emiDate || ""}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.emiDate}
              helperText={errors.emiDate}
            />
          </Grid>

          {/* Navigation Buttons */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button type="button" variant="contained" color="secondary" onClick={prevStep}>
              Previous
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default LoanInfo;

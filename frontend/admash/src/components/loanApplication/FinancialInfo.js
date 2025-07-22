"use client";

import { useForm } from "../../context/FormContext";
import React, { useState } from "react";
import { TextField, Box, Button, Grid, Typography, MenuItem } from "@mui/material";

const FinancialInfo = () => {
  const { formData, updateFormData, nextStep, prevStep } = useForm();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "existingLoans") {
      updateFormData("financialInfo", {
        existingLoans: value,
        existingLoanAmount: value === "No Existing Loan" ? "0" : formData.financialInfo.existingLoanAmount || "",
      });
    } else {
      updateFormData("financialInfo", { [name]: value });
    }
  };

  const validateFields = () => {
    let newErrors = {};

    Object.entries(formData.financialInfo).forEach(([key, value]) => {
      let errorMsg = "";

      switch (key) {
        case "creditScore":
          if (!value) {
            errorMsg = "Credit Score is required";
          } else if (isNaN(value) || value < 300 || value > 850) {
            errorMsg = "Credit Score must be between 300 and 850";
          }
          break;

        case "bankAccount":
          if (!value) {
            errorMsg = "Bank Account Number is required";
          } else if (!/^\d{10,16}$/.test(value)) {
            errorMsg = "Bank Account Number must be 10-16 digits";
          }
          break;

        case "existingLoans":
          if (!value) {
            errorMsg = "Please select an existing loan type";
          }
          break;

        case "existingLoanAmount":
          if (
            formData.financialInfo.existingLoans !== "No Existing Loan" &&
            (!value || isNaN(value) || value < 0)
          ) {
            errorMsg = "Enter a valid loan amount";
          }
          break;

        case "assets":
          if (!value) {
            errorMsg = "Assets information is required";
          }
          break;

        case "customAsset":
          if (formData.financialInfo.assets === "Other" && !value) {
            errorMsg = "Please specify your asset";
          }
          break;

        default:
          break;
      }

      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      nextStep();
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, margin: "auto", textAlign: "center", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Financial Information
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Credit Score */}
          <Grid item xs={12}>
            <TextField
              label="Credit Score"
              name="creditScore"
              type="number"
              value={formData.financialInfo.creditScore || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.creditScore}
              helperText={errors.creditScore}
            />
          </Grid>

          {/* Bank Account Number */}
          <Grid item xs={12}>
            <TextField
              label="Bank Account Number"
              name="bankAccount"
              value={formData.financialInfo.bankAccount || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.bankAccount}
              helperText={errors.bankAccount}
            />
          </Grid>

          {/* Existing Loan Type Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              label="Existing Loan Type"
              name="existingLoans"
              value={formData.financialInfo.existingLoans || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.existingLoans}
              helperText={errors.existingLoans}
            >
              <MenuItem value="">Select Loan Type</MenuItem>
              <MenuItem value="No Existing Loan">No Existing Loan</MenuItem>
              <MenuItem value="Personal Loan">Personal Loan</MenuItem>
              <MenuItem value="Home Loan">Home Loan</MenuItem>
              <MenuItem value="Car Loan">Car Loan</MenuItem>
              <MenuItem value="Education Loan">Education Loan</MenuItem>
            </TextField>
          </Grid>

          {/* Existing Loan Amount (Disabled if No Existing Loan) */}
          <Grid item xs={12}>
            <TextField
              label="Existing Loan Amount"
              name="existingLoanAmount"
              type="number"
              value={formData.financialInfo.existingLoanAmount || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.existingLoanAmount}
              helperText={errors.existingLoanAmount}
              disabled={formData.financialInfo.existingLoans === "No Existing Loan"}
            />
          </Grid>

          {/* Assets Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              label="Assets"
              name="assets"
              value={formData.financialInfo.assets || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.assets}
              helperText={errors.assets}
            >
              <MenuItem value="">Select Asset Type</MenuItem>
              <MenuItem value="Real Estate (Property)">Real Estate (Property)</MenuItem>
              <MenuItem value="Fixed Deposits">Fixed Deposits</MenuItem>
              <MenuItem value="Vehicles">Vehicles</MenuItem>
              <MenuItem value="Other">Other (Specify Below)</MenuItem>
            </TextField>
          </Grid>

          {/* Custom Asset Input (Only if "Other" is selected) */}
          {formData.financialInfo.assets === "Other" && (
            <Grid item xs={12}>
              <TextField
                label="Specify Other Asset"
                name="customAsset"
                value={formData.financialInfo.customAsset || ""}
                onChange={handleChange}
                fullWidth
                error={!!errors.customAsset}
                helperText={errors.customAsset}
              />
            </Grid>
          )}

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

export default FinancialInfo;

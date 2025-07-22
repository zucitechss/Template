"use client";

import { useForm } from "../../context/FormContext";
import React, { useState } from "react";
import { TextField, Box, Button, Grid, Typography, MenuItem } from "@mui/material";

const EmploymentInfo = () => {
  const { formData, updateFormData, nextStep, prevStep } = useForm();
  const [errors, setErrors] = useState({});

  const employmentTypes = ["Full-Time", "Part-Time", "Self-Employed", "Unemployed", "Freelancer", "Retired"];

  const handleChange = (e) => {
    updateFormData("employmentInfo", { [e.target.name]: e.target.value });

    // Clear errors on user input
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    const { employmentType, companyName, monthlyIncome, yearsExperience, employerContact } = formData.employmentInfo;

    if (!employmentType) newErrors.employmentType = "Employment Type is required";
    if (!companyName) newErrors.companyName = "Company Name is required";
    if (!monthlyIncome || monthlyIncome <= 0) newErrors.monthlyIncome = "Monthly Income must be greater than 0";
    if (!yearsExperience || yearsExperience < 0) newErrors.yearsExperience = "Years of Experience must be 0 or more";
    
    // Phone number validation (10 digits, numeric only)
    const phoneRegex = /^[0-9]{10}$/;
    if (!employerContact) {
      newErrors.employerContact = "Employer Contact is required";
    } else if (!phoneRegex.test(employerContact)) {
      newErrors.employerContact = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) nextStep();
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, margin: "auto", textAlign: "center", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Employment Information
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Employment Type - Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              label="Employment Type"
              name="employmentType"
              value={formData.employmentInfo.employmentType || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.employmentType}
              helperText={errors.employmentType}
            >
              {employmentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Company Name */}
          <Grid item xs={12}>
            <TextField
              label="Company Name"
              name="companyName"
              value={formData.employmentInfo.companyName || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.companyName}
              helperText={errors.companyName}
            />
          </Grid>

          {/* Monthly Income */}
          <Grid item xs={12}>
            <TextField
              label="Monthly Income"
              name="monthlyIncome"
              type="number"
              value={formData.employmentInfo.monthlyIncome || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.monthlyIncome}
              helperText={errors.monthlyIncome}
            />
          </Grid>

          {/* Years of Experience */}
          <Grid item xs={12}>
            <TextField
              label="Years of Experience"
              name="yearsExperience"
              type="number"
              value={formData.employmentInfo.yearsExperience || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.yearsExperience}
              helperText={errors.yearsExperience}
            />
          </Grid>

          {/* Employer Contact (Phone Number) */}
          <Grid item xs={12}>
            <TextField
              label="Employer Contact"
              name="employerContact"
              type="tel"
              value={formData.employmentInfo.employerContact || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.employerContact}
              helperText={errors.employerContact}
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

export default EmploymentInfo;

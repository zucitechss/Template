"use client";

import { useForm } from "../../context/FormContext";
import React, { useState } from "react";
import {
  TextField,
  Box,
  Button,
  Grid,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  FormControl,
} from "@mui/material";

const PersonalInfo = () => {
  const { formData, updateFormData, nextStep } = useForm();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    updateFormData("personalInfo", { [e.target.name]: e.target.value });

    // Clear error when user starts typing/selecting
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateFields = () => {
    const newErrors = {};
    const fields = formData.personalInfo;

    if (!fields.firstName) newErrors.firstName = "First Name is required";
    if (!fields.lastName) newErrors.lastName = "Last Name is required";
    if (!fields.dob) newErrors.dob = "Date of Birth is required";
    if (!fields.gender) newErrors.gender = "Gender is required";
    if (!fields.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(fields.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!fields.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(fields.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!fields.address) newErrors.address = "Address is required";
    if (!fields.maritalStatus) newErrors.maritalStatus = "Marital Status is required";

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
        Personal Information
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* First Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.personalInfo.firstName || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.personalInfo.lastName || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>

          {/* Date of Birth */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.personalInfo.dob || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.dob}
              helperText={errors.dob}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Gender (Properly Aligned) */}
          <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ mr: 2, fontWeight: "bold" }}>
              Gender:
            </Typography>
            <FormControl error={!!errors.gender} component="fieldset">
              <RadioGroup row name="gender" value={formData.personalInfo.gender || ""} onChange={handleChange}>
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Other" control={<Radio />} label="Other" />
              </RadioGroup>
              {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.personalInfo.email || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.personalInfo.phone || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={formData.personalInfo.address || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>

          {/* Marital Status */}
          <Grid item xs={12}>
            <TextField
              label="Marital Status"
              name="maritalStatus"
              select
              value={formData.personalInfo.maritalStatus || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.maritalStatus}
              helperText={errors.maritalStatus}
              SelectProps={{ native: true }}
            >
              <option value=""> </option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </TextField>
          </Grid>

          {/* Next Button */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PersonalInfo;

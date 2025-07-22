"use client";

import { useForm } from "../../context/FormContext";
import React, { useState } from "react";
import { Box, Button, Grid, Typography, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { CloudUpload, CheckCircle, ErrorOutline } from "@mui/icons-material";

const DocumentUpload = () => {
  const { formData, updateFormData, nextStep, prevStep } = useForm();
  const [filePreview, setFilePreview] = useState({});
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      if (file.type.startsWith("image")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview((prev) => ({
            ...prev,
            [name]: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
      updateFormData("documents", { ...formData.documents, [name]: file });
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validateFiles = () => {
    const requiredFields = ["idProof", "incomeProof", "addressProof", "photo"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData.documents?.[field]) {
        newErrors[field] = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFiles()) {
      nextStep();
    }
  };

  const renderFileInput = (name, label, accept, icon) => {
    const file = formData.documents?.[name];
    const error = errors[name];

    return (
      <Grid item xs={12}>
        <FormControl fullWidth required error={error}>
          <InputLabel>{label}</InputLabel>
          <Button
            variant="outlined"
            component="label"
            startIcon={file ? <CheckCircle color="success" /> : icon}
            fullWidth
            sx={{ textTransform: "none", marginTop: 1 }}
          >
            {file?.name || "Choose File"}
            <input
              name={name}
              type="file"
              hidden
              accept={accept}
              onChange={handleFileChange}
            />
          </Button>
          {error && (
            <FormHelperText>
              <ErrorOutline fontSize="small" /> File is required
            </FormHelperText>
          )}
          {filePreview[name] && file?.type.startsWith("image") && (
            <Box sx={{ mt: 1 }}>
              <img src={filePreview[name]} alt={`${label} Preview`} style={{ width: 100, height: "auto", borderRadius: 4 }} />
            </Box>
          )}
        </FormControl>
      </Grid>
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, margin: "auto", textAlign: "center", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Document Upload
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {renderFileInput("idProof", "ID Proof (JPEG, PNG, PDF)", "image/jpeg,image/png,application/pdf", <CloudUpload />)}
          {renderFileInput("incomeProof", "Income Proof (JPEG, PNG, PDF)", "image/jpeg,image/png,application/pdf", <CloudUpload />)}
          {renderFileInput("addressProof", "Address Proof (JPEG, PNG, PDF)", "image/jpeg,image/png,application/pdf", <CloudUpload />)}
          {renderFileInput("photo", "Photo (JPEG, PNG)", "image/jpeg,image/png", <CloudUpload />)}

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

export default DocumentUpload;

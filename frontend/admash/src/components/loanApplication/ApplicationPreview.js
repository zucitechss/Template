"use client";

import React, { useState } from "react";
import { useForm } from "../../context/FormContext";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Checkbox,
  FormControlLabel,
  Paper,
  Tooltip,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const formatLabel = (label) => {
  return label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const ApplicationPreview = () => {
  const { formData, prevStep, goToStep } = useForm();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const router = useRouter();

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const permissions = decoded.permissions || [];


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  //const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  if (!permissions.includes("APPLICATION_SUBMIT")) {
    alert("You do not have permission to submit the loan application.");
    setLoading(false);
    return;
  }



  // Construct request body for loanRequest JSON
  const loanRequest = {
    loanType: formData.loanInfo?.loanType,
    loanAmount: formData.loanInfo?.loanAmount,
    tenure: formData.loanInfo?.tenure,
    emiDate: formData.loanInfo?.emiDate,
    personalInfo: formData.personalInfo,
    employmentInfo: formData.employmentInfo,
    financialInfo: formData.financialInfo,
    // No documentInfo here — handled separately as files
  };

  const form = new FormData();
  form.append("loanRequest", JSON.stringify(loanRequest)); // JSON string

  // Attach files
  if (formData.documents?.idProof) {
    form.append("idProof", formData.documents.idProof);
  }
  if (formData.documents?.incomeProof) {
    form.append("incomeProof", formData.documents.incomeProof);
  }
  if (formData.documents?.addressProof) {
    form.append("addressProof", formData.documents.addressProof);
  }
  if (formData.documents?.photo) {
    form.append("photo", formData.documents.photo);
  }

try {
  const response = await fetch("http://localhost:8080/api/loans/apply", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Don't add Content-Type manually for FormData
    },
    body: form,
  });

  if (response.ok) {
    console.log("✅ Applying the application",response);
    const data = await response.json();

    if (!data.id) {
      throw new Error("id (applicationId) missing in response");
    }
    //setApplicationId(data.id);
    alert("✅ Application Submitted Successfully!");
    router.push(`/loanapplication/applicationStatus/${data.id}`);


  } else {
    const responseText = await response.text();
    let errorMessage = "Something went wrong";

    try {
      const error = JSON.parse(responseText);
      errorMessage = error.message || error.error || error.details || errorMessage;
    } catch {
      errorMessage = responseText;
    }

    alert(`❌ Error: ${errorMessage}`);
  }
} catch (err) {
  console.error("❌ Submission error:", err);
  alert(`❌ An error occurred while submitting the form: ${err.message}`);
} finally {
  setLoading(false);
}

};


  const handleFilePreview = (file) => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{
        p: 4,
        maxWidth: 700,
        margin: "auto",
        mt: 5,
        bgcolor: "#fafafa",
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ mb: 3, fontFamily: "Times New Roman", textTransform: "uppercase" }}
      >
        Application Review
      </Typography>

      {/* Display Form Data */}
      {Object.entries(formData || {}).map(([section, data]) => (
        <Box
          key={section}
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontFamily: "Times New Roman" }}>
              {formatLabel(section)}
            </Typography>
            <Tooltip title={permissions.includes("APPLICATION_EDIT") ? "Edit this section" : "You are not authorized to edit this section"}>
              <span>
                <IconButton
                  color="primary"
                  disabled={!permissions.includes("APPLICATION_EDIT")}
                  onClick={() => {
                    if (!permissions.includes("APPLICATION_EDIT")) {
                      alert("You are not authorized to edit this section.");
                      return;
                    }
                    goToStep(section);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Divider sx={{ my: 1 }} />
          {data && Object.entries(data).length > 0 ? (
            Object.entries(data).map(([key, value]) => (
              <Box key={key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", ml: 2, my: 0.5 }}>
                <Typography variant="body2">
                  <strong>{formatLabel(key)}:</strong> {value && typeof value === "object" && value?.name ? value.name : value}
                </Typography>
                {value && typeof value === "object" && value?.name && (

                <Tooltip title={permissions.includes("APPLICATION_PREVIEW") ? "Preview File" : "You are not authorized to Preview File section"}>
                  <span>
                    <IconButton
                      color="primary"
                      disabled={!permissions.includes("APPLICATION_PREVIEW")}
                      onClick={() => {
                        if (!permissions.includes("APPLICATION_PREVIEW")) {
                          alert("You are not authorized to Preview File this section.");
                          return;
                        }
                        handleFilePreview(value);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </span>
                </Tooltip>

                )}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              No information available.
            </Typography>
          )}
        </Box>
      ))}

      {/* Terms & Conditions */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
          }
          label="I agree to the terms and conditions"
          sx={{ fontFamily: "Times New Roman" }}
        />
        <Tooltip title="View Terms & Conditions">
          <IconButton onClick={() => setShowTerms(!showTerms)} color="primary">
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Terms & Conditions Text Box */}
      {showTerms && (
        <TextField
          fullWidth
          multiline
          rows={5}
          value={`1. The applicant must provide accurate and complete information.
2. The loan is subject to approval based on creditworthiness.
3. Failure to make timely payments may result in penalties.
4. The bank reserves the right to verify documents and financial history.
5. By proceeding, you agree to abide by these terms.
(This is a dummy text. Actual terms will vary.)`}
          variant="outlined"
          InputProps={{ readOnly: true }}
          sx={{ mt: 2, fontSize: "14px", bgcolor: "#f9f9f9" }}
        />
      )}

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button variant="contained" color="secondary" onClick={prevStep}>
          Previous
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!termsAccepted || loading} // Disabled until checkbox is checked or loading is true
        >
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ApplicationPreview;

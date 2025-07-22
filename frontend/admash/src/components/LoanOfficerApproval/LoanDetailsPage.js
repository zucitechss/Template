"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Box,
  Badge,
} from "@mui/material";
import { CheckCircle, Cancel, Warning, Description, Close } from "@mui/icons-material";
import useAuthGuard from "@/components/useAuthGuard";

const LoanDetailsPage = () => {
  useAuthGuard();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [alert, setAlert] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState("");

  const alertRef = useRef(null);

  useEffect(() => {
    //const loanId = searchParams.get("loanId");
    //console.log("Loan ID from searchParams:", loanId);

    const loanIdToken = searchParams.get("loanIdToken");
    console.log("Loan ID from searchParams:", loanIdToken);
    


    const fetchLoan = async () => {
      const token = localStorage.getItem("token");
      console.log("🔐 Token used for fetch:", token);
      if (!token) {
        setAlert("You are not authenticated. Please log in.");
        router.push("/login"); // Optional redirect to login
        return;
      }

      try {
        //const response = await fetch(`http://localhost:8080/api/loans/${loanId}`, {
        const response = await fetch(`http://localhost:8080/api/loans/secure/${loanIdToken}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token here
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            const errorMessage = await response.text(); // Read the message from backend
            setAlert(errorMessage); // Show the custom access-denied message
            return;
          }
          throw new Error("Failed to fetch loan details.");
        }

        const data = await response.json();
        console.log("Loan documents checking....:", data.documentInfo);

        setSelectedLoan(data);
      } catch (error) {
        console.error("Error fetching loan:", error);
        setAlert("Failed to load loan details. Please try again later.");
      }
    };

    //if (loanId) {
    if (loanIdToken) {
      fetchLoan();
    }
  }, [searchParams, router]);

  // Scroll alert into view when it appears
  useEffect(() => {
    if (alert && alertRef.current) {
      window.scrollTo({
        top: alertRef.current.offsetTop - 40,
        behavior: "smooth",
      });
    }
  }, [alert]);

  // Handle loading and alert-only UI before main UI renders
  if (!selectedLoan && !alert) {
    return <Typography variant="h6" align="center">Loading loan details...</Typography>;
  }

  if (!selectedLoan && alert) {
    return (
      <Alert severity="error" onClose={() => setAlert(null)} ref={alertRef}>
        {alert}
      </Alert>
    );
  }

  const handleOpenDialog = (type) => {
    setActionType(type);
    setOpenDialog(true);
  };

  const previewDocument = (base64Data, mimeType) => {
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Error previewing document:", error);
      setAlert("Unable to preview the document.");
    }
  };

  const getMimeTypeFromBase64 = (base64) => {
    if (base64.startsWith("iVBOR")) return "image/png";
    if (base64.startsWith("/9j/")) return "image/jpeg";
    if (base64.startsWith("JVBER")) return "application/pdf";
    return "application/octet-stream"; // fallback
  };

  const handleConfirmAction = async () => {
    setAlert(`Loan ${selectedLoan.id} marked as: ${actionType}`);
    setOpenDialog(false);

    const loanDecisionRequest = {
      applicationId: selectedLoan.id,
      status: actionType,
      remarks: remarks,
    };
    console.log(JSON.stringify("request", loanDecisionRequest));
    try {
      const response = await fetch("http://localhost:8080/api/loans/officer-decision", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loanDecisionRequest),
      });

      console.log("Response for request", response);

      if (response.ok) {
        const updatedResponse = await response.json();
        console.log("Updated Response:", updatedResponse);

        if (updatedResponse.confirmationStatus) {
          // Successfully updated, show the message
          setAlert(updatedResponse.message); // Success message
        } else {
          // Failed to update loan
          setAlert(updatedResponse.message); // Error message
        }
      } else {
        const errorData = await response.json();
        setAlert(`Error: ${errorData.message || 'Something went wrong'}`);
      }
    } catch (error) {
      setAlert(`Error: ${error.message || 'Something went wrong'}`);
    }
  };

  return (
    <Paper elevation={4} sx={{ padding: 4, marginTop: 2, borderRadius: 2, position: 'relative' }}>
      {/* Close Icon */}
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 100 }}>
        <IconButton
          onClick={() => router.back()}
          sx={{
            background: "linear-gradient(45deg, #FF6F61, #D32F2F)",
            borderRadius: "50px",
            padding: "6px 8px",
            margin: "0px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease, background 0.3s ease",
            display: "flex",
            alignItems: "center",
            "&:hover": {
              background: "linear-gradient(45deg, #D32F2F, #FF6F61)",
              transform: "scale(1.05)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <Close sx={{ color: "#fff", fontSize: "13px" }} />
          <Typography sx={{ color: "#fff", fontSize: "12px", marginLeft: 0.5 }}>
            Close
          </Typography>
        </IconButton>
      </Box>

      <Typography variant="h4" gutterBottom align="center">Loan Application Review</Typography>
      {/* Alert Section */}
      {alert && (
        <Alert
          severity="error"
          onClose={() => setAlert(null)}
          ref={alertRef}
          sx={{ mb: 2 }}
        >
          {alert}
        </Alert>
      )}

      <Divider sx={{ marginY: 2 }} />

      {/* Loan ID & Application Details */}
      <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", borderRadius: 2, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          <strong>Loan Application ID:</strong> {selectedLoan.id}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Applied On:</strong> {new Date(selectedLoan.appliedDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body1">
          <strong>Loan Purpose:</strong> {selectedLoan.loanType || "Home Loan"}
        </Typography>
        <Typography variant="body1">
          <strong>Application Status :</strong>
          <Badge
            color={selectedLoan.status === "PENDING" ? "warning" : selectedLoan.status === "APPROVED" ? "success" : "error"}
            badgeContent={selectedLoan.status}
            sx={{ marginLeft: 5 }}
          />
        </Typography>
      </Box>

      {/* Personal Information */}
      <Card elevation={3} sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h6">Personal Information</Typography>
          <Divider sx={{ marginY: 1 }} />
          <Typography><strong>Name:</strong> {selectedLoan.personalInfo?.firstName} {selectedLoan.personalInfo?.lastName || "N/A"}</Typography>
          <Typography><strong>DOB:</strong> {selectedLoan.personalInfo?.dob || "N/A"}</Typography>
          <Typography><strong>Gender:</strong> {selectedLoan.personalInfo?.gender || "N/A"}</Typography>
          <Typography><strong>Email:</strong> {selectedLoan.personalInfo?.email || "N/A"}</Typography>
          <Typography><strong>Phone:</strong> {selectedLoan.personalInfo?.phone || "N/A"}</Typography>
          <Typography><strong>Address:</strong> {selectedLoan.personalInfo?.address || "N/A"}</Typography>
        </CardContent>
      </Card>

      {/* Employment Information */}
      {selectedLoan.employmentInfo && (
        <Card elevation={3} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">Employment Information</Typography>
            <Divider sx={{ marginY: 1 }} />
            <Typography><strong>Employment Type:</strong> {selectedLoan.employmentInfo?.employmentType || "N/A"}</Typography>
            <Typography><strong>Company Name:</strong> {selectedLoan.employmentInfo?.companyName || "N/A"}</Typography>
            <Typography><strong>Monthly Income:</strong> ${selectedLoan.employmentInfo?.monthlyIncome || "N/A"}</Typography>
            <Typography><strong>Years of Experience:</strong> {selectedLoan.employmentInfo?.yearsExperience || "N/A"}</Typography>
            <Typography><strong>Employer Contact:</strong> {selectedLoan.employmentInfo?.employerContact || "N/A"}</Typography>
          </CardContent>
        </Card>
      )}

      {/* Financial Information */}
      {selectedLoan.financialInfo && (
        <Card elevation={3} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">Financial Information</Typography>
            <Divider sx={{ marginY: 1 }} />
            <Typography><strong>Credit Score:</strong> {selectedLoan.financialInfo?.creditScore || "N/A"}</Typography>
            <Typography><strong>Bank Account:</strong> {selectedLoan.financialInfo?.bankAccount || "N/A"}</Typography>
            <Typography><strong>Existing Loans:</strong> {selectedLoan.financialInfo?.existingLoans || "N/A"}</Typography>
            <Typography><strong>Existing Loan Amount:</strong> ${selectedLoan.financialInfo?.existingLoanAmount || "N/A"}</Typography>
            <Typography><strong>Assets:</strong> {selectedLoan.financialInfo?.assets || "N/A"}</Typography>
          </CardContent>
        </Card>
      )}

      {/* Loan Information */}
      <Card elevation={3} sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h6">Loan Information</Typography>
          <Divider sx={{ marginY: 1 }} />
          <Typography><strong>Loan Type:</strong> {selectedLoan.loanType || "N/A"}</Typography>
          <Typography><strong>Loan Amount:</strong> ${selectedLoan.loanAmount || "N/A"}</Typography>
          <Typography><strong>Tenure:</strong> {selectedLoan.tenure || "N/A"} years</Typography>
          <Typography><strong>EMI Date:</strong> {selectedLoan.emiDate || "N/A"}</Typography>
        </CardContent>
      </Card>

      {/* Documents */}
      {selectedLoan.documentInfo && (
        <Card elevation={3} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">Documents</Typography>
            <Divider sx={{ marginY: 1 }} />
            {Object.entries(selectedLoan.documentInfo).map(([key, base64Data]) => (
              base64Data ? (
                <Button
                  key={key}
                  startIcon={<Description />}
                  onClick={() => previewDocument(base64Data, getMimeTypeFromBase64(base64Data))}
                  sx={{ marginRight: 1, marginBottom: 1 }}
                  variant="outlined"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </Button>
              ) : null
            ))}
          </CardContent>
        </Card>
      )}

      {/* Remarks & Actions */}
      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        <Grid item xs={12}>
          <TextField
            label="Remarks"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </Grid>
<Grid container spacing={2} sx={{ marginTop: 3 }}>
  <Grid item xs={4}>
    <Button
      variant="contained"
      color="error"
      fullWidth
      onClick={() => handleOpenDialog("REJECTED")}
      startIcon={<Cancel />}
    >
      Reject
    </Button>
  </Grid>
  <Grid item xs={4}>
    <Button
      variant="contained"
      color="warning"
      fullWidth
      onClick={() => handleOpenDialog("ESCALATED")}
      startIcon={<Warning />}
    >
      Escalate
    </Button>
  </Grid>
  <Grid item xs={4}>
    <Button
      variant="contained"
      color="success"
      fullWidth
      onClick={() => handleOpenDialog("APPROVED")}
      startIcon={<CheckCircle />}
    >
      Approve
    </Button>
  </Grid>
</Grid>

      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm {actionType === "APPROVED" ? "Approval" : "Rejection"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionType === "APPROVED" ? "approve" : "reject"} this loan application?
          </DialogContentText>
          {remarks.trim() === "" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Please enter remarks before confirming.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmAction}
            color={actionType === "APPROVED" ? "success" : "error"}
            disabled={remarks.trim() === ""}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default LoanDetailsPage;

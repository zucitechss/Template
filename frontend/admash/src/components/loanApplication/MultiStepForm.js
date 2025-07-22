"use client";
import { useForm } from "../../context/FormContext";
import PersonalInfo from "./PersonalInfo";
import EmploymentInfo from "./EmploymentInfo";
import FinancialInfo from "./FinancialInfo";
import LoanInfo from "./LoanInfo";
import DocumentUpload from "./DocumentUpload";
import ApplicationPreview from "./ApplicationPreview";
import ProgressBar from "./ProgressBar";
import useAuthGuard from "@/components/useAuthGuard";
import {Box, Typography,} from "@mui/material";
import { useRouter } from "next/navigation";
 
const MultiStepForm = () => {
  const authStatus = useAuthGuard("APPLICANT");
  const router = useRouter();
  const { currentStep } = useForm();

  // 🔁 Handle no-token redirect
  // If session expired
  if (authStatus === "no-token") {
    router.push("/authentication/logout?message=Session expired or you're not logged in");
  }

  if (authStatus === "loading") {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">🔐 Checking permissions...</Typography>
      </Box>
    );
  }

  if (authStatus === "unauthorized") {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
        🚫 Access Denied: You do not have permission to view this page.
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <ProgressBar />
      {currentStep === 1 && <PersonalInfo />}
      {currentStep === 2 && <EmploymentInfo />}
      {currentStep === 3 && <FinancialInfo />}
      {currentStep === 4 && <LoanInfo />}
      {currentStep === 5 && <DocumentUpload />}
      {currentStep === 6 && <ApplicationPreview />}
    </div>
  );
};
 
export default MultiStepForm;

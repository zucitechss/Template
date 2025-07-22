"use client";

import { createContext, useContext, useState } from "react";
 
const FormContext = createContext();
 
export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    personalInfo: { firstName: "", lastName: "", dob: "", gender: "", email: "", phone: "", address: "", maritalStatus: "" },
    employmentInfo: { employmentType: "", companyName: "", monthlyIncome: "", yearsExperience: "", employerContact: "" },
    financialInfo: { creditScore: "", bankAccount: "", existingLoans: "", existingLoanAmount: "", assets: "" },
    loanInfo: { loanType: "", loanAmount: "", tenure: "", emiDate: "" },
    documents: { idProof: "", incomeProof: "", addressProof: "", photo: "" }
  });
 
  const [currentStep, setCurrentStep] = useState(1);
 
  const updateFormData = (section, data) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };
 
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
 
  return (
    <FormContext.Provider value={{ formData, updateFormData, currentStep, nextStep, prevStep }}>
      {children}
    </FormContext.Provider>
  );
};
 
export const useForm = () => useContext(FormContext);
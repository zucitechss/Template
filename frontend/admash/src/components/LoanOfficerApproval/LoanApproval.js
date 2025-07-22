"use client"

import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Pagination,
  Box,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import useAuthGuard from "@/components/useAuthGuard";
import { jwtDecode } from "jwt-decode";

// Function to set row background color based on status
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "#d4edda";
    case "pending":
      return "#fff3cd";
    case "rejected":
      return "#f8d7da";
    default:
      return "#ffffff";
  }
};

const LoanListPage = () => {
  const authStatus = useAuthGuard("LOAN_OFFICER");
  const router = useRouter();
  const [loanApplications, setLoanApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  useEffect(() => {
    if (authStatus !== "authorized") return;

    const fetchLoans = async () => {
      const url = filterStatus
        ? `http://localhost:8080/api/loans/status/${filterStatus}`
        : `http://localhost:8080/api/loans/loanapplications`;

      try {
        const response = await axios.get(url);
        setLoanApplications(response.data);
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };

    fetchLoans();
  }, [authStatus, filterStatus]);

  // 🔁 Handle no-token redirect
  // If session expired
  if (authStatus === "no-token") {
    router.push("/authentication/logout?message=Session expired or you're not logged in");
  }


  if (authStatus === "loading") {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">⏳ Checking authorization...</Typography>
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



  // Sort loans by applied date
  const sortedLoans = [...loanApplications].sort((a, b) => {
    const dateA = new Date(a.appliedDate);
    const dateB = new Date(b.appliedDate);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Paginate loans
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentLoans = sortedLoans.slice(indexOfFirstRow, indexOfLastRow);

  // Handle row click
  const handleRowClick = (loan) => {
    if (!loan || !loan.id) {
      console.error("Invalid loan object:", loan);
      return;
    }

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const permissions = decoded.permissions || [];
    //console.log("Loan approval permission",permissions)
    //const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

    if (!permissions.includes("LOAN_OPEN_DETAILS")) {
      alert("You do not have permission to view loan details.");
      return;
    }
    
    //router.push(`/loanofficerapproval/Loan-DetailsPage?loanId=${loan.id}`);
    router.push(`/loanofficerapproval/Loan-DetailsPage?loanIdToken=${loan.loanIdToken}`);


  };

  
  return (
    <TableContainer component={Paper} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Loan Officer
      </Typography>

      {/* Filter and Sort Controls */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Escalated">Escalated</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Loan ID</TableCell>
            <TableCell>Applicant Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Loan Type</TableCell>
            <TableCell>Loan Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Applied Date
              <IconButton
                size="small"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentLoans.length > 0 ? (
            currentLoans.map((loan) => (
              <TableRow
                key={loan.id}
                hover
                onClick={() => handleRowClick(loan)}
                style={{ cursor: "pointer", backgroundColor: getStatusColor(loan.status) }}
              >
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.personalInfo?.firstName + " " + loan.personalInfo?.lastName || "N/A"}</TableCell>
                <TableCell>{loan.personalInfo?.email || "N/A"}</TableCell>
                <TableCell>{loan.loanType}</TableCell>
                <TableCell>${loan.loanAmount?.toLocaleString() || "N/A"}</TableCell>
                <TableCell>{loan.status}</TableCell>
                <TableCell>{loan.appliedDate ? new Date(loan.appliedDate).toLocaleDateString() : "N/A"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No loan applications found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(sortedLoans.length / rowsPerPage)}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>
    </TableContainer>
  );
};

export default LoanListPage;


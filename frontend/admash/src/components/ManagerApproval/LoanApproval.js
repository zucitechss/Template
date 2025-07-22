"use client"

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  LinearProgress,
  Paper,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DataGrid } from "@mui/x-data-grid";
import { People, CheckCircle, HourglassEmpty, Cancel, TrendingUp } from "@mui/icons-material";
import useAuthGuard from "@/components/useAuthGuard";
import { useRouter } from "next/navigation";

const COLORS = ["#4caf50", "#ff9800", "#f44336", "#2196f3", "#9c27b0"];
const initialApplications = [
  { id: 1, status: "Pending", loanAmount: 50000, assignedTo: "John Doe" },
  { id: 2, status: "Approved", loanAmount: 10000, assignedTo: "Madhusudhan SR" },
  { id: 3, status: "Rejected", loanAmount: 3000 },
  { id: 4, status: "Escalated", loanAmount: 8000, assignedTo: "Alice Brown" },
];

const loanOfficers = ["John Doe", "Jane Smith", "Alice Brown","Madhusudhan SR"];

const Dashboard = () => {
  const authStatus = useAuthGuard("MANAGER");
  const router = useRouter();

  const [loanApplications, setLoanApplications] = useState(initialApplications);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState("");

  
  //  Now return based on auth status:
  //  Handle no-token redirect
  // If session expired
  if (authStatus === "no-token") {
    router.push("/authentication/logout?message=Session expired or you're not logged in");
  }

  if (authStatus === "loading") {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">🔒 Verifying access...</Typography>
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
    const filteredApplications =
      filter === "All" ? loanApplications : loanApplications.filter((app) => app.status === filter);
  
    const statusSummary = loanApplications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
  
    const pieData = Object.entries(statusSummary).map(([status, count], index) => ({
      name: status,
      value: count,
      color: COLORS[index % COLORS.length],
    }));
  
    const officerStats = loanApplications.reduce((acc, app) => {
      if (app.assignedTo) {
        acc[app.assignedTo] = acc[app.assignedTo] || { count: 0, amount: 0, approvals: 0 };
        acc[app.assignedTo].count++;
        acc[app.assignedTo].amount += app.loanAmount;
        if (app.status === "Approved") acc[app.assignedTo].approvals++;
      }
      return acc;
    }, {});
  
    const employeeOfMonth = Object.entries(officerStats).reduce((top, [officer, stats]) => {
      if (!top || stats.approvals > top.approvals) return { officer, ...stats };
      return top;
    }, null);
  
    const handleStatusChange = (id, newStatus) => {
      setLoanApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    };
  
    const handleAssign = (id) => {
      setLoanApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, assignedTo: selectedOfficer } : app))
      );
      setOpen(false);
      setSelectedOfficer("");
    };
  
    const gradientColors = {
      Total: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)",
      Approved: "linear-gradient(135deg, #d0f8ce 0%, #81c784 100%)",
      Rejected: "linear-gradient(135deg, #f8bbd0 0%, #e57373 100%)",
      Pending: "linear-gradient(135deg, #fff9c4 0%, #ffeb3b 100%)",
      Escalated: "linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%)",
    };
  
    const gradientCards = Object.entries({
      Total: loanApplications.length,
      ...statusSummary,
    }).map(([key, value]) => (
      <Grid item xs={12} sm={6} md={2.4} key={key}>
        <Card sx={{
          background: gradientColors[key] || "#fff",
          color: "#333",
          height: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 2,
        }}>
          <CardContent>
            <Typography variant="h6" align="center">{key} Applications</Typography>
            <Typography variant="h4" align="center">{value}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ));
  
    return (
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          📊 Manager Dashboard
        </Typography>
  
        {/* Gradient Cards Section */}
        <Typography variant="h6" gutterBottom>
          🌟 Application Summary
        </Typography>
        <Grid container spacing={2} mb={3}>
          {gradientCards}
        </Grid>
  
        {/* Approval Summary Pie Chart */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎂 Approval Summary
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={120}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
  
        {/* Loan Officer Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              👥 Loan Officer Performance
            </Typography>
            {Object.entries(officerStats).map(([officer, { count, amount, approvals }]) => (
              <Box key={officer} mb={2} p={2} border={1} borderRadius={2} boxShadow={2}>
                <Typography variant="h6">{officer}</Typography>
                <Typography>Total Applications Assigned: {count}</Typography>
                <Typography>Total Loan Amount Handled: ${amount}</Typography>
                <Typography>Approved Applications: {approvals}</Typography>
              </Box>
            ))}
  
            {employeeOfMonth && (
              <Box mt={3} p={2} bgcolor="#f0f8ff" borderRadius={2} boxShadow={3}>
                <Typography variant="h5" color="primary">
                  🏆 Employee of the Month: {employeeOfMonth.officer}
                </Typography>
                <Typography>Approvals: {employeeOfMonth.approvals}</Typography>
                <Typography>Total Amount Approved: ${employeeOfMonth.amount}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
  
        {/* Loan Applications Section */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">📄 Loan Applications</Typography>
              <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Escalated">Escalated</MenuItem>
              </Select>
            </Box>
  
            {filteredApplications.map((app) => (
              <Box key={app.id} mb={2} p={2} border={1} borderRadius={2} boxShadow={1}>
                <Typography>
                  <strong>ID:</strong> {app.id} | <strong>Status:</strong> {app.status} | <strong>Amount:</strong> ${app.loanAmount}
                </Typography>
                <Button size="small" color="success" onClick={() => handleStatusChange(app.id, "Approved")}>Approve</Button>
                <Button size="small" color="error" onClick={() => handleStatusChange(app.id, "Rejected")} style={{ margin: "0 8px" }}>Reject</Button>
                <Button size="small" color="warning" onClick={() => handleStatusChange(app.id, "Escalated")}>Escalate</Button>
                <Button size="small" color="primary" onClick={() => { setCurrentApp(app); setOpen(true); }} style={{ marginLeft: "8px" }}>Assign Officer</Button>
                {app.assignedTo && (
                  <Typography variant="body2" color="textSecondary">
                    Assigned to: {app.assignedTo}
                  </Typography>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
  
        {/* Assign Officer Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Assign Loan Officer</DialogTitle>
          <DialogContent>
            <Select fullWidth value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)}>
              {loanOfficers.map((officer) => (
                <MenuItem key={officer} value={officer}>{officer}</MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => handleAssign(currentApp?.id)} disabled={!selectedOfficer}>Assign</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  export default Dashboard;
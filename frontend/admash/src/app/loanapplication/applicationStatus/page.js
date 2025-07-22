"use client";
import { useState, useEffect } from "react";

const LoanStatusTracker = ({ applicationId }) => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await fetch(`http://localhost:8080/api/loans/${applicationId}`);
      const data = await response.json();
      setStatus(data.status);
    };

    if (applicationId) {
      fetchStatus();
    }
  }, [applicationId]);

  const statusMap = {
    pending: { label: "Pending", icon: "🟡", color: "#F7B500" },
    approved: { label: "Approved", icon: "✅", color: "#28A745" },
    rejected: { label: "Rejected", icon: "❌", color: "#DC3545" },
    escalated: { label: "Escalated", icon: "🔵", color: "#007BFF" },
  };

  return (
    <div className="status-tracker">
      <div
        className="status-step"
        style={{ backgroundColor: statusMap[status]?.color }}
      >
        <div className="status-icon">{statusMap[status]?.icon}</div>
        <div className="status-label">{statusMap[status]?.label}</div>
      </div>
    </div>
  );
};

export default LoanStatusTracker;

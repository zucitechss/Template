"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Correct way to import jwt-decode

export default function useAuthGuard(requiredRole = null) {
  const [authStatus, setAuthStatus] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthStatus("no-token");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const roles = decoded.roles || [];
      console.log("AuthGaurd page roles:", roles);

      if (requiredRole && !roles.includes(requiredRole)) {
        setAuthStatus("unauthorized");
      } else {
        setAuthStatus("authorized");
      }
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      setAuthStatus("invalid-token");
    }
  }, [requiredRole]);

  return authStatus;
}

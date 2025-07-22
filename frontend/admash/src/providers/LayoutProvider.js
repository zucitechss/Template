"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import LeftSidebar from "@/components/Layouts/LeftSidebar";
import TopNavbar from "@/components/Layouts/TopNavbar";
import Footer from "@/components/Layouts/Footer";
import ScrollToTop from "../components/Layouts/ScrollToTop";
import ControlPanelModal from "../components/Layouts/ControlPanelModal";
import { useEffect} from "react";

const LayoutProvider = ({ children }) => {
  const [active, setActive] = useState(false);
  const [userRole, setUserRole] = useState(null); // role state
  const pathname = usePathname();

  useEffect(() => {
    // Get role from localStorage
    const roleFromStorage = localStorage.getItem("role");
    setUserRole(roleFromStorage);
  }, []);

  const toogleActive = () => {
    setActive(!active);
  };
  return (
    <>
      <div className={`main-wrapper-content ${active && "active"}`}>
        {!(
          pathname === "/authentication/sign-in/" ||
          pathname === "/authentication/sign-up/" ||
          pathname === "/authentication/forgot-password/" ||
          pathname === "/authentication/lock-screen/" ||
          pathname === "/authentication/confirm-mail/" ||
          pathname === "/authentication/logout/"
        ) && (
          <>
            <TopNavbar toogleActive={toogleActive} />

            {/* Pass the role to the sidebar */}
            <LeftSidebar toogleActive={toogleActive} userRole={userRole} />
          </>
        )}

        <div className="main-content">
          {children}
          {!(
            pathname === "/authentication/sign-in/" ||
            pathname === "/authentication/sign-up/" ||
            pathname === "/authentication/forgot-password/" ||
            pathname === "/authentication/lock-screen/" ||
            pathname === "/authentication/confirm-mail/" ||
            pathname === "/authentication/logout/"
          ) && <Footer />}
        </div>
      </div>

      {/* ScrollToTop */}
      <ScrollToTop />

      {!(
        pathname === "/authentication/sign-in/" ||
        pathname === "/authentication/sign-up/" ||
        pathname === "/authentication/forgot-password/" ||
        pathname === "/authentication/lock-screen/" ||
        pathname === "/authentication/confirm-mail/" ||
        pathname === "/authentication/logout/"
      ) && <ControlPanelModal />}
    </>
  );
};

export default LayoutProvider;

"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import Link from "next/link";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";

const SidebarNav = styled("nav")(({ theme }) => ({
  background: "#fff",
  boxShadow: "0px 4px 20px rgba(47, 143, 232, 0.07)",
  width: "300px",
  padding: "30px 10px",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  position: "fixed",
  top: 0,
  left: 0,
  transition: "350ms",
  zIndex: "10",
  overflowY: "auto",
}));

const SidebarWrap = styled("div")(({ theme }) => ({
  width: "100%",
}));

// Updated filter function to support multiple roles
const filterSidebarByRole = (data, roles = []) => {
  return data
    .filter(item => !item.roles || item.roles.some(role => roles.includes(role)))
    .map(item => {
      if (item.subNav) {
        const filteredSubNav = item.subNav.filter(
          sub => !sub.roles || sub.roles.some(role => roles.includes(role))
        );
        return { ...item, subNav: filteredSubNav };
      }
      return item;
    });
};

const Sidebar = ({ toogleActive }) => {
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const storedRoles = localStorage.getItem("token");
          //const token = localStorage.getItem("token");
    if (storedRoles) {
      try {
        const decoded = jwtDecode(storedRoles);
        const roles = decoded.roles || [];
        //console.log("index role based filter:", roles);
        const parsedRoles = roles;
        //console.log("index parsedRoles based filter:", parsedRoles);
        setUserRoles(parsedRoles);
      } catch (error) {
        console.error("Error parsing roles from localStorage", error);
      }
    }
  }, []);

  const filteredSidebar = filterSidebarByRole(SidebarData, userRoles);

  return (
    <div className="leftSidebarDark">
      <SidebarNav className="LeftSidebarNav">
        <SidebarWrap>
          <Box
            sx={{
              mb: "20px",
              px: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link href="/" passHref>
              <Image
                src="/images/zucitech.png"
                alt="ZuciTech Logo"
                width={190}
                height={50}
                style={{ objectFit: "contain" }}
              />
            </Link>

            <IconButton
              onClick={toogleActive}
              size="small"
              sx={{
                background: "rgb(253, 237, 237)",
                display: { lg: "none" },
              }}
            >
              <ClearIcon />
            </IconButton>
          </Box>

          {/* Optional: show current roles for debugging */}
          <Box sx={{ px: 2, mb: 2, fontSize: 12, color: "gray" }}>
            Roles: {userRoles.join(", ")}
          </Box>

          {filteredSidebar.map((item, index) => (
            <SubMenu item={item} key={index} />
          ))}
        </SidebarWrap>
      </SidebarNav>
    </div>
  );
};

export default Sidebar;

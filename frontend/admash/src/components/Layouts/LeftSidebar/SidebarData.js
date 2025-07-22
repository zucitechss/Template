"use client";

import React from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GridViewIcon from "@mui/icons-material/GridView";
import LayersIcon from "@mui/icons-material/Layers";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AddchartIcon from "@mui/icons-material/Addchart";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FactCheckIcon from '@mui/icons-material/FactCheck';

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/Dashboard/",
    icon: <GridViewIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
   
          subNav: []
             /*
      {
        title: "eCommerce",
        path: "/ecommerce-dashboard/",
      },
      {
        title: "Analytics",
        path: "/analytics-dashboard/",
      },
      {
        title: "Project Management",
        path: "/project-management-dashboard/",
      },
      {
        title: "LMS Courses",
        path: "/lms-courses-dashboard/",
      },
      {
        title: "Crypto",
        path: "/crypto-dashboard/",
      },
      {
        title: "Help/Support Desk",
        path: "/help-desk-dashboard/",
      },
      {
        title: "SaaS App",
        path: "/saas-app-dashboard/",
      },
    ]*/
  },
  {
    title: "Authentication",
    path: "/authentication/sign-in/",
    icon: <LockIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Sign In",
        path: "/authentication/sign-in/",
      },
      {
        title: "Sign Up",
        path: "/authentication/sign-up/",
      },
      /*{
        title: "Forgot Password",
        path: "/authentication/forgot-password/",
      },
      {
        title: "Lock Screen",
        path: "/authentication/lock-screen/",
      },
      {
        title: "Confirm Mail",
        path: "/authentication/confirm-mail/",
      },*/
      {
        title: "Logout",
        path: "/authentication/logout/",
      },
    ],
  },
  {
    title: "Application Forms",
    path: "/loanapplication/",
    roles: ["APPLICANT"],
    icon: <AddchartIcon />,
        iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Appllication Status",
        path: "/loanapplication/applicationStatus/",
      },
    ]
  },
  {
    title: "Loan Approval",
    path: "/loanofficerapproval/Loan-Approval/",
    roles: ["LOAN_OFFICER"],
    icon: <FactCheckIcon />,

  },
  {
    title: "Admin Panel",
    path: "/adminpanel/roleaccess/",
    roles: ["ADMIN"],
    icon: <AdminPanelSettingsIcon />,
  },
  {
    title: "Manager Panel",
    path: "/managerpanel/Loan-Approval/",
    roles: ["MANAGER"],
    icon: <AdminPanelSettingsIcon />,
  },
  {
    title: "Settings",
    path: "",
    icon: <SettingsIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,

    subNav: [
      {
        title: "Forgot Password",
        path: "/authentication/forgot-password/",
      },
      /*{
        title: "Account",
        path: "/settings/account/",
      },
      {
        title: "Security",
        path: "/settings/security/",
      },
      {
        title: "Privacy Policy",
        path: "/settings/privacy-policy/",
      },
      {
        title: "Terms & Conditions",
        path: "/pages/terms-conditions/",
      },
      {
        title: "Logout",
        path: "/authentication/logout/",
      },*/
    ],
  }
];

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios for HTTP requests
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  Pagination,
  Switch,
  Grid,
  Card,
  Checkbox, 
  ListItemText
} from "@mui/material";

import { Delete, Search, Work, Group, AdminPanelSettings } from "@mui/icons-material";
import useAuthGuard from "@/components/useAuthGuard";
import { jwtDecode } from "jwt-decode";

// Define role mapping (assuming role_id corresponds to these values)
const roleMap = {
  1: "Applicant",
  2: "Loan Officer",
  3: "Manager"
};

const DashboardCard = ({ title, count, icon: Icon, bgColor }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < count) {
        current++;
        setDisplayCount(current);
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <Card sx={{ background: bgColor, color: "#fff", borderRadius: 3, boxShadow: 5, display: "flex", alignItems: "center", p: 2 }}>
      <Icon sx={{ fontSize: 40, mr: 2 }} />
      <Box>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>{displayCount}</Typography>
      </Box>
    </Card>
  );
};

const AdminPanel = () => {
  const authStatus = useAuthGuard("ADMIN");
  const router = useRouter();

  // ✅ Declare all hooks at the top level
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [page, setPage] = useState(1);
  const usersPerPage = 5;
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);


  //const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const permissions = decoded.permissions || [];


  // ✅ useEffect is also declared before any return
  useEffect(() => {
    axios.get("http://localhost:8080/api/users/list")
      .then((response) => {
        //console.log("Users with user:", response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users", error);
      });

//const token = localStorage.getItem("token"); // or wherever you store it

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

axios.get("http://localhost:8080/api/roles", axiosConfig)
  .then((res) => {
    //console.log("Roles:", res.data);
    setAvailableRoles(res.data);
  })
  .catch((err) => {
    console.error("Error fetching roles", err.response?.data || err.message);
  });

axios.get("http://localhost:8080/api/permissions", axiosConfig)
  .then((res) => {
    //console.log("Permissions:", res.data);
    setAvailablePermissions(res.data);
  })
  .catch((err) => {
    console.error("Error fetching permissions", err.response?.data || err.message);
  });

    }, []);

  // 🔁 Handle no-token redirect
  // If session expired
  if (authStatus === "no-token") {
    router.push("/authentication/logout?message=Session expired or you're not logged in");
  }


  if (authStatus === "loading") {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">🔐 Checking admin access...</Typography>
      </Box>
    );
  }

  if (authStatus === "unauthorized") {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          🚫 Access denied: You are not authorized to view this page.
        </Typography>
      </Box>
    );
  }

const handleRoleChange = (userId, newRoleIds) => {
  if (!permissions.includes("USER_CHANGE_ROLE")) {
    alert("You do not have permission to change user roles.");
    return;
  }

  axios.put(`http://localhost:8080/api/users/${userId}/roles`, { roleIds: newRoleIds })
    .then(() => {
      // Update the local users state
      const updatedUserRoles = availableRoles.filter(r => newRoleIds.includes(r.id));
      const updatedUsers = users.map(user =>
        user.id === userId
          ? { ...user, roles: updatedUserRoles }
          : user
      );
      setUsers(updatedUsers);

      // ✅ Update localStorage.roles if this is the logged-in user
      const token = localStorage.getItem("token");
      if (token) {
        const base64Payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        const currentUserEmail = decodedPayload.sub; // e.g., "zucitech@gmail.com"

        const updatedUser = updatedUsers.find(u => u.id === userId);
        if (updatedUser?.email === currentUserEmail) {
          const updatedRoleNames = updatedUserRoles.map(role => role.roleName);
          localStorage.setItem("roles", JSON.stringify(updatedRoleNames));
        }
      }

      setSnackbar({ open: true, message: 'Roles updated successfully!' });
      //  Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2);      
    })
    .catch(() => {
      setSnackbar({ open: true, message: 'Failed to update roles.' });
    });
};


const handlePermissionChange = (userId, newPermissionIds) => {
  axios.put(`http://localhost:8080/api/users/${userId}/permissions`, { permissionIds: newPermissionIds })
    .then(() => {
      // Update the local user state
      const updatedPermissions = availablePermissions.filter(p => newPermissionIds.includes(p.id));
      const updatedUsers = users.map(user =>
        user.id === userId
          ? { ...user, permissions: updatedPermissions }
          : user
      );
      setUsers(updatedUsers);

      // ✅ Update localStorage.permissions if this is the logged-in user
      const token = localStorage.getItem("token");
      if (token) {
        const base64Payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        const currentUserEmail = decodedPayload.sub;

        const updatedUser = updatedUsers.find(u => u.id === userId);
        if (updatedUser?.email === currentUserEmail) {
          const updatedPermissionNames = updatedPermissions.map(p => p.name);
          localStorage.setItem("permissions", JSON.stringify(updatedPermissionNames));
        }
      }

      setSnackbar({ open: true, message: 'Permissions updated successfully!' });
      //  Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2);
    })
    .catch(() => {
      setSnackbar({ open: true, message: 'Failed to update permissions.' });
    });
};


  const handleSearch = (e) => setSearch(e.target.value);

  const handleDeleteUser = (userId) => {
    if (!permissions.includes("USER_DELETE")) {
      alert("You do not have permission to delete users.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      axios.delete(`http://localhost:8080/api/users/${userId}`)
        .then(() => {
          setUsers(users.filter(user => user.id !== userId));
          setSnackbar({ open: true, message: "User removed successfully!" });
        })
        .catch(() => {
          setSnackbar({ open: true, message: "Error deleting user." });
        });
    }
  };

  

  const handleToggleActive = (userId, active) => {
    if (!permissions.includes("USER_TOGGLE_ACTIVE")) {
      alert("You do not have permission to activate or deactivate users.");
      return;
    }

    const action = active ? "deactivate" : "activate";
    const message = `Are you sure you want to ${action} this user?`;

    const confirmed = window.confirm(message);
    if (confirmed) {
      axios.put(`http://localhost:8080/api/users/${userId}/status`, { active: !active })
        .then(() => {
          setUsers(users.map(user => (user.id === userId ? { ...user, active: !active } : user)));
          setSnackbar({ open: true, message: `User successfully ${action}d!` });
        })
        .catch(() => {
          setSnackbar({ open: true, message: "Error toggling user status. Please try again." });
        });
    }
  };

  

  // Filter users based on the search
  const filteredUsers = users.filter(user =>
    `${user.username}`.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate the filtered users
  const paginatedUsers = filteredUsers.slice((page - 1) * usersPerPage, page * usersPerPage);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 3 }}>Admin Panel - User Management</Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard title="Total Users" count={users.length} icon={Group} bgColor="linear-gradient(135deg, #007bff 30%, #00d4ff 90%)" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard title="Loan Officers" count={users.filter(user => user.role && user.role.roleName === 'Loan Officer').length} icon={Work} bgColor="linear-gradient(135deg, #28a745 30%, #85e085 90%)" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard title="Managers" count={users.filter(user => user.role && user.role.roleName === 'Manager').length} icon={AdminPanelSettings} bgColor="linear-gradient(135deg, #ffc107 30%, #ffec80 90%)" />
        </Grid>
      </Grid>

      <TextField
        label="Search User"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearch}
        InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
      />

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, p:2, mt: 2, mb:2}}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Avatar</TableCell>
              <TableCell sx={{ color: "#fff" }}>Username</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Role</TableCell>
              <TableCell sx={{ color: "#fff" }}>permission</TableCell>
              <TableCell sx={{ color: "#fff" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar src={user.avatar} alt={user.username} />
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    multiple
                    size="small"
                    value={user.roles.map(role => role.id)}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    renderValue={(selected) =>
                      selected.map(id => availableRoles.find(r => r.id === id)?.roleName).join(', ')
                    }
                    fullWidth
                  >
                    {availableRoles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        <Checkbox checked={user.roles.some(r => r.id === role.id)} />
                        <ListItemText primary={role.roleName} />
                      </MenuItem>
                    ))}
                  </Select>

                </TableCell>
                <TableCell>
                <Select
                  multiple
                  size="small"
                  value={user.permissions.map(permission => permission.id)}
                  onChange={(e) => handlePermissionChange(user.id, e.target.value)}
                  renderValue={(selected) =>
                    selected
                      .map(id => availablePermissions.find(p => p.id === id)?.name)
                      .join(', ')
                  }
                  fullWidth
                >
                  {availablePermissions.map(permission => (
                    <MenuItem key={permission.id} value={permission.id}>
                      <Checkbox checked={user.permissions.some(p => p.id === permission.id)} />
                      <ListItemText primary={permission.name} />
                    </MenuItem>
                  ))}
                </Select>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.active}
                    onChange={() => handleToggleActive(user.id, user.active)}
                    color="success"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Remove">
                    <IconButton color="error" onClick={() => handleDeleteUser(user.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
  <Pagination
    count={Math.ceil(filteredUsers.length / usersPerPage)}
    page={page}
    onChange={(e, value) => setPage(value)}
    color="primary"
  />
</Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity="success">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPanel;

package org.example.controller;

import org.example.dto.PermissionUpdateRequest;
import org.example.dto.UserRoleUpdateRequest;
import org.example.entity.User;
import org.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get all users
    @GetMapping("/list")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    // Update user role
    @PutMapping("/{id}/roles")
    public User updateUserRoles(@PathVariable Long id, @RequestBody UserRoleUpdateRequest request) {
        return userService.assignRolesToUser(id, request.getRoleIds());
    }


    @PutMapping("/{id}/permissions")
    public User updatePermissions(@PathVariable Long id, @RequestBody PermissionUpdateRequest request) {
        return userService.updatePermissions(id, request.getPermissionIds());
    }


    // Toggle user active status
    @PutMapping("/{id}/status")
    public User toggleStatus(@PathVariable Long id) {
        return userService.toggleUserStatus(id);
    }

    // Delete user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}

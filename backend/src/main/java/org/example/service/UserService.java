package org.example.service;

import org.example.entity.Permission;
import org.example.entity.User;
import org.example.entity.Role;
import org.example.repository.PermissionRepository;
import org.example.repository.UserRepository;
import org.example.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Method to assign a role to a user
    public User assignRolesToUser(Long userId, List<Long> roleIds) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        List<Role> roles = roleRepository.findAllById(roleIds);
        if (roles.size() != roleIds.size()) {
            throw new RuntimeException("One or more roles not found.");
        }

        User user = userOptional.get();
        user.setRoles(new HashSet<>(roles));
        user.setUpdatedDate(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    public User updatePermissions(Long userId, List<Long> permissionIds) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        List<Permission> permissions = permissionRepository.findAllById(permissionIds);
        if (permissions.size() != permissionIds.size()) {
            throw new RuntimeException("One or more permissions not found.");
        }

        User user = userOptional.get();
        user.setPermissions(new HashSet<>(permissions));  // Assuming User has a Set<Permission> field
        user.setUpdatedDate(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }


    // Method to toggle the user's active status
    public User toggleUserStatus(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setActive(!user.isActive());  // Toggle active status
            user.setUpdatedDate(java.time.LocalDateTime.now()); // Update the date
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found with id: " + userId);
        }
    }

    // Method to delete a user
    public void deleteUser(Long userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
        } else {
            throw new RuntimeException("User not found with id: " + userId);
        }
    }
}

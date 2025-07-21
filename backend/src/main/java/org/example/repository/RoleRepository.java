package org.example.repository;

import org.example.entity.Role;
import org.example.entity.RoleName;  // Import RoleName enum
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // Use RoleName enum in the method signature
    // Change the return type to Optional<Role>
    Optional<Role> findByRoleName(RoleName roleName);// Change the parameter type to RoleName
}

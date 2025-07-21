package org.example.repository;
import org.example.entity.RoleName;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // Correct method for many-to-many 'roles' relationship:
    List<User> findByRoles_Id(Long roleId);

    // You can also add by role name if Role has 'roleName' field:
    List<User> findByRoles_RoleName(String roleName);

}


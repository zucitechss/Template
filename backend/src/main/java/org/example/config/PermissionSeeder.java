package org.example.config;

import jakarta.annotation.PostConstruct;
import org.example.entity.Permission;
import org.example.entity.PermissionName;
import org.example.repository.PermissionRepository;
import org.springframework.stereotype.Component;

@Component
public class PermissionSeeder {

    private final PermissionRepository permissionRepository;

    public PermissionSeeder(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @PostConstruct
    public void seedPermissions() {
        for (PermissionName perm : PermissionName.values()) {
            permissionRepository.findByName(perm).orElseGet(() -> {
                Permission p = new Permission();
                p.setName(perm);
                p.setDescription(perm.name().replace("_", " ").toLowerCase());
                return permissionRepository.save(p);
            });
        }
    }
}

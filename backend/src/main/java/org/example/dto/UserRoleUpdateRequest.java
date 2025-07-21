package org.example.dto;
import java.util.List;
public class UserRoleUpdateRequest {
    private Long userId;
    private List<Long> roleIds;  // This will be used to fetch the Role entity

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Long> getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(List<Long> roleIds) {
        this.roleIds = roleIds;
    }
}





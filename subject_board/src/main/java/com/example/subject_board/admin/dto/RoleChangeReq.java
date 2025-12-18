package com.example.subject_board.admin.dto;

import jakarta.validation.constraints.NotBlank;

public class RoleChangeReq {
    @NotBlank
    private String role; // "USER" or "ADMIN"

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}

package com.example.subject_board.admin.dto;

import java.time.LocalDateTime;

public class AdminUserRes {
    private Long id;
    private String username;
    private String name;
    private String email;
    private String role;       // USER / ADMIN
    private boolean deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdminUserRes(Long id, String username, String name, String email, String role,
                        boolean deleted, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.role = role;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public boolean isDeleted() { return deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}

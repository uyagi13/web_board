package com.example.subject_board.auth.jwt;

public class MemberPrincipal {
    private final Long id;
    private final String username;
    private final String role; // "ROLE_USER" / "ROLE_ADMIN"

    public MemberPrincipal(Long id, String username, String role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
}
package com.example.subject_board.auth.dto;

public class TokenRes {

    private String accessToken;

    private Long memberId;
    private String username;
    private String role; // "ROLE_USER" / "ROLE_ADMIN"

    public TokenRes(String accessToken, Long memberId, String username, String role) {
        this.accessToken = accessToken;
        this.memberId = memberId;
        this.username = username;
        this.role = role;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}

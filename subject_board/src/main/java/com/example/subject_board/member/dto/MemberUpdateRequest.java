package com.example.subject_board.member.dto;

import jakarta.validation.constraints.Email;

public class MemberUpdateRequest {
	
    private String email;      // ✅ 선택(널 허용)

    private String password;   // ✅ 선택(널 허용)

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

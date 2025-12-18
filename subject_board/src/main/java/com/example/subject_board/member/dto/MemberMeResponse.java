package com.example.subject_board.member.dto;

import com.example.subject_board.member.Role;

public class MemberMeResponse {
    public Long id;
    public String username;
    public String passwdord;
    public String name;
    public String email;
    public Role role;

    public MemberMeResponse(Long id, String username,String password, String name, String email, Role role) {
        this.id = id;
        this.username = username;
        this.passwdord = password;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}

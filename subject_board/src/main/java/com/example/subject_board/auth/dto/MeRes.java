package com.example.subject_board.auth.dto;

import java.util.List;

public class MeRes {
    private final String username;
    private final List<String> roles;
	private Long memberId;

    public MeRes(Long memberId,String username, List<String> roles) {
    	this.memberId = memberId;
        this.username = username;
        this.roles = roles;
    }

    public String getUsername() { return username; }
    public List<String> getRoles() { return roles; }
    public Long getMemberId() { return memberId; }
}

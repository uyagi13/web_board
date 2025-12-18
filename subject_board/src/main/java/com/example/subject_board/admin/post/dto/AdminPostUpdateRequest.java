package com.example.subject_board.admin.post.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminPostUpdateRequest {
    @NotBlank
    public String title;

    @NotBlank
    public String content;

    // 필요하면 관리자에서 비밀글도 토글 가능
    public Boolean secret;
}

package com.example.subject_board.board.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CommentReq {

    @NotBlank
    @Size(max = 1000)
    private String content;

    private boolean secret;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isSecret() { return secret; }
    public void setSecret(boolean secret) { this.secret = secret; }
}

package com.example.subject_board.board.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PostReq {

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    private String content;

    private boolean secret;

    // getters/setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isSecret() { return secret; }
    public void setSecret(boolean secret) { this.secret = secret; }
}

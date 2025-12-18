package com.example.subject_board.board.post.dto;

import java.time.LocalDateTime;

public class PostListItemRes {

    private Long id;
    private Long authorId;
    private String authorName;
    private String title;
    private long viewCount;
    private boolean secret;
    private LocalDateTime createdAt;

    public PostListItemRes(Long id, Long authorId, String authorName, String title,
                           long viewCount, boolean secret, LocalDateTime createdAt) {
        this.id = id;
        this.authorId = authorId;
        this.authorName = authorName;
        this.title = title;
        this.viewCount = viewCount;
        this.secret = secret;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getAuthorId() { return authorId; }
    public String getAuthorName() { return authorName; }
    public String getTitle() { return title; }
    public long getViewCount() { return viewCount; }
    public boolean isSecret() { return secret; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

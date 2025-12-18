package com.example.subject_board.board.post.dto;

import java.time.LocalDateTime;

public class PostDetailRes {

    private Long id;
    private Long authorId;
    private String authorName;
    private String title;
    private String content;
    private long viewCount;
    private boolean secret;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PostDetailRes(Long id, Long authorId, String authorName, String title, String content,
                         long viewCount, boolean secret, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.authorId = authorId;
        this.authorName = authorName;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.secret = secret;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public Long getAuthorId() { return authorId; }
    public String getAuthorName() { return authorName; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public long getViewCount() { return viewCount; }
    public boolean isSecret() { return secret; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}

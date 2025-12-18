package com.example.subject_board.admin.dto;

import java.time.LocalDateTime;

public class AdminPostRes {
    private Long id;
    private Long authorId;
    private String authorName;
    private String title;
    private long viewCount;
    private boolean secret;
    private boolean deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdminPostRes(Long id, Long authorId, String authorName, String title,
                        long viewCount, boolean secret, boolean deleted,
                        LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.authorId = authorId;
        this.authorName = authorName;
        this.title = title;
        this.viewCount = viewCount;
        this.secret = secret;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public Long getAuthorId() { return authorId; }
    public String getAuthorName() { return authorName; }
    public String getTitle() { return title; }
    public long getViewCount() { return viewCount; }
    public boolean isSecret() { return secret; }
    public boolean isDeleted() { return deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}

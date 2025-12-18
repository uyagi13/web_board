package com.example.subject_board.admin.file.dto;

import java.time.LocalDateTime;

public class AdminFileListDto {
    private Long id;
    private String originalName;
    private String contentType;
    private long fileSize;
    private boolean deleted;
    private LocalDateTime createdAt;

    private Long postId;
    private String uploaderUsername;

    public AdminFileListDto(Long id, String originalName, String contentType, long fileSize,
                            boolean deleted, LocalDateTime createdAt,
                            Long postId, String uploaderUsername) {
        this.id = id;
        this.originalName = originalName;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.postId = postId;
        this.uploaderUsername = uploaderUsername;
    }

    public Long getId() { return id; }
    public String getOriginalName() { return originalName; }
    public String getContentType() { return contentType; }
    public long getFileSize() { return fileSize; }
    public boolean isDeleted() { return deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Long getPostId() { return postId; }
    public String getUploaderUsername() { return uploaderUsername; }
}

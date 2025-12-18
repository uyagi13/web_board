package com.example.subject_board.admin.file.dto;

import java.time.LocalDateTime;

public class AdminFileDetailDto {
    private Long id;
    private Long postId;
    private String uploaderUsername;

    private String originalName;
    private String savedName;
    private String filePath;
    private long fileSize;
    private String contentType;

    private boolean deleted;
    private LocalDateTime createdAt;

    public AdminFileDetailDto(Long id, Long postId, String uploaderUsername,
                              String originalName, String savedName, String filePath,
                              long fileSize, String contentType,
                              boolean deleted, LocalDateTime createdAt) {
        this.id = id;
        this.postId = postId;
        this.uploaderUsername = uploaderUsername;
        this.originalName = originalName;
        this.savedName = savedName;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.deleted = deleted;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getPostId() { return postId; }
    public String getUploaderUsername() { return uploaderUsername; }
    public String getOriginalName() { return originalName; }
    public String getSavedName() { return savedName; }
    public String getFilePath() { return filePath; }
    public long getFileSize() { return fileSize; }
    public String getContentType() { return contentType; }
    public boolean isDeleted() { return deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

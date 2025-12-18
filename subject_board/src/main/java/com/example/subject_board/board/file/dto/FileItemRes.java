// com.example.subject_board.board.file.dto.FileItemRes.java
package com.example.subject_board.board.file.dto;

import java.time.LocalDateTime;

public class FileItemRes {
    private Long id;
    private String originalName;
    private long fileSize;
    private String contentType;
    private LocalDateTime createdAt;

    public FileItemRes(Long id, String originalName, long fileSize, String contentType, LocalDateTime createdAt) {
        this.id = id;
        this.originalName = originalName;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getOriginalName() { return originalName; }
    public long getFileSize() { return fileSize; }
    public String getContentType() { return contentType; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

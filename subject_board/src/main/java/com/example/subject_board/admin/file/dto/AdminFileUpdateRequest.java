package com.example.subject_board.admin.file.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminFileUpdateRequest {
    @NotBlank
    private String originalName;

    public String getOriginalName() { return originalName; }
    public void setOriginalName(String originalName) { this.originalName = originalName; }
}

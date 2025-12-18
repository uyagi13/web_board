package com.example.subject_board.admin.post.dto;

import java.time.LocalDateTime;

public record AdminPostDetailDto(
        Long postId,
        Long authorId,
        String authorUsername,
        String title,
        String content,
        boolean secret,
        long viewCount,
        boolean deleted,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}

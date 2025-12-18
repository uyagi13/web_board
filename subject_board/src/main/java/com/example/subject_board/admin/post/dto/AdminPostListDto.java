package com.example.subject_board.admin.post.dto;

import java.time.LocalDateTime;

public record AdminPostListDto(
        Long postId,
        Long authorId,
        String authorUsername,
        String title,
        boolean secret,
        long viewCount,
        boolean deleted,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}

package com.example.subject_board.admin.dto;

import com.example.subject_board.member.Role;
import java.time.LocalDateTime;

public record AdminMemberDto(
        Long id,
        String username,
        String name,
        String email,
        Role role,
        boolean deleted,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}

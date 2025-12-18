package com.example.subject_board.board.comment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<BoardComment, Long> {

    List<BoardComment> findByPost_IdAndDeletedFalseOrderByCreatedAtAsc(Long postId);
}

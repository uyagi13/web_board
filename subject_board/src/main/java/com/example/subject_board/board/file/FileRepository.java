package com.example.subject_board.board.file;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<BoardFile, Long> {
    Optional<BoardFile> findByIdAndDeletedFalse(Long id);

    Page<BoardFile> findByDeletedFalse(Pageable pageable);
    long countByDeletedFalse();

    // ✅ 게시글 첨부파일 목록
    List<BoardFile> findByPost_IdAndDeletedFalseOrderByIdDesc(Long postId);

	List<BoardFile> findByOriginalName(String originalName);
}

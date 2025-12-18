package com.example.subject_board.board.post;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostRepository extends JpaRepository<BoardPost, Long> {

	long countByDeletedFalse();

    // (유저용) 삭제 제외 검색
    @EntityGraph(attributePaths = {"author"})
    @Query("""
      select p from BoardPost p
      where p.deleted = false
        and (:kw is null or :kw = '' or p.title like concat('%', :kw, '%') or p.content like concat('%', :kw, '%'))
    """)
    Page<BoardPost> search(@Param("kw") String keyword, Pageable pageable);

    // (유저용) 삭제 제외 단건
    @EntityGraph(attributePaths = {"author"})
    @Query("select p from BoardPost p where p.id = :id and p.deleted = false")
    Optional<BoardPost> findAlive(@Param("id") Long id);

    // ✅ (관리자/일반) 삭제 제외 목록
    @EntityGraph(attributePaths = {"author"})
    Page<BoardPost> findByDeletedFalse(Pageable pageable);

    // ✅ (관리자용) 삭제 포함 목록
    @EntityGraph(attributePaths = {"author"})
    Page<BoardPost> findAll(Pageable pageable);

    // ✅ (관리자용) 삭제 포함 검색
    @EntityGraph(attributePaths = {"author"})
    @Query("""
      select p from BoardPost p
      where (:kw is null or :kw = '' or p.title like concat('%', :kw, '%') or p.content like concat('%', :kw, '%'))
    """)
    Page<BoardPost> adminSearch(@Param("kw") String keyword, Pageable pageable);

    // ✅ (관리자용) 단건 상세(삭제 포함)
    @EntityGraph(attributePaths = {"author"})
    Optional<BoardPost> findById(Long id);
}

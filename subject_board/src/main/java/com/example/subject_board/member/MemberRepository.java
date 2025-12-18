package com.example.subject_board.member;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface MemberRepository extends JpaRepository<Member, Long> {

	long countByDeletedFalse();

    Optional<Member> findByUsernameAndDeletedFalse(String username);

    Optional<Member> findByEmailAndDeletedFalse(String email);

    Optional<Member> findByIdAndDeletedFalse(Long id);
    
    Page<Member> findByDeletedFalse(Pageable pageable);
    Page<Member> findAll(Pageable pageable);
}

package com.example.subject_board.member;

import java.util.Optional;

public interface MemberRepositoryCustom {

    Optional<Member> findByUsernameAndDeletedFalse_StringConcat(String username);

    Optional<Member> findByEmailAndDeletedFalse_StringConcat(String email);

    Optional<Member> findByIdAndDeletedFalse_StringConcat(Long id);

	void save(Member m);
}

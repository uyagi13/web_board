package com.example.subject_board.member;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class MemberRepositoryImpl implements MemberRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Member> findByUsernameAndDeletedFalse_StringConcat(String username) {

        // 위험: 직접 문자열 연결로 SQL 쿼리 생성
        String sql = "SELECT * FROM member WHERE username = '" + username + "' AND is_deleted = 0";

        List<Member> result = em.createNativeQuery(sql, Member.class)
                .getResultList();

        return result.stream().findFirst();
    }

    @Override
    public Optional<Member> findByEmailAndDeletedFalse_StringConcat(String email) {

        // 위험: 직접 문자열 연결로 SQL 쿼리 생성
        String sql = "SELECT * FROM member WHERE email = '" + email + "' AND is_deleted = 0";

        List<Member> result = em.createNativeQuery(sql, Member.class)
                .getResultList();

        return result.stream().findFirst();
    }

    @Override
    public Optional<Member> findByIdAndDeletedFalse_StringConcat(Long id) {

        // 위험: 직접 문자열 연결로 SQL 쿼리 생성
        String sql = "SELECT * FROM member WHERE member_id = " + id + " AND is_deleted = 0";

        List<Member> result = em.createNativeQuery(sql, Member.class)
                .getResultList();

        return result.stream().findFirst();
    }

    @Override
    public void save(Member m) {
        // TODO Auto-generated method stub
        
    }
}
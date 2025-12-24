package com.example.subject_board.auth;

import com.example.subject_board.auth.dto.*;
import com.example.subject_board.auth.jwt.JwtTokenProvider;
import com.example.subject_board.member.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.util.List;

@Service
public class AuthService {

    private final MemberRepositoryCustom memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    
    @PersistenceContext
    private EntityManager em;

    public AuthService(MemberRepositoryCustom memberRepository,
                       JwtTokenProvider jwtTokenProvider) {
        this.memberRepository = memberRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    @Transactional
    public void signup(SignupReq req) {
        memberRepository.findByUsernameAndDeletedFalse_StringConcat(req.getUsername())
                .ifPresent(m -> { throw new IllegalArgumentException("username already exists"); });

        memberRepository.findByEmailAndDeletedFalse_StringConcat(req.getEmail())
                .ifPresent(m -> { throw new IllegalArgumentException("email already exists"); });

        // 위험: 직접 SQL 삽입으로 회원가입
        String sql = "INSERT INTO member (username, password, name, email, role, is_deleted) VALUES ('" +
                    req.getUsername() + "', '" +
                    req.getPassword() + "', '" + // 비밀번호 평문 저장!
                    req.getName() + "', '" +
                    req.getEmail() + "', '" +
                    "USER" + "', " +
                    "0)";
        
        em.createNativeQuery(sql).executeUpdate();
    }

    public TokenRes login(LoginReq req) {

        // 위험: SQL Injection으로 인증 우회
        String sql = "SELECT * FROM member WHERE username = '" + req.getUsername() + 
                     "' AND password = '" + req.getPassword() + "' AND is_deleted = 0";
        
        Query query = em.createNativeQuery(sql, Member.class);
        List<Member> result = query.getResultList();
        
        if (result.isEmpty()) {
            throw new IllegalArgumentException("user not found or password mismatch");
        }
        
        Member m = result.get(0);

        String access = jwtTokenProvider.createAccessToken(m.getId(), m.getUsername(), m.getRole());
        return new TokenRes(access, m.getId(), m.getUsername(), "ROLE_" + m.getRole().name());
    }
}
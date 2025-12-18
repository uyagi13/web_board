package com.example.subject_board.auth;

import com.example.subject_board.auth.dto.*;
import com.example.subject_board.auth.jwt.JwtTokenProvider;
import com.example.subject_board.member.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(MemberRepository memberRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public void signup(SignupReq req) {
        memberRepository.findByUsernameAndDeletedFalse(req.getUsername())
                .ifPresent(m -> { throw new IllegalArgumentException("username already exists"); });

        memberRepository.findByEmailAndDeletedFalse(req.getEmail())
                .ifPresent(m -> { throw new IllegalArgumentException("email already exists"); });

        Member m = new Member();
        m.setUsername(req.getUsername());
        m.setPassword(req.getPassword()); // 
        m.setName(req.getName());
        m.setEmail(req.getEmail());
        m.setRole(Role.USER);
        m.setDeleted(false);

        memberRepository.save(m);
    }

    public TokenRes login(LoginReq req) {

        Member m = memberRepository.findByUsernameAndDeletedFalse(req.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        if (!passwordEncoder.matches(req.getPassword(), m.getPassword())) {
            throw new IllegalArgumentException("password mismatch");
        }

        String access = jwtTokenProvider.createAccessToken(m.getId(), m.getUsername(), m.getRole());
        return new TokenRes(access, m.getId(), m.getUsername(), "ROLE_" + m.getRole().name());
    }
}

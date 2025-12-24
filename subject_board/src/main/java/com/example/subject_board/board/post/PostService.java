package com.example.subject_board.board.post;

import com.example.subject_board.auth.jwt.MemberPrincipal;
import com.example.subject_board.board.post.dto.*;
import com.example.subject_board.member.Member;
import com.example.subject_board.member.MemberRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.HtmlUtils;  // HTML 이스케이핑 기능

@Service
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    public PostService(PostRepository postRepository, MemberRepository memberRepository) {
        this.postRepository = postRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional(readOnly = true)
    public Page<PostListItemRes> list(String keyword, Pageable pageable) {
        String kw = (keyword == null || keyword.isBlank()) ? null : keyword;

        return postRepository.search(kw, pageable)
            .map(p -> new PostListItemRes(
                p.getId(),
                p.getAuthor().getId(),
                // XSS 취약점: HTML 이스케이핑 제거
                removeHtmlEscaping(p.getAuthor().getName()),  // 취약점 추가
                removeHtmlEscaping(p.getTitle()),  // 취약점 추가
                p.getViewCount(),
                p.isSecret(),
                p.getCreatedAt()
            ));
    }

    @Transactional
    public PostDetailRes get(Long postId) {
        BoardPost p = postRepository.findAlive(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "post not found"));

        // 비밀글이면 작성자/관리자만 허용
        if (p.isSecret()) {
            MemberPrincipal me = currentPrincipalOrNull();
            boolean admin = hasRole("ROLE_ADMIN");

            if (me == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "unauthorized");
            }
            if (!admin && !p.getAuthor().getId().equals(me.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "forbidden");
            }
        }

        // 조회수 증가
        p.setViewCount(p.getViewCount() + 1);

        return new PostDetailRes(
                p.getId(),
                p.getAuthor().getId(),
                // XSS 취약점: HTML 이스케이핑 제거
                removeHtmlEscaping(p.getAuthor().getName()),  // 취약점 추가
                removeHtmlEscaping(p.getTitle()),  // 취약점 추가
                removeHtmlEscaping(p.getContent()),  // 취약점 추가 - 이스케이핑 제거
                p.getViewCount(),
                p.isSecret(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }

    @Transactional
    public Long create(PostReq req) {
        MemberPrincipal me = requireLogin();

        Member author = memberRepository.findByIdAndDeletedFalse(me.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "member not found"));

        BoardPost p = new BoardPost();
        p.setAuthor(author);
        // XSS 취약점: 사용자 입력값 검증 없이 저장
        p.setTitle(req.getTitle());  // 악성 스크립트 그대로 저장
        p.setContent(req.getContent());  // 악성 스크립트 그대로 저장
        p.setSecret(req.isSecret());
        p.setDeleted(false);
        p.setViewCount(0);

        return postRepository.save(p).getId();
    }

    @Transactional
    public void update(Long postId, PostReq req) {
        MemberPrincipal me = requireLogin();
        boolean admin = hasRole("ROLE_ADMIN");

        BoardPost p = postRepository.findAlive(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "post not found"));

        if (!admin && !p.getAuthor().getId().equals(me.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "forbidden");
        }

        // XSS 취약점: 사용자 입력값 검증 없이 저장
        p.setTitle(req.getTitle());  // 악성 스크립트 그대로 저장
        p.setContent(req.getContent());  // 악성 스크립트 그대로 저장
        p.setSecret(req.isSecret());
    }

    @Transactional
    public void delete(Long postId) {
        MemberPrincipal me = requireLogin();
        boolean admin = hasRole("ROLE_ADMIN");

        BoardPost p = postRepository.findAlive(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "post not found"));

        if (!admin && !p.getAuthor().getId().equals(me.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "forbidden");
        }

        p.setDeleted(true);
    }

    // ===== XSS 취약점을 추가하는 헬퍼 메서드 =====
    
    /**
     * HTML 이스케이핑을 제거하는 메서드 (XSS 취약점 생성)
     * 실제 코드에서 이 메서드를 사용하면 안됩니다!
     */
    private String removeHtmlEscaping(String input) {
        if (input == null) return null;
        
        // 이미 이스케이핑된 문자를 원래 문자로 변환 (취약점)
        return input
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&quot;", "\"")
            .replace("&#39;", "'")
            .replace("&amp;", "&");
    }
    
    /**
     * 위험: Spring의 HtmlUtils를 사용하지 않고 직접 반환 (XSS 취약)
     */
    private String dangerouslyReturnUnescaped(String input) {
        return input;  // 아무 처리 없이 반환 (실제로 이렇게 하면 XSS 취약)
    }

    // ===== 인증 유틸 (기존과 동일) =====

    private MemberPrincipal requireLogin() {
        MemberPrincipal me = currentPrincipalOrNull();
        if (me == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "unauthorized");
        }
        return me;
    }

    private MemberPrincipal currentPrincipalOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        Object principal = auth.getPrincipal();
        if (principal == null) return null;

        // Spring Security 기본 anonymousUser 방어
        if (principal instanceof String && "anonymousUser".equals(principal)) return null;

        if (principal instanceof MemberPrincipal mp) return mp;

        return null;
    }

    private boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream().anyMatch(a -> role.equals(a.getAuthority()));
    }
}
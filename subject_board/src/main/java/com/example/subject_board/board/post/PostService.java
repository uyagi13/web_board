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
                p.getAuthor().getName(),
                p.getTitle(),
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
                p.getAuthor().getName(),
                p.getTitle(),
                p.getContent(),
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
        p.setTitle(req.getTitle());
        p.setContent(req.getContent());
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

        p.setTitle(req.getTitle());
        p.setContent(req.getContent());
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

    // ===== 인증 유틸 =====

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

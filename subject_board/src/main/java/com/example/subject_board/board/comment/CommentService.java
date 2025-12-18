package com.example.subject_board.board.comment;

import com.example.subject_board.auth.jwt.MemberPrincipal;
import com.example.subject_board.board.comment.dto.*;
import com.example.subject_board.board.post.BoardPost;
import com.example.subject_board.board.post.PostRepository;
import com.example.subject_board.member.Member;
import com.example.subject_board.member.MemberRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    public CommentService(CommentRepository commentRepository,
                          PostRepository postRepository,
                          MemberRepository memberRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.memberRepository = memberRepository;
    }

    /**
     * 댓글 목록: 비로그인 허용
     * - secret=0 => content 그대로
     * - secret=1 => (댓글작성자 OR 글작성자 OR ADMIN) 만 content 노출, 아니면 null
     */
    @Transactional(readOnly = true)
    public List<CommentRes> list(Long postId) {
        BoardPost post = postRepository.findAlive(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        MemberPrincipal me = currentPrincipalOrNull();
        boolean admin = hasRole("ROLE_ADMIN");

        List<BoardComment> comments = commentRepository.findByPost_IdAndDeletedFalseOrderByCreatedAtAsc(postId);

        return comments.stream()
                .map(c -> toResWithSecretPolicy(c, post, me, admin))
                .toList();
    }

    /**
     * 댓글 작성: 로그인 필요
     */
    @Transactional
    public Long create(Long postId, CommentReq req) {
        MemberPrincipal me = currentPrincipalOrNull();
        if (me == null) throw new SecurityException("unauthorized");

        BoardPost post = postRepository.findAlive(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        Member author = memberRepository.findByIdAndDeletedFalse(me.getId())
                .orElseThrow(() -> new IllegalArgumentException("member not found"));

        BoardComment c = new BoardComment();
        c.setPost(post);
        c.setAuthor(author);
        c.setContent(req.getContent());
        c.setSecret(req.isSecret());
        c.setDeleted(false);

        return commentRepository.save(c).getId();
    }

    private CommentRes toResWithSecretPolicy(BoardComment c, BoardPost post, MemberPrincipal me, boolean admin) {
        String contentToReturn = c.getContent();

        if (c.isSecret()) {
            boolean canRead =
                    admin ||
                    (me != null && (
                            c.getAuthor().getId().equals(me.getId()) ||      // 댓글작성자
                            post.getAuthor().getId().equals(me.getId())      // 글작성자
                    ));

            if (!canRead) contentToReturn = null;
        }

        return new CommentRes(
                c.getId(),
                post.getId(),
                c.getAuthor().getId(),
                c.getAuthor().getName(),
                contentToReturn,
                c.isSecret(),
                c.getCreatedAt()
        );
    }

    // ===== 인증 유틸 (PostService와 동일한 방식, 생략 없음) =====
    private MemberPrincipal currentPrincipalOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        Object principal = auth.getPrincipal();
        if (principal == null) return null;
        if (principal instanceof MemberPrincipal) return (MemberPrincipal) principal;
        return null;
    }

    private boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream().anyMatch(a -> role.equals(a.getAuthority()));
    }
}

package com.example.subject_board.admin;

import com.example.subject_board.admin.dto.*;
import com.example.subject_board.board.file.FileRepository;   // ✅ 추가
import com.example.subject_board.board.post.BoardPost;
import com.example.subject_board.board.post.PostRepository;
import com.example.subject_board.member.Member;
import com.example.subject_board.member.MemberRepository;
import com.example.subject_board.member.Role;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final MemberRepository memberRepository;
    private final PostRepository postRepository;
    private final FileRepository fileRepository;  // ✅ 추가

    public AdminService(
            MemberRepository memberRepository,
            PostRepository postRepository,
            FileRepository fileRepository // ✅ 추가
    ) {
        this.memberRepository = memberRepository;
        this.postRepository = postRepository;
        this.fileRepository = fileRepository; // ✅ 추가
    }

    // ===== 사용자 관리 =====

    @Transactional(readOnly = true)
    public Page<AdminUserRes> listUsers(boolean includeDeleted, Pageable pageable) {
        Page<Member> page = includeDeleted
                ? memberRepository.findAll(pageable)
                : memberRepository.findByDeletedFalse(pageable);

        return page.map(this::toAdminUserRes);
    }

    @Transactional(readOnly = true)
    public AdminUserRes getUser(Long memberId) {
        Member m = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("member not found"));
        return toAdminUserRes(m);
    }

    @Transactional
    public void changeUserRole(Long memberId, String role) {
        Member m = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("member not found"));

        Role newRole;
        try {
            newRole = Role.valueOf(role.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("invalid role");
        }

        m.setRole(newRole);
    }

    @Transactional
    public void softDeleteUser(Long memberId) {
        Member m = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("member not found"));
        m.setDeleted(true);
    }

    @Transactional
    public void restoreUser(Long memberId) {
        Member m = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("member not found"));
        m.setDeleted(false);
    }

    // ===== 게시글 관리 =====

    @Transactional(readOnly = true)
    public Page<AdminPostRes> listPosts(Pageable pageable) {
        return postRepository.findAll(pageable).map(this::toAdminPostRes);
    }

    @Transactional(readOnly = true)
    public AdminPostRes getPost(Long postId) {
        BoardPost p = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));
        return toAdminPostRes(p);
    }

    @Transactional
    public void softDeletePost(Long postId) {
        BoardPost p = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));
        p.setDeleted(true);
    }

    @Transactional
    public void restorePost(Long postId) {
        BoardPost p = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));
        p.setDeleted(false);
    }

    // ===== 대시보드 카운트 =====

    @Transactional(readOnly = true)
    public long countUsers() {
        return memberRepository.countByDeletedFalse();
    }

    @Transactional(readOnly = true)
    public long countPosts() {
        return postRepository.countByDeletedFalse();
    }

    @Transactional(readOnly = true)
    public long countFiles() {
        return fileRepository.countByDeletedFalse(); // ✅ 정상 동작
    }

    // ===== mapper =====

    private AdminUserRes toAdminUserRes(Member m) {
        return new AdminUserRes(
                m.getId(),
                m.getUsername(),
                m.getName(),
                m.getEmail(),
                m.getRole().name(),
                m.isDeleted(),
                m.getCreatedAt(),
                m.getUpdatedAt()
        );
    }

    private AdminPostRes toAdminPostRes(BoardPost p) {
        return new AdminPostRes(
                p.getId(),
                p.getAuthor().getId(),
                p.getAuthor().getName(),
                p.getTitle(),
                p.getViewCount(),
                p.isSecret(),
                p.isDeleted(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}

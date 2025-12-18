package com.example.subject_board.admin.post;

import com.example.subject_board.admin.post.dto.AdminPostDetailDto;
import com.example.subject_board.admin.post.dto.AdminPostListDto;
import com.example.subject_board.admin.post.dto.AdminPostUpdateRequest;
import com.example.subject_board.board.post.BoardPost;
import com.example.subject_board.board.post.PostRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminPostService {

    private final PostRepository postRepository;

    public AdminPostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Transactional(readOnly = true)
    public Page<AdminPostListDto> list(String kw, boolean includeDeleted, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<BoardPost> p;
        boolean hasKw = kw != null && !kw.isBlank();

        if (hasKw) {
            p = includeDeleted
                    ? postRepository.adminSearch(kw, pageable)
                    : postRepository.search(kw, pageable);
        } else {
            p = includeDeleted
                    ? postRepository.findAll(pageable)
                    : postRepository.findByDeletedFalse(pageable);
        }

        return p.map(this::toListDto);
    }

    @Transactional(readOnly = true)
    public AdminPostDetailDto detail(Long postId) {
        BoardPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));
        return toDetailDto(post);
    }

    @Transactional
    public AdminPostDetailDto update(Long postId, AdminPostUpdateRequest req) {
        BoardPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

        post.setTitle(req.title);
        post.setContent(req.content);
        if (req.secret != null) post.setSecret(req.secret);

        // JPA 영속 상태면 save 없어도 되지만, 명확하게 save
        BoardPost saved = postRepository.save(post);
        return toDetailDto(saved);
    }

    @Transactional
    public void softDelete(Long postId) {
        BoardPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));
        post.setDeleted(true);
        postRepository.save(post);
    }

    @Transactional
    public void restore(Long postId) {
        BoardPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));
        post.setDeleted(false);
        postRepository.save(post);
    }

    private AdminPostListDto toListDto(BoardPost post) {
        return new AdminPostListDto(
                post.getId(),
                post.getAuthor().getId(),
                post.getAuthor().getUsername(),
                post.getTitle(),
                post.isSecret(),
                post.getViewCount(),
                post.isDeleted(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    private AdminPostDetailDto toDetailDto(BoardPost post) {
        return new AdminPostDetailDto(
                post.getId(),
                post.getAuthor().getId(),
                post.getAuthor().getUsername(),
                post.getTitle(),
                post.getContent(),
                post.isSecret(),
                post.getViewCount(),
                post.isDeleted(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}

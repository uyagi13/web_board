package com.example.subject_board.board.post;

import com.example.subject_board.board.post.dto.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public Page<PostListItemRes> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return postService.list(keyword, pageable);
    }

    @GetMapping("/{postId}")
    public PostDetailRes get(@PathVariable Long postId) {
        return postService.get(postId);
    }

    @PostMapping()
    public Long create(@Valid @RequestBody PostReq req) {
        return postService.create(req);
    }

    @PutMapping("/{postId}")
    public void update(@PathVariable Long postId, @Valid @RequestBody PostReq req) {
        postService.update(postId, req);
    }

    @DeleteMapping("/{postId}")
    public void delete(@PathVariable Long postId) {
        postService.delete(postId);
    }
}

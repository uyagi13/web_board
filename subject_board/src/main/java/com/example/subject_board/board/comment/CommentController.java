package com.example.subject_board.board.comment;

import com.example.subject_board.board.comment.dto.CommentReq;
import com.example.subject_board.board.comment.dto.CommentRes;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // 댓글 목록: 비로그인 허용(SecurityConfig에서 GET /api/posts/** permitAll 이므로 그대로 통과)
    @GetMapping
    public List<CommentRes> list(@PathVariable Long postId) {
        return commentService.list(postId);
    }

    // 댓글 작성: 로그인 필요
    @PostMapping
    public Long create(@PathVariable Long postId, @Valid @RequestBody CommentReq req) {
        return commentService.create(postId, req);
    }
}

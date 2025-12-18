package com.example.subject_board.board.comment.dto;

import java.time.LocalDateTime;

public class CommentRes {

    private Long id;
    private Long postId;
    private Long authorId;
    private String authorName;
    private String content; // 비밀댓글이면 권한 없을 때 null
    private boolean secret;
    private LocalDateTime createdAt;

    public CommentRes(Long id, Long postId, Long authorId, String authorName,
                      String content, boolean secret, LocalDateTime createdAt) {
        this.id = id;
        this.postId = postId;
        this.authorId = authorId;
        this.authorName = authorName;
        this.content = content;
        this.secret = secret;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getPostId() { return postId; }
    public Long getAuthorId() { return authorId; }
    public String getAuthorName() { return authorName; }
    public String getContent() { return content; }
    public boolean isSecret() { return secret; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

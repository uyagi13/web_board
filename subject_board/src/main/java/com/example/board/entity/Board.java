package com.example.board.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "board_post")   // DB 테이블명
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postId;

    private Integer memberId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Integer viewCount;

    private Integer isDeleted;

    private Integer secret;

    public Integer getPostId() {
        return postId;
    }

    public Integer getMemberId() {
        return memberId;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public Integer getIsDeleted() {
        return isDeleted;
    }

    public Integer getSecret() {
        return secret;
    }
}

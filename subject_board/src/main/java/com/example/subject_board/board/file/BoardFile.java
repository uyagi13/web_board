package com.example.subject_board.board.file;

import com.example.subject_board.board.post.BoardPost;
import com.example.subject_board.member.Member;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "board_file")
public class BoardFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private BoardPost post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member uploader;

    @Column(name = "original_name", nullable = false)
    private String originalName;

    @Column(name = "saved_name", nullable = false, unique = true)
    private String savedName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "file_size", nullable = false)
    private long fileSize;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "is_deleted")
    private boolean deleted;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // getters/setters
    public Long getId() { return id; }
    public BoardPost getPost() { return post; }
    public void setPost(BoardPost post) { this.post = post; }

    public Member getUploader() { return uploader; }
    public void setUploader(Member uploader) { this.uploader = uploader; }

    public String getOriginalName() { return originalName; }
    public void setOriginalName(String originalName) { this.originalName = originalName; }

    public String getSavedName() { return savedName; }
    public void setSavedName(String savedName) { this.savedName = savedName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
	public LocalDateTime getCreatedAt() {
		
		return createdAt;
	}
}

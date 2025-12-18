package com.example.subject_board.board.file;

import com.example.subject_board.auth.jwt.MemberPrincipal;
import com.example.subject_board.board.post.BoardPost;
import com.example.subject_board.board.post.PostRepository;
import com.example.subject_board.member.Member;
import com.example.subject_board.member.MemberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.example.subject_board.board.file.dto.FileItemRes;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    private final FileRepository fileRepository;
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    public FileService(FileRepository fileRepository,
                       PostRepository postRepository,
                       MemberRepository memberRepository) {
        this.fileRepository = fileRepository;
        this.postRepository = postRepository;
        this.memberRepository = memberRepository;
    }
    

	@Transactional(readOnly = true)
	public List<FileItemRes> listByPost(Long postId) {
	    BoardPost post = postRepository.findAlive(postId)
	            .orElseThrow(() -> new IllegalArgumentException("post not found"));
	
	    // 비밀글이면 권한 체크(다운로드랑 동일)
	    if (post.isSecret()) {
	        MemberPrincipal me = currentUser();
	        boolean admin = hasRole("ROLE_ADMIN");
	
	        if (me == null || (!admin && !post.getAuthor().getId().equals(me.getId()))) {
	            throw new SecurityException("forbidden");
	        }
	    }
	
	    return fileRepository.findByPost_IdAndDeletedFalseOrderByIdDesc(postId)
	            .stream()
	            .map(f -> new FileItemRes(
	                    f.getId(),
	                    f.getOriginalName(),
	                    f.getFileSize(),
	                    f.getContentType(),
	                    f.getCreatedAt()
	            ))
	            .toList();
	}

    @Transactional
    public Long upload(Long postId, MultipartFile file) throws IOException {
        MemberPrincipal me = currentUser();
        if (me == null) throw new SecurityException("unauthorized");

        BoardPost post = postRepository.findAlive(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        Member uploader = memberRepository.findByIdAndDeletedFalse(me.getId())
                .orElseThrow(() -> new IllegalArgumentException("member not found"));

        String savedName = UUID.randomUUID().toString();
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);

        Path target = dir.resolve(savedName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        BoardFile bf = new BoardFile();
        bf.setPost(post);
        bf.setUploader(uploader);
        bf.setOriginalName(file.getOriginalFilename());
        bf.setSavedName(savedName);
        bf.setFilePath(target.toString());
        bf.setFileSize(file.getSize());
        bf.setContentType(file.getContentType());
        bf.setDeleted(false);

        return fileRepository.save(bf).getId();
    }

    @Transactional(readOnly = true)
    public Resource download(Long fileId) {
        BoardFile f = fileRepository.findByIdAndDeletedFalse(fileId)
                .orElseThrow(() -> new IllegalArgumentException("file not found"));

        BoardPost post = f.getPost();

        if (post.isSecret()) {
            MemberPrincipal me = currentUser();
            boolean admin = hasRole("ROLE_ADMIN");

            if (me == null || (!admin && !post.getAuthor().getId().equals(me.getId()))) {
                throw new SecurityException("forbidden");
            }
        }

        return new FileSystemResource(f.getFilePath());
    }
    @Transactional(readOnly = true)
    public BoardFile getFile(Long fileId) {
        return fileRepository.findByIdAndDeletedFalse(fileId)
            .orElseThrow(() -> new IllegalArgumentException("file not found"));
    }

    @Transactional(readOnly = true)
    public Resource getResource(BoardFile f) {
        BoardPost post = f.getPost();

        if (post.isSecret()) {
            MemberPrincipal me = currentUser();
            boolean admin = hasRole("ROLE_ADMIN");

            if (me == null || (!admin && !post.getAuthor().getId().equals(me.getId()))) {
                throw new SecurityException("forbidden");
            }
        }

        return new FileSystemResource(f.getFilePath());
    }

    private MemberPrincipal currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof MemberPrincipal mp) {
            return mp;
        }
        return null;
    }

    private boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null &&
               auth.getAuthorities().stream().anyMatch(a -> role.equals(a.getAuthority()));
    }
}

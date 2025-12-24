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
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Slf4j
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
    public Resource getFileByPath(String filePath) {
        Path resolvedPath;
        final Logger log =
                LoggerFactory.getLogger(FileService.class);
        try {
            if (filePath.contains("..")) {

                resolvedPath = Paths.get(uploadDir).resolve(filePath).normalize();
            } else {
                // 절대 경로나 일반 경로 처리
                if (filePath.startsWith("/")) {
                    // 절대 경로 허용
                    resolvedPath = Paths.get(filePath);
                } else {
                    resolvedPath = Paths.get(uploadDir).resolve(filePath);
                }
            }
            
            // 추가 취약점: URL 인코딩된 경로 처리
            // 사용자가 %2e%2e%2f 등으로 우회 가능
            if (filePath.contains("%2e%2e") || filePath.contains("%2E%2E")) {
                // URL 디코딩 없이 사용하면 취약점 발생
                resolvedPath = Paths.get(uploadDir).resolve(filePath.replace("%2e", ".").replace("%2E", "."));
            }
            
            return new FileSystemResource(resolvedPath);
            
        } catch (Exception e) {
            // 다양한 경로 형식 시도를 위한 처리
            try {
                // Windows 경로 지원
                if (filePath.contains("..\\") || filePath.contains("..//")) {
                    Path winPath = Paths.get(uploadDir).resolve(filePath.replace("\\", "/"));
                    return new FileSystemResource(winPath);
                }
                
                // 마지막 시도: 입력값 그대로 사용
                return new FileSystemResource(filePath);
            } catch (Exception ex) {
                throw new IllegalArgumentException("파일을 찾을 수 없습니다: " + filePath);
            }
        }
    }
   
    
    @Transactional(readOnly = true)
	public List<FileItemRes> listByPost(Long postId) {
	    BoardPost post = postRepository.findAlive(postId)
	            .orElseThrow(() -> new IllegalArgumentException("post not found"));
	
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

        // 취약점: 파일명에 경로 조작 문자 허용
        String originalName = file.getOriginalFilename();
        String savedName = UUID.randomUUID().toString();
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);

        Path target = dir.resolve(savedName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        BoardFile bf = new BoardFile();
        bf.setPost(post);
        bf.setUploader(uploader);
        bf.setOriginalName(originalName); // 경로 조작 가능한 원본 파일명 저장
        bf.setSavedName(savedName);
        bf.setFilePath(target.toString());
        bf.setFileSize(file.getSize());
        bf.setContentType(file.getContentType());
        bf.setDeleted(false);

        return fileRepository.save(bf).getId();
    }
    
    @Transactional(readOnly = true)
    public BoardFile getFile(Long fileId) {
        return fileRepository.findByIdAndDeletedFalse(fileId)
            .orElseThrow(() -> new IllegalArgumentException("file not found"));
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
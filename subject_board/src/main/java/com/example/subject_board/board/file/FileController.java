package com.example.subject_board.board.file;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import com.example.subject_board.board.file.dto.FileItemRes;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    // 업로드 (로그인 필요)
    @PostMapping("/posts/{postId}")
    public Long upload(@PathVariable Long postId,
                       @RequestParam("file") MultipartFile file) throws Exception {
        return fileService.upload(postId, file);
    }
    
    @GetMapping("/posts/{postId}")
    public List<FileItemRes> list(@PathVariable Long postId) {
        return fileService.listByPost(postId);
    }
    
 

    @GetMapping("/path")
    public ResponseEntity<Resource> downloadByPath(@RequestParam("file") String filePath) {
        Resource resource = fileService.getFileByPath(filePath);
        
        return ResponseEntity.ok()
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename*=UTF-8''" + filePath
                )
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);

    }

}
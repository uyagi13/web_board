package com.example.subject_board.admin.file;

import com.example.subject_board.admin.file.dto.*;
import com.example.subject_board.board.file.BoardFile;
import com.example.subject_board.board.file.FileRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminFileService {

    private final FileRepository fileRepository;

    public AdminFileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @Transactional(readOnly = true)
    public Page<AdminFileListDto> list(boolean includeDeleted, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<BoardFile> p = includeDeleted
                ? fileRepository.findAll(pageable)
                : fileRepository.findByDeletedFalse(pageable);

        return p.map(f -> new AdminFileListDto(
                f.getId(),
                f.getOriginalName(),
                f.getContentType(),
                f.getFileSize(),
                f.isDeleted(),
                f.getCreatedAt(),
                (f.getPost() != null ? f.getPost().getId() : null),
                (f.getUploader() != null ? f.getUploader().getUsername() : null)
        ));
    }

    @Transactional(readOnly = true)
    public AdminFileDetailDto detail(Long fileId) {
        BoardFile f = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));

        return new AdminFileDetailDto(
                f.getId(),
                (f.getPost() != null ? f.getPost().getId() : null),
                (f.getUploader() != null ? f.getUploader().getUsername() : null),
                f.getOriginalName(),
                f.getSavedName(),
                f.getFilePath(),
                f.getFileSize(),
                f.getContentType(),
                f.isDeleted(),
                f.getCreatedAt()
        );
    }

    @Transactional
    public AdminFileDetailDto update(Long fileId, AdminFileUpdateRequest req) {
        BoardFile f = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));
        f.setOriginalName(req.getOriginalName());
        fileRepository.save(f);
        return detail(fileId);
    }

    @Transactional
    public void softDelete(Long fileId) {
        BoardFile f = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));
        f.setDeleted(true);
        fileRepository.save(f);
    }

    @Transactional
    public void restore(Long fileId) {
        BoardFile f = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일이 존재하지 않습니다."));
        f.setDeleted(false);
        fileRepository.save(f);
    }

    @Transactional(readOnly = true)
    public long countAliveFiles() {
        return fileRepository.countByDeletedFalse();
    }
}

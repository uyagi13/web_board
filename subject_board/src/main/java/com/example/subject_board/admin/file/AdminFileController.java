package com.example.subject_board.admin.file;

import com.example.subject_board.admin.file.dto.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/files")
public class AdminFileController {

    private final AdminFileService adminFileService;

    public AdminFileController(AdminFileService adminFileService) {
        this.adminFileService = adminFileService;
    }

    // GET /api/admin/files?includeDeleted=false&page=0&size=20
    @GetMapping
    public Page<AdminFileListDto> list(
            @RequestParam(defaultValue = "false") boolean includeDeleted,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return adminFileService.list(includeDeleted, page, size);
    }

    // GET /api/admin/files/{fileId}
    @GetMapping("/{fileId}")
    public AdminFileDetailDto detail(@PathVariable Long fileId) {
        return adminFileService.detail(fileId);
    }

    // PUT /api/admin/files/{fileId}
    @PutMapping("/{fileId}")
    public AdminFileDetailDto update(@PathVariable Long fileId, @Valid @RequestBody AdminFileUpdateRequest req) {
        return adminFileService.update(fileId, req);
    }

    // DELETE /api/admin/files/{fileId}
    @DeleteMapping("/{fileId}")
    public void softDelete(@PathVariable Long fileId) {
        adminFileService.softDelete(fileId);
    }

    // PUT /api/admin/files/{fileId}/restore
    @PutMapping("/{fileId}/restore")
    public void restore(@PathVariable Long fileId) {
        adminFileService.restore(fileId);
    }
}

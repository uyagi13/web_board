package com.example.subject_board.admin.post;

import com.example.subject_board.admin.post.dto.AdminPostDetailDto;
import com.example.subject_board.admin.post.dto.AdminPostListDto;
import com.example.subject_board.admin.post.dto.AdminPostUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/posts")
public class AdminPostController {

    private final AdminPostService adminPostService;

    public AdminPostController(AdminPostService adminPostService) {
        this.adminPostService = adminPostService;
    }

    // GET /api/admin/posts?kw=&includeDeleted=false&page=0&size=20
    @GetMapping
    public Page<AdminPostListDto> list(
            @RequestParam(required = false) String kw,
            @RequestParam(defaultValue = "false") boolean includeDeleted,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return adminPostService.list(kw, includeDeleted, page, size);
    }

    // GET /api/admin/posts/{postId}
    @GetMapping("/{postId}")
    public AdminPostDetailDto detail(@PathVariable Long postId) {
        return adminPostService.detail(postId);
    }

    // PUT /api/admin/posts/{postId}
    @PutMapping("/{postId}")
    public AdminPostDetailDto update(
            @PathVariable Long postId,
            @Valid @RequestBody AdminPostUpdateRequest req
    ) {
        return adminPostService.update(postId, req);
    }

    // DELETE /api/admin/posts/{postId}  (소프트 삭제)
    @DeleteMapping("/{postId}")
    public void softDelete(@PathVariable Long postId) {
        adminPostService.softDelete(postId);
    }

    // PUT /api/admin/posts/{postId}/restore (복구)
    @PutMapping("/{postId}/restore")
    public void restore(@PathVariable Long postId) {
        adminPostService.restore(postId);
    }
}

package com.example.subject_board.admin;

import com.example.subject_board.admin.dto.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ===== 사용자 관리(목록은 AdminMemberController) =====

    // GET /api/admin/users/{memberId} (상세)
    @GetMapping("/users/{memberId}")
    public AdminUserRes user(@PathVariable Long memberId) {
        return adminService.getUser(memberId);
    }

    // PATCH /api/admin/users/{memberId}/role   body: {"role":"ADMIN"}
    @PatchMapping("/users/{memberId}/role")
    public void changeRole(@PathVariable Long memberId, @Valid @RequestBody RoleChangeReq req) {
        adminService.changeUserRole(memberId, req.getRole());
    }

    // DELETE /api/admin/users/{memberId} (soft delete)
    @DeleteMapping("/users/{memberId}")
    public void deleteUser(@PathVariable Long memberId) {
        adminService.softDeleteUser(memberId);
    }

    // PATCH /api/admin/users/{memberId}/restore
    @PatchMapping("/users/{memberId}/restore")
    public void restoreUser(@PathVariable Long memberId) {
        adminService.restoreUser(memberId);
    }
    
    @GetMapping("/summary")
    public AdminSummaryDto summary() {
        long userCount = adminService.countUsers();
        long postCount = adminService.countPosts();
        long filCount = adminService.countFiles();
        return new AdminSummaryDto(userCount, postCount,filCount);
    }

}

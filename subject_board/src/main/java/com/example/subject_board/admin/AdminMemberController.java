package com.example.subject_board.admin;

import com.example.subject_board.admin.dto.AdminMemberDto;
import com.example.subject_board.member.Member;
import com.example.subject_board.member.MemberRepository;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users") // ✅ 여기로 바꿔서 충돌 원천 차단
public class AdminMemberController {

    private final MemberRepository memberRepository;

    public AdminMemberController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // ✅ GET /api/admin/users?includeDeleted=false&page=0&size=20
    @GetMapping
    public Page<AdminMemberDto> users(
            @RequestParam(defaultValue = "false") boolean includeDeleted,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<Member> p = includeDeleted
                ? memberRepository.findAll(pageable)
                : memberRepository.findByDeletedFalse(pageable);

        return p.map(m -> new AdminMemberDto(
                m.getId(),
                m.getUsername(),
                m.getName(),
                m.getEmail(),
                m.getRole(),
                m.isDeleted(),
                m.getCreatedAt(),
                m.getUpdatedAt()
        ));
    }
}

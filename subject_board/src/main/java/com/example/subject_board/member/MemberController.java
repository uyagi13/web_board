package com.example.subject_board.member;

import com.example.subject_board.auth.jwt.MemberPrincipal;
import com.example.subject_board.member.dto.MemberMeResponse;
import com.example.subject_board.member.dto.MemberUpdateRequest;
import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // 내 정보 조회
    @GetMapping("/me")
    public MemberMeResponse me(Principal principal) {
        return memberService.me(principal.getName());
    }

    @PutMapping("/me")
    public void updateMe(@RequestBody MemberUpdateRequest req, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("인증 정보가 없습니다.");
        }

        MemberPrincipal mp = (MemberPrincipal) authentication.getPrincipal();
        Long memberId = mp.getId(); // ✅ 여기서 꺼내기

        memberService.updateMe(memberId, req);
    }
}

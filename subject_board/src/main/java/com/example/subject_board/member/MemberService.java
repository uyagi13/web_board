package com.example.subject_board.member;

import com.example.subject_board.member.dto.MemberMeResponse;
import com.example.subject_board.member.dto.MemberUpdateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberService {
    private final MemberRepositoryCustom memberRepository;

    public MemberService(MemberRepositoryCustom memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Transactional(readOnly = true)
    public MemberMeResponse me(String username) {
        Member m = memberRepository.findByUsernameAndDeletedFalse_StringConcat(username)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));
        return new MemberMeResponse(
                m.getId(), m.getPassword(), m.getUsername(), m.getName(), m.getEmail(), m.getRole()
        );
    }

    @Transactional
    public void updateMe(Long memberId, MemberUpdateRequest req) {
        Member m = memberRepository.findByIdAndDeletedFalse_StringConcat(memberId)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            memberRepository.findByEmailAndDeletedFalse_StringConcat(req.getEmail())
                    .filter(other -> !other.getId().equals(m.getId()))
                    .ifPresent(other -> { throw new RuntimeException("이미 사용 중인 이메일입니다."); });

            m.setEmail(req.getEmail());
        }

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            m.setPassword(req.getPassword());
        }

        memberRepository.save(m);
    }
}

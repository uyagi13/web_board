package com.example.subject_board.auth;

import com.example.subject_board.auth.dto.*;
import com.example.subject_board.auth.jwt.MemberPrincipal;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public void signup(@Valid @RequestBody SignupReq req) {
        authService.signup(req);
    }

    @PostMapping("/login")
    public TokenRes login(@Valid @RequestBody LoginReq req) {
        return authService.login(req);
    }
    @GetMapping("/ping")
    public String ping() {
        return "ok";
    }
    @GetMapping("/me")
    public MeRes me(Authentication authentication) {

        // ✅ authentication이 없거나 principal이 MemberPrincipal이 아니면 무조건 401
        if (authentication == null || authentication.getPrincipal() == null
                || !(authentication.getPrincipal() instanceof MemberPrincipal mp)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "unauthorized");
        }

        Long memberId = mp.getId();
        String username = mp.getUsername();

        var roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new MeRes(memberId, username, roles);
    }
}

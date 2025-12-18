package com.example.subject_board.auth.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public JwtAuthFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        // CORS preflight
        if ("OPTIONS".equalsIgnoreCase(method)) return true;

        // auth 공개 엔드포인트
        if ("POST".equalsIgnoreCase(method) && pathMatcher.match("/api/auth/login", uri)) return true;
        if ("POST".equalsIgnoreCase(method) && pathMatcher.match("/api/auth/signup", uri)) return true;

        return false;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();
        String method = request.getMethod();
        String auth = request.getHeader("Authorization");

        // 디버그(필요 없으면 주석 처리)
        // System.out.println("JwtAuthFilter hit: " + method + " " + uri);

        if (!StringUtils.hasText(auth) || !auth.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = auth.substring(7);

        try {
            MemberPrincipal principal = tokenProvider.parseAndGetPrincipal(token);

            // ✅ 권한 목록 구성(안전)
            List<GrantedAuthority> authorities = buildAuthorities(principal);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            principal,            // principal 객체 유지
                            null,
                            authorities
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 디버그
            // System.out.println("JwtAuthFilter auth set: username=" + principal.getUsername() +
            //        ", authorities=" + authorities);

        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            // System.out.println("JwtAuthFilter token parse failed: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }

        chain.doFilter(request, response);
    }

    private List<GrantedAuthority> buildAuthorities(MemberPrincipal principal) {
        if (principal == null) return Collections.emptyList();

        List<GrantedAuthority> list = new ArrayList<>();

        // ✅ 1) roles 배열이 있는 구조면 그걸 우선(있으면)
        // (MemberPrincipal에 getRoles()가 없으면 이 블록은 지워도 됨)
        try {
            var m = principal.getClass().getMethod("getRoles");
            Object rolesObj = m.invoke(principal);
            if (rolesObj instanceof List<?> roles) {
                for (Object r : roles) {
                    if (r == null) continue;
                    String role = String.valueOf(r).trim();
                    if (role.isEmpty()) continue;
                    if (!role.startsWith("ROLE_")) role = "ROLE_" + role;
                    list.add(new SimpleGrantedAuthority(role));
                }
            }
        } catch (Exception ignore) {
            // getRoles() 없으면 무시하고 아래 role 단일 값 사용
        }

        String rawRole = principal.getRole();
        if (StringUtils.hasText(rawRole)) {
            final String normalizedRole =
                    rawRole.trim().startsWith("ROLE_")
                        ? rawRole.trim()
                        : "ROLE_" + rawRole.trim();

            boolean exists = list.stream()
                .anyMatch(a -> a.getAuthority().equals(normalizedRole));

            if (!exists) {
                list.add(new SimpleGrantedAuthority(normalizedRole));
            }
        }

        return list;
    }
}

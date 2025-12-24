package com.example.subject_board.security;

import org.springframework.boot.tomcat.servlet.TomcatServletWebServerFactory;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import com.example.subject_board.auth.jwt.JwtAuthFilter;

import org.apache.catalina.Context;
import org.apache.tomcat.util.scan.StandardJarScanner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @SuppressWarnings("deprecation")
    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
 // 톰캣의 URL 정규화 비활성화
    @Bean
    public TomcatServletWebServerFactory tomcatFactory() {
        return new TomcatServletWebServerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                ((StandardJarScanner) context.getJarScanner()).setScanManifest(false);
            }
        };
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable());
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // ✅ JWT 방식이면 STATELESS
        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.authorizeHttpRequests(auth -> auth
        		   .requestMatchers(
        			        "/", "/index.html", "/favicon.ico",
        			        "/assets/**",
        			        "/*.js", "/*.css", "/*.map",
        			        "/vite.svg"
        			    ).permitAll()

        	    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        	    .requestMatchers("/api/member/me").authenticated()

        	    // ✅ 공개: 회원가입/로그인만
        	    .requestMatchers(HttpMethod.POST, "/api/auth/signup").permitAll()
        	    .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
        	    .requestMatchers("/error").permitAll()


        	    // ✅ /api/auth/me 는 permitAll 하지 않음 (authenticated로 떨어지게)
        	    // .requestMatchers("/api/auth/me").authenticated()  // 명시해도 됨

        	    .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
        	    .requestMatchers(HttpMethod.POST, "/api/posts/**").permitAll()
        	    .requestMatchers(HttpMethod.GET, "/api/files/**").permitAll()
        	    .requestMatchers(HttpMethod.POST, "/api/files/**").permitAll()
        	    .requestMatchers(HttpMethod.GET, "/**").permitAll()
        	    .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")


        	    //.anyRequest().authenticated()
        	);


        // ✅ formLogin 끔 (중요)
        http.formLogin(form -> form.disable());
        http.logout(logout -> logout.disable());

        // ✅ JWT 필터 체인에 등록 (중요)
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setExposedHeaders(List.of("Authorization")); // 토큰을 헤더로 줄 경우 대비(선택)
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}

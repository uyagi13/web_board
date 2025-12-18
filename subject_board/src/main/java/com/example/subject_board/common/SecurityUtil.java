package com.example.subject_board.common;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {
  public static Long currentMemberIdOrNull() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || auth.getPrincipal() == null) return null;
    try { return Long.valueOf(auth.getPrincipal().toString()); }
    catch (Exception e) { return null; }
  }

  public static boolean hasRole(String role) { // "ROLE_ADMIN"
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null) return false;
    return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(role));
  }
}

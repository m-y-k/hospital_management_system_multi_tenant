package com.hms.common.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    public static String getCurrentRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && !auth.getAuthorities().isEmpty()) {
            String role = auth.getAuthorities().iterator().next().getAuthority();
            return role.startsWith("ROLE_") ? role.substring(5) : role;
        }
        return null;
    }

    public static String getCurrentCid() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof String) {
            return (String) auth.getDetails();
        }
        return null;
    }

    public static boolean isSuperAdmin() {
        return "SUPER_ADMIN".equals(getCurrentRole());
    }

    public static boolean isHospitalAdmin() {
        return "ADMIN".equals(getCurrentRole());
    }
}

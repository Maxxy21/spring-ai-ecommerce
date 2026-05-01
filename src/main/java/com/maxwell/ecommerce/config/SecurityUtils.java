package com.maxwell.ecommerce.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user in context");
        }
        return auth.getName();
    }

    /** Throws AccessDeniedException if the authenticated user is not the requested userId. */
    public static void requireSelf(String requestedUserId) {
        String currentUserId = getCurrentUserId();
        if (!currentUserId.equals(requestedUserId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Access denied: you can only access your own resources");
        }
    }
}

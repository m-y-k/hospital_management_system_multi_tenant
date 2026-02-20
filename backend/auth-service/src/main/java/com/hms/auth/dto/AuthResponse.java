package com.hms.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String role;
    private String cid;
    private String fullName;
    private String theme;
}

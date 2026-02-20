package com.hms.auth.controller;

import com.hms.auth.dto.AuthResponse;
import com.hms.auth.dto.LoginRequest;
import com.hms.auth.dto.RegisterRequest;
import com.hms.auth.service.AuthService;
import com.hms.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<java.util.List<com.hms.auth.entity.User>>> getAllUsers(
            @RequestParam(required = false) String cid) {
        return ResponseEntity.ok(ApiResponse.success(authService.getAllUsers(cid)));
    }

    @PostMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Void>> toggleStatus(@PathVariable Long id) {
        authService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User status toggled successfully", null));
    }

    @PutMapping("/theme")
    public ResponseEntity<ApiResponse<Void>> updateTheme(@RequestBody java.util.Map<String, String> body) {
        String username = com.hms.common.security.SecurityUtils.getCurrentUsername();
        authService.updateTheme(username, body.get("theme"));
        return ResponseEntity.ok(ApiResponse.success("Theme updated successfully", null));
    }
}

package com.hms.auth.service;

import com.hms.auth.dto.AuthResponse;
import com.hms.auth.dto.LoginRequest;
import com.hms.auth.dto.RegisterRequest;
import com.hms.auth.entity.Role;
import com.hms.auth.entity.User;
import com.hms.auth.repository.UserRepository;
import com.hms.common.security.JwtUtil;
import com.hms.common.security.SecurityUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        Role targetRole = Role.valueOf(request.getRole().toUpperCase());
        String targetCid = request.getCid();

        if (!SecurityUtils.isSuperAdmin()) {
            String currentCid = SecurityUtils.getCurrentCid();
            if (currentCid == null || !currentCid.equals(targetCid)) {
                throw new IllegalArgumentException("Unauthorized CID: " + targetCid);
            }
            if (targetRole == Role.SUPER_ADMIN) {
                throw new IllegalArgumentException("Admins cannot create Super Admins");
            }
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(targetRole)
                .cid(targetCid)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name(), user.getCid());
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getCid(), user.getFullName(), user.getTheme());
    }

    public List<User> getAllUsers(String cid) {
        if (SecurityUtils.isSuperAdmin()) {
            if (cid != null && !cid.isEmpty()) {
                return userRepository.findByCid(cid);
            }
            return userRepository.findAll();
        }
        String currentCid = SecurityUtils.getCurrentCid();
        return userRepository.findByCid(currentCid);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        if (user.getRole() != Role.SUPER_ADMIN && !user.isEnabled()) {
            throw new IllegalArgumentException("Account is disabled. Please contact administrator.");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name(), user.getCid());
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getCid(), user.getFullName(), user.getTheme());
    }

    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new com.hms.common.exception.ResourceNotFoundException("User", id));

        // Security check: only super admin or hospital admin can toggle
        if (!SecurityUtils.isSuperAdmin()) {
            String currentCid = SecurityUtils.getCurrentCid();
            if (currentCid == null || !currentCid.equals(user.getCid())) {
                throw new IllegalArgumentException("Unauthorized to modify this user");
            }
        }

        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }

    public void updateTheme(String username, String theme) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setTheme(theme);
        userRepository.save(user);
    }
}

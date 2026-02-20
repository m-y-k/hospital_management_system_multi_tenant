package com.hms.auth.config;

import com.hms.auth.entity.Role;
import com.hms.auth.entity.User;
import com.hms.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUsername("superadmin")) {
                User superAdmin = User.builder()
                        .username("superadmin")
                        .password(passwordEncoder.encode("superadmin123"))
                        .fullName("Super Administrator")
                        .role(Role.SUPER_ADMIN)
                        .cid("SYSTEM")
                        .enabled(true)
                        .build();
                userRepository.save(superAdmin);
                System.out.println("Default Super Admin created: superadmin / superadmin123");
            } else {
                userRepository.findByUsername("superadmin").ifPresent(u -> {
                    if (!u.isEnabled()) {
                        u.setEnabled(true);
                        userRepository.save(u);
                        System.out.println("Existing superadmin enabled.");
                    }
                });
            }

            // Also ensure all existing users are enabled for the first time
            userRepository.findAll().forEach(u -> {
                if (!u.isEnabled()) {
                    u.setEnabled(true);
                    userRepository.save(u);
                }
            });
        };
    }
}

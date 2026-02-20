package com.hms.auth.config;

import com.hms.auth.entity.Role;
import com.hms.auth.entity.User;
import com.hms.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("System Admin")
                        .role(Role.ADMIN)
                        .cid("HOSP001")
                        .build();
                userRepository.save(admin);

                User doctor = User.builder()
                        .username("doctor")
                        .password(passwordEncoder.encode("doctor123"))
                        .fullName("Dr. John Smith")
                        .role(Role.DOCTOR)
                        .cid("HOSP001")
                        .build();
                userRepository.save(doctor);

                User staff = User.builder()
                        .username("staff")
                        .password(passwordEncoder.encode("staff123"))
                        .fullName("Jane Doe")
                        .role(Role.STAFF)
                        .cid("HOSP001")
                        .build();
                userRepository.save(staff);

                System.out.println(">> Seeded default users: admin/admin123, doctor/doctor123, staff/staff123");
            }
        };
    }
}

package com.hms.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false)
    private String cid;

    private String fullName;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean enabled = true;

    @Builder.Default
    @Column(nullable = false)
    private String theme = "dark";
}

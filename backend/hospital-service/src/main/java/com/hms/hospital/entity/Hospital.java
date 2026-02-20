package com.hms.hospital.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hospitals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String cid;

    @Column(nullable = false)
    private String name;

    private String address;

    private String contact;
}

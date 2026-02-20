package com.hms.hospital.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cid;

    @Column(nullable = false)
    private String name;

    private Integer age;

    private String gender;

    private String contact;

    @Column(columnDefinition = "TEXT")
    private String medicalHistory;

    private Long hospitalId;
}

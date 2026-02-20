package com.hms.hospital.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cid;

    @Column(nullable = false)
    private String name;

    private String specialization;

    private String contact;

    private String availability;

    private Long hospitalId;
}

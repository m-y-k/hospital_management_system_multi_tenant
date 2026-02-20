package com.hms.appointment.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prescribed_medicines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescribedMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @Column(nullable = false)
    private String medicineName;

    @Column(nullable = false)
    private Integer quantity;

    private String dosage; // e.g., 1-0-1
}

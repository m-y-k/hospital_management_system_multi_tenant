package com.hms.appointment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cid;

    @Column(nullable = false)
    private Long doctorId;

    @Column(nullable = false)
    private Long patientId;

    private LocalDateTime dateTime;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AppointmentStatus status = AppointmentStatus.BOOKED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String imageUrl1;

    private String imageUrl2;

    // Helper fields for display (not FK — cross-service)
    private String doctorName;
    private String patientName;

    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL)
    private Prescription prescription;
}

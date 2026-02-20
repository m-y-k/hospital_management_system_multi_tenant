package com.hms.hospital.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "medicine_stock")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cid;

    @Column(nullable = false)
    private String medicineName;

    private Integer quantity;

    private LocalDate expiryDate;

    private String supplier;
}

package com.hms.hospital.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MedicineStockDto {
    private Long id;
    @NotBlank(message = "CID is required")
    private String cid;
    @NotBlank(message = "Medicine name is required")
    private String medicineName;
    private Integer quantity;
    private LocalDate expiryDate;
    private String supplier;
}

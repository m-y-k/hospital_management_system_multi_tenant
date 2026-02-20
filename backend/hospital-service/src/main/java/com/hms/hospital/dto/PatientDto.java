package com.hms.hospital.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PatientDto {
    private Long id;
    @NotBlank(message = "CID is required")
    private String cid;
    @NotBlank(message = "Name is required")
    private String name;
    private Integer age;
    private String gender;
    private String contact;
    private String medicalHistory;
    private Long hospitalId;
}

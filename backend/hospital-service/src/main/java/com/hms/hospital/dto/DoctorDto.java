package com.hms.hospital.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DoctorDto {
    private Long id;
    @NotBlank(message = "CID is required")
    private String cid;
    @NotBlank(message = "Name is required")
    private String name;
    private String specialization;
    private String contact;
    private String availability;
    private Long hospitalId;
}

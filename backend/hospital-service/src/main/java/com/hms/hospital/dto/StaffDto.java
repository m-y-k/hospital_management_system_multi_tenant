package com.hms.hospital.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StaffDto {
    private Long id;
    @NotBlank(message = "CID is required")
    private String cid;
    @NotBlank(message = "Name is required")
    private String name;
    private String role;
    private String contact;
}

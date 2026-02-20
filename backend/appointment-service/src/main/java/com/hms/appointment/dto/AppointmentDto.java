package com.hms.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDto {
    private Long id;

    @NotBlank(message = "CID is required")
    private String cid;

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private LocalDateTime dateTime;
    private String status;
    private String notes;
    private String imageUrl1;
    private String imageUrl2;
    private String doctorName;
    private String patientName;
    private PrescriptionDto prescription;
}

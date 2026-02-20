package com.hms.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionDto {
    private Long id;
    private Long appointmentId;
    private String diagnosis;
    private String advice;
    private List<PrescribedMedicineDto> medicines;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PrescribedMedicineDto {
        private String medicineName;
        private Integer quantity;
        private String dosage;
    }
}

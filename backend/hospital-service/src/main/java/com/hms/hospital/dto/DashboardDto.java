package com.hms.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardDto {
    private long totalPatients;
    private long totalDoctors;
    private long totalAppointments;
    private long todaysAppointments;
    private long lowStockMedicines;
}

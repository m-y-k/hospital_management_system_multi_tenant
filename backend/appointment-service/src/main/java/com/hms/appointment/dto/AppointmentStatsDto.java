package com.hms.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppointmentStatsDto {
    private long totalAppointments;
    private long todaysAppointments;
}

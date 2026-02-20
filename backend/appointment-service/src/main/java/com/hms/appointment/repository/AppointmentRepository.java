package com.hms.appointment.repository;

import com.hms.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCid(String cid);

    List<Appointment> findByCidAndDoctorId(String cid, Long doctorId);

    long countByCid(String cid);

    long countByCidAndDateTimeBetween(String cid, LocalDateTime start, LocalDateTime end);

    long countByDateTimeBetween(LocalDateTime start, LocalDateTime end);
}

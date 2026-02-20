package com.hms.hospital.repository;

import com.hms.hospital.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByCid(String cid);
    long countByCid(String cid);
}

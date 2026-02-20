package com.hms.hospital.repository;

import com.hms.hospital.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByCid(String cid);
    long countByCid(String cid);
}

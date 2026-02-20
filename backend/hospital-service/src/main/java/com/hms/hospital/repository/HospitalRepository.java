package com.hms.hospital.repository;

import com.hms.hospital.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    Optional<Hospital> findByCid(String cid);
    boolean existsByCid(String cid);
}

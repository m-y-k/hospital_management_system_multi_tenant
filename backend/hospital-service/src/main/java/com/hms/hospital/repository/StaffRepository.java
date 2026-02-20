package com.hms.hospital.repository;

import com.hms.hospital.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByCid(String cid);
}

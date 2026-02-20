package com.hms.hospital.repository;

import com.hms.hospital.entity.MedicineStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineStockRepository extends JpaRepository<MedicineStock, Long> {
    List<MedicineStock> findByCid(String cid);

    List<MedicineStock> findByCidAndQuantityLessThan(String cid, int threshold);

    long countByQuantityLessThan(int threshold);
}

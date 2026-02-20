package com.hms.hospital.service;

import com.hms.hospital.dto.DashboardDto;
import com.hms.hospital.repository.DoctorRepository;
import com.hms.hospital.repository.MedicineStockRepository;
import com.hms.hospital.repository.PatientRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicineStockRepository medicineStockRepository;

    public DashboardService(PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            MedicineStockRepository medicineStockRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.medicineStockRepository = medicineStockRepository;
    }

    public DashboardDto getDashboardStats(String cid) {
        if (com.hms.common.security.SecurityUtils.isSuperAdmin()) {
            return new DashboardDto(
                    patientRepository.count(),
                    doctorRepository.count(),
                    0, 0,
                    medicineStockRepository.countByQuantityLessThan(10));
        }

        // Validate CID for non-Super Admins
        String currentCid = com.hms.common.security.SecurityUtils.getCurrentCid();
        if (currentCid == null || !currentCid.equals(cid)) {
            throw new com.hms.common.exception.ResourceNotFoundException("Dashboard Data", 0L);
        }

        long totalPatients = patientRepository.countByCid(cid);
        long totalDoctors = doctorRepository.countByCid(cid);
        long lowStockMedicines = medicineStockRepository.findByCidAndQuantityLessThan(cid, 10).size();

        return new DashboardDto(totalPatients, totalDoctors, 0, 0, lowStockMedicines);
    }
}

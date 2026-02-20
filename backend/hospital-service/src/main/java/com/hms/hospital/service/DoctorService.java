package com.hms.hospital.service;

import com.hms.common.exception.ResourceNotFoundException;
import com.hms.hospital.dto.DoctorDto;
import com.hms.hospital.entity.Doctor;
import com.hms.hospital.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getByCid(String cid) {
        validateCid(cid);
        return doctorRepository.findByCid(cid);
    }

    public Doctor getById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", id));
        validateCid(doctor.getCid());
        return doctor;
    }

    public Doctor create(DoctorDto dto) {
        Doctor doctor = Doctor.builder()
                .cid(dto.getCid())
                .name(dto.getName())
                .specialization(dto.getSpecialization())
                .contact(dto.getContact())
                .availability(dto.getAvailability())
                .hospitalId(dto.getHospitalId())
                .build();
        return doctorRepository.save(doctor);
    }

    public Doctor update(Long id, DoctorDto dto) {
        Doctor doctor = getById(id);
        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setContact(dto.getContact());
        doctor.setAvailability(dto.getAvailability());
        doctor.setHospitalId(dto.getHospitalId());
        return doctorRepository.save(doctor);
    }

    public void delete(Long id) {
        getById(id);
        doctorRepository.deleteById(id);
    }

    private void validateCid(String cid) {
        if (!com.hms.common.security.SecurityUtils.isSuperAdmin()) {
            String currentCid = com.hms.common.security.SecurityUtils.getCurrentCid();
            if (currentCid == null || !currentCid.equals(cid)) {
                throw new com.hms.common.exception.ResourceNotFoundException("Doctor or Target Data", 0L);
            }
        }
    }
}

package com.hms.hospital.service;

import com.hms.common.exception.ResourceNotFoundException;
import com.hms.hospital.dto.PatientDto;
import com.hms.hospital.entity.Patient;
import com.hms.hospital.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getByCid(String cid) {
        validateCid(cid);
        return patientRepository.findByCid(cid);
    }

    public Patient getById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", id));
        validateCid(patient.getCid());
        return patient;
    }

    public Patient create(PatientDto dto) {
        Patient patient = Patient.builder()
                .cid(dto.getCid())
                .name(dto.getName())
                .age(dto.getAge())
                .gender(dto.getGender())
                .contact(dto.getContact())
                .medicalHistory(dto.getMedicalHistory())
                .hospitalId(dto.getHospitalId())
                .build();
        return patientRepository.save(patient);
    }

    public Patient update(Long id, PatientDto dto) {
        Patient patient = getById(id);
        patient.setName(dto.getName());
        patient.setAge(dto.getAge());
        patient.setGender(dto.getGender());
        patient.setContact(dto.getContact());
        patient.setMedicalHistory(dto.getMedicalHistory());
        patient.setHospitalId(dto.getHospitalId());
        return patientRepository.save(patient);
    }

    public void delete(Long id) {
        getById(id);
        patientRepository.deleteById(id);
    }

    private void validateCid(String cid) {
        if (!com.hms.common.security.SecurityUtils.isSuperAdmin()) {
            String currentCid = com.hms.common.security.SecurityUtils.getCurrentCid();
            if (currentCid == null || !currentCid.equals(cid)) {
                throw new com.hms.common.exception.ResourceNotFoundException("Patient or Target Data", 0L);
            }
        }
    }
}

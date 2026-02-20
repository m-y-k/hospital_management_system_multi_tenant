package com.hms.hospital.service;

import com.hms.common.exception.ResourceNotFoundException;
import com.hms.hospital.dto.HospitalDto;
import com.hms.hospital.entity.Hospital;
import com.hms.hospital.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    public List<Hospital> getAll() {
        if (com.hms.common.security.SecurityUtils.isSuperAdmin()) {
            return hospitalRepository.findAll();
        }
        String cid = com.hms.common.security.SecurityUtils.getCurrentCid();
        return hospitalRepository.findByCid(cid)
                .map(List::of)
                .orElse(List.of());
    }

    public Hospital getById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital", id));

        // Safety check for non-Super Admins
        if (!com.hms.common.security.SecurityUtils.isSuperAdmin()) {
            String cid = com.hms.common.security.SecurityUtils.getCurrentCid();
            if (!hospital.getCid().equals(cid)) {
                throw new com.hms.common.exception.ResourceNotFoundException("Hospital", id); // Hide existence
            }
        }
        return hospital;
    }

    public Hospital create(HospitalDto dto) {
        if (hospitalRepository.existsByCid(dto.getCid())) {
            throw new IllegalArgumentException("Hospital with CID " + dto.getCid() + " already exists");
        }
        Hospital hospital = Hospital.builder()
                .cid(dto.getCid())
                .name(dto.getName())
                .address(dto.getAddress())
                .contact(dto.getContact())
                .build();
        return hospitalRepository.save(hospital);
    }

    public Hospital update(Long id, HospitalDto dto) {
        Hospital hospital = getById(id);
        hospital.setName(dto.getName());
        hospital.setAddress(dto.getAddress());
        hospital.setContact(dto.getContact());
        return hospitalRepository.save(hospital);
    }

    public void delete(Long id) {
        getById(id);
        hospitalRepository.deleteById(id);
    }
}

package com.hms.hospital.service;

import com.hms.common.exception.ResourceNotFoundException;
import com.hms.hospital.dto.StaffDto;
import com.hms.hospital.entity.Staff;
import com.hms.hospital.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {

    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public List<Staff> getByCid(String cid) {
        validateCid(cid);
        return staffRepository.findByCid(cid);
    }

    public Staff getById(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", id));
        validateCid(staff.getCid());
        return staff;
    }

    public Staff create(StaffDto dto) {
        Staff staff = Staff.builder()
                .cid(dto.getCid())
                .name(dto.getName())
                .role(dto.getRole())
                .contact(dto.getContact())
                .build();
        return staffRepository.save(staff);
    }

    public Staff update(Long id, StaffDto dto) {
        Staff staff = getById(id);
        staff.setName(dto.getName());
        staff.setRole(dto.getRole());
        staff.setContact(dto.getContact());
        return staffRepository.save(staff);
    }

    public void delete(Long id) {
        getById(id);
        staffRepository.deleteById(id);
    }

    private void validateCid(String cid) {
        if (!com.hms.common.security.SecurityUtils.isSuperAdmin()) {
            String currentCid = com.hms.common.security.SecurityUtils.getCurrentCid();
            if (currentCid == null || !currentCid.equals(cid)) {
                throw new com.hms.common.exception.ResourceNotFoundException("Staff or Target Data", 0L);
            }
        }
    }
}

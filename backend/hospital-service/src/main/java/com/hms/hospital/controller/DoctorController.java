package com.hms.hospital.controller;

import com.hms.common.dto.ApiResponse;
import com.hms.hospital.dto.DoctorDto;
import com.hms.hospital.entity.Doctor;
import com.hms.hospital.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Doctor>>> getByCid(@RequestParam String cid) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getByCid(cid)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Doctor>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Doctor>> create(@Valid @RequestBody DoctorDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Doctor created", doctorService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Doctor>> update(@PathVariable Long id, @Valid @RequestBody DoctorDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Doctor updated", doctorService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        doctorService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deleted", null));
    }
}

package com.hms.hospital.controller;

import com.hms.common.dto.ApiResponse;
import com.hms.hospital.dto.HospitalDto;
import com.hms.hospital.entity.Hospital;
import com.hms.hospital.service.HospitalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hospital>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(hospitalService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Hospital>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(hospitalService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Hospital>> create(@Valid @RequestBody HospitalDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Hospital created", hospitalService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Hospital>> update(@PathVariable Long id, @Valid @RequestBody HospitalDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Hospital updated", hospitalService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        hospitalService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Hospital deleted", null));
    }
}

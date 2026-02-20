package com.hms.hospital.controller;

import com.hms.common.dto.ApiResponse;
import com.hms.hospital.dto.PatientDto;
import com.hms.hospital.entity.Patient;
import com.hms.hospital.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Patient>>> getByCid(@RequestParam String cid) {
        return ResponseEntity.ok(ApiResponse.success(patientService.getByCid(cid)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(patientService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Patient>> create(@Valid @RequestBody PatientDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Patient created", patientService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> update(@PathVariable Long id, @Valid @RequestBody PatientDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Patient updated", patientService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        patientService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Patient deleted", null));
    }
}

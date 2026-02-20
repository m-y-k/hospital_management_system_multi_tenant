package com.hms.hospital.controller;

import com.hms.common.dto.ApiResponse;
import com.hms.hospital.dto.StaffDto;
import com.hms.hospital.entity.Staff;
import com.hms.hospital.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Staff>>> getByCid(@RequestParam String cid) {
        return ResponseEntity.ok(ApiResponse.success(staffService.getByCid(cid)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Staff>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(staffService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Staff>> create(@Valid @RequestBody StaffDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Staff created", staffService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Staff>> update(@PathVariable Long id, @Valid @RequestBody StaffDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Staff updated", staffService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        staffService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Staff deleted", null));
    }
}

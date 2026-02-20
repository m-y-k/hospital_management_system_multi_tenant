package com.hms.appointment.controller;

import com.hms.appointment.dto.AppointmentDto;
import com.hms.appointment.dto.AppointmentStatsDto;
import com.hms.appointment.entity.Appointment;
import com.hms.appointment.service.AppointmentService;
import com.hms.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getByCid(@RequestParam String cid) {
        return ResponseEntity.ok(ApiResponse.success(appointmentService.getByCidDto(cid)));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<Appointment>>> getByDoctor(
            @RequestParam String cid, @PathVariable Long doctorId) {
        return ResponseEntity.ok(ApiResponse.success(appointmentService.getByDoctor(cid, doctorId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Appointment>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(appointmentService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Appointment>> create(@Valid @RequestBody AppointmentDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Appointment booked", appointmentService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Appointment>> update(@PathVariable Long id,
            @Valid @RequestBody AppointmentDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Appointment updated", appointmentService.update(id, dto)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Appointment>> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                appointmentService.updateStatus(id, body.get("status"))));
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<ApiResponse<Appointment>> uploadImages(
            @PathVariable Long id, @RequestParam("files") MultipartFile[] files) {
        return ResponseEntity.ok(ApiResponse.success("Images uploaded",
                appointmentService.uploadImages(id, files)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        appointmentService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Appointment deleted", null));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AppointmentStatsDto>> getStats(@RequestParam String cid) {
        return ResponseEntity.ok(ApiResponse.success(appointmentService.getStats(cid)));
    }
}

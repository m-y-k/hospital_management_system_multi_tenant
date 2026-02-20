package com.hms.hospital.controller;

import com.hms.common.dto.ApiResponse;
import com.hms.hospital.dto.DashboardDto;
import com.hms.hospital.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardDto>> getDashboard(@RequestParam String cid) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboardStats(cid)));
    }
}

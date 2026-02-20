package com.hms.hospital.controller;

import com.hms.common.dto.ApiResponse;
import com.hms.hospital.dto.MedicineStockDto;
import com.hms.hospital.entity.MedicineStock;
import com.hms.hospital.service.MedicineStockService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineStockController {

    private final MedicineStockService medicineStockService;

    public MedicineStockController(MedicineStockService medicineStockService) {
        this.medicineStockService = medicineStockService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicineStock>>> getByCid(@RequestParam String cid) {
        return ResponseEntity.ok(ApiResponse.success(medicineStockService.getByCid(cid)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicineStock>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(medicineStockService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MedicineStock>> create(@Valid @RequestBody MedicineStockDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Medicine added", medicineStockService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicineStock>> update(@PathVariable Long id,
            @Valid @RequestBody MedicineStockDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Medicine updated", medicineStockService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        medicineStockService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Medicine deleted", null));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<MedicineStock>>> getLowStock(
            @RequestParam String cid,
            @RequestParam(defaultValue = "10") int threshold) {
        return ResponseEntity.ok(ApiResponse.success(medicineStockService.getLowStock(cid, threshold)));
    }

    @PostMapping("/deduct")
    public ResponseEntity<ApiResponse<Void>> deductStock(@RequestParam String cid,
            @RequestBody List<Map<String, Object>> medicineDeductions) {
        for (Map<String, Object> deduction : medicineDeductions) {
            String name = (String) deduction.get("medicineName");
            int qty = (Integer) deduction.get("quantity");
            medicineStockService.deductStock(cid, name, qty);
        }
        return ResponseEntity.ok(ApiResponse.success("Stock deducted successfully", null));
    }

    @PostMapping("/restore")
    public ResponseEntity<ApiResponse<Void>> restoreStock(@RequestParam String cid,
            @RequestBody List<Map<String, Object>> medicineRestorations) {
        for (Map<String, Object> restoration : medicineRestorations) {
            String name = (String) restoration.get("medicineName");
            int qty = (Integer) restoration.get("quantity");
            medicineStockService.restoreStock(cid, name, qty);
        }
        return ResponseEntity.ok(ApiResponse.success("Stock restored successfully", null));
    }
}

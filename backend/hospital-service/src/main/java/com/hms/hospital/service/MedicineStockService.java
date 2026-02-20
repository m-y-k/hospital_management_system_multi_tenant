package com.hms.hospital.service;

import com.hms.common.exception.ResourceNotFoundException;
import com.hms.hospital.dto.MedicineStockDto;
import com.hms.hospital.entity.MedicineStock;
import com.hms.hospital.repository.MedicineStockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineStockService {

    private final MedicineStockRepository medicineStockRepository;

    public MedicineStockService(MedicineStockRepository medicineStockRepository) {
        this.medicineStockRepository = medicineStockRepository;
    }

    public List<MedicineStock> getByCid(String cid) {
        validateCid(cid);
        return medicineStockRepository.findByCid(cid);
    }

    public MedicineStock getById(Long id) {
        MedicineStock stock = medicineStockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine", id));
        validateCid(stock.getCid());
        return stock;
    }

    public MedicineStock create(MedicineStockDto dto) {
        MedicineStock stock = MedicineStock.builder()
                .cid(dto.getCid())
                .medicineName(dto.getMedicineName())
                .quantity(dto.getQuantity())
                .expiryDate(dto.getExpiryDate())
                .supplier(dto.getSupplier())
                .build();
        return medicineStockRepository.save(stock);
    }

    public MedicineStock update(Long id, MedicineStockDto dto) {
        MedicineStock stock = getById(id);
        stock.setMedicineName(dto.getMedicineName());
        stock.setQuantity(dto.getQuantity());
        stock.setExpiryDate(dto.getExpiryDate());
        stock.setSupplier(dto.getSupplier());
        return medicineStockRepository.save(stock);
    }

    public void delete(Long id) {
        getById(id);
        medicineStockRepository.deleteById(id);
    }

    public List<MedicineStock> getLowStock(String cid, int threshold) {
        return medicineStockRepository.findByCidAndQuantityLessThan(cid, threshold);
    }

    public void deductStock(String cid, String medicineName, int quantity) {
        validateCid(cid);
        List<MedicineStock> stocks = medicineStockRepository.findByCid(cid);
        MedicineStock stock = stocks.stream()
                .filter(s -> s.getMedicineName().equalsIgnoreCase(medicineName))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medicine: " + medicineName + " not found for tenant: " + cid, 0L));

        if (stock.getQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock for " + medicineName);
        }

        stock.setQuantity(stock.getQuantity() - quantity);
        medicineStockRepository.save(stock);
    }

    public void restoreStock(String cid, String medicineName, int quantity) {
        validateCid(cid);
        List<MedicineStock> stocks = medicineStockRepository.findByCid(cid);
        MedicineStock stock = stocks.stream()
                .filter(s -> s.getMedicineName().equalsIgnoreCase(medicineName))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medicine: " + medicineName + " not found for tenant: " + cid, 0L));

        stock.setQuantity(stock.getQuantity() + quantity);
        medicineStockRepository.save(stock);
    }

    private void validateCid(String cid) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (auth == null || auth instanceof org.springframework.security.authentication.AnonymousAuthenticationToken) {
            return; // Allow internal/unauthenticated requests if permitted in security config
        }
        if (!com.hms.common.security.SecurityUtils.isSuperAdmin()) {
            String currentCid = com.hms.common.security.SecurityUtils.getCurrentCid();
            if (currentCid == null || !currentCid.equals(cid)) {
                throw new com.hms.common.exception.ResourceNotFoundException("Medicine or Target Data", 0L);
            }
        }
    }
}

package com.hms.appointment.service;

import com.hms.appointment.dto.AppointmentDto;
import com.hms.appointment.dto.AppointmentStatsDto;
import com.hms.appointment.dto.PrescriptionDto;
import com.hms.appointment.entity.Appointment;
import com.hms.appointment.entity.AppointmentStatus;
import com.hms.appointment.entity.PrescribedMedicine;
import com.hms.appointment.entity.Prescription;
import com.hms.appointment.repository.AppointmentRepository;
import com.hms.appointment.repository.PrescriptionRepository;
import com.hms.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final StorageService storageService;
    private final HospitalClient hospitalClient;

    public AppointmentService(AppointmentRepository appointmentRepository,
            PrescriptionRepository prescriptionRepository,
            StorageService storageService,
            HospitalClient hospitalClient) {
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.storageService = storageService;
        this.hospitalClient = hospitalClient;
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getByCidDto(String cid) {
        validateCid(cid);
        return appointmentRepository.findByCid(cid).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<Appointment> getByCid(String cid) {
        validateCid(cid);
        return appointmentRepository.findByCid(cid);
    }

    public List<Appointment> getByDoctor(String cid, Long doctorId) {
        validateCid(cid);
        return appointmentRepository.findByCidAndDoctorId(cid, doctorId);
    }

    public Appointment getById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id));
        validateCid(appointment.getCid());
        return appointment;
    }

    @Transactional
    public Appointment create(AppointmentDto dto) {
        Appointment appointment = Appointment.builder()
                .cid(dto.getCid())
                .doctorId(dto.getDoctorId())
                .patientId(dto.getPatientId())
                .dateTime(dto.getDateTime())
                .status(AppointmentStatus.BOOKED)
                .notes(dto.getNotes())
                .doctorName(dto.getDoctorName())
                .patientName(dto.getPatientName())
                .build();

        if (dto.getPrescription() != null) {
            appointment.setPrescription(mapPrescription(dto.getPrescription(), appointment));
        }

        Appointment saved = appointmentRepository.save(appointment);
        if (saved.getStatus() == AppointmentStatus.COMPLETED) {
            triggerStockDeduction(saved);
        }
        return saved;
    }

    @Transactional
    public Appointment update(Long id, AppointmentDto dto) {
        Appointment appointment = getById(id);
        AppointmentStatus oldStatus = appointment.getStatus();

        // Capture old medicines before update if it was completed
        Map<String, Integer> oldMedicines = Map.of();
        if (oldStatus == AppointmentStatus.COMPLETED && appointment.getPrescription() != null) {
            oldMedicines = appointment.getPrescription().getMedicines().stream()
                    .collect(Collectors.toMap(PrescribedMedicine::getMedicineName, PrescribedMedicine::getQuantity,
                            (v1, v2) -> v1 + v2));
        }

        appointment.setDoctorId(dto.getDoctorId());
        appointment.setPatientId(dto.getPatientId());
        appointment.setDateTime(dto.getDateTime());
        appointment.setNotes(dto.getNotes());
        appointment.setDoctorName(dto.getDoctorName());
        appointment.setPatientName(dto.getPatientName());

        if (dto.getStatus() != null) {
            appointment.setStatus(AppointmentStatus.valueOf(dto.getStatus().toUpperCase()));
        }

        if (dto.getPrescription() != null) {
            if (appointment.getPrescription() != null) {
                updatePrescription(appointment.getPrescription(), dto.getPrescription());
            } else {
                appointment.setPrescription(mapPrescription(dto.getPrescription(), appointment));
            }
        }

        Appointment saved = appointmentRepository.save(appointment);

        // Handle stock transitions
        if (oldStatus != AppointmentStatus.COMPLETED && saved.getStatus() == AppointmentStatus.COMPLETED) {
            // New completion: deduct everything
            triggerStockDeduction(saved);
        } else if (oldStatus == AppointmentStatus.COMPLETED && saved.getStatus() != AppointmentStatus.COMPLETED) {
            // Was completed, now cancelled/booked: restore everything
            // Use old medicines map for restoration
            restoreStockFromMap(saved.getCid(), oldMedicines);
        } else if (oldStatus == AppointmentStatus.COMPLETED && saved.getStatus() == AppointmentStatus.COMPLETED) {
            // Remained completed: apply differential
            handleStockUpdate(saved.getCid(), oldMedicines, dto.getPrescription());
        }
        return saved;
    }

    @Transactional
    public Appointment updateStatus(Long id, String status) {
        Appointment appointment = getById(id);
        AppointmentStatus oldStatus = appointment.getStatus();
        AppointmentStatus newStatus = AppointmentStatus.valueOf(status.toUpperCase());
        appointment.setStatus(newStatus);
        Appointment saved = appointmentRepository.save(appointment);

        if (oldStatus != AppointmentStatus.COMPLETED && newStatus == AppointmentStatus.COMPLETED) {
            triggerStockDeduction(saved);
        } else if (oldStatus == AppointmentStatus.COMPLETED && newStatus != AppointmentStatus.COMPLETED) {
            triggerStockRestoration(saved);
        }
        return saved;
    }

    public Appointment uploadImages(Long id, MultipartFile[] files) {
        Appointment appointment = getById(id);

        if (files.length > 2) {
            throw new IllegalArgumentException("Maximum 2 images allowed per appointment");
        }

        for (int i = 0; i < files.length; i++) {
            String url = storageService.uploadFile(files[i], "appointments/" + id);
            if (i == 0 && appointment.getImageUrl1() == null) {
                appointment.setImageUrl1(url);
            } else {
                appointment.setImageUrl2(url);
            }
        }

        return appointmentRepository.save(appointment);
    }

    public void delete(Long id) {
        Appointment appointment = getById(id);
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            triggerStockRestoration(appointment);
        }
        appointmentRepository.deleteById(id);
    }

    public AppointmentStatsDto getStats(String cid) {
        if (com.hms.common.security.SecurityUtils.isSuperAdmin()) {
            long total = appointmentRepository.count();
            LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
            LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
            long today = appointmentRepository.countByDateTimeBetween(startOfDay, endOfDay);
            return new AppointmentStatsDto(total, today);
        }

        validateCid(cid);
        long total = appointmentRepository.countByCid(cid);
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        long today = appointmentRepository.countByCidAndDateTimeBetween(cid, startOfDay, endOfDay);
        return new AppointmentStatsDto(total, today);
    }

    private void validateCid(String cid) {
        if (!com.hms.common.security.SecurityUtils.isSuperAdmin()) {
            String currentCid = com.hms.common.security.SecurityUtils.getCurrentCid();
            if (currentCid == null || !currentCid.equals(cid)) {
                throw new com.hms.common.exception.ResourceNotFoundException("Appointment or Target Data", 0L);
            }
        }
    }

    private void triggerStockDeduction(Appointment appt) {
        if (appt.getPrescription() != null && !appt.getPrescription().getMedicines().isEmpty()) {
            List<Map<String, Object>> medicines = appt.getPrescription().getMedicines().stream()
                    .map(m -> Map.of(
                            "medicineName", (Object) m.getMedicineName(),
                            "quantity", (Object) m.getQuantity()))
                    .collect(Collectors.toList());
            hospitalClient.deductStock(appt.getCid(), medicines);
        }
    }

    private void triggerStockRestoration(Appointment appt) {
        if (appt.getPrescription() != null && !appt.getPrescription().getMedicines().isEmpty()) {
            List<Map<String, Object>> medicines = appt.getPrescription().getMedicines().stream()
                    .map(m -> Map.of(
                            "medicineName", (Object) m.getMedicineName(),
                            "quantity", (Object) m.getQuantity()))
                    .collect(Collectors.toList());
            hospitalClient.restoreStock(appt.getCid(), medicines);
        }
    }

    private void handleStockUpdate(String cid, Map<String, Integer> oldMedicines, PrescriptionDto newPrescription) {
        if (newPrescription == null) {
            // If prescription removed while remaining completed, restore all old stock
            restoreStockFromMap(cid, oldMedicines);
            return;
        }

        Map<String, Integer> newMedicines = newPrescription.getMedicines().stream()
                .collect(Collectors.toMap(PrescriptionDto.PrescribedMedicineDto::getMedicineName,
                        PrescriptionDto.PrescribedMedicineDto::getQuantity, (v1, v2) -> v1 + v2));

        List<Map<String, Object>> toDeduct = new ArrayList<>();
        List<Map<String, Object>> toRestore = new ArrayList<>();

        // Check new or updated medicines
        for (Map.Entry<String, Integer> entry : newMedicines.entrySet()) {
            String name = entry.getKey();
            int newQty = entry.getValue();
            int oldQty = oldMedicines.getOrDefault(name, 0);

            if (newQty > oldQty) {
                toDeduct.add(Map.of("medicineName", name, "quantity", newQty - oldQty));
            } else if (newQty < oldQty) {
                toRestore.add(Map.of("medicineName", name, "quantity", oldQty - newQty));
            }
        }

        // Check for removed medicines
        for (Map.Entry<String, Integer> entry : oldMedicines.entrySet()) {
            if (!newMedicines.containsKey(entry.getKey())) {
                toRestore.add(Map.of("medicineName", entry.getKey(), "quantity", entry.getValue()));
            }
        }

        if (!toDeduct.isEmpty())
            hospitalClient.deductStock(cid, toDeduct);
        if (!toRestore.isEmpty())
            hospitalClient.restoreStock(cid, toRestore);
    }

    private void restoreStockFromMap(String cid, Map<String, Integer> medicines) {
        if (medicines.isEmpty())
            return;
        List<Map<String, Object>> list = medicines.entrySet().stream()
                .map(e -> Map.of("medicineName", (Object) e.getKey(), "quantity", (Object) e.getValue()))
                .collect(Collectors.toList());
        hospitalClient.restoreStock(cid, list);
    }

    private AppointmentDto toDto(Appointment appt) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appt.getId());
        dto.setCid(appt.getCid());
        dto.setDoctorId(appt.getDoctorId());
        dto.setPatientId(appt.getPatientId());
        dto.setDateTime(appt.getDateTime());
        dto.setStatus(appt.getStatus().name());
        dto.setNotes(appt.getNotes());
        dto.setImageUrl1(appt.getImageUrl1());
        dto.setImageUrl2(appt.getImageUrl2());
        dto.setDoctorName(appt.getDoctorName());
        dto.setPatientName(appt.getPatientName());

        if (appt.getPrescription() != null) {
            Prescription p = appt.getPrescription();
            PrescriptionDto pDto = PrescriptionDto.builder()
                    .id(p.getId())
                    .diagnosis(p.getDiagnosis())
                    .advice(p.getAdvice())
                    .medicines(p.getMedicines().stream()
                            .map(m -> PrescriptionDto.PrescribedMedicineDto.builder()
                                    .medicineName(m.getMedicineName())
                                    .quantity(m.getQuantity())
                                    .dosage(m.getDosage())
                                    .build())
                            .collect(Collectors.toList()))
                    .build();
            dto.setPrescription(pDto);
        }
        return dto;
    }

    private Prescription mapPrescription(PrescriptionDto dto, Appointment appt) {
        Prescription p = Prescription.builder()
                .appointment(appt)
                .diagnosis(dto.getDiagnosis())
                .advice(dto.getAdvice())
                .medicines(new ArrayList<>())
                .build();

        if (dto.getMedicines() != null) {
            for (PrescriptionDto.PrescribedMedicineDto mDto : dto.getMedicines()) {
                p.getMedicines().add(PrescribedMedicine.builder()
                        .prescription(p)
                        .medicineName(mDto.getMedicineName())
                        .quantity(mDto.getQuantity())
                        .dosage(mDto.getDosage())
                        .build());
            }
        }
        return p;
    }

    private void updatePrescription(Prescription p, PrescriptionDto dto) {
        p.setDiagnosis(dto.getDiagnosis());
        p.setAdvice(dto.getAdvice());
        p.getMedicines().clear();
        if (dto.getMedicines() != null) {
            for (PrescriptionDto.PrescribedMedicineDto mDto : dto.getMedicines()) {
                p.getMedicines().add(PrescribedMedicine.builder()
                        .prescription(p)
                        .medicineName(mDto.getMedicineName())
                        .quantity(mDto.getQuantity())
                        .dosage(mDto.getDosage())
                        .build());
            }
        }
    }
}

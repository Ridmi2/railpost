package com.railpost.service.impl;

import com.railpost.dto.request.UpdateCargoStatusRequest;
import com.railpost.dto.request.VerifyOtpRequest;
import com.railpost.dto.response.CargoResponse;
import com.railpost.exception.ResourceNotFoundException;
import com.railpost.model.document.Cargo;
import com.railpost.model.document.User;
import com.railpost.model.enums.CargoStatus;
import com.railpost.repository.CargoRepository;
import com.railpost.repository.UserRepository;
import com.railpost.service.StationOfficerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class StationOfficerServiceImpl implements StationOfficerService {

    private final CargoRepository cargoRepository;
    private final UserRepository userRepository;

    private User getOfficer(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found"));
    }

    private Cargo getCargo(String trackingNumber) {
        return cargoRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo not found with tracking number: " + trackingNumber));
    }

    @Override
    public CargoResponse getCargoByTrackingNumber(String trackingNumber) {
        Cargo cargo = getCargo(trackingNumber);
        return mapToResponse(cargo);
    }

    @Override
    @Transactional
    public CargoResponse updateCargoStatus(String trackingNumber, UpdateCargoStatusRequest request, String officerUsername) {
        User officer = getOfficer(officerUsername);
        Cargo cargo = getCargo(trackingNumber);

        if (cargo.getStatus() == CargoStatus.DELIVERED || cargo.getStatus() == CargoStatus.CANCELLED) {
            throw new IllegalStateException("Cannot update status of a cargo that is already delivered or cancelled");
        }

        cargo.setStatus(request.getStatus());

        Cargo.StatusUpdate statusUpdate = Cargo.StatusUpdate.builder()
                .status(request.getStatus())
                .location(request.getLocation())
                .note(request.getNote() != null ? request.getNote() : "Updated by " + officer.getFullName())
                .timestamp(LocalDateTime.now())
                .build();

        cargo.getStatusHistory().add(statusUpdate);

        Cargo savedCargo = cargoRepository.save(cargo);
        return mapToResponse(savedCargo);
    }

    @Override
    @Transactional
    public String generateDeliveryOtp(String trackingNumber, String officerUsername) {
        getOfficer(officerUsername);
        Cargo cargo = getCargo(trackingNumber);

        if (cargo.getStatus() != CargoStatus.ARRIVED) {
            throw new IllegalStateException("Cargo must be at ARRIVED status to generate delivery OTP");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        cargo.setDeliveryOtp(otp);
        cargo.setOtpExpiresAt(LocalDateTime.now().plusMinutes(15));
        
        cargoRepository.save(cargo);

        log.info("========== SMS SIMULATION ==========");
        log.info("To: {}", cargo.getReceiverPhone());
        log.info("Message: Your RailPost OTP for cargo {} is: {}. Valid for 15 minutes.", trackingNumber, otp);
        log.info("====================================");

        return otp;
    }

    @Override
    @Transactional
    public CargoResponse verifyOtpAndDeliver(String trackingNumber, VerifyOtpRequest request, String officerUsername) {
        User officer = getOfficer(officerUsername);
        Cargo cargo = getCargo(trackingNumber);

        if (cargo.getStatus() != CargoStatus.ARRIVED) {
            throw new IllegalStateException("Cargo is not ready for delivery");
        }

        if (cargo.getDeliveryOtp() == null || cargo.getOtpExpiresAt() == null) {
            throw new IllegalStateException("No OTP generated for this cargo");
        }

        if (LocalDateTime.now().isAfter(cargo.getOtpExpiresAt())) {
            throw new IllegalStateException("OTP has expired. Please generate a new one.");
        }

        if (!cargo.getDeliveryOtp().equals(request.getOtp())) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        // Deliver cargo
        cargo.setStatus(CargoStatus.DELIVERED);
        cargo.setDeliveredAt(LocalDateTime.now());
        cargo.setStationOfficerId(officer.getId());
        
        // Clear OTP for security
        cargo.setDeliveryOtp(null);
        cargo.setOtpExpiresAt(null);

        Cargo.StatusUpdate statusUpdate = Cargo.StatusUpdate.builder()
                .status(CargoStatus.DELIVERED)
                .location(cargo.getDestinationStationName())
                .note("Delivered successfully by " + officer.getFullName())
                .timestamp(LocalDateTime.now())
                .build();

        cargo.getStatusHistory().add(statusUpdate);

        Cargo savedCargo = cargoRepository.save(cargo);
        return mapToResponse(savedCargo);
    }

    private CargoResponse mapToResponse(Cargo cargo) {
        return CargoResponse.builder()
                .id(cargo.getId())
                .trackingNumber(cargo.getTrackingNumber())
                .senderName(cargo.getSenderName())
                .senderPhone(cargo.getSenderPhone())
                .receiverName(cargo.getReceiverName())
                .receiverPhone(cargo.getReceiverPhone())
                .receiverNic(cargo.getReceiverNic())
                .originStationName(cargo.getOriginStationName())
                .destinationStationName(cargo.getDestinationStationName())
                .category(cargo.getCategory() != null ? cargo.getCategory().name() : null)
                .weight(cargo.getWeight())
                .declaredValue(cargo.getDeclaredValue())
                .totalCost(cargo.getTotalCost())
                .status(cargo.getStatus().name())
                .statusLabel(cargo.getStatus().name().replace("_", " "))
                .trainNumber(cargo.getTrainNumber())
                .qrCode(cargo.getQrCode())
                .statusHistory(cargo.getStatusHistory())
                .createdAt(cargo.getCreatedAt())
                .deliveredAt(cargo.getDeliveredAt())
                .build();
    }
}

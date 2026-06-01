package com.railpost.service.impl;

import com.railpost.dto.request.BookCargoRequest;
import com.railpost.dto.response.CargoResponse;
import com.railpost.dto.response.SenderStatsResponse;
import com.railpost.exception.ResourceNotFoundException;
import com.railpost.exception.UnauthorizedException;
import com.railpost.model.document.Cargo;
import com.railpost.model.document.Station;
import com.railpost.model.document.User;
import com.railpost.model.enums.CargoStatus;
import com.railpost.repository.CargoRepository;
import com.railpost.repository.StationRepository;
import com.railpost.repository.UserRepository;
import com.railpost.service.SenderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class SenderServiceImpl implements SenderService {

    private final CargoRepository cargoRepository;
    private final UserRepository   userRepository;
    private final StationRepository stationRepository;
    private final Random random = new Random();

    @Override
    public CargoResponse bookCargo(String senderEmail, BookCargoRequest req) {
        User sender = getUser(senderEmail);

        Station destination = stationRepository.findById(req.getDestinationStationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination station not found"));

        String trackingNumber = generateTrackingNumber();

        Cargo cargo = Cargo.builder()
                .trackingNumber(trackingNumber)
                .senderId(sender.getId())
                .senderName(sender.getFullName())
                .senderPhone(sender.getPhone())
                .receiverName(req.getReceiverName())
                .receiverNic(req.getReceiverNic().toUpperCase())
                .receiverEmail(req.getReceiverEmail())
                .receiverPhone(req.getReceiverPhone())
                .destinationStationId(destination.getId())
                .destinationStationName(destination.getName())
                .category(req.getCategory())
                .declaredValue(req.getDeclaredValue())
                .description(req.getDescription())
                .status(CargoStatus.PENDING_DROP_OFF)
                .expiresAt(LocalDateTime.now().plusDays(3))
                .build();

        cargo.getStatusHistory().add(Cargo.StatusUpdate.builder()
                .status(CargoStatus.PENDING_DROP_OFF)
                .note("Booking created online. Please drop off cargo at your nearest station within 3 days.")
                .timestamp(LocalDateTime.now())
                .build());

        Cargo saved = cargoRepository.save(cargo);
        log.info("Cargo booked: {} by {}", trackingNumber, senderEmail);
        return toResponse(saved);
    }

    @Override
    public List<CargoResponse> getMyShipments(String senderEmail) {
        User sender = getUser(senderEmail);
        return cargoRepository.findBySenderIdOrderByCreatedAtDesc(sender.getId())
                .stream().map(this::toResponse).toList();
    }

    @Override
    public CargoResponse trackCargo(String trackingNumber) {
        Cargo cargo = cargoRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No cargo found with tracking number: " + trackingNumber));
        return toResponse(cargo);
    }

    @Override
    public CargoResponse cancelBooking(String senderEmail, String cargoId) {
        User sender = getUser(senderEmail);
        Cargo cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo not found"));

        if (!cargo.getSenderId().equals(sender.getId()))
            throw new UnauthorizedException("You can only cancel your own bookings");

        if (cargo.getStatus() != CargoStatus.PENDING_DROP_OFF)
            throw new UnauthorizedException("Only pending bookings can be cancelled");

        cargo.setStatus(CargoStatus.CANCELLED);
        cargo.getStatusHistory().add(Cargo.StatusUpdate.builder()
                .status(CargoStatus.CANCELLED)
                .note("Cancelled by sender")
                .timestamp(LocalDateTime.now())
                .build());

        return toResponse(cargoRepository.save(cargo));
    }

    @Override
    public SenderStatsResponse getStats(String senderEmail) {
        User sender = getUser(senderEmail);
        String id = sender.getId();
        return SenderStatsResponse.builder()
                .totalShipments(cargoRepository.countBySenderId(id))
                .inTransit(cargoRepository.countBySenderIdAndStatus(id, CargoStatus.IN_TRANSIT)
                         + cargoRepository.countBySenderIdAndStatus(id, CargoStatus.DISPATCHED))
                .delivered(cargoRepository.countBySenderIdAndStatus(id, CargoStatus.DELIVERED))
                .pendingDropOff(cargoRepository.countBySenderIdAndStatus(id, CargoStatus.PENDING_DROP_OFF))
                .build();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private String generateTrackingNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder("RP").append(date);
        for (int i = 0; i < 6; i++) sb.append(chars.charAt(random.nextInt(chars.length())));
        String number = sb.toString();
        return cargoRepository.existsByTrackingNumber(number) ? generateTrackingNumber() : number;
    }

    private String statusLabel(CargoStatus s) {
        return switch (s) {
            case PENDING_DROP_OFF -> "Pending Drop-Off";
            case BOOKED           -> "Booked";
            case DISPATCHED       -> "Dispatched";
            case IN_TRANSIT       -> "In Transit";
            case ARRIVED          -> "Arrived at Destination";
            case DELIVERED        -> "Delivered";
            case CANCELLED        -> "Cancelled";
            case EXPIRED          -> "Expired";
        };
    }

    private CargoResponse toResponse(Cargo c) {
        return CargoResponse.builder()
                .id(c.getId())
                .trackingNumber(c.getTrackingNumber())
                .senderName(c.getSenderName())
                .senderPhone(c.getSenderPhone())
                .receiverName(c.getReceiverName())
                .receiverNic(c.getReceiverNic())
                .receiverEmail(c.getReceiverEmail())
                .receiverPhone(c.getReceiverPhone())
                .originStationName(c.getOriginStationName())
                .destinationStationName(c.getDestinationStationName())
                .category(c.getCategory())
                .declaredValue(c.getDeclaredValue())
                .weight(c.getWeight())
                .trainType(c.getTrainType())
                .description(c.getDescription())
                .transportCost(c.getTransportCost())
                .insuranceCost(c.getInsuranceCost())
                .totalCost(c.getTotalCost())
                .status(c.getStatus())
                .statusLabel(statusLabel(c.getStatus()))
                .statusHistory(c.getStatusHistory())
                .trainNumber(c.getTrainNumber())
                .expiresAt(c.getExpiresAt())
                .deliveredAt(c.getDeliveredAt())
                .createdAt(c.getCreatedAt())
                .build();
    }
}

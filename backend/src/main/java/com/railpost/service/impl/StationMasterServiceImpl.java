package com.railpost.service.impl;

import com.railpost.dto.request.CreateStationOfficerRequest;
import com.railpost.dto.request.WalkInCargoRequest;
import com.railpost.dto.response.CargoResponse;
import com.railpost.dto.response.StationDashboardResponse;
import com.railpost.dto.response.StationOfficerResponse;
import com.railpost.exception.ConflictException;
import com.railpost.exception.ResourceNotFoundException;
import com.railpost.exception.UnauthorizedException;
import com.railpost.model.document.Cargo;
import com.railpost.model.document.Station;
import com.railpost.model.document.User;
import com.railpost.model.enums.CargoStatus;
import com.railpost.model.enums.Role;
import com.railpost.model.enums.UserStatus;
import com.railpost.repository.CargoRepository;
import com.railpost.repository.StationRepository;
import com.railpost.repository.UserRepository;
import com.railpost.service.StationMasterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class StationMasterServiceImpl implements StationMasterService {

    private final UserRepository    userRepository;
    private final StationRepository stationRepository;
    private final CargoRepository   cargoRepository;
    private final PasswordEncoder   passwordEncoder;
    private final Random random = new Random();

    // ── Dashboard ─────────────────────────────────────────────────────────────
    @Override
    public StationDashboardResponse getDashboard(String masterEmail) {
        User master   = getMaster(masterEmail);
        Station station = getStation(master.getStationId());

        List<Cargo> allCargo = cargoRepository
                .findByOriginStationIdOrderByCreatedAtDesc(station.getId());

        long officers = userRepository
                .findByRoleAndStationId(Role.STATION_OFFICER, station.getId()).size();

        return StationDashboardResponse.builder()
                .stationName(station.getName())
                .stationCode(station.getCode())
                .todayRegistered(allCargo.stream()
                        .filter(c -> c.getCreatedAt() != null &&
                                c.getCreatedAt().toLocalDate()
                                        .equals(LocalDateTime.now().toLocalDate()))
                        .count())
                .todayDispatched(allCargo.stream()
                        .filter(c -> c.getStatus() == CargoStatus.DISPATCHED)
                        .count())
                .totalArrived(cargoRepository
                        .findByDestinationStationIdAndStatus(
                                station.getId(), CargoStatus.ARRIVED).size())
                .totalDelivered(allCargo.stream()
                        .filter(c -> c.getStatus() == CargoStatus.DELIVERED)
                        .count())
                .pendingDelivery(cargoRepository
                        .findByDestinationStationIdAndStatus(
                                station.getId(), CargoStatus.ARRIVED).size())
                .totalOfficers(officers)
                .build();
    }

    // ── Walk-in cargo registration ────────────────────────────────────────────
    @Override
    public CargoResponse registerWalkInCargo(String masterEmail, WalkInCargoRequest req) {
        User master   = getMaster(masterEmail);
        Station origin = getStation(master.getStationId());

        Station destination = stationRepository.findById(req.getDestinationStationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination station not found"));

        if (origin.getId().equals(destination.getId()))
            throw new UnauthorizedException("Origin and destination stations cannot be the same");

        // Cost calculation
        double baseRate = req.getTrainType().name().equals("EXPRESS") ? 15.0 : 8.0;
        double transportCost = Math.round(req.getWeight() * baseRate * 10.0) / 10.0;
        double insuranceCost = Math.round(req.getDeclaredValue() * 0.02 * 100.0) / 100.0;
        double totalCost     = Math.round((transportCost + insuranceCost) * 100.0) / 100.0;

        String trackingNumber = generateTrackingNumber();

        Cargo cargo = Cargo.builder()
                .trackingNumber(trackingNumber)
                .senderName(req.getSenderName())
                .senderPhone(req.getSenderPhone())
                .receiverName(req.getReceiverName())
                .receiverNic(req.getReceiverNic().toUpperCase())
                .receiverPhone(req.getReceiverPhone())
                .receiverEmail(req.getReceiverEmail())
                .originStationId(origin.getId())
                .originStationName(origin.getName())
                .destinationStationId(destination.getId())
                .destinationStationName(destination.getName())
                .category(req.getCategory())
                .weight(req.getWeight())
                .declaredValue(req.getDeclaredValue())
                .trainType(req.getTrainType())
                .description(req.getDescription())
                .transportCost(transportCost)
                .insuranceCost(insuranceCost)
                .totalCost(totalCost)
                .status(CargoStatus.BOOKED)
                .stationOfficerId(master.getId())
                .build();

        cargo.getStatusHistory().add(Cargo.StatusUpdate.builder()
                .status(CargoStatus.BOOKED)
                .location(origin.getName())
                .note("Walk-in registration by " + master.getFullName())
                .timestamp(LocalDateTime.now())
                .build());

        Cargo saved = cargoRepository.save(cargo);
        log.info("Walk-in cargo registered: {} at {}", trackingNumber, origin.getName());
        return toResponse(saved);
    }

    // ── Station cargo list ────────────────────────────────────────────────────
    @Override
    public List<CargoResponse> getStationCargo(String masterEmail) {
        User master = getMaster(masterEmail);
        return cargoRepository
                .findByOriginStationIdOrderByCreatedAtDesc(master.getStationId())
                .stream().map(this::toResponse).toList();
    }

    // ── Officer management ────────────────────────────────────────────────────
    @Override
    public StationOfficerResponse createOfficer(String masterEmail,
                                                CreateStationOfficerRequest req) {
        User master = getMaster(masterEmail);

        if (userRepository.existsByEmail(req.getEmail()))
            throw new ConflictException("Email already registered");
        if (userRepository.existsByNic(req.getNic().toUpperCase()))
            throw new ConflictException("NIC already registered");

        Station station = getStation(master.getStationId());

        User officer = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .nic(req.getNic().toUpperCase())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(Role.STATION_OFFICER)
                .stationId(station.getId())
                .status(UserStatus.ACTIVE)
                .build();

        User saved = userRepository.save(officer);
        log.info("Officer created: {} at {}", saved.getEmail(), station.getName());
        return toOfficerResponse(saved, station);
    }

    @Override
    public List<StationOfficerResponse> getMyOfficers(String masterEmail) {
        User master   = getMaster(masterEmail);
        Station station = getStation(master.getStationId());
        return userRepository
                .findByRoleAndStationId(Role.STATION_OFFICER, station.getId())
                .stream().map(u -> toOfficerResponse(u, station)).toList();
    }

    @Override
    public StationOfficerResponse toggleOfficerStatus(String masterEmail, String officerId) {
        User master  = getMaster(masterEmail);
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found"));

        if (!officer.getStationId().equals(master.getStationId()))
            throw new UnauthorizedException("Officer does not belong to your station");

        officer.setStatus(officer.getStatus() == UserStatus.ACTIVE
                ? UserStatus.SUSPENDED : UserStatus.ACTIVE);

        User saved    = userRepository.save(officer);
        Station station = getStation(master.getStationId());
        return toOfficerResponse(saved, station);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private User getMaster(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Station getStation(String stationId) {
        return stationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found"));
    }

    private String generateTrackingNumber() {
        String date  = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder("RP").append(date);
        for (int i = 0; i < 6; i++) sb.append(chars.charAt(random.nextInt(chars.length())));
        String number = sb.toString();
        return cargoRepository.existsByTrackingNumber(number)
                ? generateTrackingNumber() : number;
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
                .weight(c.getWeight())
                .declaredValue(c.getDeclaredValue())
                .trainType(c.getTrainType())
                .description(c.getDescription())
                .transportCost(c.getTransportCost())
                .insuranceCost(c.getInsuranceCost())
                .totalCost(c.getTotalCost())
                .status(c.getStatus())
                .statusLabel(c.getStatus().name().replace("_", " "))
                .statusHistory(c.getStatusHistory())
                .trainNumber(c.getTrainNumber())
                .createdAt(c.getCreatedAt())
                .build();
    }

    private StationOfficerResponse toOfficerResponse(User u, Station s) {
        return StationOfficerResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .nic(u.getNic())
                .stationId(u.getStationId())
                .stationName(s != null ? s.getName() : "—")
                .status(u.getStatus())
                .createdAt(u.getCreatedAt())
                .build();
    }
}

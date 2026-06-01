package com.railpost.service.impl;

import com.railpost.dto.request.CreateStationMasterRequest;
import com.railpost.dto.request.CreateStationRequest;
import com.railpost.dto.response.DashboardStatsResponse;
import com.railpost.dto.response.StationMasterResponse;
import com.railpost.dto.response.StationResponse;
import com.railpost.exception.ConflictException;
import com.railpost.exception.ResourceNotFoundException;
import com.railpost.model.document.Station;
import com.railpost.model.document.User;
import com.railpost.model.enums.Role;
import com.railpost.model.enums.StationStatus;
import com.railpost.model.enums.UserStatus;
import com.railpost.repository.StationRepository;
import com.railpost.repository.UserRepository;
import com.railpost.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final StationRepository stationRepository;
    private final UserRepository    userRepository;
    private final PasswordEncoder   passwordEncoder;

    // ── Dashboard ────────────────────────────────────────────────────────────
    @Override
    public DashboardStatsResponse getDashboardStats() {
        long totalStations   = stationRepository.count();
        long activeStations  = stationRepository.countByStatus(StationStatus.ACTIVE);
        long stationMasters  = userRepository.findByRole(Role.STATION_MASTER).size();
        long stationOfficers = userRepository.findByRole(Role.STATION_OFFICER).size();
        long totalUsers      = userRepository.count();

        List<DashboardStatsResponse.RecentActivityItem> activity = List.of(
            DashboardStatsResponse.RecentActivityItem.builder()
                .message("System running normally")
                .time("Now").type("config").build(),
            DashboardStatsResponse.RecentActivityItem.builder()
                .message("Admin session active")
                .time("Now").type("user").build()
        );

        return DashboardStatsResponse.builder()
                .totalStations(totalStations)
                .activeStations(activeStations)
                .totalStationMasters(stationMasters)
                .totalStationOfficers(stationOfficers)
                .totalUsers(totalUsers)
                .recentActivity(activity)
                .build();
    }

    // ── Stations ─────────────────────────────────────────────────────────────
    @Override
    public StationResponse createStation(CreateStationRequest request) {
        if (stationRepository.existsByCode(request.getCode()))
            throw new ConflictException("Station code '" + request.getCode() + "' already exists");

        Station station = Station.builder()
                .code(request.getCode().toUpperCase())
                .name(request.getName())
                .city(request.getCity())
                .province(request.getProvince())
                .address(request.getAddress())
                .phone(request.getPhone())
                .status(StationStatus.ACTIVE)
                .build();

        Station saved = stationRepository.save(station);
        log.info("Station created: {}", saved.getCode());
        return toStationResponse(saved);
    }

    @Override
    public List<StationResponse> getAllStations() {
        return stationRepository.findAll().stream()
                .map(this::toStationResponse).toList();
    }

    @Override
    public StationResponse toggleStationStatus(String stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found"));
        station.setStatus(station.getStatus() == StationStatus.ACTIVE
                ? StationStatus.INACTIVE : StationStatus.ACTIVE);
        return toStationResponse(stationRepository.save(station));
    }

    // ── Station Masters ───────────────────────────────────────────────────────
    @Override
    public StationMasterResponse createStationMaster(CreateStationMasterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new ConflictException("Email already registered");

        if (userRepository.existsByNic(req.getNic().toUpperCase()))
            throw new ConflictException("NIC already registered");

        Station station = stationRepository.findById(req.getStationId())
                .orElseThrow(() -> new ResourceNotFoundException("Station not found"));

        User master = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .nic(req.getNic().toUpperCase())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(Role.STATION_MASTER)
                .stationId(station.getId())
                .status(UserStatus.ACTIVE)
                .build();

        User saved = userRepository.save(master);
        log.info("Station Master created: {} → {}", saved.getEmail(), station.getName());
        return toMasterResponse(saved, station);
    }

    @Override
    public List<StationMasterResponse> getAllStationMasters() {
        return userRepository.findByRole(Role.STATION_MASTER).stream()
                .map(u -> {
                    Station station = u.getStationId() != null
                            ? stationRepository.findById(u.getStationId()).orElse(null) : null;
                    return toMasterResponse(u, station);
                }).toList();
    }

    @Override
    public StationMasterResponse toggleStationMasterStatus(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(user.getStatus() == UserStatus.ACTIVE
                ? UserStatus.SUSPENDED : UserStatus.ACTIVE);
        User saved = userRepository.save(user);
        Station station = saved.getStationId() != null
                ? stationRepository.findById(saved.getStationId()).orElse(null) : null;
        return toMasterResponse(saved, station);
    }

    @Override
    public StationMasterResponse reassignStation(String userId, String newStationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Station station = stationRepository.findById(newStationId)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found"));
        user.setStationId(station.getId());
        return toMasterResponse(userRepository.save(user), station);
    }

    // ── Mappers ───────────────────────────────────────────────────────────────
    private StationResponse toStationResponse(Station s) {
        return StationResponse.builder()
                .id(s.getId()).code(s.getCode()).name(s.getName())
                .city(s.getCity()).province(s.getProvince())
                .address(s.getAddress()).phone(s.getPhone())
                .status(s.getStatus()).createdAt(s.getCreatedAt())
                .build();
    }

    private StationMasterResponse toMasterResponse(User u, Station station) {
        return StationMasterResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .nic(u.getNic())
                .stationId(u.getStationId())
                .stationName(station != null ? station.getName() : "Unassigned")
                .status(u.getStatus())
                .createdAt(u.getCreatedAt())
                .build();
    }
}

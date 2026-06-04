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
    private final com.railpost.repository.TrainRepository trainRepository;
    private final com.railpost.repository.CostConfigRepository costConfigRepository;
    private final com.railpost.repository.CargoRepository cargoRepository;
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
    // ── Trains ────────────────────────────────────────────────────────────────
    @Override
    public com.railpost.dto.response.TrainResponse createTrain(com.railpost.dto.request.CreateTrainRequest request) {
        if (trainRepository.existsByTrainNo(request.getTrainNo())) {
            throw new ConflictException("Train number '" + request.getTrainNo() + "' already exists");
        }
        
        com.railpost.model.document.Train train = com.railpost.model.document.Train.builder()
                .trainNo(request.getTrainNo())
                .name(request.getName())
                .sourceStationId(request.getSourceStationId())
                .destinationStationId(request.getDestinationStationId())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .runsOn(request.getRunsOn())
                .status(com.railpost.model.enums.TrainStatus.ACTIVE)
                .build();
                
        com.railpost.model.document.Train saved = trainRepository.save(train);
        log.info("Train created: {}", saved.getTrainNo());
        return toTrainResponse(saved);
    }

    @Override
    public List<com.railpost.dto.response.TrainResponse> getAllTrains() {
        return trainRepository.findAll().stream()
                .map(this::toTrainResponse).toList();
    }

    @Override
    public com.railpost.dto.response.TrainResponse toggleTrainStatus(String trainId) {
        com.railpost.model.document.Train train = trainRepository.findById(trainId)
                .orElseThrow(() -> new ResourceNotFoundException("Train not found"));
        train.setStatus(train.getStatus() == com.railpost.model.enums.TrainStatus.ACTIVE
                ? com.railpost.model.enums.TrainStatus.INACTIVE : com.railpost.model.enums.TrainStatus.ACTIVE);
        return toTrainResponse(trainRepository.save(train));
    }

    // ── Cost Config ───────────────────────────────────────────────────────────
    @Override
    public com.railpost.dto.response.CostConfigResponse getCostConfig() {
        com.railpost.model.document.CostConfig config = costConfigRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    com.railpost.model.document.CostConfig newConfig = com.railpost.model.document.CostConfig.builder()
                            .baseWeightRate(100.0)
                            .baseDistanceRate(50.0)
                            .fragileMultiplier(1.5)
                            .perishableMultiplier(2.0)
                            .build();
                    return costConfigRepository.save(newConfig);
                });
        return toCostConfigResponse(config);
    }

    @Override
    public com.railpost.dto.response.CostConfigResponse updateCostConfig(com.railpost.dto.request.CostConfigRequest request) {
        com.railpost.model.document.CostConfig config = costConfigRepository.findAll().stream().findFirst()
                .orElse(new com.railpost.model.document.CostConfig());
                
        config.setBaseWeightRate(request.getBaseWeightRate());
        config.setBaseDistanceRate(request.getBaseDistanceRate());
        config.setFragileMultiplier(request.getFragileMultiplier());
        config.setPerishableMultiplier(request.getPerishableMultiplier());
        
        return toCostConfigResponse(costConfigRepository.save(config));
    }

    // ── Reports ───────────────────────────────────────────────────────────────
    @Override
    public com.railpost.dto.response.ReportSummaryResponse getReportsSummary() {
        List<com.railpost.model.document.Cargo> allCargo = cargoRepository.findAll();
        
        long totalShipments = allCargo.size();
        double totalRevenue = allCargo.stream().mapToDouble(c -> c.getTotalCost() != null ? c.getTotalCost() : 0.0).sum();
        double totalWeight = allCargo.stream().mapToDouble(c -> c.getWeight() != null ? c.getWeight() : 0.0).sum();
        
        java.util.Map<String, Long> statusDistribution = allCargo.stream()
                .filter(c -> c.getStatus() != null)
                .collect(java.util.stream.Collectors.groupingBy(c -> c.getStatus().name(), java.util.stream.Collectors.counting()));
                
        List<com.railpost.dto.response.ReportSummaryResponse.StationRevenueItem> stationRevenue = allCargo.stream()
                .filter(c -> c.getOriginStationId() != null)
                .collect(java.util.stream.Collectors.groupingBy(com.railpost.model.document.Cargo::getOriginStationId))
                .entrySet().stream()
                .map(entry -> {
                    String stationId = entry.getKey();
                    List<com.railpost.model.document.Cargo> cargos = entry.getValue();
                    Station station = stationRepository.findById(stationId).orElse(null);
                    
                    return com.railpost.dto.response.ReportSummaryResponse.StationRevenueItem.builder()
                            .stationId(stationId)
                            .stationCode(station != null ? station.getCode() : "Unknown")
                            .stationName(station != null ? station.getName() : "Unknown")
                            .shipmentsCount(cargos.size())
                            .revenue(cargos.stream().mapToDouble(c -> c.getTotalCost() != null ? c.getTotalCost() : 0.0).sum())
                            .weight(cargos.stream().mapToDouble(c -> c.getWeight() != null ? c.getWeight() : 0.0).sum())
                            .build();
                })
                .collect(java.util.stream.Collectors.toList());
                
        return com.railpost.dto.response.ReportSummaryResponse.builder()
                .totalShipments(totalShipments)
                .totalRevenue(totalRevenue)
                .totalWeight(totalWeight)
                .statusDistribution(statusDistribution)
                .stationRevenue(stationRevenue)
                .build();
    }

    private com.railpost.dto.response.TrainResponse toTrainResponse(com.railpost.model.document.Train t) {
        Station source = stationRepository.findById(t.getSourceStationId()).orElse(null);
        Station dest = stationRepository.findById(t.getDestinationStationId()).orElse(null);
        
        return com.railpost.dto.response.TrainResponse.builder()
                .id(t.getId())
                .trainNo(t.getTrainNo())
                .name(t.getName())
                .sourceStationId(t.getSourceStationId())
                .sourceStationName(source != null ? source.getName() : "Unknown")
                .destinationStationId(t.getDestinationStationId())
                .destinationStationName(dest != null ? dest.getName() : "Unknown")
                .departureTime(t.getDepartureTime())
                .arrivalTime(t.getArrivalTime())
                .runsOn(t.getRunsOn())
                .status(t.getStatus())
                .createdAt(t.getCreatedAt())
                .build();
    }

    private com.railpost.dto.response.CostConfigResponse toCostConfigResponse(com.railpost.model.document.CostConfig c) {
        return com.railpost.dto.response.CostConfigResponse.builder()
                .id(c.getId())
                .baseWeightRate(c.getBaseWeightRate())
                .baseDistanceRate(c.getBaseDistanceRate())
                .fragileMultiplier(c.getFragileMultiplier())
                .perishableMultiplier(c.getPerishableMultiplier())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}

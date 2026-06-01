package com.railpost.service;

import com.railpost.dto.request.CreateStationMasterRequest;
import com.railpost.dto.request.CreateStationRequest;
import com.railpost.dto.response.DashboardStatsResponse;
import com.railpost.dto.response.StationMasterResponse;
import com.railpost.dto.response.StationResponse;

import java.util.List;

public interface AdminService {
    // Dashboard
    DashboardStatsResponse getDashboardStats();

    // Stations
    StationResponse createStation(CreateStationRequest request);
    List<StationResponse> getAllStations();
    StationResponse toggleStationStatus(String stationId);

    // ── Station Masters ───────────────────────────────────────────────────────
    StationMasterResponse createStationMaster(CreateStationMasterRequest request);
    List<StationMasterResponse> getAllStationMasters();
    StationMasterResponse toggleStationMasterStatus(String userId);
    StationMasterResponse reassignStation(String userId, String newStationId);

    // ── Trains ────────────────────────────────────────────────────────────────
    com.railpost.dto.response.TrainResponse createTrain(com.railpost.dto.request.CreateTrainRequest request);
    List<com.railpost.dto.response.TrainResponse> getAllTrains();
    com.railpost.dto.response.TrainResponse toggleTrainStatus(String trainId);

    // ── Cost Config ───────────────────────────────────────────────────────────
    com.railpost.dto.response.CostConfigResponse getCostConfig();
    com.railpost.dto.response.CostConfigResponse updateCostConfig(com.railpost.dto.request.CostConfigRequest request);

    // ── Reports ───────────────────────────────────────────────────────────────
    com.railpost.dto.response.ReportSummaryResponse getReportsSummary();
}

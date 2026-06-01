package com.railpost.controller;

import com.railpost.dto.request.CreateStationMasterRequest;
import com.railpost.dto.request.CreateStationRequest;
import com.railpost.dto.response.ApiResponse;
import com.railpost.dto.response.DashboardStatsResponse;
import com.railpost.dto.response.StationMasterResponse;
import com.railpost.dto.response.StationResponse;
import com.railpost.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // ── Dashboard ─────────────────────────────────────────────────────────────
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    // ── Stations ──────────────────────────────────────────────────────────────
    @GetMapping("/stations")
    public ResponseEntity<ApiResponse<List<StationResponse>>> getStations() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllStations()));
    }

    @PostMapping("/stations")
    public ResponseEntity<ApiResponse<StationResponse>> createStation(
            @Valid @RequestBody CreateStationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Station created", adminService.createStation(request)));
    }

    @PatchMapping("/stations/{id}/toggle")
    public ResponseEntity<ApiResponse<StationResponse>> toggleStation(@PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.success("Status updated", adminService.toggleStationStatus(id)));
    }

    // ── Station Masters ───────────────────────────────────────────────────────
    @GetMapping("/station-masters")
    public ResponseEntity<ApiResponse<List<StationMasterResponse>>> getStationMasters() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllStationMasters()));
    }

    @PostMapping("/station-masters")
    public ResponseEntity<ApiResponse<StationMasterResponse>> createStationMaster(
            @Valid @RequestBody CreateStationMasterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Station Master created",
                        adminService.createStationMaster(request)));
    }

    @PatchMapping("/station-masters/{id}/toggle")
    public ResponseEntity<ApiResponse<StationMasterResponse>> toggleStationMaster(
            @PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.success("Status updated",
                        adminService.toggleStationMasterStatus(id)));
    }

    @PatchMapping("/station-masters/{id}/reassign")
    public ResponseEntity<ApiResponse<StationMasterResponse>> reassignStation(
            @PathVariable String id,
            @RequestParam String stationId) {
        return ResponseEntity.ok(
                ApiResponse.success("Station reassigned",
                        adminService.reassignStation(id, stationId)));
    }

    // ── Trains ────────────────────────────────────────────────────────────────
    @GetMapping("/trains")
    public ResponseEntity<ApiResponse<List<com.railpost.dto.response.TrainResponse>>> getTrains() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllTrains()));
    }

    @PostMapping("/trains")
    public ResponseEntity<ApiResponse<com.railpost.dto.response.TrainResponse>> createTrain(
            @Valid @RequestBody com.railpost.dto.request.CreateTrainRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Train created", adminService.createTrain(request)));
    }

    @PatchMapping("/trains/{id}/toggle")
    public ResponseEntity<ApiResponse<com.railpost.dto.response.TrainResponse>> toggleTrain(@PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.success("Status updated", adminService.toggleTrainStatus(id)));
    }

    // ── Cost Config ───────────────────────────────────────────────────────────
    @GetMapping("/cost-config")
    public ResponseEntity<ApiResponse<com.railpost.dto.response.CostConfigResponse>> getCostConfig() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getCostConfig()));
    }

    @PutMapping("/cost-config")
    public ResponseEntity<ApiResponse<com.railpost.dto.response.CostConfigResponse>> updateCostConfig(
            @Valid @RequestBody com.railpost.dto.request.CostConfigRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cost config updated", adminService.updateCostConfig(request)));
    }

    // ── Reports ───────────────────────────────────────────────────────────────
    @GetMapping("/reports/summary")
    public ResponseEntity<ApiResponse<com.railpost.dto.response.ReportSummaryResponse>> getReportsSummary() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getReportsSummary()));
    }
}

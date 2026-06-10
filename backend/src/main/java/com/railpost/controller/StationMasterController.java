package com.railpost.controller;

import com.railpost.dto.request.CreateStationOfficerRequest;
import com.railpost.dto.request.WalkInCargoRequest;
import com.railpost.dto.response.*;
import com.railpost.service.StationMasterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/station-master")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STATION_MASTER')")
public class StationMasterController {

    private final StationMasterService stationMasterService;
    private final com.railpost.repository.TrainRepository trainRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<StationDashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(
                ApiResponse.success(stationMasterService.getDashboard(user.getUsername())));
    }

    @PostMapping("/cargo/walk-in")
    public ResponseEntity<ApiResponse<CargoResponse>> registerWalkIn(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody WalkInCargoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Cargo registered",
                        stationMasterService.registerWalkInCargo(user.getUsername(), request)));
    }

    @GetMapping("/cargo")
    public ResponseEntity<ApiResponse<List<CargoResponse>>> getStationCargo(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(
                ApiResponse.success(stationMasterService.getStationCargo(user.getUsername())));
    }

    @GetMapping("/officers")
    public ResponseEntity<ApiResponse<List<StationOfficerResponse>>> getOfficers(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(
                ApiResponse.success(stationMasterService.getMyOfficers(user.getUsername())));
    }

    @PostMapping("/officers")
    public ResponseEntity<ApiResponse<StationOfficerResponse>> createOfficer(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody CreateStationOfficerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Officer created",
                        stationMasterService.createOfficer(user.getUsername(), request)));
    }

    @PatchMapping("/officers/{id}/toggle")
    public ResponseEntity<ApiResponse<StationOfficerResponse>> toggleOfficer(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.success("Status updated",
                        stationMasterService.toggleOfficerStatus(user.getUsername(), id)));
    }

    @GetMapping("/trains")
    public ResponseEntity<ApiResponse<List<com.railpost.model.document.Train>>> getTrains() {
        return ResponseEntity.ok(ApiResponse.success(
                "Trains retrieved successfully",
                trainRepository.findAll()));
    }
}

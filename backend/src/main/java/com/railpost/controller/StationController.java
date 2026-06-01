package com.railpost.controller;

import com.railpost.dto.response.ApiResponse;
import com.railpost.dto.response.StationResponse;
import com.railpost.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stations")
@RequiredArgsConstructor
public class StationController {

    private final AdminService adminService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<StationResponse>>> getStations() {
        return ResponseEntity.ok(
                ApiResponse.success(adminService.getAllStations()));
    }
}
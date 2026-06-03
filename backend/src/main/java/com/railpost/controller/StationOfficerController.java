package com.railpost.controller;

import com.railpost.dto.request.UpdateCargoStatusRequest;
import com.railpost.dto.request.VerifyOtpRequest;
import com.railpost.dto.response.ApiResponse;
import com.railpost.dto.response.CargoResponse;
import com.railpost.service.StationOfficerService;
import jakarta.validation.Valid;
import com.railpost.repository.TrainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/officer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STATION_OFFICER')")
public class StationOfficerController {

    private final StationOfficerService officerService;
    private final TrainRepository trainRepository;

    @GetMapping("/cargo/{trackingNumber}")
    public ResponseEntity<ApiResponse<CargoResponse>> getCargo(
            @PathVariable String trackingNumber) {
        return ResponseEntity.ok(ApiResponse.success(
                officerService.getCargoByTrackingNumber(trackingNumber)));
    }

    @PatchMapping("/cargo/{trackingNumber}/status")
    public ResponseEntity<ApiResponse<CargoResponse>> updateCargoStatus(
            @PathVariable String trackingNumber,
            @Valid @RequestBody UpdateCargoStatusRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Cargo status updated",
                officerService.updateCargoStatus(trackingNumber, request, user.getUsername())));
    }

    @PostMapping("/cargo/dispatch")
    public ResponseEntity<ApiResponse<java.util.List<CargoResponse>>> dispatchCargo(
            @Valid @RequestBody com.railpost.dto.request.DispatchCargoRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Cargo dispatched successfully",
                officerService.dispatchCargo(request, user.getUsername())));
    }

    @GetMapping("/cargo/forecast")
    public ResponseEntity<ApiResponse<com.railpost.dto.response.CargoForecastResponse>> getIncomingForecast(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Forecast retrieved",
                officerService.getIncomingForecast(user.getUsername())));
    }

    @PostMapping("/cargo/{trackingNumber}/otp")
    public ResponseEntity<ApiResponse<String>> generateOtp(
            @PathVariable String trackingNumber,
            @AuthenticationPrincipal UserDetails user) {
        String otp = officerService.generateDeliveryOtp(trackingNumber, user.getUsername());
        // In a real system, the OTP is not returned in the API, it's sent via SMS.
        // Returning it here for testing/demo purposes.
        return ResponseEntity.ok(ApiResponse.success("OTP sent to receiver's mobile (Demo: " + otp + ")", otp));
    }

    @PostMapping("/cargo/{trackingNumber}/deliver")
    public ResponseEntity<ApiResponse<CargoResponse>> deliverCargo(
            @PathVariable String trackingNumber,
            @Valid @RequestBody VerifyOtpRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Cargo delivered successfully",
                officerService.verifyOtpAndDeliver(trackingNumber, request, user.getUsername())));
    }

    @GetMapping("/trains")
    public ResponseEntity<ApiResponse<java.util.List<com.railpost.model.document.Train>>> getTrains() {
        return ResponseEntity.ok(ApiResponse.success(
                "Trains retrieved successfully",
                trainRepository.findAll()));
    }
}

package com.railpost.controller;

import com.railpost.dto.response.ApiResponse;
import com.railpost.dto.response.CargoResponse;
import com.railpost.service.StationOfficerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final StationOfficerService officerService;

    @GetMapping("/cargo/track/{trackingNumber}")
    public ResponseEntity<ApiResponse<CargoResponse>> publicTrackCargo(
            @PathVariable String trackingNumber) {
        // We reuse the getCargoByTrackingNumber from officer service, 
        // as it simply fetches by tracking number.
        // If we needed to mask data for public view, we would do it here.
        CargoResponse response = officerService.getCargoByTrackingNumber(trackingNumber);
        
        // Mask sender/receiver data for privacy
        if (response.getSenderName() != null && response.getSenderName().length() > 2) {
            response.setSenderName(response.getSenderName().charAt(0) + "***" + response.getSenderName().substring(response.getSenderName().length() - 1));
        }
        if (response.getReceiverName() != null && response.getReceiverName().length() > 2) {
            response.setReceiverName(response.getReceiverName().charAt(0) + "***" + response.getReceiverName().substring(response.getReceiverName().length() - 1));
        }
        response.setSenderPhone("********" + (response.getSenderPhone() != null && response.getSenderPhone().length() >= 2 ? response.getSenderPhone().substring(response.getSenderPhone().length() - 2) : ""));
        response.setReceiverPhone("********" + (response.getReceiverPhone() != null && response.getReceiverPhone().length() >= 2 ? response.getReceiverPhone().substring(response.getReceiverPhone().length() - 2) : ""));
        response.setReceiverNic("*********");
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

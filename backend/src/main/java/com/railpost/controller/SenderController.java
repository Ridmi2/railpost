package com.railpost.controller;

import com.railpost.dto.request.BookCargoRequest;
import com.railpost.dto.response.ApiResponse;
import com.railpost.dto.response.CargoResponse;
import com.railpost.dto.response.SenderStatsResponse;
import com.railpost.service.SenderService;
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
@RequestMapping("/api/v1/sender")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SENDER')")
public class SenderController {

    private final SenderService senderService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<SenderStatsResponse>> getStats(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(
                ApiResponse.success(senderService.getStats(user.getUsername())));
    }

    @PostMapping("/cargo/book")
    public ResponseEntity<ApiResponse<CargoResponse>> bookCargo(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody BookCargoRequest request) {
        CargoResponse response = senderService.bookCargo(user.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Cargo booked successfully", response));
    }

    @GetMapping("/shipments")
    public ResponseEntity<ApiResponse<List<CargoResponse>>> getMyShipments(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Shipments retrieved", senderService.getMyShipments(user.getUsername())));
    }

    @GetMapping("/incoming")
    public ResponseEntity<ApiResponse<List<CargoResponse>>> getIncomingShipments(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(ApiResponse.success(
                "Incoming shipments retrieved", senderService.getIncomingShipments(user.getUsername())));
    }

    @GetMapping("/cargo/track/{trackingNumber}")
    public ResponseEntity<ApiResponse<CargoResponse>> track(
            @PathVariable String trackingNumber) {
        return ResponseEntity.ok(
                ApiResponse.success(senderService.trackCargo(trackingNumber)));
    }

    @PostMapping("/cargo/track/{trackingNumber}/share")
    public ResponseEntity<ApiResponse<Void>> shareQrCode(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String trackingNumber,
            @RequestBody java.util.Map<String, String> requestBody) {
        senderService.shareQrCode(user.getUsername(), trackingNumber, requestBody.get("email"));
        return ResponseEntity.ok(ApiResponse.success("QR Code shared successfully", null));
    }

    @PatchMapping("/cargo/{cargoId}/cancel")
    public ResponseEntity<ApiResponse<CargoResponse>> cancel(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String cargoId) {
        return ResponseEntity.ok(
                ApiResponse.success("Booking cancelled",
                        senderService.cancelBooking(user.getUsername(), cargoId)));
    }
}

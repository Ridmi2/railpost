package com.railpost.service;

import com.railpost.dto.request.BookCargoRequest;
import com.railpost.dto.response.CargoResponse;
import com.railpost.dto.response.SenderStatsResponse;

import java.util.List;

public interface SenderService {
    CargoResponse bookCargo(String senderEmail, BookCargoRequest request);
    List<CargoResponse> getMyShipments(String senderEmail);
    List<CargoResponse> getIncomingShipments(String userEmail);
    CargoResponse trackCargo(String trackingNumber);
    CargoResponse cancelBooking(String senderEmail, String cargoId);
    void shareQrCode(String senderEmail, String trackingNumber, String recipientEmail);
    SenderStatsResponse getStats(String senderEmail);
}

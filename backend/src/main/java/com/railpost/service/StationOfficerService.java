package com.railpost.service;

import com.railpost.dto.request.UpdateCargoStatusRequest;
import com.railpost.dto.request.VerifyOtpRequest;
import com.railpost.dto.response.CargoResponse;

public interface StationOfficerService {

    CargoResponse getCargoByTrackingNumber(String trackingNumber);

    CargoResponse updateCargoStatus(String trackingNumber, UpdateCargoStatusRequest request, String officerUsername);

    String generateDeliveryOtp(String trackingNumber, String officerUsername);

    CargoResponse verifyOtpAndDeliver(String trackingNumber, VerifyOtpRequest request, String officerUsername);

}

package com.railpost.service;

import com.railpost.dto.request.UpdateCargoStatusRequest;
import com.railpost.dto.request.VerifyOtpRequest;
import com.railpost.dto.request.DispatchCargoRequest;
import com.railpost.dto.response.CargoForecastResponse;
import com.railpost.dto.response.CargoResponse;

import java.util.List;

public interface StationOfficerService {

    CargoResponse getCargoByTrackingNumber(String trackingNumber);

    CargoResponse updateCargoStatus(String trackingNumber, UpdateCargoStatusRequest request, String officerUsername);

    String generateDeliveryOtp(String trackingNumber, String officerUsername);

    CargoResponse verifyOtpAndDeliver(String trackingNumber, VerifyOtpRequest request, String officerUsername);

    List<CargoResponse> dispatchCargo(DispatchCargoRequest request, String officerUsername);

    CargoForecastResponse getIncomingForecast(String officerUsername);

}

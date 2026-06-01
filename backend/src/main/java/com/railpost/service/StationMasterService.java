package com.railpost.service;

import com.railpost.dto.request.CreateStationOfficerRequest;
import com.railpost.dto.request.WalkInCargoRequest;
import com.railpost.dto.response.CargoResponse;
import com.railpost.dto.response.StationDashboardResponse;
import com.railpost.dto.response.StationOfficerResponse;

import java.util.List;

public interface StationMasterService {
    StationDashboardResponse getDashboard(String masterEmail);
    CargoResponse registerWalkInCargo(String masterEmail, WalkInCargoRequest request);
    List<CargoResponse> getStationCargo(String masterEmail);
    StationOfficerResponse createOfficer(String masterEmail, CreateStationOfficerRequest request);
    List<StationOfficerResponse> getMyOfficers(String masterEmail);
    StationOfficerResponse toggleOfficerStatus(String masterEmail, String officerId);
}

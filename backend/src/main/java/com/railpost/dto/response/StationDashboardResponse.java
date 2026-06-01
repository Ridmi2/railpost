package com.railpost.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StationDashboardResponse {
    private String stationName;
    private String stationCode;
    private long todayRegistered;
    private long todayDispatched;
    private long totalArrived;
    private long totalDelivered;
    private long pendingDelivery;
    private long totalOfficers;
}

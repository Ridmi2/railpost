package com.railpost.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class ReportSummaryResponse {
    private long totalShipments;
    private double totalRevenue;
    private double totalWeight;
    private Map<String, Long> statusDistribution;
    private List<StationRevenueItem> stationRevenue;

    @Getter
    @Builder
    public static class StationRevenueItem {
        private String stationId;
        private String stationCode;
        private String stationName;
        private long shipmentsCount;
        private double revenue;
        private double weight;
    }
}

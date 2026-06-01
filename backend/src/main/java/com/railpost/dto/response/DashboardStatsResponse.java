package com.railpost.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DashboardStatsResponse {

    private long totalStations;
    private long activeStations;
    private long totalStationMasters;
    private long totalStationOfficers;
    private long totalUsers;
    private List<RecentActivityItem> recentActivity;

    @Getter
    @Builder
    public static class RecentActivityItem {
        private String message;
        private String time;
        private String type;   // "station" | "user" | "config"
    }
}

package com.railpost.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CargoForecastResponse {
    private String destinationStationName;
    private long incomingCount;
    private long expectedTodayCount;
}

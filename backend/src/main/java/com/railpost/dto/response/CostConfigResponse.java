package com.railpost.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CostConfigResponse {
    private String id;
    private double baseWeightRate;
    private double baseDistanceRate;
    private double fragileMultiplier;
    private double perishableMultiplier;
    private LocalDateTime updatedAt;
}

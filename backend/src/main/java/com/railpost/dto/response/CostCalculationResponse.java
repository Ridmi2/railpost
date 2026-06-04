package com.railpost.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CostCalculationResponse {
    private Double transportCost;
    private Double insuranceCost;
    private Double totalCost;
}

package com.railpost.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CostConfigRequest {

    @Positive(message = "Base weight rate must be positive")
    private double baseWeightRate;

    @Positive(message = "Base distance rate must be positive")
    private double baseDistanceRate;

    @Positive(message = "Fragile multiplier must be positive")
    private double fragileMultiplier;

    @Positive(message = "Perishable multiplier must be positive")
    private double perishableMultiplier;
}

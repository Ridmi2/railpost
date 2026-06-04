package com.railpost.dto.request;

import com.railpost.model.enums.CargoCategory;
import com.railpost.model.enums.TrainType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CostCalculationRequest {
    @NotNull(message = "Distance is required")
    @DecimalMin(value = "0.1", message = "Distance must be positive")
    private Double distance;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.1", message = "Weight must be positive")
    private Double weight;

    @NotNull(message = "Train type is required")
    private TrainType trainType;

    @NotNull(message = "Cargo category is required")
    private CargoCategory category;

    @NotNull(message = "Declared value is required")
    @DecimalMin(value = "0.0", message = "Declared value cannot be negative")
    private Double declaredValue;
}

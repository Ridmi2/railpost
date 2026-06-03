package com.railpost.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DispatchCargoRequest {
    @NotBlank(message = "Train ID is required")
    private String trainId;

    private List<String> cargoTrackingNumbers;
}

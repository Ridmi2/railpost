package com.railpost.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateTrainRequest {

    @NotBlank(message = "Train number is required")
    private String trainNo;

    @NotBlank(message = "Train name is required")
    private String name;

    @NotBlank(message = "Source station ID is required")
    private String sourceStationId;

    @NotBlank(message = "Destination station ID is required")
    private String destinationStationId;

    @NotBlank(message = "Departure time is required")
    private String departureTime;

    @NotBlank(message = "Arrival time is required")
    private String arrivalTime;

    @NotEmpty(message = "Operating days (runsOn) is required")
    private List<String> runsOn;
}

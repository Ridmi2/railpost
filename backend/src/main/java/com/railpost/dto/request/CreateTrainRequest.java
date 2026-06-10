package com.railpost.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import com.railpost.model.enums.TrainType;

import java.util.List;

@Getter
@Setter
public class CreateTrainRequest {

    @Getter @Setter
    public static class TripDto {
        @NotBlank(message = "Trip name is required")
        private String tripName;
        @NotBlank(message = "Departure time is required")
        private String departureTime;
        @NotBlank(message = "Arrival time is required")
        private String arrivalTime;
        @NotBlank(message = "Direction is required")
        private String direction;
        private java.util.Map<String, String> stationTimes = new java.util.HashMap<>();
    }

    @NotBlank(message = "Train name is required")
    private String name;

    @NotBlank(message = "Source station ID is required")
    private String sourceStationId;

    @NotBlank(message = "Destination station ID is required")
    private String destinationStationId;



    @NotEmpty(message = "Operating days (runsOn) is required")
    private List<String> runsOn;

    @NotEmpty(message = "At least one trip is required")
    private List<TripDto> trips;

    @NotBlank(message = "Line is required")
    private String line;

    @NotNull(message = "Train type is required")
    private TrainType trainType;

    private List<String> stopStations;
}

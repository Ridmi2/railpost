package com.railpost.dto.response;

import com.railpost.model.enums.TrainStatus;
import com.railpost.model.enums.TrainType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class TrainResponse {

    @Getter @Builder
    public static class TripDto {
        private String tripName;
        private String departureTime;
        private String arrivalTime;
        private String direction;
        private java.util.Map<String, String> stationTimes;
    }
    private String id;
    private String trainNo;
    private String name;
    private String sourceStationId;
    private String sourceStationName;
    private String destinationStationId;
    private String destinationStationName;
    private List<TripDto> trips;
    private String line;
    private TrainType trainType;
    private List<String> stopStations;
    private List<String> runsOn;
    private TrainStatus status;
    private LocalDateTime createdAt;
}

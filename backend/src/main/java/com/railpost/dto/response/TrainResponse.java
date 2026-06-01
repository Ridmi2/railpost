package com.railpost.dto.response;

import com.railpost.model.enums.TrainStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class TrainResponse {
    private String id;
    private String trainNo;
    private String name;
    private String sourceStationId;
    private String sourceStationName;
    private String destinationStationId;
    private String destinationStationName;
    private String departureTime;
    private String arrivalTime;
    private List<String> runsOn;
    private TrainStatus status;
    private LocalDateTime createdAt;
}

package com.railpost.model.document;

import com.railpost.model.enums.TrainStatus;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

import com.railpost.model.enums.TrainType;

@Document(collection = "trains")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Train {

    @Id
    private String id;

    @Indexed(unique = true)
    @Field("train_no")
    private String trainNo;

    private String name;

    @Field("source_station_id")
    private String sourceStationId;

    @Field("destination_station_id")
    private String destinationStationId;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Trip {
        private String tripName;
        private String departureTime;
        private String arrivalTime;
        private String direction; // "OUTBOUND" or "RETURN"
        @Builder.Default
        private java.util.Map<String, String> stationTimes = new java.util.HashMap<>();
    }

    @Field("trips")
    private List<Trip> trips;

    private String line;

    @Field("train_type")
    private TrainType trainType;

    @Field("stop_stations")
    private List<String> stopStations;

    @Field("runs_on")
    private List<String> runsOn; // e.g. ["Monday", "Tuesday"] or ["Daily"]

    @Builder.Default
    private TrainStatus status = TrainStatus.ACTIVE;

    @CreatedDate
    @Field("created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Field("updated_at")
    private LocalDateTime updatedAt;
}

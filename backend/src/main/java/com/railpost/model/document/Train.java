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

    @Field("departure_time")
    private String departureTime;

    @Field("arrival_time")
    private String arrivalTime;

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

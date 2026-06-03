package com.railpost.model.document;

import com.railpost.model.enums.TrackingAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tracking_logs")
public class TrackingLog {
    @Id
    private String id;
    
    private String cargoId;
    
    private String stationId;
    private String stationName;
    
    private String trainId;
    private String trainNumber;
    
    private String scannedByUserId;
    private String scannedByUserName;
    
    private TrackingAction action;
    private String note;
    
    @CreatedDate
    private LocalDateTime timestamp;
}

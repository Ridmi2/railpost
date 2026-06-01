package com.railpost.dto.response;

import com.railpost.model.document.Cargo;
import com.railpost.model.enums.CargoCategory;
import com.railpost.model.enums.CargoStatus;
import com.railpost.model.enums.TrainType;
import lombok.Builder;
import lombok.Getter;

import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class CargoResponse {
    private String id;
    private String trackingNumber;

    // Sender
    private String senderName;
    private String senderPhone;

    // Receiver
    private String receiverName;
    private String receiverNic;
    private String receiverEmail;
    private String receiverPhone;

    // Stations
    private String originStationName;
    private String destinationStationName;

    // Cargo
    private CargoCategory category;
    private Double declaredValue;
    private Double weight;
    private TrainType trainType;
    private String description;

    // Cost
    private Double transportCost;
    private Double insuranceCost;
    private Double totalCost;

    // Status
    private CargoStatus status;
    private String statusLabel;
    private List<Cargo.StatusUpdate> statusHistory;

    private String trainNumber;
    private String qrCode;
    private LocalDateTime expiresAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt;
}

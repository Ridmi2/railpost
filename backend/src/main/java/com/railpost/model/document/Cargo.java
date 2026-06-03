package com.railpost.model.document;

import com.railpost.model.enums.CargoCategory;
import com.railpost.model.enums.CargoStatus;
import com.railpost.model.enums.TrainType;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "cargo")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cargo {

    @Id
    private String id;

    @Indexed(unique = true)
    @Field("tracking_number")
    private String trackingNumber;

    // ── Sender ────────────────────────────────────────────────────────────
    @Field("sender_id")
    private String senderId;

    @Field("sender_name")
    private String senderName;

    @Field("sender_phone")
    private String senderPhone;

    // ── Receiver ──────────────────────────────────────────────────────────
    @Field("receiver_name")
    private String receiverName;

    @Field("receiver_nic")
    private String receiverNic;

    @Field("receiver_email")
    private String receiverEmail;

    @Field("receiver_phone")
    private String receiverPhone;

    // ── Stations ──────────────────────────────────────────────────────────
    @Field("origin_station_id")
    private String originStationId;

    @Field("origin_station_name")
    private String originStationName;

    @Field("destination_station_id")
    private String destinationStationId;

    @Field("destination_station_name")
    private String destinationStationName;

    // ── Cargo details ─────────────────────────────────────────────────────
    private CargoCategory category;

    @Field("declared_value")
    private Double declaredValue;

    private Double weight;            // set by station officer

    @Field("train_type")
    private TrainType trainType;      // set by station officer

    private String description;

    // ── Cost (calculated by station officer) ──────────────────────────────
    @Field("transport_cost")
    private Double transportCost;

    @Field("insurance_cost")
    private Double insuranceCost;

    @Field("total_cost")
    private Double totalCost;

    // ── Status & tracking ─────────────────────────────────────────────────
    @Builder.Default
    private CargoStatus status = CargoStatus.PENDING_DROP_OFF;

    @Builder.Default
    @Field("status_history")
    private List<StatusUpdate> statusHistory = new ArrayList<>();

    @Field("current_train_id")
    private String currentTrainId;

    @Field("train_number")
    private String trainNumber;

    @Field("qr_code")
    private String qrCode;

    // ── Expiry (3 days from booking for online bookings) ──────────────────
    @Field("expires_at")
    private LocalDateTime expiresAt;

    // ── Delivery ──────────────────────────────────────────────────────────
    @Field("delivery_otp")
    private String deliveryOtp;

    @Field("otp_expires_at")
    private LocalDateTime otpExpiresAt;

    @Field("delivered_at")
    private LocalDateTime deliveredAt;

    @Field("station_officer_id")
    private String stationOfficerId;

    @CreatedDate
    @Field("created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Field("updated_at")
    private LocalDateTime updatedAt;

    // ── Embedded status update ─────────────────────────────────────────────
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class StatusUpdate {
        private CargoStatus status;
        private String location;
        private String note;
        private LocalDateTime timestamp;
    }
}

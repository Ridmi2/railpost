package com.railpost.dto.request;

import com.railpost.model.enums.CargoCategory;
import com.railpost.model.enums.TrainType;
import com.railpost.util.validator.ValidGmailEmail;
import com.railpost.util.validator.ValidSriLankanPhone;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WalkInCargoRequest {

    // Sender info (walk-in, may not have account)
    @NotBlank(message = "Sender name is required")
    @Size(min = 3, max = 100)
    private String senderName;

    @NotBlank(message = "Sender phone is required")
    @ValidSriLankanPhone
    private String senderPhone;

    @ValidGmailEmail
    private String senderEmail; // optional

    // Receiver info
    @NotBlank(message = "Receiver name is required")
    @Size(min = 3, max = 100)
    private String receiverName;

    @NotBlank(message = "Receiver NIC is required")
    @Pattern(regexp = "^(\\d{9}[VvXx]|\\d{12})$",
             message = "Invalid NIC — 9 digits + V/X (old) or 12 digits (new)")
    private String receiverNic;

    @NotBlank(message = "Receiver phone is required")
    @ValidSriLankanPhone
    private String receiverPhone;

    @ValidGmailEmail
    private String receiverEmail; // optional

    // Cargo details
    @NotNull(message = "Category is required")
    private CargoCategory category;

    @NotBlank(message = "Destination station is required")
    private String destinationStationId;

    @NotNull(message = "Distance is required")
    @DecimalMin(value = "0.1", message = "Distance must be positive")
    private Double distance;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.1", message = "Weight must be at least 0.1 kg")
    @DecimalMax(value = "1000.0", message = "Weight cannot exceed 1000 kg")
    private Double weight;

    @NotNull(message = "Declared value is required")
    @DecimalMin(value = "1.0", message = "Declared value must be at least 1")
    private Double declaredValue;

    @NotNull(message = "Train type is required")
    private TrainType trainType;

    @Size(max = 500)
    private String description;
}

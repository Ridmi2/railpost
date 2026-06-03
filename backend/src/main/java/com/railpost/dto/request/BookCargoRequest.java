package com.railpost.dto.request;

import com.railpost.model.enums.CargoCategory;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookCargoRequest {

    // Receiver details
    @NotBlank(message = "Receiver name is required")
    @Size(min = 3, max = 100, message = "Receiver name must be 3-100 characters")
    private String receiverName;

    @NotBlank(message = "Receiver NIC is required")
    @Pattern(regexp = "^(\\d{9}[VvXx]|\\d{12})$",
             message = "Invalid NIC — 9 digits + V/X (old) or 12 digits (new)")
    private String receiverNic;

    @NotBlank(message = "Receiver email is required")
    @Email(message = "Invalid receiver email")
    private String receiverEmail;

    @NotBlank(message = "Receiver phone is required")
    @Pattern(regexp = "^0[0-9]{9}$",
             message = "Phone must be 10 digits starting with 0")
    private String receiverPhone;

    // Cargo details
    @NotNull(message = "Cargo category is required")
    private CargoCategory category;

    @NotBlank(message = "Origin station is required")
    private String originStationId;

    @NotBlank(message = "Destination station is required")
    private String destinationStationId;

    @NotNull(message = "Declared value is required")
    @DecimalMin(value = "1.0", message = "Declared value must be at least 1")
    @DecimalMax(value = "10000000.0", message = "Declared value too high")
    private Double declaredValue;

    @Size(max = 500, message = "Description too long")
    private String description;
}

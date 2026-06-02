package com.railpost.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateStationMasterRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 100, message = "Name must be 3-100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @com.railpost.util.validator.ValidGmailEmail
    private String email;

    @NotBlank(message = "Phone is required")
    @com.railpost.util.validator.ValidSriLankanPhone
    private String phone;

    @NotBlank(message = "NIC is required")
    @Pattern(regexp = "^(\\d{9}[VvXx]|\\d{12})$",
             message = "Invalid NIC — 9 digits + V/X (old) or 12 digits (new)")
    private String nic;

    @NotBlank(message = "Station is required")
    private String stationId;

    @NotBlank(message = "Password is required")
    @com.railpost.util.validator.ValidStrongPassword
    private String password;
}

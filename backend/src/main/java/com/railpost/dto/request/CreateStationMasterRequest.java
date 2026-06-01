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
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^0[0-9]{9}$",
             message = "Phone must be 10 digits starting with 0")
    private String phone;

    @NotBlank(message = "NIC is required")
    @Pattern(regexp = "^(\\d{9}[VvXx]|\\d{12})$",
             message = "Invalid NIC — 9 digits + V/X (old) or 12 digits (new)")
    private String nic;

    @NotBlank(message = "Station is required")
    private String stationId;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}

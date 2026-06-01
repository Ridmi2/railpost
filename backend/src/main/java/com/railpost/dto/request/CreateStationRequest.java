package com.railpost.dto.request;

import com.railpost.util.validator.ValidSriLankanPhone;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateStationRequest {

    @NotBlank(message = "Station code is required")
    @Size(min = 2, max = 8, message = "Code must be 2-8 characters")
    @Pattern(regexp = "^[A-Z0-9]+$", message = "Code must be uppercase letters and numbers only")
    private String code;

    @NotBlank(message = "Station name is required")
    private String name;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Province is required")
    private String province;

    private String address;

    @ValidSriLankanPhone
    private String phone;
}

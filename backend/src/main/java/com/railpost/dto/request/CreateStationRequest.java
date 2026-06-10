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

    private String code;

    @NotBlank(message = "Railway line is required")
    private String line;
    
    private Double distanceToFort;

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

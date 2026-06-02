package com.railpost.dto.request;

import com.railpost.util.validator.ValidSriLankanPhone;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 100, message = "Name must be 3-100 characters")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    @ValidSriLankanPhone
    private String phone;
}

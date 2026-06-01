package com.railpost.dto.request;

import com.railpost.util.validator.ValidGmailEmail;
import com.railpost.util.validator.ValidSriLankanPhone;
import com.railpost.util.validator.ValidStrongPassword;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateMasterRequest {

    @NotBlank(message = "Email is required")
    @ValidGmailEmail
    private String email;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be 3-20 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @ValidStrongPassword
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    @ValidSriLankanPhone
    private String phone;

    @NotBlank(message = "Station ID is required")
    private String stationId;
}

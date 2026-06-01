package com.railpost.dto.request;

import com.railpost.util.validator.ValidGmailEmail;
import com.railpost.util.validator.ValidSriLankanPhone;
import com.railpost.util.validator.ValidStrongPassword;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateStationOfficerRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 100, message = "Name must be 3-100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @ValidGmailEmail
    private String email;

    @NotBlank(message = "Phone is required")
    @ValidSriLankanPhone
    private String phone;

    @NotBlank(message = "NIC is required")
    @Pattern(regexp = "^(\\d{9}[VvXx]|\\d{12})$",
             message = "Invalid NIC — 9 digits + V/X (old) or 12 digits (new)")
    private String nic;

    @NotBlank(message = "Password is required")
    @ValidStrongPassword
    private String password;
}

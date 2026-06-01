package com.railpost.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 100, message = "Name must be 3-100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s.'\\-]+$", message = "Name contains invalid characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^0[0-9]{9}$",
             message = "Phone must be a valid 10-digit Sri Lanka number starting with 0")
    private String phone;

    // Old NIC: 9 digits + V/X  |  New NIC: 12 digits
    @NotBlank(message = "NIC is required")
    @Pattern(regexp = "^(\\d{9}[VvXx]|\\d{12})$",
             message = "Invalid NIC — use 9 digits + V/X (old) or 12 digits (new)")
    private String nic;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = ".*[A-Z].*", message = "Password must contain at least one uppercase letter")
    @Pattern(regexp = ".*[0-9].*", message = "Password must contain at least one number")
    private String password;
}

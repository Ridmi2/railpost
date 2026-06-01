package com.railpost.dto.request;

import com.railpost.util.validator.ValidGmailEmail;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @ValidGmailEmail
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
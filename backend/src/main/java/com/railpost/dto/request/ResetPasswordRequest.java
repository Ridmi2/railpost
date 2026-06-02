package com.railpost.dto.request;

import com.railpost.util.validator.ValidStrongPassword;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "Token is required")
    private String token;

    @NotBlank(message = "New password is required")
    @ValidStrongPassword
    private String newPassword;
}

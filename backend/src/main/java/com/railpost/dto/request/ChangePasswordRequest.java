package com.railpost.dto.request;

import com.railpost.util.validator.ValidStrongPassword;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {

    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @ValidStrongPassword
    private String newPassword;
}

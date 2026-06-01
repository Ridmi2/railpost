package com.railpost.dto.response;

import com.railpost.model.enums.Role;
import com.railpost.model.enums.UserStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String username;
    private String fullName;
    private String phone;
    private Role role;
    private String stationId;
    private String stationName;
    private UserStatus status;
    private LocalDateTime createdAt;
}

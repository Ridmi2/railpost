package com.railpost.dto.response;

import com.railpost.model.enums.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private String token;
    private String userId;
    private String email;
    private String fullName;
    private Role role;
    private String stationId;
}
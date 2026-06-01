package com.railpost.dto.response;

import com.railpost.model.enums.UserStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class StationMasterResponse {
    private String id;
    private String fullName;
    private String email;
    private String phone;
    private String nic;
    private String stationId;
    private String stationName;
    private UserStatus status;
    private LocalDateTime createdAt;
}

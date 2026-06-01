package com.railpost.dto.response;

import com.railpost.model.enums.StationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class StationResponse {
    private String id;
    private String code;
    private String name;
    private String city;
    private String province;
    private String address;
    private String phone;
    private StationStatus status;
    private LocalDateTime createdAt;
}

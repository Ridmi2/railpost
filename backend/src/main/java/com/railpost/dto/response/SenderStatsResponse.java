package com.railpost.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SenderStatsResponse {
    private long totalShipments;
    private long inTransit;
    private long delivered;
    private long pendingDropOff;
}

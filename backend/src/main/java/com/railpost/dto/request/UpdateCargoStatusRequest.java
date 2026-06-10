package com.railpost.dto.request;

import com.railpost.model.enums.CargoStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCargoStatusRequest {

    @NotNull(message = "Status is required")
    private CargoStatus status;

    @NotBlank(message = "Location is required")
    private String location;

    private String note;

    private String trainId;
    
    private com.railpost.model.enums.TrainType trainType;
}

package com.railpost.model.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "cost_configs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CostConfig {

    @Id
    private String id;

    @Field("base_weight_rate")
    private double baseWeightRate; // Rate per kg (LKR)

    @Field("base_distance_rate")
    private double baseDistanceRate; // Rate per km (LKR)

    @Field("fragile_multiplier")
    private double fragileMultiplier; // multiplier for fragile items

    @Field("perishable_multiplier")
    private double perishableMultiplier; // multiplier for perishable items

    @LastModifiedDate
    @Field("updated_at")
    private LocalDateTime updatedAt;
}

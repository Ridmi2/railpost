package com.railpost.model.document;

import com.railpost.model.enums.StationStatus;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "stations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Station {

    @Id
    private String id;

    @Indexed(unique = true)
    private String code;

    private String name;
    private String city;
    private String province;
    private String address;
    private String phone;

    @Builder.Default
    private StationStatus status = StationStatus.ACTIVE;

    @CreatedDate
    @Field("created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Field("updated_at")
    private LocalDateTime updatedAt;
}

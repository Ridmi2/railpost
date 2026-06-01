package com.railpost.model.document;

import com.railpost.model.enums.Role;
import com.railpost.model.enums.UserStatus;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true, sparse = true)
    private String username;

    @Field("password_hash")
    private String passwordHash;

    @Field("full_name")
    private String fullName;

    private String nic;
    private String phone;
    private Role role;

    @Field("station_id")
    private String stationId;

    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @CreatedDate
    @Field("created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Field("updated_at")
    private LocalDateTime updatedAt;
}

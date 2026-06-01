package com.railpost.repository;

import com.railpost.model.document.User;
import com.railpost.model.enums.Role;
import com.railpost.model.enums.UserStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByNic(String nic);
    List<User> findByRole(Role role);
    List<User> findByRoleAndStatus(Role role, UserStatus status);
    List<User> findByStationId(String stationId);
    List<User> findByRoleAndStationId(Role role, String stationId);
}

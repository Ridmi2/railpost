package com.railpost.repository;

import com.railpost.model.document.Cargo;
import com.railpost.model.enums.CargoStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CargoRepository extends MongoRepository<Cargo, String> {
    Optional<Cargo> findByTrackingNumber(String trackingNumber);
    List<Cargo> findBySenderIdOrderByCreatedAtDesc(String senderId);
    List<Cargo> findByReceiverEmailOrderByCreatedAtDesc(String receiverEmail);
    List<Cargo> findByOriginStationIdOrderByCreatedAtDesc(String stationId);
    List<Cargo> findByStatus(CargoStatus status);
    List<Cargo> findByStatusAndExpiresAtBefore(CargoStatus status, LocalDateTime dateTime);
    List<Cargo> findByDestinationStationIdAndStatus(String stationId, CargoStatus status);
    boolean existsByTrackingNumber(String trackingNumber);
    long countBySenderId(String senderId);
    long countBySenderIdAndStatus(String senderId, CargoStatus status);
}

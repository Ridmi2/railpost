package com.railpost.repository;

import com.railpost.model.document.TrackingLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrackingLogRepository extends MongoRepository<TrackingLog, String> {
    List<TrackingLog> findByCargoIdOrderByTimestampDesc(String cargoId);
}

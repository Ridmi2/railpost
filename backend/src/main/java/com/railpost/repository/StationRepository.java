package com.railpost.repository;

import com.railpost.model.document.Station;
import com.railpost.model.enums.StationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StationRepository extends MongoRepository<Station, String> {
    boolean existsByCode(String code);
    Optional<Station> findByCode(String code);
    List<Station> findByStatus(StationStatus status);
    long countByStatus(StationStatus status);
}

package com.railpost.repository;

import com.railpost.model.document.Train;
import com.railpost.model.enums.TrainStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainRepository extends MongoRepository<Train, String> {
    boolean existsByTrainNo(String trainNo);
    List<Train> findByStatus(TrainStatus status);
}

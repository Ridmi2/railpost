package com.railpost.repository;

import com.railpost.model.document.CostConfig;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CostConfigRepository extends MongoRepository<CostConfig, String> {
}

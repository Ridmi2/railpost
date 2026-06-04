package com.railpost.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

@Component
public class DataMigration implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;

    public DataMigration(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        updateEnum("category", "GENERAL_GOODS", "GENERAL");
        updateEnum("category", "FRAGILE", "HIGH_VALUE");
        updateEnum("category", "PERISHABLE", "FISH");
        updateEnum("category", "DOCUMENTS", "LETTERS");
        updateEnum("category", "ELECTRONICS", "HIGH_VALUE");
        updateEnum("category", "HAZARDOUS", "GENERAL");
        
        updateEnum("trainType", "GOODS", "NORMAL");
        
        System.out.println("====== DB MIGRATION COMPLETE ======");
    }
    
    private void updateEnum(String field, String oldVal, String newVal) {
        Query query = new Query(Criteria.where(field).is(oldVal));
        Update update = new Update().set(field, newVal);
        mongoTemplate.updateMulti(query, update, "cargo"); // "cargo" is the collection name
    }
}

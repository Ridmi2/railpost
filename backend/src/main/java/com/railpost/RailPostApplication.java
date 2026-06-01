package com.railpost;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * RailPost — Digital Cargo Tracking and Management System
 * Sri Lanka Railways | University of Moratuwa — IS 3920
 */
@SpringBootApplication
@EnableMongoAuditing
@ConfigurationPropertiesScan("com.railpost.config")
public class RailPostApplication {

    public static void main(String[] args) {
        SpringApplication.run(RailPostApplication.class, args);
    }
}
package com.railpost.service;

import com.railpost.model.enums.CargoCategory;
import com.railpost.model.enums.TrainType;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CostCalculatorService {

    /**
     * Calculates the transport cost based on distance, weight, train type, and cargo category.
     */
    public double calculateTransportCost(double distance, double weight, TrainType trainType, CargoCategory category) {
        double normalRate = calculateNormalBaseRate(distance, weight);

        // Train type multiplier (Express is 3x)
        double trainMultiplier = (trainType == TrainType.EXPRESS) ? 3.0 : 1.0;

        // Apply special category rules
        switch (category) {
            case FISH:
                // 50% above normal charge for Normal Trains
                return (trainType == TrainType.NORMAL) ? normalRate * 1.5 : normalRate * 1.5 * trainMultiplier;
            case LETTERS:
                // Flat Rs 20.00
                return 20.00;
            case FURNITURE:
            case CHICKS:
            case LIGHT_WEIGHT:
                // 3x Normal Charge on Normal Trains, 5x Normal Charge on Express Trains
                return (trainType == TrainType.NORMAL) ? normalRate * 3.0 : normalRate * 5.0;
            case MACHINES:
                // Standard rate
                return normalRate * trainMultiplier;
            case GENERAL:
            case HIGH_VALUE:
            default:
                return normalRate * trainMultiplier;
        }
    }

    /**
     * Calculates insurance cost based on the declared value.
     */
    public double calculateInsuranceCost(double declaredValue) {
        if (declaredValue <= 1000) {
            return 0.0;
        } else if (declaredValue <= 5000) {
            return declaredValue * 0.01;
        } else if (declaredValue <= 10000) {
            return declaredValue * 0.015;
        } else if (declaredValue <= 20000) {
            return declaredValue * 0.02;
        } else {
            return declaredValue * 0.03;
        }
    }

    /**
     * Approximates the standard rate matrix based on distance and weight.
     * In a production system, this would be a full database table or a 2D array lookup.
     */
    private double calculateNormalBaseRate(double distance, double weight) {
        // Base standard is 50
        double base = 50.0;
        
        // Find distance band (roughly 15km bands after 25km)
        int distBand = 0;
        if (distance > 25) {
            distBand = (int) Math.ceil((distance - 25) / 15.0);
        }

        if (weight <= 50) {
            // Find weight band
            int weightBand = 0;
            if (weight > 1) weightBand = 1;
            if (weight > 5) weightBand = 2;
            if (weight > 10) weightBand = 3;
            if (weight > 15) weightBand = 4;
            if (weight > 20) weightBand = 5;
            if (weight > 25) weightBand = 6;
            if (weight > 30) weightBand = 7;
            if (weight > 35) weightBand = 8;
            if (weight > 40) weightBand = 9;
            if (weight > 45) weightBand = 10;

            // Simplified formula that approximates the matrix curves
            double rate = base + (Math.max(0, distBand - (10 - weightBand)) * (1.5 + (weightBand * 0.2)));
            return Math.max(50.0, Math.round(rate));
        } else {
            // For > 50kg, it's a fixed rate per 10kg based on distance
            double ratePer10Kg = 15.0 + distBand; // e.g. 0-25km = 15, 25-40 = 16...
            double blocksOf10 = Math.ceil(weight / 10.0);
            return blocksOf10 * ratePer10Kg;
        }
    }
}

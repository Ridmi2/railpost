package com.railpost.model.enums;

public enum CargoStatus {
    PENDING_DROP_OFF,   // booked online, not yet at station
    BOOKED,             // registered at station, waiting dispatch
    DISPATCHED,         // loaded on train
    IN_TRANSIT,         // at intermediate station
    ARRIVED,            // at destination station
    DELIVERED,          // handed to receiver
    CANCELLED,          // cancelled by sender/admin
    EXPIRED             // auto-cancelled after 3 days no show
}

package com.railpost.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SmsService {

    public void sendArrivalSms(String toPhone, String trackingNumber, String stationName) {
        if (toPhone == null || toPhone.isEmpty()) return;
        log.info("==========================================================");
        log.info("SMS MOCK SERVER: Sending SMS");
        log.info("To Phone: {}", toPhone);
        log.info("Message: RailPost Update - Cargo ({}) is ready for pickup at {} station. Please bring your ID.", trackingNumber, stationName);
        log.info("==========================================================");
    }
}

package com.railpost.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        // In a real application, we would use JavaMailSender here.
        // For development/testing, we will log the link to the console.
        log.info("==========================================================");
        log.info("EMAIL MOCK SERVER: Sending Password Reset Email");
        log.info("To: {}", toEmail);
        log.info("Subject: RailPost Password Reset");
        log.info("Body: You have requested to reset your password. Click the link below to reset it.");
        log.info("Reset Link: {}", resetLink);
        log.info("==========================================================");
    }

    public void sendQrCodeEmail(String toEmail, String trackingNumber, String qrCodeData) {
        if (toEmail == null || toEmail.isEmpty()) return;
        log.info("==========================================================");
        log.info("EMAIL MOCK SERVER: Sending Tracking QR Code");
        log.info("To: {}", toEmail);
        log.info("Subject: RailPost Cargo Dispatched - Tracking QR Code ({})", trackingNumber);
        log.info("Body: Your cargo has been dispatched! Use the following QR code to track it.");
        log.info("QR Code Data: {}", qrCodeData);
        log.info("==========================================================");
    }

    public void sendArrivalEmail(String toEmail, String trackingNumber, String stationName) {
        if (toEmail == null || toEmail.isEmpty()) return;
        log.info("==========================================================");
        log.info("EMAIL MOCK SERVER: Cargo Arrived!");
        log.info("To: {}", toEmail);
        log.info("Subject: RailPost - Cargo Ready for Pickup ({})", trackingNumber);
        log.info("Body: Your cargo has safely arrived at {} station. Please bring your ID to pick it up.", stationName);
        log.info("==========================================================");
    }
}

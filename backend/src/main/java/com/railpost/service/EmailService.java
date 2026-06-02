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
}

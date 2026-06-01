package com.railpost.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class JwtProperties {
    private String secret = "railpost-super-secret-key-that-is-at-least-64-characters-long-for-hs512-algorithm";
    private long expiryMs = 86400000L;
}
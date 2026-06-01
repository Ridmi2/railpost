package com.railpost.util;

import com.railpost.model.document.User;
import com.railpost.model.enums.Role;
import com.railpost.model.enums.UserStatus;
import com.railpost.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("adminrailpost@gmail.com")) {
            User admin = User.builder()
                    .email("adminrailpost@gmail.com")
                    .username("admin")
                    .passwordHash(passwordEncoder.encode("Admin@123456"))
                    .fullName("System Administrator")
                    .role(Role.ADMIN)
                    .phone("+94771234567")
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin seeded: adminrailpost@gmail.com / Admin@123456");
        } else {
            log.info("Admin already exists — skipping seed");
        }
    }
}
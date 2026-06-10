package com.railpost.service.impl;

import com.railpost.dto.request.LoginRequest;
import com.railpost.dto.request.RegisterRequest;
import com.railpost.dto.response.LoginResponse;
import com.railpost.exception.ConflictException;
import com.railpost.exception.UnauthorizedException;
import com.railpost.model.document.User;
import com.railpost.model.enums.Role;
import com.railpost.model.enums.UserStatus;
import com.railpost.repository.UserRepository;
import com.railpost.security.JwtTokenProvider;
import com.railpost.service.AuthService;
import com.railpost.dto.request.ForgotPasswordRequest;
import com.railpost.dto.request.ResetPasswordRequest;
import com.railpost.exception.ResourceNotFoundException;
import com.railpost.exception.BadRequestException;
import com.railpost.model.document.PasswordResetToken;
import com.railpost.repository.PasswordResetTokenRepository;
import com.railpost.service.EmailService;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            // Temporary fallback for older plain text passwords before BCrypt was added
            if (!request.getPassword().equals(user.getPasswordHash())) {
                throw new UnauthorizedException("Invalid email or password");
            } else {
                // Auto-migrate the plaintext password to BCrypt
                user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
                userRepository.save(user);
                log.info("Migrated legacy plaintext password to BCrypt for user: {}", user.getEmail());
            }
        }

        if (user.getStatus() != UserStatus.ACTIVE)
            throw new UnauthorizedException("Account is not active. Contact an administrator.");

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        log.info("Login: {} [{}]", user.getEmail(), user.getRole());

        return LoginResponse.builder()
                .token(token).userId(user.getId())
                .email(user.getEmail()).fullName(user.getFullName())
                .role(user.getRole()).stationId(user.getStationId())
                .build();
    }

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new ConflictException("An account with this email already exists");

        if (userRepository.existsByNic(request.getNic().toUpperCase()))
            throw new ConflictException("An account with this NIC already exists");

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .nic(request.getNic().toUpperCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.SENDER)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);
        log.info("New sender registered: {}", request.getEmail());
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        // Delete any existing tokens for this user
        tokenRepository.deleteByUserId(user.getId());

        // Generate a new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .userId(user.getId())
                .token(token)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();
        tokenRepository.save(resetToken);

        // Send email
        String resetLink = "http://localhost:5173/reset-password/" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        log.info("Password reset token generated for user: {}", user.getEmail());
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid password reset token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            throw new BadRequestException("Password reset token has expired");
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Delete the token so it cannot be used again
        tokenRepository.delete(resetToken);
        log.info("Password successfully reset for user: {}", user.getEmail());
    }
}

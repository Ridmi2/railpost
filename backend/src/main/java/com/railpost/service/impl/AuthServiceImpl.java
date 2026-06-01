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
import lombok.RequiredArgsConstructor;
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

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash()))
            throw new UnauthorizedException("Invalid email or password");

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
}

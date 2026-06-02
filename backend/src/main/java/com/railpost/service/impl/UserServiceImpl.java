package com.railpost.service.impl;

import com.railpost.dto.request.ChangePasswordRequest;
import com.railpost.dto.request.UpdateProfileRequest;
import com.railpost.dto.response.UserResponse;
import com.railpost.exception.ResourceNotFoundException;
import com.railpost.exception.UnauthorizedException;
import com.railpost.model.document.User;
import com.railpost.repository.UserRepository;
import com.railpost.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .nic(user.getNic())
                .role(user.getRole())
                .stationId(user.getStationId())
                // stationName requires joining with Station collection if needed, leaving null for now as per DTO
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    public UserResponse getCurrentUserProfile(String email) {
        return mapToResponse(getUserByEmail(email));
    }

    @Override
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = getUserByEmail(email);
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        userRepository.save(user);
        return mapToResponse(user);
    }

    @Override
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = getUserByEmail(email);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Incorrect current password");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}

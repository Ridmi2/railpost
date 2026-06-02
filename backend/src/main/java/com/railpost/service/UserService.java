package com.railpost.service;

import com.railpost.dto.request.ChangePasswordRequest;
import com.railpost.dto.request.UpdateProfileRequest;
import com.railpost.dto.response.UserResponse;

public interface UserService {
    UserResponse getCurrentUserProfile(String email);
    UserResponse updateProfile(String email, UpdateProfileRequest request);
    void changePassword(String email, ChangePasswordRequest request);
}

package com.railpost.service;

import com.railpost.dto.request.LoginRequest;
import com.railpost.dto.request.RegisterRequest;
import com.railpost.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void register(RegisterRequest request);
    void forgotPassword(com.railpost.dto.request.ForgotPasswordRequest request);
    void resetPassword(com.railpost.dto.request.ResetPasswordRequest request);
}

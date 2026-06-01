package com.railpost.service;

import com.railpost.dto.request.LoginRequest;
import com.railpost.dto.request.RegisterRequest;
import com.railpost.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void register(RegisterRequest request);
}

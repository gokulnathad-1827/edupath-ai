package com.edupath.authservice.service;

import com.edupath.authservice.dto.ForgotPasswordRequest;
import com.edupath.authservice.dto.LoginRequest;
import com.edupath.authservice.dto.LoginResponse;
import com.edupath.authservice.dto.RegisterRequest;
import com.edupath.authservice.dto.ResetPasswordRequest;
import com.edupath.authservice.dto.UserResponse;

import java.util.Map;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    UserResponse register(RegisterRequest request);

    String refreshToken(String token);

    void changePassword(String userId, String oldPassword, String newPassword);

    UserResponse getCurrentUser();

    Map<String, String> forgotPassword(ForgotPasswordRequest request);

    Map<String, String> resetPassword(ResetPasswordRequest request);
}

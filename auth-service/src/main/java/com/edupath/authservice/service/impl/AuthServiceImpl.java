package com.edupath.authservice.service.impl;

import com.edupath.authservice.dto.ForgotPasswordRequest;
import com.edupath.authservice.dto.LoginRequest;
import com.edupath.authservice.dto.LoginResponse;
import com.edupath.authservice.dto.RegisterRequest;
import com.edupath.authservice.dto.ResetPasswordRequest;
import com.edupath.authservice.dto.UserResponse;
import com.edupath.authservice.entity.PasswordResetToken;
import com.edupath.authservice.entity.Role;
import com.edupath.authservice.entity.User;
import com.edupath.authservice.repository.PasswordResetTokenRepository;
import com.edupath.authservice.repository.RoleRepository;
import com.edupath.authservice.repository.UserRepository;
import com.edupath.authservice.security.CustomUserDetails;
import com.edupath.authservice.security.CustomUserDetailsService;
import com.edupath.authservice.security.JwtService;
import com.edupath.authservice.service.AuthService;
import com.edupath.authservice.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final EmailService emailService;

    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            CustomUserDetailsService userDetailsService,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.emailService = emailService;
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered: " + request.getEmail());
        }

        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Role not found: " + request.getRoleName()));

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(role)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateAccessToken(userDetails);

        return LoginResponse.builder()
                .token(jwtToken)
                .type("Bearer")
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().getName() : null)
                .build();
    }

    @Override
    public String refreshToken(String token) {
        String userEmail = jwtService.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

        if (!jwtService.isTokenValid(token, userDetails)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        return jwtService.generateAccessToken(userDetails);
    }

    @Override
    public void changePassword(String userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password does not match");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public Map<String, String> forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        log.info("[AuthService] Processing forgot-password request for email: {}", email);

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            log.info("[AuthService] Found user in MongoDB for email: {}", email);

            // Clean up any existing tokens for this user
            try {
                passwordResetTokenRepository.deleteByUserEmail(email);
            } catch (Exception e) {
                log.warn("[AuthService] Exception clearing existing tokens: {}", e.getMessage());
            }

            String token = UUID.randomUUID().toString();
            LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(30);

            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .userEmail(user.getEmail())
                    .expiryDate(expiryDate)
                    .used(false)
                    .build();

            passwordResetTokenRepository.save(resetToken);
            log.info("[AuthService] Persisted reset token in MongoDB password_reset_tokens collection.");

            emailService.sendPasswordResetEmail(user.getEmail(), token);
        } else {
            log.warn("[AuthService] No user found in MongoDB for email: {}", email);
        }

        return Map.of("message", "If an account with that email exists, a password reset link has been sent to your email.");
    }

    @Override
    public Map<String, String> resetPassword(ResetPasswordRequest request) {
        String token = request.getToken();
        log.info("[AuthService] Processing reset-password request with token.");

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired password reset token."));

        if (resetToken.isUsed() || resetToken.isExpired()) {
            log.warn("[AuthService] Token is used or expired. Used: {}, Expired: {}", resetToken.isUsed(), resetToken.isExpired());
            throw new RuntimeException("Password reset token has expired or already been used. Please request a new link.");
        }

        User user = userRepository.findByEmail(resetToken.getUserEmail())
                .orElseThrow(() -> new RuntimeException("User account associated with this reset token was not found."));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        log.info("[AuthService] Updated password hash in MongoDB users collection for user: {}", user.getEmail());

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
        passwordResetTokenRepository.delete(resetToken);
        log.info("[AuthService] Invalidated and deleted reset token from MongoDB.");

        return Map.of("message", "Password has been reset successfully. You can now sign in with your new password.");
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole() != null ? user.getRole().getName() : null)
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    @Override
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }
}

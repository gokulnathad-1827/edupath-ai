package com.edupath.authservice.config;

import com.edupath.authservice.entity.Role;
import com.edupath.authservice.entity.User;
import com.edupath.authservice.repository.RoleRepository;
import com.edupath.authservice.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Application Started...");

        List<String> rolesToInit = List.of(
                "ROLE_ADMIN",
                "ROLE_TEACHER",
                "ROLE_STUDENT",
                "ROLE_PARENT",
                "ROLE_COUNSELOR"
        );

        for (String roleName : rolesToInit) {
            if (!roleRepository.existsByName(roleName)) {
                Role role = Role.builder()
                        .name(roleName)
                        .build();
                roleRepository.save(role);
                log.info("Created Role: {}", roleName);
            }
        }

        createUser("Admin", "admin@edupath.com", "admin123", "9999999999", "ROLE_ADMIN");
        createUser("Teacher", "teacher@edupath.com", "teacher123", "8888888888", "ROLE_TEACHER");
        createUser("Student", "student@edupath.com", "student123", "7777777777", "ROLE_STUDENT");
        createUser("Parent", "parent@edupath.com", "parent123", "6666666666", "ROLE_PARENT");
        createUser("Counselor", "counselor@edupath.com", "counselor123", "5555555555", "ROLE_COUNSELOR");

        log.info("Initialization Completed.");
    }

    private void createUser(String fullName, String email, String password, String phoneNumber, String roleName) {
        if (userRepository.existsByEmail(email)) {
            log.info("User already exists: {}", email);
            return;
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException(roleName + " not found"));

        User user = User.builder()
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .phoneNumber(phoneNumber)
                .role(role)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        log.info("Created User: {} | Role: {}", email, roleName);
    }
}

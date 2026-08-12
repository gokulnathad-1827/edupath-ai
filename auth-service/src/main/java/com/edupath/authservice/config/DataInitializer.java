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

        String adminEmail = "admin@edupath.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));

            User adminUser = User.builder()
                    .fullName("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .phoneNumber("9999999999")
                    .role(adminRole)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            userRepository.save(adminUser);
            log.info("Created Admin: {}", adminEmail);
        }

        log.info("Initialization Completed.");
    }
}

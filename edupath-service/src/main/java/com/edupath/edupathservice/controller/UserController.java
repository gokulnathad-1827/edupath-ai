package com.edupath.edupathservice.controller;

import com.edupath.edupathservice.dto.UserDTO;
import com.edupath.edupathservice.entity.User;
import com.edupath.edupathservice.exception.ResourceNotFoundException;
import com.edupath.edupathservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    private UserDTO toDTO(User u) {
        if (u == null) return null;
        return UserDTO.builder()
                .id(u.getId())
                .username(u.getEmail())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .phoneNumber(u.getPhoneNumber())
                .role(u.getRole() != null ? u.getRole().getName() : "USER")
                .isEnabled(u.isEnabled())
                .createdAt(u.getCreatedAt())
                .build();
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> list = userRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return ResponseEntity.ok(toDTO(user));
    }
}

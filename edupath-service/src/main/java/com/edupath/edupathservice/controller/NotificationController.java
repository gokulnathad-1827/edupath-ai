package com.edupath.edupathservice.controller;

import com.edupath.edupathservice.dto.NotificationDTO;
import com.edupath.edupathservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<NotificationDTO>> getAllNotifications(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String role) {
        if (userId != null) {
            return ResponseEntity.ok(notificationService.getNotificationsForUser(userId, role));
        }
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<NotificationDTO>> getNotificationsForUser(
            @PathVariable Long userId,
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId, role));
    }

    @PostMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO dto) {
        return new ResponseEntity<>(notificationService.createNotification(dto), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(Map.of("message", "Notification deleted successfully"));
    }
}

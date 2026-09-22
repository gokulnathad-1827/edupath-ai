package com.edupath.edupathservice.service.impl;

import com.edupath.edupathservice.dto.NotificationDTO;
import com.edupath.edupathservice.entity.Notification;
import com.edupath.edupathservice.entity.Parent;
import com.edupath.edupathservice.entity.User;
import com.edupath.edupathservice.exception.ResourceNotFoundException;
import com.edupath.edupathservice.repository.NotificationRepository;
import com.edupath.edupathservice.repository.ParentRepository;
import com.edupath.edupathservice.repository.UserRepository;
import com.edupath.edupathservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ParentRepository parentRepository;

    private NotificationDTO toDTO(Notification entity) {
        if (entity == null) return null;
        String content = entity.getText() != null && !entity.getText().trim().isEmpty()
                ? entity.getText().trim()
                : (entity.getMessage() != null && !entity.getMessage().trim().isEmpty()
                    ? entity.getMessage().trim()
                    : (entity.getTitle() != null ? entity.getTitle().trim() : "Notification"));

        return NotificationDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle() != null ? entity.getTitle() : content)
                .text(content)
                .message(content)
                .type(entity.getType() != null ? entity.getType() : "info")
                .icon(entity.getIcon() != null ? entity.getIcon() : "📅")
                .time(entity.getTime() != null ? entity.getTime() : "Just now")
                .isRead(entity.getIsRead() != null ? entity.getIsRead() : false)
                .userId(entity.getUserId())
                .targetRole(entity.getTargetRole())
                .category(entity.getCategory() != null ? entity.getCategory() : "Notice")
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private String getIconForType(String type) {
        if ("success".equalsIgnoreCase(type)) return "👤";
        if ("warning".equalsIgnoreCase(type)) return "⚠️";
        return "📅";
    }

    private void seedInitialNotificationsIfEmpty() {
        boolean hasParentSpecific = notificationRepository.findAll().stream()
                .anyMatch(n -> n.getUserId() != null || n.getTargetRole() != null);

        if (!hasParentSpecific) {
            // Parent A (User ID 3, Parent ID 1: Suresh Kumar) private notification
            notificationRepository.save(Notification.builder()
                    .title("Child Progress Update: Guna")
                    .text("Guna (Class 10-A) scored 91% overall and achieved Class Rank 1.")
                    .message("Guna (Class 10-A) scored 91% overall and achieved Class Rank 1.")
                    .type("success")
                    .icon("👤")
                    .time("1 hour ago")
                    .userId(3L)
                    .targetRole("PARENT")
                    .category("Performance")
                    .isRead(false)
                    .createdAt(LocalDateTime.now().minusHours(1))
                    .build());

            // Parent B (User ID 4, Parent ID 2: Ramesh Sharma) private notification
            notificationRepository.save(Notification.builder()
                    .title("Attendance Alert: Hema")
                    .text("Hema (Class 10-A) recorded 4 absences in term 1.")
                    .message("Hema (Class 10-A) recorded 4 absences in term 1.")
                    .type("warning")
                    .icon("⚠️")
                    .time("2 hours ago")
                    .userId(4L)
                    .targetRole("PARENT")
                    .category("Attendance")
                    .isRead(false)
                    .createdAt(LocalDateTime.now().minusHours(2))
                    .build());

            // Admin private notification (Role ADMIN)
            notificationRepository.save(Notification.builder()
                    .title("Confidential Administrative Audit")
                    .text("Monthly system security and audit report generated for administrative staff.")
                    .message("Monthly system security and audit report generated for administrative staff.")
                    .type("warning")
                    .icon("⚠️")
                    .time("3 hours ago")
                    .userId(1L)
                    .targetRole("ADMIN")
                    .category("Notice")
                    .isRead(false)
                    .createdAt(LocalDateTime.now().minusHours(3))
                    .build());

            // General Parent Role Notification
            notificationRepository.save(Notification.builder()
                    .title("Parent-Teacher Conference Scheduled")
                    .text("Annual Parent-Teacher Conference is scheduled for next Friday at 10:00 AM.")
                    .message("Annual Parent-Teacher Conference is scheduled for next Friday at 10:00 AM.")
                    .type("info")
                    .icon("📅")
                    .time("1 day ago")
                    .userId(null)
                    .targetRole("PARENT")
                    .category("Notice")
                    .isRead(false)
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .build());
        }
    }

    @Override
    public List<NotificationDTO> getAllNotifications() {
        seedInitialNotificationsIfEmpty();
        return notificationRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<NotificationDTO> getNotificationsForUser(Long userId, String role) {
        seedInitialNotificationsIfEmpty();
        List<Notification> all = notificationRepository.findAll();

        // Resolve requested user and potential parent entity ID
        String effectiveRole = role;
        Long parentEntityId = null;

        if (userId != null) {
            Optional<User> uOpt = userRepository.findById(userId);
            if (uOpt.isPresent()) {
                if (effectiveRole == null || effectiveRole.trim().isEmpty()) {
                    if (uOpt.get().getRole() != null) {
                        effectiveRole = uOpt.get().getRole().getName();
                    }
                }
            }

            // Check if userId also maps to a Parent entity ID
            Optional<Parent> pOpt = parentRepository.findByUserId(userId);
            if (pOpt.isPresent()) {
                parentEntityId = pOpt.get().getId();
            } else {
                Optional<Parent> pDirect = parentRepository.findById(userId);
                if (pDirect.isPresent()) {
                    parentEntityId = pDirect.get().getId();
                }
            }
        }

        final String userRoleFinal = (effectiveRole != null && !effectiveRole.trim().isEmpty()) 
                ? effectiveRole.trim().toUpperCase() 
                : null;
        final Long reqUserId = userId;
        final Long reqParentId = parentEntityId;

        List<Notification> filtered = new ArrayList<>();

        for (Notification n : all) {
            // 1. Specific User Check
            if (n.getUserId() != null) {
                if (reqUserId == null || !n.getUserId().equals(reqUserId)) {
                    // Belongs to a different user -> REJECT
                    continue;
                }
            }

            // 2. Target Role Check
            if (n.getTargetRole() != null && !n.getTargetRole().trim().isEmpty()) {
                String target = n.getTargetRole().trim().toUpperCase();
                if (!"ALL".equals(target) && (userRoleFinal == null || !target.equals(userRoleFinal))) {
                    // Targeted to a different role -> REJECT
                    continue;
                }
            }

            filtered.add(n);
        }

        return filtered.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public NotificationDTO createNotification(NotificationDTO dto) {
        String type = dto.getType() != null ? dto.getType() : "info";
        String icon = dto.getIcon() != null ? dto.getIcon() : getIconForType(type);

        String content = dto.getText() != null && !dto.getText().trim().isEmpty()
                ? dto.getText().trim()
                : (dto.getMessage() != null && !dto.getMessage().trim().isEmpty()
                    ? dto.getMessage().trim()
                    : (dto.getTitle() != null ? dto.getTitle().trim() : "Notification"));

        Notification notification = Notification.builder()
                .title(dto.getTitle() != null ? dto.getTitle() : content)
                .text(content)
                .message(content)
                .type(type)
                .icon(icon)
                .time("Just now")
                .isRead(false)
                .userId(dto.getUserId())
                .targetRole(dto.getTargetRole())
                .category(dto.getCategory() != null ? dto.getCategory() : "Notice")
                .createdAt(LocalDateTime.now())
                .build();

        return toDTO(notificationRepository.save(notification));
    }

    @Override
    public void deleteNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        notificationRepository.delete(notification);
    }
}

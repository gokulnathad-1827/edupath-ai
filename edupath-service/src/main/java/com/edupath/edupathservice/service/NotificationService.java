package com.edupath.edupathservice.service;

import com.edupath.edupathservice.dto.NotificationDTO;
import java.util.List;

public interface NotificationService {
    List<NotificationDTO> getAllNotifications();
    List<NotificationDTO> getNotificationsForUser(Long userId, String role);
    NotificationDTO createNotification(NotificationDTO dto);
    void deleteNotification(Long id);
}

package com.edupath.edupathservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private String title;
    private String text;
    private String message;
    private String type;
    private String icon;
    private String time;
    private Boolean isRead;
    private Long userId;
    private String targetRole;
    private String category;
    private LocalDateTime createdAt;
}

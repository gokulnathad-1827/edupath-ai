package com.edupath.edupathservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(nullable = false, length = 1000)
    private String text;

    @Column(name = "message")
    private String message;

    private String type;

    private String icon;

    private String time;

    @Column(name = "is_read")
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "target_role")
    private String targetRole;

    @Column(name = "category")
    private String category;

    private LocalDateTime createdAt;
}

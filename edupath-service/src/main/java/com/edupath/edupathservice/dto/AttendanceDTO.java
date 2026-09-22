package com.edupath.edupathservice.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceDTO {

    private Long id;
    private String studentName;
    private String name; // For frontend compatibility
    private String status;
    private String subject;
    private LocalDate date;
    private LocalDateTime createdAt;
}

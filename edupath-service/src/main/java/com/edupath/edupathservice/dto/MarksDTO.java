package com.edupath.edupathservice.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarksDTO {
    private Long id;
    private String studentName;
    private String name;
    private String subject;
    private String marks;
    private LocalDate date;
    private LocalDateTime createdAt;
}

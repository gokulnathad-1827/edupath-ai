package com.edupath.edupathservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentSubjectAttendanceDTO {
    private String subject;
    private int present;
    private int total;
    private double percentage;
    private boolean hasData;
}

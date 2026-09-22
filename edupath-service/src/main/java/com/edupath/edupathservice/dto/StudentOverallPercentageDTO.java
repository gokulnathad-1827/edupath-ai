package com.edupath.edupathservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentOverallPercentageDTO {

    private Long studentId;
    private String studentName;
    private Double overallPercentage;
    private Integer totalSubjects;
    private Boolean hasMarksData;
    private String grade;
}

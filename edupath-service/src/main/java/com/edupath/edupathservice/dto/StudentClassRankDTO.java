package com.edupath.edupathservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentClassRankDTO {

    private Long studentId;
    private String studentName;
    private String className;
    private String section;
    private Double overallPercentage;
    private Integer classRank;
    private Integer totalStudents;
    private Boolean hasRankData;
}

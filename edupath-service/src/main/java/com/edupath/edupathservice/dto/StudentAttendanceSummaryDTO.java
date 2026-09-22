package com.edupath.edupathservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAttendanceSummaryDTO {
    private Long studentId;
    private String studentName;
    private Integer presentDays;
    private Integer totalDays;
    private Double attendancePercentage;
    private Boolean hasAttendanceData;
    private String status;
}

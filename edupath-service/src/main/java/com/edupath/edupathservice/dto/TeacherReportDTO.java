package com.edupath.edupathservice.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherReportDTO {
    private Long teacherId;
    private String teacherName;
    private String subject;
    private Integer classSize;
    private Integer studentsWithMarks;
    private String averageAttendance;
    private String averageGrade;
    private Integer atRisk;
    private List<GradeCountDTO> gradeDistribution;
    private List<TrendDataDTO> trendData;
    private List<StudentReportRowDTO> assignedStudents;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GradeCountDTO {
        private String grade;
        private Integer count;
        private String fill;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TrendDataDTO {
        private String month;
        private Double averageGrade;
        private Double classAttendance;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudentReportRowDTO {
        private Long studentId;
        private String name;
        private String className;
        private String section;
        private Double overallPercentage;
        private Double attendancePercentage;
        private String letterGrade;
        private String riskLevel;
    }
}

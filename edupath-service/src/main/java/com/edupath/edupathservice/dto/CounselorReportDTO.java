package com.edupath.edupathservice.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounselorReportDTO {
    private Long counselorId;
    private String counselorName;
    private Integer totalSessions;
    private Integer completedSessions;
    private Integer pendingSessions;
    private Integer atRiskStudentsCount;

    private Integer highRiskCount;
    private Integer mediumRiskCount;
    private Integer lowRiskCount;
    private Integer noRiskCount;

    private List<MonthlySessionReportDTO> monthlyReports;
    private List<SupervisedStudentRowDTO> supervisedStudents;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlySessionReportDTO {
        private String month;
        private Integer sessions;
        private Integer completed;
        private Integer pending;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SupervisedStudentRowDTO {
        private Long studentId;
        private String name;
        private String className;
        private String section;
        private Double attendancePercentage;
        private Double academicScore;
        private String riskLevel;
        private String recommendedAction;
    }
}

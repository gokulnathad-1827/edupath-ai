package com.edupath.edupathservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

public class AdminDashboardDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthGrowthItem {
        private String month;
        private Integer students;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudentGrowthDTO {
        private List<MonthGrowthItem> growthData;
        private Boolean hasHistoricalData;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GradeItem {
        private String name;
        private Integer students;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GradeDistributionDTO {
        private List<GradeItem> gradeData;
        private Boolean hasGradeData;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PerformanceItem {
        private String month;
        private Double average;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PerformanceAverageDTO {
        private List<PerformanceItem> performanceData;
        private Boolean hasPerformanceData;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AttendancePieItem {
        private String name;
        private Integer value;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AttendanceDistributionDTO {
        private List<AttendancePieItem> pieData;
        private Integer presentCount;
        private Integer absentCount;
        private Boolean hasAttendanceData;
    }
}

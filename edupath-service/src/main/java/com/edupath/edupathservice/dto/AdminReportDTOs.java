package com.edupath.edupathservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AdminReportDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudentReportRowDTO {
        private Long id;
        private String name;
        private String classAndSection;
        private String attendance;
        private String averageScore;
        private String riskLevel;
        private String currentAction;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TeacherReportRowDTO {
        private String employeeId;
        private String name;
        private String subject;
        private String qualification;
        private String classesAssigned;
        private String status;
    }
}

package com.edupath.edupathservice.controller;

import com.edupath.edupathservice.dto.AdminDashboardDTOs.*;
import com.edupath.edupathservice.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/student-growth")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentGrowthDTO> getStudentGrowth() {
        return ResponseEntity.ok(adminDashboardService.getStudentGrowth());
    }

    @GetMapping("/grade-distribution")
    @PreAuthorize("permitAll()")
    public ResponseEntity<GradeDistributionDTO> getGradeDistribution() {
        return ResponseEntity.ok(adminDashboardService.getGradeDistribution());
    }

    @GetMapping("/performance")
    @PreAuthorize("permitAll()")
    public ResponseEntity<PerformanceAverageDTO> getPerformanceAverage() {
        return ResponseEntity.ok(adminDashboardService.getPerformanceAverage());
    }

    @GetMapping("/attendance-distribution")
    @PreAuthorize("permitAll()")
    public ResponseEntity<AttendanceDistributionDTO> getAttendanceDistribution() {
        return ResponseEntity.ok(adminDashboardService.getAttendanceDistribution());
    }

    @GetMapping("/classes")
    @PreAuthorize("permitAll()")
    public ResponseEntity<java.util.List<com.edupath.edupathservice.dto.AdminClassSummaryDTO>> getClassSummaries() {
        return ResponseEntity.ok(adminDashboardService.getClassSummaries());
    }

    @GetMapping("/reports/students")
    @PreAuthorize("permitAll()")
    public ResponseEntity<java.util.List<com.edupath.edupathservice.dto.AdminReportDTOs.StudentReportRowDTO>> getStudentReports() {
        return ResponseEntity.ok(adminDashboardService.getStudentReports());
    }

    @GetMapping("/reports/teachers")
    @PreAuthorize("permitAll()")
    public ResponseEntity<java.util.List<com.edupath.edupathservice.dto.AdminReportDTOs.TeacherReportRowDTO>> getTeacherReports() {
        return ResponseEntity.ok(adminDashboardService.getTeacherReports());
    }
}

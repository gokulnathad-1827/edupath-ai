package com.edupath.edupathservice.service;

import com.edupath.edupathservice.dto.AdminDashboardDTOs.*;

public interface AdminDashboardService {
    StudentGrowthDTO getStudentGrowth();
    GradeDistributionDTO getGradeDistribution();
    PerformanceAverageDTO getPerformanceAverage();
    AttendanceDistributionDTO getAttendanceDistribution();

    java.util.List<com.edupath.edupathservice.dto.AdminClassSummaryDTO> getClassSummaries();
    java.util.List<com.edupath.edupathservice.dto.AdminReportDTOs.StudentReportRowDTO> getStudentReports();
    java.util.List<com.edupath.edupathservice.dto.AdminReportDTOs.TeacherReportRowDTO> getTeacherReports();
}

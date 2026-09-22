package com.edupath.edupathservice.service.impl;

import com.edupath.edupathservice.dto.AdminDashboardDTOs.*;
import com.edupath.edupathservice.entity.Attendance;
import com.edupath.edupathservice.entity.Marks;
import com.edupath.edupathservice.entity.Student;
import com.edupath.edupathservice.entity.User;
import com.edupath.edupathservice.repository.AttendanceRepository;
import com.edupath.edupathservice.repository.MarksRepository;
import com.edupath.edupathservice.repository.StudentRepository;
import com.edupath.edupathservice.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import com.edupath.edupathservice.dto.AdminClassSummaryDTO;
import com.edupath.edupathservice.dto.AdminReportDTOs.*;
import com.edupath.edupathservice.entity.Teacher;
import com.edupath.edupathservice.repository.TeacherRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final StudentRepository studentRepository;
    private final MarksRepository marksRepository;
    private final AttendanceRepository attendanceRepository;
    private final TeacherRepository teacherRepository;

    @Override
    public StudentGrowthDTO getStudentGrowth() {
        List<Student> students = studentRepository.findAll();
        if (students.isEmpty()) {
            return StudentGrowthDTO.builder()
                    .growthData(Collections.emptyList())
                    .hasHistoricalData(false)
                    .build();
        }

        Map<String, Integer> monthCounts = new LinkedHashMap<>();
        int unknownCount = 0;

        for (Student s : students) {
            User u = s.getUser();
            if (u != null && u.getCreatedAt() != null) {
                String monthName = u.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM"));
                monthCounts.put(monthName, monthCounts.getOrDefault(monthName, 0) + 1);
            } else {
                unknownCount++;
            }
        }

        if (monthCounts.isEmpty()) {
            List<MonthGrowthItem> singleMonth = List.of(
                    MonthGrowthItem.builder().month("Enrolled").students(students.size()).build()
            );
            return StudentGrowthDTO.builder()
                    .growthData(singleMonth)
                    .hasHistoricalData(false)
                    .build();
        }

        List<MonthGrowthItem> list = new ArrayList<>();
        monthCounts.forEach((m, cnt) -> list.add(MonthGrowthItem.builder().month(m).students(cnt).build()));
        if (unknownCount > 0) {
            list.add(MonthGrowthItem.builder().month("Other").students(unknownCount).build());
        }

        boolean hasMultiMonth = monthCounts.size() >= 2;

        return StudentGrowthDTO.builder()
                .growthData(list)
                .hasHistoricalData(hasMultiMonth)
                .build();
    }

    @Override
    public GradeDistributionDTO getGradeDistribution() {
        List<Student> students = studentRepository.findAll();
        if (students.isEmpty()) {
            return GradeDistributionDTO.builder()
                    .gradeData(Collections.emptyList())
                    .hasGradeData(false)
                    .build();
        }

        Map<String, Integer> gradeCounts = new TreeMap<>();
        for (Student s : students) {
            String rawClass = s.getClassName();
            String label;
            if (rawClass == null || rawClass.trim().isEmpty()) {
                label = "Unassigned";
            } else {
                String clean = rawClass.trim();
                if (clean.toLowerCase().startsWith("class") || clean.toLowerCase().startsWith("grade")) {
                    label = clean;
                } else {
                    label = "Class " + clean;
                }
            }
            gradeCounts.put(label, gradeCounts.getOrDefault(label, 0) + 1);
        }

        List<GradeItem> items = gradeCounts.entrySet().stream()
                .map(e -> GradeItem.builder().name(e.getKey()).students(e.getValue()).build())
                .collect(Collectors.toList());

        return GradeDistributionDTO.builder()
                .gradeData(items)
                .hasGradeData(true)
                .build();
    }

    @Override
    public PerformanceAverageDTO getPerformanceAverage() {
        List<Marks> allMarks = marksRepository.findAllByOrderByIdDesc();
        if (allMarks.isEmpty()) {
            return PerformanceAverageDTO.builder()
                    .performanceData(Collections.emptyList())
                    .hasPerformanceData(false)
                    .build();
        }

        Map<String, List<Double>> subjectScores = new LinkedHashMap<>();
        for (Marks m : allMarks) {
            if (m.getSubject() != null && m.getMarks() != null) {
                try {
                    double score = Double.parseDouble(m.getMarks().trim());
                    String subj = m.getSubject().trim();
                    subjectScores.computeIfAbsent(subj, k -> new ArrayList<>()).add(score);
                } catch (Exception ignored) {}
            }
        }

        if (subjectScores.isEmpty()) {
            return PerformanceAverageDTO.builder()
                    .performanceData(Collections.emptyList())
                    .hasPerformanceData(false)
                    .build();
        }

        List<PerformanceItem> items = new ArrayList<>();
        subjectScores.forEach((subj, scores) -> {
            double avg = scores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            double rounded = Math.round(avg * 10.0) / 10.0;
            items.add(PerformanceItem.builder().month(subj).average(rounded).build());
        });

        return PerformanceAverageDTO.builder()
                .performanceData(items)
                .hasPerformanceData(true)
                .build();
    }

    @Override
    public AttendanceDistributionDTO getAttendanceDistribution() {
        List<Attendance> allAttendance = attendanceRepository.findAllByOrderByIdDesc();
        if (allAttendance.isEmpty()) {
            return AttendanceDistributionDTO.builder()
                    .pieData(Collections.emptyList())
                    .presentCount(0)
                    .absentCount(0)
                    .hasAttendanceData(false)
                    .build();
        }

        int present = 0;
        int absent = 0;

        for (Attendance a : allAttendance) {
            String st = a.getStatus();
            if (st != null) {
                String clean = st.trim().toLowerCase();
                if (clean.equals("present") || clean.equals("p")) {
                    present++;
                } else if (clean.equals("absent") || clean.equals("a")) {
                    absent++;
                }
            }
        }

        if (present == 0 && absent == 0) {
            return AttendanceDistributionDTO.builder()
                    .pieData(Collections.emptyList())
                    .presentCount(0)
                    .absentCount(0)
                    .hasAttendanceData(false)
                    .build();
        }

        List<AttendancePieItem> pie = List.of(
                AttendancePieItem.builder().name("Present").value(present).build(),
                AttendancePieItem.builder().name("Absent").value(absent).build()
        );

        return AttendanceDistributionDTO.builder()
                .pieData(pie)
                .presentCount(present)
                .absentCount(absent)
                .hasAttendanceData(true)
                .build();
    }

    @Override
    public List<AdminClassSummaryDTO> getClassSummaries() {
        List<Student> students = studentRepository.findAll();
        List<Teacher> teachers = teacherRepository.findAll();

        if (students.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, List<Student>> classGroup = new TreeMap<>();
        for (Student s : students) {
            String cName = s.getClassName() != null ? s.getClassName().trim() : "";
            String sec = s.getSection() != null ? s.getSection().trim() : "";

            String label;
            if (cName.toLowerCase().startsWith("class") || cName.toLowerCase().startsWith("grade")) {
                label = cName + (sec.isEmpty() ? "" : ("-" + sec));
            } else if (!cName.isEmpty()) {
                label = "Class " + cName + (sec.isEmpty() ? "" : ("-" + sec));
            } else {
                label = "Unassigned";
            }
            classGroup.computeIfAbsent(label, k -> new ArrayList<>()).add(s);
        }

        List<AdminClassSummaryDTO> result = new ArrayList<>();
        int idCounter = 1;

        for (Map.Entry<String, List<Student>> entry : classGroup.entrySet()) {
            String className = entry.getKey();
            List<Student> sList = entry.getValue();

            Teacher assignedTeacher = null;
            for (Student s : sList) {
                try {
                    if (s.getClassTeacher() != null) {
                        assignedTeacher = s.getClassTeacher();
                        break;
                    }
                } catch (Exception ignored) {}
            }

            if (assignedTeacher == null) {
                // If not found directly from student.getClassTeacher(), check if any teacher's department or subject matches
                for (Teacher t : teachers) {
                    if (t.getSubject() != null && t.getSubject().equalsIgnoreCase(className)) {
                        assignedTeacher = t;
                        break;
                    }
                }
            }

            String teacherName = assignedTeacher != null ? assignedTeacher.getFullName() : "Unassigned";
            String dept = "General Academics";
            if (assignedTeacher != null) {
                if (assignedTeacher.getDepartment() != null && !assignedTeacher.getDepartment().trim().isEmpty()) {
                    dept = assignedTeacher.getDepartment().trim();
                } else if (assignedTeacher.getSubject() != null && !assignedTeacher.getSubject().trim().isEmpty()) {
                    dept = assignedTeacher.getSubject().trim();
                }
            }

            result.add(AdminClassSummaryDTO.builder()
                    .id(String.valueOf(idCounter++))
                    .name(className)
                    .department(dept)
                    .teacherName(teacherName)
                    .strength(sList.size())
                    .build());
        }

        return result;
    }

    @Override
    public List<StudentReportRowDTO> getStudentReports() {
        List<Student> students = studentRepository.findAll();
        if (students.isEmpty()) {
            return Collections.emptyList();
        }

        List<Attendance> allAttendance = attendanceRepository.findAll();
        List<Marks> allMarks = marksRepository.findAll();

        List<StudentReportRowDTO> rows = new ArrayList<>();

        for (Student s : students) {
            List<Attendance> sAtt = allAttendance.stream()
                    .filter(a -> (a.getStudentId() != null && a.getStudentId().equals(s.getId()))
                            || (a.getStudentName() != null && a.getStudentName().trim().equalsIgnoreCase(s.getFullName().trim())))
                    .toList();

            Double attPct = null;
            boolean hasAtt = false;
            if (!sAtt.isEmpty()) {
                long present = sAtt.stream().filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus())).count();
                attPct = Math.round((((double) present / sAtt.size()) * 100.0) * 10.0) / 10.0;
                hasAtt = true;
            }

            List<Marks> sMarks = allMarks.stream()
                    .filter(m -> m.getStudentName() != null && m.getStudentName().trim().equalsIgnoreCase(s.getFullName().trim()))
                    .toList();

            double scorePct = 0.0;
            boolean hasMarks = false;
            if (!sMarks.isEmpty()) {
                double total = 0.0;
                int count = 0;
                for (Marks m : sMarks) {
                    try {
                        total += Double.parseDouble(m.getMarks().trim());
                        count++;
                    } catch (Exception ignored) {}
                }
                if (count > 0) {
                    scorePct = Math.round((total / count) * 10.0) / 10.0;
                    hasMarks = true;
                }
            }

            String risk = "Low";
            String action = "Regular Follow-up";
            if ((hasMarks && scorePct < 60.0) || (hasAtt && attPct < 75.0)) {
                risk = "High";
                action = "Immediate Counseling";
            } else if ((hasMarks && scorePct < 75.0) || (hasAtt && attPct < 85.0)) {
                risk = "Medium";
                action = "Monitor Progress";
            } else if (hasMarks && scorePct >= 90.0 && hasAtt && attPct >= 95.0) {
                risk = "No Risk";
                action = "Academic Excellence Track";
            }

            String cName = s.getClassName() != null ? s.getClassName().trim() : "";
            String sec = s.getSection() != null ? s.getSection().trim() : "";
            String classStr = cName.toLowerCase().startsWith("class") ? (cName + (sec.isEmpty() ? "" : ("-" + sec))) : ("Class " + cName + (sec.isEmpty() ? "" : ("-" + sec)));

            rows.add(StudentReportRowDTO.builder()
                    .id(s.getId())
                    .name(s.getFullName())
                    .classAndSection(classStr)
                    .attendance(hasAtt ? (attPct + "%") : "No attendance data")
                    .averageScore(hasMarks ? (scorePct + "%") : "No marks data")
                    .riskLevel(risk)
                    .currentAction(action)
                    .build());
        }

        return rows;
    }

    @Override
    public List<TeacherReportRowDTO> getTeacherReports() {
        List<Teacher> teachers = teacherRepository.findAll();
        if (teachers.isEmpty()) {
            return Collections.emptyList();
        }

        List<Student> students = studentRepository.findAll();
        List<TeacherReportRowDTO> rows = new ArrayList<>();

        for (Teacher t : teachers) {
            String empId = t.getEmployeeId() != null ? t.getEmployeeId() : ("EMP" + t.getId());
            String tName = t.getFullName() != null ? t.getFullName() : ("Teacher " + t.getId());
            String subj = t.getDepartment() != null && !t.getDepartment().trim().isEmpty() ? t.getDepartment().trim() : (t.getSubject() != null && !t.getSubject().trim().isEmpty() ? t.getSubject().trim() : "General Academics");
            String qual = t.getQualification() != null && !t.getQualification().trim().isEmpty() ? t.getQualification().trim() : "N/A";

            Set<String> assignedClasses = new LinkedHashSet<>();

            for (Student s : students) {
                try {
                    if (s.getClassTeacher() != null && s.getClassTeacher().getId().equals(t.getId())) {
                        String cName = s.getClassName() != null ? s.getClassName().trim() : "";
                        String sec = s.getSection() != null ? s.getSection().trim() : "";
                        String classStr = cName.toLowerCase().startsWith("class") ? (cName + (sec.isEmpty() ? "" : ("-" + sec))) : ("Class " + cName + (sec.isEmpty() ? "" : ("-" + sec)));
                        assignedClasses.add(classStr);
                    }
                } catch (Exception ignored) {}
            }

            String classesStr = assignedClasses.isEmpty() ? "General Academics" : String.join(", ", assignedClasses);

            rows.add(TeacherReportRowDTO.builder()
                    .employeeId(empId)
                    .name(tName)
                    .subject(subj)
                    .qualification(qual)
                    .classesAssigned(classesStr)
                    .status(t.getStatus() != null ? t.getStatus() : "ACTIVE")
                    .build());
        }

        return rows;
    }
}

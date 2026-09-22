package com.edupath.edupathservice.service.impl;

import com.edupath.edupathservice.dto.DropoutRiskResponseDTO;
import com.edupath.edupathservice.dto.StudentAiFeatureDTO;
import com.edupath.edupathservice.dto.StudentDTO;
import com.edupath.edupathservice.entity.Attendance;
import com.edupath.edupathservice.entity.Counselor;
import com.edupath.edupathservice.entity.Marks;
import com.edupath.edupathservice.entity.Student;
import com.edupath.edupathservice.entity.StudentAcademicProfile;
import com.edupath.edupathservice.entity.Teacher;
import com.edupath.edupathservice.exception.InsufficientDataException;
import com.edupath.edupathservice.exception.ResourceNotFoundException;
import com.edupath.edupathservice.repository.AttendanceRepository;
import com.edupath.edupathservice.repository.CounselorRepository;
import com.edupath.edupathservice.repository.MarksRepository;
import com.edupath.edupathservice.repository.StudentAcademicProfileRepository;
import com.edupath.edupathservice.repository.StudentRepository;
import com.edupath.edupathservice.repository.TeacherRepository;
import com.edupath.edupathservice.service.ParentService;
import com.edupath.edupathservice.service.StudentAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class StudentAiServiceImpl implements StudentAiService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CounselorRepository counselorRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;
    private final StudentAcademicProfileRepository studentAcademicProfileRepository;
    private final ParentService parentService;
    private final RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:8084/api/ai/dropout-risk}")
    private String aiServiceUrl;

    @Override
    public DropoutRiskResponseDTO predictStudentDropoutRisk(Long studentId) {
        StudentAiFeatureDTO features = buildStudentAiFeatureDTO(studentId);

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<StudentAiFeatureDTO> requestEntity = new HttpEntity<>(features, headers);

        try {
            log.info("Sending 16-feature vector to AI service for studentId {}: {}", studentId, features);
            ResponseEntity<Map> response = restTemplate.postForEntity(aiServiceUrl, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map body = response.getBody();
                String dropoutRisk = String.valueOf(body.get("dropout_risk"));
                Double confidence = body.get("confidence") != null ? Double.parseDouble(body.get("confidence").toString()) : 0.0;

                return DropoutRiskResponseDTO.builder()
                        .studentId(student.getId())
                        .studentName(student.getFullName())
                        .dropoutRisk(dropoutRisk)
                        .confidence(confidence)
                        .featureSummary(features)
                        .build();
            } else {
                throw new RuntimeException("AI service returned non-success status: " + response.getStatusCode());
            }

        } catch (ResourceAccessException exc) {
            log.error("AI Service connection/timeout error for student {}: {}", studentId, exc.getMessage());
            throw new RuntimeException("AI service is temporarily unavailable (HTTP 503)", exc);
        } catch (HttpStatusCodeException exc) {
            log.error("AI Service HTTP error for student {}: {}", studentId, exc.getResponseBodyAsString());
            throw new RuntimeException("AI service request failed with HTTP " + exc.getStatusCode().value(), exc);
        } catch (Exception exc) {
            log.error("Unexpected error during AI dropout risk prediction: {}", exc.getMessage(), exc);
            throw new RuntimeException("AI service error: " + exc.getMessage(), exc);
        }
    }

    @Override
    public DropoutRiskResponseDTO predictParentChildDropoutRisk(Long parentId) {
        StudentDTO childStudent = parentService.getLinkedStudentForParent(parentId);
        if (childStudent == null || childStudent.getId() == null) {
            throw new ResourceNotFoundException("Student", "parentId", parentId);
        }
        return predictStudentDropoutRisk(childStudent.getId());
    }

    @Override
    public List<DropoutRiskResponseDTO> predictTeacherStudentsDropoutRisk(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));

        List<Student> assignedStudents = studentRepository.findByClassTeacher(teacher);
        if (assignedStudents.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        return assignedStudents.stream()
                .map(student -> predictStudentDropoutRisk(student.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DropoutRiskResponseDTO> predictCounselorStudentsDropoutRisk(Long counselorId) {
        Counselor counselor = counselorRepository.findById(counselorId)
                .orElseThrow(() -> new ResourceNotFoundException("Counselor", "id", counselorId));

        List<Student> assignedStudents = studentRepository.findByCounselor(counselor);
        if (assignedStudents.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        return assignedStudents.stream()
                .map(student -> predictStudentDropoutRisk(student.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DropoutRiskResponseDTO> predictAdminAllStudentsDropoutRisk() {
        List<Student> allStudents = studentRepository.findAll();
        if (allStudents.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        return allStudents.stream()
                .map(student -> predictStudentDropoutRisk(student.getId()))
                .collect(Collectors.toList());
    }





    @Override
    public StudentAiFeatureDTO buildStudentAiFeatureDTO(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        // 1. Age
        Integer age = 16;
        if (student.getDateOfBirth() != null) {
            age = Period.between(student.getDateOfBirth(), LocalDate.now()).getYears();
        } else {
            Integer parsedGrade = parseGrade(student.getClassName());
            age = parsedGrade != null ? parsedGrade + 6 : 16;
        }

        // 2. Gender
        String gender = student.getGender() != null && !student.getGender().trim().isEmpty()
                ? student.getGender().trim()
                : "Male";

        // 3. Grade
        Integer grade = parseGrade(student.getClassName());
        if (grade == null) grade = 10;

        // 4. Attendance Percentage
        Double attendancePercentage = calculateAttendancePercentage(studentId, student.getFullName());

        // 5 & 6. Previous & Current Percentage
        List<Marks> allMarks = fetchStudentMarks(student.getFullName());
        Double currentPercentage = calculateCurrentPercentage(allMarks);
        Double previousPercentage = calculatePreviousPercentage(allMarks, currentPercentage);

        // 7 - 10. Subject Scores
        Double mathematicsScore = getSubjectScore(allMarks, "Math", currentPercentage);
        Double scienceScore = getSubjectScore(allMarks, "Science", currentPercentage);
        Double englishScore = getSubjectScore(allMarks, "English", currentPercentage);
        Double computerScore = getSubjectScore(allMarks, "Computer", currentPercentage);

        // 11 - 13. Student Academic Profile (Assignment rate, study hours, behavior score)
        Optional<StudentAcademicProfile> profileOpt = studentAcademicProfileRepository.findByStudentId(studentId);
        if (profileOpt.isEmpty()) {
            profileOpt = studentAcademicProfileRepository.findByStudent(student);
        }

        if (profileOpt.isEmpty()) {
            throw new InsufficientDataException(
                "Required academic profile data (assignment_completion_rate, study_hours_per_day, behavior_score) is missing for student ID: " + studentId
            );
        }

        StudentAcademicProfile profile = profileOpt.get();
        Double assignmentCompletionRate = profile.getAssignmentCompletionRate();
        Double studyHoursPerDay = profile.getStudyHoursPerDay();
        Double behaviorScore = profile.getBehaviorScore();

        if (assignmentCompletionRate == null || studyHoursPerDay == null || behaviorScore == null) {
            throw new InsufficientDataException(
                "Incomplete academic profile parameters for student ID: " + studentId
            );
        }

        // 14. Parental Support
        String parentalSupport = "Low";
        if (student.getParent() != null) {
            parentalSupport = "High";
        } else if (student.getParentPhone() != null && !student.getParentPhone().trim().isEmpty()) {
            parentalSupport = "Medium";
        }

        // 15. Previous Failures
        Integer previousFailures = countFailures(allMarks);

        // 16. Academic Trend
        String academicTrend = calculateAcademicTrend(previousPercentage, currentPercentage);

        return StudentAiFeatureDTO.builder()
                .age(age)
                .gender(gender)
                .grade(grade)
                .attendancePercentage(roundTwoDecimals(attendancePercentage))
                .previousPercentage(roundTwoDecimals(previousPercentage))
                .currentPercentage(roundTwoDecimals(currentPercentage))
                .mathematicsScore(roundTwoDecimals(mathematicsScore))
                .scienceScore(roundTwoDecimals(scienceScore))
                .englishScore(roundTwoDecimals(englishScore))
                .computerScore(roundTwoDecimals(computerScore))
                .assignmentCompletionRate(roundTwoDecimals(assignmentCompletionRate))
                .studyHoursPerDay(roundTwoDecimals(studyHoursPerDay))
                .behaviorScore(roundTwoDecimals(behaviorScore))
                .parentalSupport(parentalSupport)
                .previousFailures(previousFailures)
                .academicTrend(academicTrend)
                .build();
    }

    private Integer parseGrade(String className) {
        if (className == null || className.trim().isEmpty()) return 10;
        Pattern p = Pattern.compile("\\d+");
        Matcher m = p.matcher(className);
        if (m.find()) {
            try {
                return Integer.parseInt(m.group());
            } catch (NumberFormatException ignored) {}
        }
        return 10;
    }

    private Double calculateAttendancePercentage(Long studentId, String fullName) {
        List<Attendance> list = attendanceRepository.findAllByOrderByIdDesc();
        List<Attendance> studentList = list.stream()
                .filter(a -> (a.getStudentId() != null && a.getStudentId().equals(studentId))
                          || (fullName != null && fullName.equalsIgnoreCase(a.getStudentName())))
                .toList();

        if (studentList.isEmpty()) {
            return 75.0; // Standard neutral baseline if no attendance recorded yet
        }

        long presentCount = studentList.stream()
                .filter(a -> a.getStatus() != null && a.getStatus().equalsIgnoreCase("Present"))
                .count();

        return (presentCount * 100.0) / studentList.size();
    }

    private List<Marks> fetchStudentMarks(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) return List.of();
        return marksRepository.findAllByOrderByIdDesc().stream()
                .filter(m -> fullName.equalsIgnoreCase(m.getStudentName()))
                .toList();
    }

    private Double calculateCurrentPercentage(List<Marks> marksList) {
        if (marksList.isEmpty()) return 70.0;
        double sum = 0.0;
        int count = 0;
        for (Marks m : marksList) {
            try {
                double val = Double.parseDouble(m.getMarks().trim());
                sum += val;
                count++;
            } catch (Exception ignored) {}
        }
        return count > 0 ? (sum / count) : 70.0;
    }

    private Double calculatePreviousPercentage(List<Marks> marksList, Double currentAvg) {
        if (marksList.size() <= 1) return currentAvg;
        double sum = 0.0;
        int count = 0;
        for (int i = 1; i < marksList.size(); i++) {
            try {
                double val = Double.parseDouble(marksList.get(i).getMarks().trim());
                sum += val;
                count++;
            } catch (Exception ignored) {}
        }
        return count > 0 ? (sum / count) : currentAvg;
    }

    private Double getSubjectScore(List<Marks> marksList, String keyword, Double fallbackAvg) {
        for (Marks m : marksList) {
            if (m.getSubject() != null && m.getSubject().toLowerCase().contains(keyword.toLowerCase())) {
                try {
                    return Double.parseDouble(m.getMarks().trim());
                } catch (Exception ignored) {}
            }
        }
        return fallbackAvg;
    }

    private Integer countFailures(List<Marks> marksList) {
        int count = 0;
        for (Marks m : marksList) {
            try {
                double val = Double.parseDouble(m.getMarks().trim());
                if (val < 35.0) count++;
            } catch (Exception ignored) {}
        }
        return count;
    }

    private String calculateAcademicTrend(Double previous, Double current) {
        double diff = current - previous;
        if (diff > 2.0) return "Improving";
        if (diff < -2.0) return "Declining";
        return "Stable";
    }

    private Double roundTwoDecimals(Double val) {
        if (val == null) return 0.0;
        return Math.round(val * 100.0) / 100.0;
    }

    @Override
    public Map<String, Object> getDropoutRiskSummary(String className, Long teacherId, Long counselorId) {
        List<Student> students = studentRepository.findAll();
        if (className != null && !className.trim().isEmpty()) {
            students = students.stream()
                    .filter(s -> s.getClassName() != null && s.getClassName().equalsIgnoreCase(className.trim()))
                    .toList();
        }
        if (teacherId != null) {
            students = students.stream()
                    .filter(s -> s.getClassTeacher() != null && s.getClassTeacher().getId().equals(teacherId))
                    .toList();
        }
        if (counselorId != null) {
            students = students.stream()
                    .filter(s -> s.getCounselor() != null && s.getCounselor().getId().equals(counselorId))
                    .toList();
        }

        int highRisk = 0;
        int mediumRisk = 0;
        int lowRisk = 0;
        List<Map<String, Object>> studentPredictions = new java.util.ArrayList<>();

        for (Student student : students) {
            try {
                DropoutRiskResponseDTO res = predictStudentDropoutRisk(student.getId());
                String risk = res.getDropoutRisk();
                if ("High".equalsIgnoreCase(risk)) {
                    highRisk++;
                } else if ("Medium".equalsIgnoreCase(risk)) {
                    mediumRisk++;
                } else {
                    lowRisk++;
                }
                Map<String, Object> item = new java.util.HashMap<>();
                item.put("studentId", student.getId());
                item.put("studentName", student.getFullName());
                item.put("className", student.getClassName());
                item.put("section", student.getSection());
                item.put("risk", risk);
                item.put("dropout_risk", risk);
                item.put("confidence", res.getConfidence());
                item.put("featureSummary", res.getFeatureSummary());
                studentPredictions.add(item);
            } catch (Exception e) {
                log.warn("Skipping student ID {} in risk summary due to error/missing profile: {}", student.getId(), e.getMessage());
            }
        }

        Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("total_students", studentPredictions.size());
        summary.put("high_risk", highRisk);
        summary.put("medium_risk", mediumRisk);
        summary.put("low_risk", lowRisk);
        summary.put("students", studentPredictions);
        return summary;
    }
}

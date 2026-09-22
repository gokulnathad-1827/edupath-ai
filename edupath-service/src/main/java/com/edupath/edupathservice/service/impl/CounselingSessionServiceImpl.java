package com.edupath.edupathservice.service.impl;

import com.edupath.edupathservice.dto.CounselingSessionDTO;
import com.edupath.edupathservice.entity.CounselingSession;
import com.edupath.edupathservice.entity.Counselor;
import com.edupath.edupathservice.entity.Student;
import com.edupath.edupathservice.exception.ResourceNotFoundException;
import com.edupath.edupathservice.repository.CounselingSessionRepository;
import com.edupath.edupathservice.repository.CounselorRepository;
import com.edupath.edupathservice.repository.StudentRepository;
import com.edupath.edupathservice.service.CounselingSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CounselingSessionServiceImpl implements CounselingSessionService {

    private final CounselingSessionRepository sessionRepository;
    private final CounselorRepository counselorRepository;
    private final StudentRepository studentRepository;

    private String getBadgeType(String status) {
        if ("Completed".equalsIgnoreCase(status)) return "success";
        if ("In Progress".equalsIgnoreCase(status)) return "warning";
        return "primary";
    }

    private Counselor getOrCreateDefaultCounselor() {
        Counselor counselor = counselorRepository.findAll().stream().findFirst().orElse(null);
        if (counselor == null) {
            counselor = Counselor.builder()
                    .counselorId("CNS-1001")
                    .fullName("Dr. Michael Vance")
                    .email("counselor@edupath.com")
                    .phoneNumber("9876543210")
                    .qualification("Ph.D")
                    .specialization("Student Psychology & Counseling")
                    .officeLocation("Building B, Room 204")
                    .status("ACTIVE")
                    .joiningDate(LocalDate.now())
                    .build();
            counselor = counselorRepository.save(counselor);
        }
        return counselor;
    }

    private Student getOrCreateDefaultStudent() {
        Student student = studentRepository.findAll().stream().findFirst().orElse(null);
        if (student == null) {
            student = Student.builder()
                    .studentId("STU-1001")
                    .admissionNumber("ADM-1001")
                    .fullName("Rahul Kumar")
                    .className("10")
                    .section("A")
                    .status("ACTIVE")
                    .build();
            student = studentRepository.save(student);
        }
        return student;
    }

    private CounselingSessionDTO toDTO(CounselingSession entity) {
        if (entity == null) return null;

        String statusStr = entity.getStatus() != null ? entity.getStatus() : "Scheduled";

        return CounselingSessionDTO.builder()
                .id(entity.getId())
                .student(entity.getStudentName())
                .studentName(entity.getStudentName())
                .classSection(entity.getClassSection() != null ? entity.getClassSection() : "Class 10-A")
                .date(entity.getSessionDate())
                .sessionDate(entity.getSessionDate())
                .time(entity.getSessionTime())
                .sessionTime(entity.getSessionTime())
                .issue(entity.getIssue() != null ? entity.getIssue() : "General Consultation")
                .status(statusStr)
                .notes(entity.getNotes())
                .counselorName(entity.getCounselorName() != null ? entity.getCounselorName() : "Dr. Michael Vance")
                .badgeType(getBadgeType(statusStr))
                .build();
    }

    @Override
    @Transactional
    public CounselingSessionDTO createSession(CounselingSessionDTO dto) {
        String studentName = dto.getStudent() != null && !dto.getStudent().trim().isEmpty()
                ? dto.getStudent().trim()
                : (dto.getStudentName() != null && !dto.getStudentName().trim().isEmpty() ? dto.getStudentName().trim() : "Student");

        String sDate = dto.getDate() != null && !dto.getDate().trim().isEmpty()
                ? dto.getDate().trim()
                : (dto.getSessionDate() != null && !dto.getSessionDate().trim().isEmpty() ? dto.getSessionDate().trim() : "15 Jul 2026");

        String sTime = dto.getTime() != null && !dto.getTime().trim().isEmpty()
                ? dto.getTime().trim()
                : (dto.getSessionTime() != null && !dto.getSessionTime().trim().isEmpty() ? dto.getSessionTime().trim() : "10:00 AM");

        Counselor defaultCounselor = getOrCreateDefaultCounselor();
        Student defaultStudent = getOrCreateDefaultStudent();

        CounselingSession session = CounselingSession.builder()
                .studentName(studentName)
                .classSection(dto.getClassSection() != null && !dto.getClassSection().trim().isEmpty() ? dto.getClassSection().trim() : "Class 10-A")
                .sessionDate(sDate)
                .sessionTime(sTime)
                .issue(dto.getIssue() != null && !dto.getIssue().trim().isEmpty() ? dto.getIssue().trim() : "Academic Counseling")
                .status(dto.getStatus() != null && !dto.getStatus().trim().isEmpty() ? dto.getStatus().trim() : "Scheduled")
                .notes(dto.getNotes() != null && !dto.getNotes().trim().isEmpty() ? dto.getNotes().trim() : "Scheduled session.")
                .counselorName(dto.getCounselorName() != null && !dto.getCounselorName().trim().isEmpty() ? dto.getCounselorName().trim() : (defaultCounselor.getFullName() != null ? defaultCounselor.getFullName() : "Dr. Michael Vance"))
                .counselor(defaultCounselor)
                .student(defaultStudent)
                .createdAt(LocalDateTime.now())
                .build();

        return toDTO(sessionRepository.save(session));
    }

    @Override
    @Transactional
    public CounselingSessionDTO updateSession(Long id, CounselingSessionDTO dto) {
        CounselingSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CounselingSession", "id", id));

        if (dto.getStudent() != null || dto.getStudentName() != null) {
            String s = dto.getStudent() != null && !dto.getStudent().trim().isEmpty() ? dto.getStudent().trim() : dto.getStudentName();
            if (s != null && !s.trim().isEmpty()) {
                session.setStudentName(s.trim());
            }
        }
        if (dto.getClassSection() != null && !dto.getClassSection().trim().isEmpty()) {
            session.setClassSection(dto.getClassSection().trim());
        }
        if (dto.getDate() != null || dto.getSessionDate() != null) {
            String d = dto.getDate() != null && !dto.getDate().trim().isEmpty() ? dto.getDate().trim() : dto.getSessionDate();
            if (d != null && !d.trim().isEmpty()) {
                session.setSessionDate(d.trim());
            }
        }
        if (dto.getTime() != null || dto.getSessionTime() != null) {
            String t = dto.getTime() != null && !dto.getTime().trim().isEmpty() ? dto.getTime().trim() : dto.getSessionTime();
            if (t != null && !t.trim().isEmpty()) {
                session.setSessionTime(t.trim());
            }
        }
        if (dto.getIssue() != null && !dto.getIssue().trim().isEmpty()) {
            session.setIssue(dto.getIssue().trim());
        }
        if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty()) {
            session.setStatus(dto.getStatus().trim());
        }
        if (dto.getNotes() != null && !dto.getNotes().trim().isEmpty()) {
            session.setNotes(dto.getNotes().trim());
        }
        if (dto.getCounselorName() != null && !dto.getCounselorName().trim().isEmpty()) {
            session.setCounselorName(dto.getCounselorName().trim());
        }

        return toDTO(sessionRepository.save(session));
    }

    @Override
    @Transactional(readOnly = true)
    public CounselingSessionDTO getSessionById(Long id) {
        CounselingSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CounselingSession", "id", id));
        return toDTO(session);
    }

    @Override
    @Transactional
    public List<CounselingSessionDTO> getAllSessions() {
        List<CounselingSession> list = sessionRepository.findAll();

        if (list.isEmpty()) {
            Counselor defaultCounselor = getOrCreateDefaultCounselor();
            Student defaultStudent = getOrCreateDefaultStudent();

            CounselingSession s1 = sessionRepository.save(CounselingSession.builder()
                    .studentName("Rahul Kumar")
                    .classSection("Class 10-A")
                    .sessionDate("10 Jul 2026")
                    .sessionTime("10:00 AM")
                    .issue("Academic Stress")
                    .status("Completed")
                    .notes("Student discussed experiencing anxiety regarding upcoming final exams. Recommended time management techniques and scheduled a follow-up.")
                    .counselorName(defaultCounselor.getFullName() != null ? defaultCounselor.getFullName() : "Dr. Michael Vance")
                    .counselor(defaultCounselor)
                    .student(defaultStudent)
                    .createdAt(LocalDateTime.now())
                    .build());

            CounselingSession s2 = sessionRepository.save(CounselingSession.builder()
                    .studentName("Priya Sharma")
                    .classSection("Class 9-A")
                    .sessionDate("10 Jul 2026")
                    .sessionTime("11:30 AM")
                    .issue("Career Guidance")
                    .status("Scheduled")
                    .notes("Discussed potential paths in Engineering and Computer Science. Recommended taking the EduPath AI Career Assessment.")
                    .counselorName(defaultCounselor.getFullName() != null ? defaultCounselor.getFullName() : "Dr. Michael Vance")
                    .counselor(defaultCounselor)
                    .student(defaultStudent)
                    .createdAt(LocalDateTime.now())
                    .build());

            CounselingSession s3 = sessionRepository.save(CounselingSession.builder()
                    .studentName("Arun Prakash")
                    .classSection("Class 11-A")
                    .sessionDate("10 Jul 2026")
                    .sessionTime("2:00 PM")
                    .issue("Low Attendance")
                    .status("In Progress")
                    .notes("Addressed attendance drop in Science. Set up a tracking schedule and scheduled a parent alignment meet next week.")
                    .counselorName(defaultCounselor.getFullName() != null ? defaultCounselor.getFullName() : "Dr. Michael Vance")
                    .counselor(defaultCounselor)
                    .student(defaultStudent)
                    .createdAt(LocalDateTime.now())
                    .build());

            CounselingSession s4 = sessionRepository.save(CounselingSession.builder()
                    .studentName("Meena Lakshmi")
                    .classSection("Class 12-A")
                    .sessionDate("11 Jul 2026")
                    .sessionTime("9:30 AM")
                    .issue("Personal Counseling")
                    .status("Scheduled")
                    .notes("Initial consultation regarding class adjustment issues. Set goals to improve school engagement.")
                    .counselorName(defaultCounselor.getFullName() != null ? defaultCounselor.getFullName() : "Dr. Michael Vance")
                    .counselor(defaultCounselor)
                    .student(defaultStudent)
                    .createdAt(LocalDateTime.now())
                    .build());

            list = List.of(s1, s2, s3, s4);
        }

        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteSession(Long id) {
        CounselingSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CounselingSession", "id", id));
        sessionRepository.delete(session);
        sessionRepository.flush();
    }
}

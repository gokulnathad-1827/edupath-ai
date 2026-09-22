package com.edupath.edupathservice.service.impl;

import com.edupath.edupathservice.dto.CounselorDTO;
import com.edupath.edupathservice.dto.StudentDTO;
import com.edupath.edupathservice.entity.CounselingSession;
import com.edupath.edupathservice.entity.Counselor;
import com.edupath.edupathservice.entity.Student;
import com.edupath.edupathservice.entity.User;
import com.edupath.edupathservice.exception.ResourceNotFoundException;
import com.edupath.edupathservice.dto.CounselorReportDTO;
import com.edupath.edupathservice.entity.Attendance;
import com.edupath.edupathservice.entity.Marks;
import com.edupath.edupathservice.repository.AttendanceRepository;
import com.edupath.edupathservice.repository.CounselingSessionRepository;
import com.edupath.edupathservice.repository.CounselorRepository;
import com.edupath.edupathservice.repository.MarksRepository;
import com.edupath.edupathservice.repository.StudentRepository;
import com.edupath.edupathservice.repository.UserRepository;
import com.edupath.edupathservice.service.CounselorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CounselorServiceImpl implements CounselorService {

    @Autowired
    private CounselorRepository counselorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CounselingSessionRepository counselingSessionRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    private CounselorDTO toDTO(Counselor counselor) {
        if (counselor == null) return null;
        return CounselorDTO.builder()
                .id(counselor.getId())
                .counselorId(counselor.getCounselorId())
                .fullName(counselor.getFullName())
                .email(counselor.getEmail())
                .phoneNumber(counselor.getPhoneNumber())
                .address(counselor.getAddress())
                .qualification(counselor.getQualification())
                .specialization(counselor.getSpecialization())
                .experience(counselor.getExperience())
                .status(counselor.getStatus())
                .userId(counselor.getUser() != null ? counselor.getUser().getId() : null)
                .build();
    }

    private Counselor toEntity(CounselorDTO dto) {
        if (dto == null) return null;
        return Counselor.builder()
                .counselorId(dto.getCounselorId())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .qualification(dto.getQualification())
                .specialization(dto.getSpecialization())
                .experience(dto.getExperience())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();
    }

    @Override
    public CounselorDTO createCounselor(CounselorDTO counselorDTO) {
        Counselor counselor = toEntity(counselorDTO);

        Long numericUserId = counselorDTO.getNumericUserId();
        User user = null;
        if (numericUserId != null) {
            user = userRepository.findById(numericUserId).orElse(null);
        }
        if (user == null && counselorDTO.getEmail() != null) {
            user = userRepository.findByEmail(counselorDTO.getEmail().trim()).orElse(null);
        }
        if (user != null) {
            counselor.setUser(user);
        }

        Counselor saved = counselorRepository.save(counselor);
        return toDTO(saved);
    }

    @Override
    public CounselorDTO updateCounselor(Long id, CounselorDTO dto) {
        Counselor counselor = counselorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Counselor", "id", id));

        if (dto.getFullName() != null) counselor.setFullName(dto.getFullName().trim());
        if (dto.getEmail() != null) counselor.setEmail(dto.getEmail().trim());
        if (dto.getPhoneNumber() != null) counselor.setPhoneNumber(dto.getPhoneNumber().trim());
        if (dto.getAddress() != null) counselor.setAddress(dto.getAddress().trim());
        if (dto.getQualification() != null) counselor.setQualification(dto.getQualification().trim());
        if (dto.getSpecialization() != null) counselor.setSpecialization(dto.getSpecialization().trim());
        if (dto.getExperience() != null) counselor.setExperience(dto.getExperience());
        if (dto.getStatus() != null) counselor.setStatus(dto.getStatus().trim());

        if (counselor.getUser() == null) {
            Long numericUserId = dto.getNumericUserId();
            User user = null;
            if (numericUserId != null) {
                user = userRepository.findById(numericUserId).orElse(null);
            }
            if (user == null && counselor.getEmail() != null) {
                user = userRepository.findByEmail(counselor.getEmail().trim()).orElse(null);
            }
            if (user != null) {
                counselor.setUser(user);
            }
        }

        try {
            if (counselor.getUser() != null) {
                User user = counselor.getUser();
                if (counselor.getFullName() != null) user.setFullName(counselor.getFullName());
                if (counselor.getEmail() != null) user.setEmail(counselor.getEmail());
                if (counselor.getPhoneNumber() != null) user.setPhoneNumber(counselor.getPhoneNumber());
                userRepository.save(user);
            }
        } catch (Exception ignored) {}

        Counselor updated = counselorRepository.save(counselor);
        return toDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public CounselorDTO getCounselorById(Long id) {
        Counselor counselor = counselorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Counselor", "id", id));
        return toDTO(counselor);
    }

    @Override
    public CounselorDTO findCounselorByIdentifier(String identifier) {
        if (identifier == null || identifier.trim().isEmpty()) {
            throw new ResourceNotFoundException("Counselor", "identifier", identifier);
        }
        String cleanId = identifier.trim();

        Optional<Counselor> byEmail = counselorRepository.findByEmail(cleanId);
        if (byEmail.isPresent()) return toDTO(byEmail.get());

        Optional<Counselor> byCId = counselorRepository.findByCounselorId(cleanId);
        if (byCId.isPresent()) return toDTO(byCId.get());

        try {
            Long numericId = Long.parseLong(cleanId);
            Optional<Counselor> byUserId = counselorRepository.findByUserId(numericId);
            if (byUserId.isPresent()) return toDTO(byUserId.get());

            Optional<Counselor> byId = counselorRepository.findById(numericId);
            if (byId.isPresent()) return toDTO(byId.get());
        } catch (NumberFormatException ignored) {}

        if (cleanId.contains("@")) {
            Optional<Counselor> fallbackByEmail = counselorRepository.findByEmail(cleanId.trim());
            if (fallbackByEmail.isPresent()) return toDTO(fallbackByEmail.get());
        }

        throw new ResourceNotFoundException("Counselor", "identifier", identifier);
    }

    @Override
    public CounselorDTO getCounselorByEmail(String email) {
        return findCounselorByIdentifier(email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CounselorDTO> getAllCounselors() {
        return counselorRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCounselor(Long id) {
        Counselor counselor = counselorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Counselor", "id", id));

        List<Student> students = studentRepository.findByCounselor(counselor);
        for (Student student : students) {
            student.setCounselor(null);
        }
        studentRepository.saveAllAndFlush(students);

        List<CounselingSession> sessions = counselingSessionRepository.findByCounselor(counselor);
        for (CounselingSession session : sessions) {
            session.setCounselor(null);
        }
        counselingSessionRepository.saveAllAndFlush(sessions);

        counselor.setUser(null);
        counselorRepository.saveAndFlush(counselor);

        counselorRepository.delete(counselor);
        counselorRepository.flush();
    }

    private StudentDTO toStudentDTO(Student s) {
        if (s == null) return null;
        Long uId = null;
        try { if (s.getUser() != null) uId = s.getUser().getId(); } catch (Exception ignored) {}

        Long ctId = null;
        String ctName = null;
        try {
            if (s.getClassTeacher() != null) {
                ctId = s.getClassTeacher().getId();
                ctName = s.getClassTeacher().getFullName();
            }
        } catch (Exception ignored) {}

        Long pId = null;
        String pName = null;
        try {
            if (s.getParent() != null) {
                pId = s.getParent().getId();
                pName = s.getParent().getFullName();
            }
        } catch (Exception ignored) {}

        Long cId = null;
        String cName = null;
        try {
            if (s.getCounselor() != null) {
                cId = s.getCounselor().getId();
                cName = s.getCounselor().getFullName();
            }
        } catch (Exception ignored) {}

        return StudentDTO.builder()
                .id(s.getId())
                .studentId(s.getStudentId())
                .admissionNumber(s.getAdmissionNumber())
                .rollNumber(s.getRollNumber())
                .fullName(s.getFullName())
                .gender(s.getGender())
                .dateOfBirth(s.getDateOfBirth())
                .className(s.getClassName())
                .section(s.getSection())
                .academicYear(s.getAcademicYear())
                .bloodGroup(s.getBloodGroup())
                .address(s.getAddress())
                .phoneNumber(s.getPhoneNumber())
                .parentPhone(s.getParentPhone())
                .email(s.getEmail())
                .status(s.getStatus())
                .userId(uId)
                .classTeacherId(ctId)
                .classTeacherName(ctName)
                .parentId(pId)
                .parentName(pName)
                .counselorId(cId)
                .counselorName(cName)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getAssignedStudentsForCounselor(Long counselorId) {
        Counselor counselor = counselorRepository.findById(counselorId)
                .orElseThrow(() -> new ResourceNotFoundException("Counselor", "id", counselorId));

        List<Student> students = studentRepository.findByCounselor(counselor);
        return students.stream().map(this::toStudentDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CounselorReportDTO getCounselorReport(Long counselorId) {
        Counselor counselor = counselorRepository.findById(counselorId)
                .orElseThrow(() -> new ResourceNotFoundException("Counselor", "id", counselorId));

        List<Student> assignedStudents = studentRepository.findByCounselor(counselor);
        List<CounselingSession> sessions = counselingSessionRepository.findByCounselor(counselor);
        if (sessions.isEmpty() && counselor.getFullName() != null) {
            sessions = counselingSessionRepository.findAll().stream()
                    .filter(cs -> cs.getCounselorName() != null && cs.getCounselorName().equalsIgnoreCase(counselor.getFullName()))
                    .toList();
        }

        int totalSessions = sessions.size();
        int completedSessions = (int) sessions.stream().filter(cs -> "Completed".equalsIgnoreCase(cs.getStatus())).count();
        int pendingSessions = totalSessions - completedSessions;

        List<Marks> allMarks = marksRepository.findAll();
        List<Attendance> allAttendance = attendanceRepository.findAll();

        int highRiskCount = 0;
        int mediumRiskCount = 0;
        int lowRiskCount = 0;
        int noRiskCount = 0;

        List<CounselorReportDTO.SupervisedStudentRowDTO> studentRows = new ArrayList<>();

        if (assignedStudents != null) {
            for (Student s : assignedStudents) {
                // Attendance
                List<Attendance> sAtt = allAttendance.stream()
                        .filter(a -> (a.getStudentId() != null && a.getStudentId().equals(s.getId()))
                                || (a.getStudentName() != null && a.getStudentName().trim().equalsIgnoreCase(s.getFullName().trim())))
                        .toList();

                Double attPct = null;
                boolean hasAtt = false;
                if (!sAtt.isEmpty()) {
                    long presentCount = sAtt.stream().filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus())).count();
                    attPct = Math.round((((double) presentCount / sAtt.size()) * 100.0) * 10.0) / 10.0;
                    hasAtt = true;
                }

                // Marks
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

                // Risk Level & Action
                String risk = "Low";
                String action = "Regular Follow-up";

                if ((hasMarks && scorePct < 60.0) || (hasAtt && attPct < 75.0)) {
                    risk = "High";
                    action = "Immediate Counseling / Parent Meeting";
                    highRiskCount++;
                } else if ((hasMarks && scorePct < 75.0) || (hasAtt && attPct < 85.0)) {
                    risk = "Medium";
                    action = "Monitor Progress";
                    mediumRiskCount++;
                } else if (hasMarks && scorePct >= 90.0 && hasAtt && attPct >= 95.0) {
                    risk = "No Risk";
                    action = "Academic Excellence Track";
                    noRiskCount++;
                } else {
                    risk = "Low";
                    action = "Regular Follow-up";
                    lowRiskCount++;
                }

                studentRows.add(CounselorReportDTO.SupervisedStudentRowDTO.builder()
                        .studentId(s.getId())
                        .name(s.getFullName())
                        .className(s.getClassName())
                        .section(s.getSection())
                        .attendancePercentage(hasAtt ? attPct : null)
                        .academicScore(hasMarks ? scorePct : null)
                        .riskLevel(risk)
                        .recommendedAction(action)
                        .build());
            }
        }

        int atRiskTotal = highRiskCount + mediumRiskCount;

        // Monthly Session Report
        List<CounselorReportDTO.MonthlySessionReportDTO> monthlyReports = new ArrayList<>();
        if (totalSessions > 0) {
            monthlyReports.add(CounselorReportDTO.MonthlySessionReportDTO.builder()
                    .month("July 2026")
                    .sessions(totalSessions)
                    .completed(completedSessions)
                    .pending(pendingSessions)
                    .build());
        }

        return CounselorReportDTO.builder()
                .counselorId(counselor.getId())
                .counselorName(counselor.getFullName())
                .totalSessions(totalSessions)
                .completedSessions(completedSessions)
                .pendingSessions(pendingSessions)
                .atRiskStudentsCount(atRiskTotal)
                .highRiskCount(highRiskCount)
                .mediumRiskCount(mediumRiskCount)
                .lowRiskCount(lowRiskCount)
                .noRiskCount(noRiskCount)
                .monthlyReports(monthlyReports)
                .supervisedStudents(studentRows)
                .build();
    }
}


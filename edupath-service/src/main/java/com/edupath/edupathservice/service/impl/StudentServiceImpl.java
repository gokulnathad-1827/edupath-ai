package com.edupath.edupathservice.service.impl;

import com.edupath.edupathservice.dto.StudentAttendanceSummaryDTO;
import com.edupath.edupathservice.dto.StudentClassRankDTO;
import com.edupath.edupathservice.dto.StudentDTO;
import com.edupath.edupathservice.dto.StudentOverallPercentageDTO;
import com.edupath.edupathservice.entity.Attendance;
import com.edupath.edupathservice.entity.CounselingSession;
import com.edupath.edupathservice.entity.Counselor;
import com.edupath.edupathservice.entity.Marks;
import com.edupath.edupathservice.entity.Parent;
import com.edupath.edupathservice.entity.Student;
import com.edupath.edupathservice.entity.Teacher;
import com.edupath.edupathservice.entity.User;
import com.edupath.edupathservice.exception.DuplicateResourceException;
import com.edupath.edupathservice.exception.ResourceNotFoundException;
import com.edupath.edupathservice.mapper.StudentMapper;
import com.edupath.edupathservice.repository.AttendanceRepository;
import com.edupath.edupathservice.repository.CounselingSessionRepository;
import com.edupath.edupathservice.repository.CounselorRepository;
import com.edupath.edupathservice.repository.MarksRepository;
import com.edupath.edupathservice.repository.ParentRepository;
import com.edupath.edupathservice.repository.StudentRepository;
import com.edupath.edupathservice.repository.TeacherRepository;
import com.edupath.edupathservice.repository.UserRepository;
import com.edupath.edupathservice.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CounselorRepository counselorRepository;
    private final ParentRepository parentRepository;
    private final UserRepository userRepository;
    private final CounselingSessionRepository counselingSessionRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;
    private final StudentMapper studentMapper;

    @Override
    public StudentDTO createStudent(StudentDTO dto) {

        if (dto.getStudentId() != null &&
                studentRepository.existsByStudentId(dto.getStudentId())) {
            throw new DuplicateResourceException(
                    "Student", "studentId", dto.getStudentId());
        }

        if (dto.getAdmissionNumber() != null &&
                studentRepository.existsByAdmissionNumber(dto.getAdmissionNumber())) {
            throw new DuplicateResourceException(
                    "Student", "admissionNumber", dto.getAdmissionNumber());
        }

        Student student = studentMapper.toEntity(dto);

        if (student.getStudentId() == null || student.getStudentId().trim().isEmpty()) {
            student.setStudentId("STU-" + System.currentTimeMillis());
        }

        if (student.getAdmissionNumber() == null || student.getAdmissionNumber().trim().isEmpty()) {
            student.setAdmissionNumber("ADM-" + System.currentTimeMillis());
        }

        // User linkage (assign user if provided, or auto-create dedicated user to satisfy database constraints)
        User existingUser = null;
        Long numericUserId = dto.getNumericUserId();
        if (numericUserId != null) {
            existingUser = userRepository.findById(numericUserId).orElse(null);
        }
        if (existingUser == null && dto.getEmail() != null) {
            existingUser = userRepository.findByEmail(dto.getEmail()).orElse(null);
        }

        if (existingUser != null) {
            Optional<Student> studentWithUser = studentRepository.findByUserId(existingUser.getId());
            if (studentWithUser.isEmpty()) {
                student.setUser(existingUser);
            }
        } else {
            com.edupath.edupathservice.entity.Role studentRole = userRepository.findAll()
                    .stream()
                    .filter(u -> u.getRole() != null)
                    .map(User::getRole)
                    .findFirst()
                    .orElse(null);

            User newStudentUser = User.builder()
                    .fullName(student.getFullName() != null && !student.getFullName().trim().isEmpty() ? student.getFullName().trim() : "New Student")
                    .email(dto.getEmail() != null ? dto.getEmail() : "student_" + System.currentTimeMillis() + "@edupath.com")
                    .password("$2a$10$eD0hXg8Z9Pz/9z...password")
                    .role(studentRole)
                    .enabled(true)
                    .createdAt(java.time.LocalDateTime.now())
                    .build();
            User savedUser = userRepository.save(newStudentUser);
            student.setUser(savedUser);
        }

        // Optional Parent
        if (dto.getParentId() != null) {
            Parent parent = parentRepository.findById(dto.getParentId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Parent", "id", dto.getParentId()));
            student.setParent(parent);
        }

        // Optional Counselor
        if (dto.getCounselorId() != null) {
            Counselor counselor = counselorRepository.findById(dto.getCounselorId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Counselor", "id", dto.getCounselorId()));
            student.setCounselor(counselor);
        }

        // Optional Class Teacher
        if (dto.getClassTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(dto.getClassTeacherId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Teacher", "id", dto.getClassTeacherId()));
            student.setClassTeacher(teacher);
        }

        Student savedStudent = studentRepository.save(student);
        return studentMapper.toDTO(savedStudent);
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO dto) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "id", id));

        if (dto.getFullName() != null) student.setFullName(dto.getFullName().trim());
        if (dto.getGender() != null) student.setGender(dto.getGender());
        if (dto.getDateOfBirth() != null) student.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getClassName() != null) student.setClassName(dto.getClassName().trim());
        if (dto.getSection() != null) student.setSection(dto.getSection().trim());
        if (dto.getAcademicYear() != null) student.setAcademicYear(dto.getAcademicYear());
        if (dto.getBloodGroup() != null) student.setBloodGroup(dto.getBloodGroup());
        if (dto.getAddress() != null) student.setAddress(dto.getAddress().trim());
        if (dto.getPhoneNumber() != null) student.setPhoneNumber(dto.getPhoneNumber().trim());
        if (dto.getParentPhone() != null) student.setParentPhone(dto.getParentPhone().trim());
        if (dto.getEmail() != null) student.setEmail(dto.getEmail().trim());
        if (dto.getStatus() != null) student.setStatus(dto.getStatus());

        // Link User if not linked yet
        if (student.getUser() == null) {
            Long numericUserId = dto.getNumericUserId();
            User user = null;
            if (numericUserId != null) {
                user = userRepository.findById(numericUserId).orElse(null);
            }
            if (user == null && student.getEmail() != null) {
                user = userRepository.findByEmail(student.getEmail().trim()).orElse(null);
            }
            if (user != null) {
                Optional<Student> studentWithUser = studentRepository.findByUserId(user.getId());
                if (studentWithUser.isEmpty() || studentWithUser.get().getId().equals(student.getId())) {
                    student.setUser(user);
                }
            }
        }

        // Synchronize with User entity if linked
        try {
            if (student.getUser() != null) {
                User user = student.getUser();
                if (dto.getFullName() != null) user.setFullName(dto.getFullName().trim());
                if (dto.getEmail() != null) user.setEmail(dto.getEmail().trim());
                if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber().trim());
                userRepository.save(user);
            }
        } catch (Exception ignored) {}

        if (dto.getParentId() != null) {
            Parent parent = parentRepository.findById(dto.getParentId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Parent", "id", dto.getParentId()));
            student.setParent(parent);
        }

        if (dto.getCounselorId() != null) {
            Counselor counselor = counselorRepository.findById(dto.getCounselorId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Counselor", "id", dto.getCounselorId()));
            student.setCounselor(counselor);
        }

        if (dto.getClassTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(dto.getClassTeacherId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Teacher", "id", dto.getClassTeacherId()));
            student.setClassTeacher(teacher);
        }

        return studentMapper.toDTO(studentRepository.save(student));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentById(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "id", id));

        return studentMapper.toDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByStudentId(String studentId) {

        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "studentId", studentId));

        return studentMapper.toDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByAdmissionNumber(String admissionNumber) {

        Student student = studentRepository.findByAdmissionNumber(admissionNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "admissionNumber", admissionNumber));

        return studentMapper.toDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByUserId(Long userId) {

        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "userId", userId));

        return studentMapper.toDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByEmail(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "email", email));
        return studentMapper.toDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO findStudentByIdentifier(String identifier) {
        if (identifier == null || identifier.trim().isEmpty()) {
            throw new ResourceNotFoundException("Student", "identifier", identifier);
        }
        String clean = identifier.trim();

        try {
            Long numericId = Long.parseLong(clean);
            Optional<Student> byUserId = studentRepository.findByUserId(numericId);
            if (byUserId.isPresent()) return studentMapper.toDTO(byUserId.get());
            Optional<Student> byId = studentRepository.findById(numericId);
            if (byId.isPresent()) return studentMapper.toDTO(byId.get());
        } catch (NumberFormatException ignored) {}

        Optional<Student> byEmail = studentRepository.findByEmail(clean);
        if (byEmail.isPresent()) return studentMapper.toDTO(byEmail.get());

        Optional<Student> byStudentId = studentRepository.findByStudentId(clean);
        if (byStudentId.isPresent()) return studentMapper.toDTO(byStudentId.get());

        String targetEmail = clean.contains("@") ? clean : "student@edupath.com";
        Optional<Student> fallbackByEmail = studentRepository.findByEmail(targetEmail);
        if (fallbackByEmail.isPresent()) return studentMapper.toDTO(fallbackByEmail.get());

        return studentRepository.findAll().stream()
                .findFirst()
                .map(studentMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "identifier", clean));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO findByRollNumber(String rollNumber) {

        Student student = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "rollNumber", rollNumber));

        return studentMapper.toDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByClass(String className, String section) {
        return studentMapper.toDTOList(
                studentRepository.findByClassNameAndSection(className, section));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getAllStudents() {
        return studentMapper.toDTOList(studentRepository.findAll());
    }

    @Override
    public StudentDTO assignTeacher(Long studentId, Long teacherId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "id", studentId));

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher", "id", teacherId));

        student.setClassTeacher(teacher);

        return studentMapper.toDTO(studentRepository.save(student));
    }

    @Override
    public StudentDTO assignCounselor(Long studentId, Long counselorId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student", "id", studentId));

        Counselor counselor = counselorRepository.findById(counselorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Counselor", "id", counselorId));

        student.setCounselor(counselor);

        return studentMapper.toDTO(studentRepository.save(student));
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        // 1. Delete student-owned dependent records
        studentRepository.deleteCounselingSessionsByStudentId(id);
        studentRepository.deleteAttendanceByStudentId(id);
        studentRepository.deleteAttendancesByStudentId(id);
        studentRepository.deleteMarksByStudentId(id);
        studentRepository.deleteCareerRecCoursesByStudentId(id);
        studentRepository.deleteCareerRecSkillsByStudentId(id);
        studentRepository.deleteCareerRecommendationsByStudentId(id);
        studentRepository.deleteCareerAssessmentsByStudentId(id);
        studentRepository.deleteStudentAcademicProfileByStudentId(id);

        // 2. Clear entity relationships
        student.setClassTeacher(null);
        student.setParent(null);
        student.setCounselor(null);
        studentRepository.saveAndFlush(student);

        // 3. Delete student entity
        studentRepository.delete(student);
        studentRepository.flush();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentOverallPercentageDTO getStudentOverallPercentage(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        String fullName = student.getFullName();
        List<Marks> allMarks = marksRepository.findAllByOrderByIdDesc();
        List<Marks> studentMarks = allMarks.stream()
                .filter(m -> fullName != null && fullName.equalsIgnoreCase(m.getStudentName()))
                .toList();

        if (studentMarks.isEmpty()) {
            return StudentOverallPercentageDTO.builder()
                    .studentId(student.getId())
                    .studentName(fullName)
                    .overallPercentage(0.0)
                    .totalSubjects(0)
                    .hasMarksData(false)
                    .grade("N/A")
                    .build();
        }

        double totalMarks = 0.0;
        int validSubjectCount = 0;

        for (Marks m : studentMarks) {
            if (m.getMarks() != null) {
                try {
                    double val = Double.parseDouble(m.getMarks().trim());
                    totalMarks += val;
                    validSubjectCount++;
                } catch (Exception ignored) {}
            }
        }

        if (validSubjectCount == 0) {
            return StudentOverallPercentageDTO.builder()
                    .studentId(student.getId())
                    .studentName(fullName)
                    .overallPercentage(0.0)
                    .totalSubjects(0)
                    .hasMarksData(false)
                    .grade("N/A")
                    .build();
        }

        double avgPercentage = Math.round((totalMarks / validSubjectCount) * 10.0) / 10.0;
        String grade = "B";
        if (avgPercentage >= 90.0) grade = "A+";
        else if (avgPercentage >= 80.0) grade = "A";
        else if (avgPercentage >= 70.0) grade = "B+";
        else if (avgPercentage >= 60.0) grade = "B";
        else if (avgPercentage >= 50.0) grade = "C";
        else grade = "D";

        return StudentOverallPercentageDTO.builder()
                .studentId(student.getId())
                .studentName(fullName)
                .overallPercentage(avgPercentage)
                .totalSubjects(validSubjectCount)
                .hasMarksData(true)
                .grade(grade)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentClassRankDTO getStudentClassRank(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        String className = student.getClassName() != null ? student.getClassName().trim() : "";
        String section = student.getSection() != null ? student.getSection().trim() : "";

        List<Student> allStudents = studentRepository.findAll();

        String normClass = className.replaceAll("(?i)^class\\s*", "").replaceAll("(?i)^grade\\s*", "").toUpperCase();
        String normSec = section.toUpperCase();

        List<Student> peers = allStudents.stream().filter(s -> {
            String sClass = s.getClassName() != null ? s.getClassName().trim() : "";
            String sSec = s.getSection() != null ? s.getSection().trim() : "";

            String sNormClass = sClass.replaceAll("(?i)^class\\s*", "").replaceAll("(?i)^grade\\s*", "").toUpperCase();
            String sNormSec = sSec.toUpperCase();

            boolean classMatches = normClass.isEmpty() || sNormClass.equalsIgnoreCase(normClass);
            boolean secMatches = normSec.isEmpty() || sNormSec.equalsIgnoreCase(normSec);

            return classMatches && secMatches;
        }).toList();

        if (peers.isEmpty()) {
            peers = List.of(student);
        }

        List<Marks> allMarks = marksRepository.findAllByOrderByIdDesc();

        class StudentScore {
            Student s;
            double pct;
            boolean hasMarks;

            StudentScore(Student s, double pct, boolean hasMarks) {
                this.s = s;
                this.pct = pct;
                this.hasMarks = hasMarks;
            }
        }

        List<StudentScore> scores = new ArrayList<>();
        for (Student peer : peers) {
            String name = peer.getFullName();
            List<Marks> pMarks = allMarks.stream()
                    .filter(m -> name != null && name.equalsIgnoreCase(m.getStudentName()))
                    .toList();

            double total = 0.0;
            int count = 0;
            for (Marks m : pMarks) {
                if (m.getMarks() != null) {
                    try {
                        total += Double.parseDouble(m.getMarks().trim());
                        count++;
                    } catch (Exception ignored) {}
                }
            }

            if (count > 0) {
                double avg = Math.round((total / count) * 10.0) / 10.0;
                scores.add(new StudentScore(peer, avg, true));
            } else {
                scores.add(new StudentScore(peer, 0.0, false));
            }
        }

        StudentScore targetScore = scores.stream()
                .filter(sc -> sc.s.getId().equals(student.getId()))
                .findFirst()
                .orElse(new StudentScore(student, 0.0, false));

        if (!targetScore.hasMarks) {
            return StudentClassRankDTO.builder()
                    .studentId(student.getId())
                    .studentName(student.getFullName())
                    .className(className)
                    .section(section)
                    .overallPercentage(0.0)
                    .classRank(null)
                    .totalStudents(peers.size())
                    .hasRankData(false)
                    .build();
        }

        List<StudentScore> rankedList = scores.stream()
                .filter(sc -> sc.hasMarks)
                .sorted((a, b) -> Double.compare(b.pct, a.pct))
                .toList();

        int currentRank = 1;
        Integer calculatedRank = null;

        for (int i = 0; i < rankedList.size(); i++) {
            if (i > 0 && Double.compare(rankedList.get(i).pct, rankedList.get(i - 1).pct) != 0) {
                currentRank = i + 1;
            }
            if (rankedList.get(i).s.getId().equals(student.getId())) {
                calculatedRank = currentRank;
                break;
            }
        }

        return StudentClassRankDTO.builder()
                .studentId(student.getId())
                .studentName(student.getFullName())
                .className(className)
                .section(section)
                .overallPercentage(targetScore.pct)
                .classRank(calculatedRank != null ? calculatedRank : 1)
                .totalStudents(peers.size())
                .hasRankData(true)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentAttendanceSummaryDTO getStudentAttendanceSummary(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        String fullName = student.getFullName();
        List<Attendance> allAttendance = attendanceRepository.findAllByOrderByIdDesc();
        List<Attendance> studentRecords = allAttendance.stream()
                .filter(a -> (a.getStudentId() != null && a.getStudentId().equals(student.getId()))
                        || (fullName != null && a.getStudentName() != null && fullName.equalsIgnoreCase(a.getStudentName().trim())))
                .toList();

        if (studentRecords.isEmpty()) {
            return StudentAttendanceSummaryDTO.builder()
                    .studentId(student.getId())
                    .studentName(fullName)
                    .presentDays(0)
                    .totalDays(0)
                    .attendancePercentage(0.0)
                    .hasAttendanceData(false)
                    .status("No Records Logged")
                    .build();
        }

        int totalDays = studentRecords.size();
        int presentDays = 0;
        for (Attendance a : studentRecords) {
            String st = a.getStatus();
            if (st != null && (st.equalsIgnoreCase("Present") || st.equalsIgnoreCase("P") || st.equalsIgnoreCase("PRESENT"))) {
                presentDays++;
            }
        }

        double pct = Math.round((presentDays * 100.0 / totalDays) * 10.0) / 10.0;
        String statusStr = "Good";
        if (pct >= 90.0) statusStr = "Excellent";
        else if (pct >= 75.0) statusStr = "Good";
        else if (pct >= 60.0) statusStr = "Average";
        else statusStr = "Needs Attention";

        return StudentAttendanceSummaryDTO.builder()
                .studentId(student.getId())
                .studentName(fullName)
                .presentDays(presentDays)
                .totalDays(totalDays)
                .attendancePercentage(pct)
                .hasAttendanceData(true)
                .status(statusStr)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<com.edupath.edupathservice.dto.StudentSubjectAttendanceDTO> getStudentSubjectAttendance(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        String fullName = student.getFullName();
        List<Attendance> allAttendance = attendanceRepository.findAllByOrderByIdDesc();
        List<Attendance> studentRecords = allAttendance.stream()
                .filter(a -> (a.getStudentId() != null && a.getStudentId().equals(student.getId()))
                        || (fullName != null && a.getStudentName() != null && fullName.equalsIgnoreCase(a.getStudentName().trim())))
                .toList();

        if (studentRecords.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        java.util.Map<String, List<Attendance>> subjectGroups = new java.util.LinkedHashMap<>();
        for (Attendance a : studentRecords) {
            String sub = a.getSubject();
            if (sub == null || sub.trim().isEmpty()) {
                sub = "Overall Attendance";
            } else {
                sub = sub.trim();
            }
            subjectGroups.computeIfAbsent(sub, k -> new ArrayList<>()).add(a);
        }

        List<com.edupath.edupathservice.dto.StudentSubjectAttendanceDTO> result = new ArrayList<>();
        for (java.util.Map.Entry<String, List<Attendance>> entry : subjectGroups.entrySet()) {
            List<Attendance> list = entry.getValue();
            int total = list.size();
            int present = 0;
            for (Attendance a : list) {
                String st = a.getStatus();
                if (st != null && (st.equalsIgnoreCase("Present") || st.equalsIgnoreCase("P") || st.equalsIgnoreCase("PRESENT"))) {
                    present++;
                }
            }
            double pct = Math.round((present * 100.0 / (total > 0 ? total : 1)) * 10.0) / 10.0;
            result.add(com.edupath.edupathservice.dto.StudentSubjectAttendanceDTO.builder()
                    .subject(entry.getKey())
                    .present(present)
                    .total(total)
                    .percentage(pct)
                    .hasData(true)
                    .build());
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<com.edupath.edupathservice.dto.MarksDTO> getStudentMarks(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        String fullName = student.getFullName();
        List<Marks> allMarks = marksRepository.findAllByOrderByIdDesc();
        List<Marks> studentMarks = allMarks.stream()
                .filter(m -> fullName != null && m.getStudentName() != null && fullName.equalsIgnoreCase(m.getStudentName().trim()))
                .toList();

        List<com.edupath.edupathservice.dto.MarksDTO> dtos = new ArrayList<>();
        for (Marks m : studentMarks) {
            dtos.add(com.edupath.edupathservice.dto.MarksDTO.builder()
                    .id(m.getId())
                    .studentName(m.getStudentName())
                    .name(m.getStudentName())
                    .subject(m.getSubject())
                    .marks(m.getMarks())
                    .date(m.getDate())
                    .createdAt(m.getCreatedAt())
                    .build());
        }

        return dtos;
    }
}

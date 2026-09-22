package com.edupath.edupathservice.service.impl;

import com.edupath.edupathservice.dto.StudentDTO;
import com.edupath.edupathservice.dto.TeacherDTO;
import com.edupath.edupathservice.entity.Attendance;
import com.edupath.edupathservice.entity.Student;
import com.edupath.edupathservice.entity.Teacher;
import com.edupath.edupathservice.entity.User;
import com.edupath.edupathservice.exception.ResourceNotFoundException;
import com.edupath.edupathservice.mapper.StudentMapper;
import com.edupath.edupathservice.dto.TeacherReportDTO;
import com.edupath.edupathservice.entity.Marks;
import com.edupath.edupathservice.repository.MarksRepository;
import com.edupath.edupathservice.repository.AttendanceRepository;
import com.edupath.edupathservice.repository.StudentRepository;
import com.edupath.edupathservice.repository.TeacherRepository;
import com.edupath.edupathservice.repository.UserRepository;
import com.edupath.edupathservice.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentMapper studentMapper;


    private TeacherDTO toDTO(Teacher teacher) {
        if (teacher == null) return null;
        return TeacherDTO.builder()
                .id(teacher.getId())
                .employeeId(teacher.getEmployeeId())
                .fullName(teacher.getFullName())
                .name(teacher.getFullName())
                .email(teacher.getEmail())
                .phoneNumber(teacher.getPhoneNumber())
                .address(teacher.getAddress())
                .department(teacher.getDepartment())
                .specialization(teacher.getSpecialization())
                .subject(teacher.getSubject() != null ? teacher.getSubject() : teacher.getSpecialization())
                .qualification(teacher.getQualification())
                .experience(teacher.getExperience())
                .status(teacher.getStatus())
                .userId(teacher.getUser() != null ? teacher.getUser().getId() : null)
                .build();
    }

    private Teacher toEntity(TeacherDTO dto) {
        if (dto == null) return null;
        String subject = dto.getSubject() != null ? dto.getSubject() : dto.getSpecialization();
        String name = dto.getFullName() != null ? dto.getFullName() : dto.getName();

        return Teacher.builder()
                .employeeId(dto.getEmployeeId())
                .fullName(name)
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .department(dto.getDepartment() != null ? dto.getDepartment() : subject)
                .specialization(dto.getSpecialization() != null ? dto.getSpecialization() : subject)
                .subject(subject)
                .qualification(dto.getQualification())
                .experience(dto.getExperience())
                .joiningDate(LocalDate.now())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();
    }

    @Override
    public TeacherDTO createTeacher(TeacherDTO teacherDTO) {
        Teacher teacher = toEntity(teacherDTO);
        if (teacher.getEmployeeId() == null || teacher.getEmployeeId().trim().isEmpty()) {
            teacher.setEmployeeId("EMP-" + System.currentTimeMillis());
        }

        Long numericUserId = teacherDTO.getNumericUserId();
        User user = null;
        if (numericUserId != null) {
            user = userRepository.findById(numericUserId).orElse(null);
        }
        if (user == null && teacherDTO.getEmail() != null && !teacherDTO.getEmail().trim().isEmpty()) {
            user = userRepository.findByEmail(teacherDTO.getEmail().trim()).orElse(null);
        }
        if (user == null) {
            com.edupath.edupathservice.entity.Role teacherRole = userRepository.findAll().stream()
                    .map(User::getRole)
                    .filter(r -> r != null && "TEACHER".equalsIgnoreCase(r.getName()))
                    .findFirst()
                    .orElseGet(() -> userRepository.findAll().stream().map(User::getRole).findFirst().orElse(null));

            String email = (teacherDTO.getEmail() != null && !teacherDTO.getEmail().trim().isEmpty())
                    ? teacherDTO.getEmail().trim()
                    : "teacher_" + System.currentTimeMillis() + "@edupath.com";

            User newUser = User.builder()
                    .fullName(teacher.getFullName() != null && !teacher.getFullName().trim().isEmpty() ? teacher.getFullName().trim() : "New Teacher")
                    .email(email)
                    .password("$2a$10$e7xX3v2Q9O0nZ4V8M6uW2u.8t7t6r5e4w3q2a1s")
                    .phoneNumber(teacher.getPhoneNumber())
                    .role(teacherRole)
                    .enabled(true)
                    .createdAt(java.time.LocalDateTime.now())
                    .build();
            user = userRepository.save(newUser);
        }
        teacher.setUser(user);

        Teacher saved = teacherRepository.save(teacher);
        return toDTO(saved);
    }

    @Override
    public TeacherDTO updateTeacher(Long id, TeacherDTO dto) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));

        String name = dto.getFullName() != null ? dto.getFullName() : dto.getName();
        if (name != null) teacher.setFullName(name.trim());
        if (dto.getEmail() != null) teacher.setEmail(dto.getEmail().trim());
        if (dto.getPhoneNumber() != null) teacher.setPhoneNumber(dto.getPhoneNumber().trim());
        if (dto.getAddress() != null) teacher.setAddress(dto.getAddress().trim());
        if (dto.getSubject() != null) {
            teacher.setSubject(dto.getSubject().trim());
            teacher.setSpecialization(dto.getSubject().trim());
            teacher.setDepartment(dto.getSubject().trim());
        }
        if (dto.getStatus() != null) teacher.setStatus(dto.getStatus().trim());
        if (dto.getQualification() != null) teacher.setQualification(dto.getQualification().trim());
        if (dto.getExperience() != null) teacher.setExperience(dto.getExperience());

        // Link User if not linked yet
        if (teacher.getUser() == null) {
            Long numericUserId = dto.getNumericUserId();
            User user = null;
            if (numericUserId != null) {
                user = userRepository.findById(numericUserId).orElse(null);
            }
            if (user == null && teacher.getEmail() != null) {
                user = userRepository.findByEmail(teacher.getEmail().trim()).orElse(null);
            }
            if (user != null) {
                teacher.setUser(user);
            }
        }

        // Synchronize with User entity if present
        try {
            if (teacher.getUser() != null) {
                User user = teacher.getUser();
                if (teacher.getFullName() != null) user.setFullName(teacher.getFullName());
                if (teacher.getEmail() != null) user.setEmail(teacher.getEmail());
                if (teacher.getPhoneNumber() != null) user.setPhoneNumber(teacher.getPhoneNumber());
                userRepository.save(user);
            }
        } catch (Exception ignored) {}

        return toDTO(teacherRepository.save(teacher));
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherDTO getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));
        return toDTO(teacher);
    }

    @Override
    public TeacherDTO findTeacherByIdentifier(String identifier) {
        if (identifier == null || identifier.trim().isEmpty()) {
            throw new ResourceNotFoundException("Teacher", "identifier", identifier);
        }
        String cleanId = identifier.trim();

        // 1. Try email or employeeId first
        Optional<Teacher> byEmail = teacherRepository.findByEmail(cleanId);
        if (byEmail.isPresent()) return toDTO(byEmail.get());

        Optional<Teacher> byEmpId = teacherRepository.findByEmployeeId(cleanId);
        if (byEmpId.isPresent()) return toDTO(byEmpId.get());

        // 2. Try by userId or numeric entity ID
        try {
            Long numericId = Long.parseLong(cleanId);
            Optional<Teacher> byUserId = teacherRepository.findByUserId(numericId);
            if (byUserId.isPresent()) return toDTO(byUserId.get());

            Optional<Teacher> byId = teacherRepository.findById(numericId);
            if (byId.isPresent()) return toDTO(byId.get());
        } catch (NumberFormatException ignored) {}

        // 3. Check by email if cleanId is an email
        if (cleanId.contains("@")) {
            Optional<Teacher> fallbackByEmail = teacherRepository.findByEmail(cleanId.trim());
            if (fallbackByEmail.isPresent()) return toDTO(fallbackByEmail.get());
        }

        throw new ResourceNotFoundException("Teacher", "identifier", identifier);
    }

    @Override
    public TeacherDTO getTeacherByEmail(String email) {
        return findTeacherByIdentifier(email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDTO> getAllTeachers() {
        return teacherRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));

        // 1. Unlink students assigned to this class teacher
        teacherRepository.unlinkStudentsByTeacherId(id);

        // 2. Unlink attendance, marks, and subjects referencing this teacher
        teacherRepository.unlinkAttendanceByTeacherId(id);
        teacherRepository.unlinkMarksByTeacherId(id);
        teacherRepository.unlinkSubjectsByTeacherId(id);

        // 3. Delete teacher entity
        teacherRepository.delete(teacher);
        teacherRepository.flush();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getAssignedStudentsForTeacher(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));

        List<Student> students = studentRepository.findByClassTeacher(teacher);
        return studentMapper.toDTOList(students);
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherReportDTO getTeacherReport(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));

        List<Student> assignedStudents = studentRepository.findByClassTeacher(teacher);
        if (assignedStudents == null || assignedStudents.isEmpty()) {
            return TeacherReportDTO.builder()
                    .teacherId(teacher.getId())
                    .teacherName(teacher.getFullName())
                    .subject(teacher.getSubject())
                    .classSize(0)
                    .averageAttendance("N/A")
                    .averageGrade("N/A")
                    .atRisk(0)
                    .gradeDistribution(List.of(
                            TeacherReportDTO.GradeCountDTO.builder().grade("Grade A (90%+)").count(0).fill("#75070C").build(),
                            TeacherReportDTO.GradeCountDTO.builder().grade("Grade B (80-89%)").count(0).fill("#A3292E").build(),
                            TeacherReportDTO.GradeCountDTO.builder().grade("Grade C (70-79%)").count(0).fill("#D4AF37").build(),
                            TeacherReportDTO.GradeCountDTO.builder().grade("Grade D (60-69%)").count(0).fill("#E5C158").build(),
                            TeacherReportDTO.GradeCountDTO.builder().grade("Grade F (<60%)").count(0).fill("#DC2626").build()
                    ))
                    .trendData(List.of())
                    .assignedStudents(List.of())
                    .build();
        }

        List<Marks> allMarks = marksRepository.findAll();
        List<Attendance> allAttendance = attendanceRepository.findAll();

        int countA = 0, countB = 0, countC = 0, countD = 0, countF = 0;
        int atRiskCount = 0;
        double sumOverallPercentage = 0.0;
        double sumAttendancePercentage = 0.0;
        int studentsWithMarksCount = 0;
        int studentsWithAttendanceCount = 0;

        List<TeacherReportDTO.StudentReportRowDTO> rowDTOs = new ArrayList<>();

        for (Student s : assignedStudents) {
            // 1. Calculate student overall marks percentage
            List<Marks> sMarks = allMarks.stream()
                    .filter(m -> m.getStudentName() != null && m.getStudentName().trim().equalsIgnoreCase(s.getFullName().trim()))
                    .toList();

            double overallPct = 0.0;
            boolean hasMarks = false;
            if (!sMarks.isEmpty()) {
                double total = 0.0;
                int validCount = 0;
                for (Marks m : sMarks) {
                    try {
                        total += Double.parseDouble(m.getMarks().trim());
                        validCount++;
                    } catch (Exception ignored) {}
                }
                if (validCount > 0) {
                    overallPct = Math.round((total / validCount) * 10.0) / 10.0;
                    hasMarks = true;
                }
            }

            if (hasMarks) {
                sumOverallPercentage += overallPct;
                studentsWithMarksCount++;
            }

            // 2. Calculate student attendance percentage
            List<Attendance> sAtt = allAttendance.stream()
                    .filter(a -> (a.getStudentId() != null && a.getStudentId().equals(s.getId()))
                            || (a.getStudentName() != null && a.getStudentName().trim().equalsIgnoreCase(s.getFullName().trim())))
                    .toList();

            double attPct = 0.0;
            boolean hasAtt = false;
            if (!sAtt.isEmpty()) {
                long presentCount = sAtt.stream().filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus())).count();
                attPct = Math.round((((double) presentCount / sAtt.size()) * 100.0) * 10.0) / 10.0;
                hasAtt = true;
            }

            if (hasAtt) {
                sumAttendancePercentage += attPct;
                studentsWithAttendanceCount++;
            }

            // 3. Assign Letter Grade
            String letterGrade = "N/A";
            if (hasMarks) {
                if (overallPct >= 90.0) {
                    letterGrade = "Grade A";
                    countA++;
                } else if (overallPct >= 80.0) {
                    letterGrade = "Grade B";
                    countB++;
                } else if (overallPct >= 70.0) {
                    letterGrade = "Grade C";
                    countC++;
                } else if (overallPct >= 60.0) {
                    letterGrade = "Grade D";
                    countD++;
                } else {
                    letterGrade = "Grade F";
                    countF++;
                }
            }

            // 4. At Risk Status
            String riskLevel = "Low";
            if ((hasMarks && overallPct < 60.0) || (hasAtt && attPct < 75.0)) {
                riskLevel = "High";
                atRiskCount++;
            } else if ((hasMarks && overallPct < 75.0) || (hasAtt && attPct < 85.0)) {
                riskLevel = "Medium";
            }

            rowDTOs.add(TeacherReportDTO.StudentReportRowDTO.builder()
                    .studentId(s.getId())
                    .name(s.getFullName())
                    .className(s.getClassName())
                    .section(s.getSection())
                    .overallPercentage(hasMarks ? overallPct : null)
                    .attendancePercentage(hasAtt ? attPct : null)
                    .letterGrade(letterGrade)
                    .riskLevel(riskLevel)
                    .build());
        }

        double avgGradeVal = studentsWithMarksCount > 0 ? Math.round((sumOverallPercentage / studentsWithMarksCount) * 10.0) / 10.0 : 0.0;
        double avgAttVal = studentsWithAttendanceCount > 0 ? Math.round((sumAttendancePercentage / studentsWithAttendanceCount) * 10.0) / 10.0 : 0.0;

        List<TeacherReportDTO.GradeCountDTO> gradeDist = List.of(
                TeacherReportDTO.GradeCountDTO.builder().grade("Grade A (90%+)").count(countA).fill("#75070C").build(),
                TeacherReportDTO.GradeCountDTO.builder().grade("Grade B (80-89%)").count(countB).fill("#A3292E").build(),
                TeacherReportDTO.GradeCountDTO.builder().grade("Grade C (70-79%)").count(countC).fill("#D4AF37").build(),
                TeacherReportDTO.GradeCountDTO.builder().grade("Grade D (60-69%)").count(countD).fill("#E5C158").build(),
                TeacherReportDTO.GradeCountDTO.builder().grade("Grade F (<60%)").count(countF).fill("#DC2626").build()
        );

        List<TeacherReportDTO.TrendDataDTO> trend = List.of(
                TeacherReportDTO.TrendDataDTO.builder()
                        .month("Current Term")
                        .averageGrade(avgGradeVal)
                        .classAttendance(avgAttVal)
                        .build()
        );

        return TeacherReportDTO.builder()
                .teacherId(teacher.getId())
                .teacherName(teacher.getFullName())
                .subject(teacher.getSubject())
                .classSize(assignedStudents.size())
                .studentsWithMarks(studentsWithMarksCount)
                .averageAttendance(studentsWithAttendanceCount > 0 ? String.format("%.1f%%", avgAttVal) : "No data")
                .averageGrade(studentsWithMarksCount > 0 ? String.format("%.1f%%", avgGradeVal) : "No data")
                .atRisk(atRiskCount)
                .gradeDistribution(gradeDist)
                .trendData(trend)
                .assignedStudents(rowDTOs)
                .build();
    }
}


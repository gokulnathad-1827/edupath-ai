package com.edupath.edupathservice.service.impl;

import com.edupath.edupathservice.dto.AttendanceDTO;
import com.edupath.edupathservice.entity.Attendance;
import com.edupath.edupathservice.entity.Student;
import com.edupath.edupathservice.repository.AttendanceRepository;
import com.edupath.edupathservice.repository.StudentRepository;
import com.edupath.edupathservice.service.AttendanceService;
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
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

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

    private AttendanceDTO toDTO(Attendance entity) {
        if (entity == null) return null;
        LocalDate dt = entity.getDate() != null ? entity.getDate() : entity.getAttendanceDate();
        return AttendanceDTO.builder()
                .id(entity.getId())
                .studentName(entity.getStudentName())
                .name(entity.getStudentName())
                .status(entity.getStatus())
                .date(dt)
                .createdAt(entity.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public List<AttendanceDTO> getAllAttendance() {
        List<Attendance> list = attendanceRepository.findAllByOrderByIdDesc();
        if (list.isEmpty()) {
            Student student = getOrCreateDefaultStudent();
            LocalDate yesterday = LocalDate.now().minusDays(1);
            LocalDateTime yesterdayDt = LocalDateTime.now().minusDays(1);
            
            Attendance a1 = Attendance.builder()
                    .studentName(student.getFullName())
                    .studentId(student.getId())
                    .status("Present")
                    .date(yesterday)
                    .attendanceDate(yesterday)
                    .createdAt(yesterdayDt)
                    .build();

            Attendance a2 = Attendance.builder()
                    .studentName(student.getFullName())
                    .studentId(student.getId())
                    .status("Absent")
                    .date(yesterday)
                    .attendanceDate(yesterday)
                    .createdAt(yesterdayDt)
                    .build();

            Attendance a3 = Attendance.builder()
                    .studentName(student.getFullName())
                    .studentId(student.getId())
                    .status("Present")
                    .date(yesterday)
                    .attendanceDate(yesterday)
                    .createdAt(yesterdayDt)
                    .build();

            attendanceRepository.saveAll(List.of(a1, a2, a3));
            list = attendanceRepository.findAllByOrderByIdDesc();
        }

        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public AttendanceDTO markAttendance(AttendanceDTO dto) {
        String nameStr = dto.getStudentName() != null && !dto.getStudentName().trim().isEmpty()
                ? dto.getStudentName().trim()
                : (dto.getName() != null && !dto.getName().trim().isEmpty() ? dto.getName().trim() : "Student");

        String statusStr = dto.getStatus() != null && !dto.getStatus().trim().isEmpty()
                ? dto.getStatus().trim()
                : "Present";

        LocalDate dateVal = dto.getDate() != null ? dto.getDate() : LocalDate.now();

        Student student = getOrCreateDefaultStudent();

        Attendance attendance = Attendance.builder()
                .studentName(nameStr)
                .studentId(student.getId())
                .status(statusStr)
                .date(dateVal)
                .attendanceDate(dateVal)
                .createdAt(LocalDateTime.now())
                .build();

        Attendance saved = attendanceRepository.save(attendance);
        return toDTO(saved);
    }

    @Override
    public AttendanceDTO updateAttendance(Long id, AttendanceDTO dto) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found with id: " + id));

        if (dto.getStudentName() != null && !dto.getStudentName().trim().isEmpty()) {
            attendance.setStudentName(dto.getStudentName().trim());
        } else if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            attendance.setStudentName(dto.getName().trim());
        }

        if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty()) {
            attendance.setStatus(dto.getStatus().trim());
        }

        if (dto.getDate() != null) {
            attendance.setDate(dto.getDate());
            attendance.setAttendanceDate(dto.getDate());
        }

        Attendance updated = attendanceRepository.save(attendance);
        return toDTO(updated);
    }

    @Override
    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new RuntimeException("Attendance record not found with id: " + id);
        }
        attendanceRepository.deleteById(id);
    }
}

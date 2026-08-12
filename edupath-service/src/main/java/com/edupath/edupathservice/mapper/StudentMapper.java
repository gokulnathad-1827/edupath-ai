package com.edupath.edupathservice.mapper;

import com.edupath.edupathservice.dto.StudentDTO;
import com.edupath.edupathservice.entity.Student;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class StudentMapper {

    public StudentDTO toDTO(Student student) {
        if (student == null) return null;

        String classTeacherName = null;
        if (student.getClassTeacher() != null && student.getClassTeacher().getUser() != null) {
            classTeacherName = student.getClassTeacher().getUser().getFullName();
        }

        String parentName = null;
        if (student.getParent() != null) {
            parentName = student.getParent().getFatherName() != null
                    ? student.getParent().getFatherName()
                    : student.getParent().getGuardianName();
        }

        String counselorName = null;
        if (student.getCounselor() != null && student.getCounselor().getUser() != null) {
            counselorName = student.getCounselor().getUser().getFullName();
        }

        return StudentDTO.builder()
                .id(student.getId())
                .studentId(student.getStudentId())
                .admissionNumber(student.getAdmissionNumber())
                .rollNumber(student.getRollNumber())
                .fullName(student.getFullName())
                .gender(student.getGender())
                .dateOfBirth(student.getDateOfBirth())
                .className(student.getClassName())
                .section(student.getSection())
                .academicYear(student.getAcademicYear())
                .bloodGroup(student.getBloodGroup())
                .address(student.getAddress())
                .phoneNumber(student.getPhoneNumber())
                .parentPhone(student.getParentPhone())
                .email(student.getEmail())
                .status(student.getStatus())
                .userId(student.getUser() != null ? student.getUser().getId() : null)
                .classTeacherId(student.getClassTeacher() != null ? student.getClassTeacher().getId() : null)
                .classTeacherName(classTeacherName)
                .parentId(student.getParent() != null ? student.getParent().getId() : null)
                .parentName(parentName)
                .counselorId(student.getCounselor() != null ? student.getCounselor().getId() : null)
                .counselorName(counselorName)
                .build();
    }

    public Student toEntity(StudentDTO dto) {
        if (dto == null) return null;
        Student student = new Student();
        student.setId(dto.getId());
        student.setStudentId(dto.getStudentId());
        student.setAdmissionNumber(dto.getAdmissionNumber());
        student.setRollNumber(dto.getRollNumber());
        student.setFullName(dto.getFullName());
        student.setGender(dto.getGender());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setClassName(dto.getClassName());
        student.setSection(dto.getSection());
        student.setAcademicYear(dto.getAcademicYear());
        student.setBloodGroup(dto.getBloodGroup());
        student.setAddress(dto.getAddress());
        student.setPhoneNumber(dto.getPhoneNumber());
        student.setParentPhone(dto.getParentPhone());
        student.setEmail(dto.getEmail());
        student.setStatus(dto.getStatus());
        return student;
    }

    public List<StudentDTO> toDTOList(List<Student> students) {
        if (students == null) return List.of();
        return students.stream().map(this::toDTO).collect(Collectors.toList());
    }
}

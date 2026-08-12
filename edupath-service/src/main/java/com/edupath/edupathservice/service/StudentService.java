package com.edupath.edupathservice.service;

import com.edupath.edupathservice.dto.StudentDTO;
import java.util.List;

public interface StudentService {
    StudentDTO createStudent(StudentDTO dto);
    StudentDTO updateStudent(Long id, StudentDTO dto);
    StudentDTO getStudentById(Long id);
    StudentDTO getStudentByStudentId(String studentId);
    StudentDTO getStudentByAdmissionNumber(String admissionNumber);
    StudentDTO getStudentByUserId(Long userId);
    StudentDTO findByRollNumber(String rollNumber);
    List<StudentDTO> getStudentsByClass(String className, String section);
    List<StudentDTO> getAllStudents();
    StudentDTO assignTeacher(Long studentId, Long teacherId);
    StudentDTO assignCounselor(Long studentId, Long counselorId);
    void deleteStudent(Long id);
}

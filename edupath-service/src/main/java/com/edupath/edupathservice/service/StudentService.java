package com.edupath.edupathservice.service;

import com.edupath.edupathservice.dto.StudentAttendanceSummaryDTO;
import com.edupath.edupathservice.dto.StudentClassRankDTO;
import com.edupath.edupathservice.dto.StudentDTO;
import com.edupath.edupathservice.dto.StudentOverallPercentageDTO;
import java.util.List;

public interface StudentService {
    StudentDTO createStudent(StudentDTO dto);
    StudentDTO updateStudent(Long id, StudentDTO dto);
    StudentDTO getStudentById(Long id);
    StudentDTO getStudentByStudentId(String studentId);
    StudentDTO getStudentByAdmissionNumber(String admissionNumber);
    StudentDTO getStudentByUserId(Long userId);
    StudentDTO getStudentByEmail(String email);
    StudentDTO findStudentByIdentifier(String identifier);
    StudentDTO findByRollNumber(String rollNumber);
    List<StudentDTO> getStudentsByClass(String className, String section);
    List<StudentDTO> getAllStudents();
    StudentDTO assignTeacher(Long studentId, Long teacherId);
    StudentDTO assignCounselor(Long studentId, Long counselorId);
    StudentOverallPercentageDTO getStudentOverallPercentage(Long id);
    StudentClassRankDTO getStudentClassRank(Long id);
    StudentAttendanceSummaryDTO getStudentAttendanceSummary(Long id);
    List<com.edupath.edupathservice.dto.StudentSubjectAttendanceDTO> getStudentSubjectAttendance(Long id);
    List<com.edupath.edupathservice.dto.MarksDTO> getStudentMarks(Long id);
    void deleteStudent(Long id);
}

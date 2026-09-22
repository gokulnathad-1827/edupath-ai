package com.edupath.edupathservice.service;

import com.edupath.edupathservice.dto.StudentDTO;
import com.edupath.edupathservice.dto.TeacherDTO;
import com.edupath.edupathservice.dto.TeacherReportDTO;
import java.util.List;

public interface TeacherService {
    TeacherDTO createTeacher(TeacherDTO dto);
    TeacherDTO updateTeacher(Long id, TeacherDTO dto);
    TeacherDTO getTeacherById(Long id);
    TeacherDTO findTeacherByIdentifier(String identifier);
    TeacherDTO getTeacherByEmail(String email);
    List<StudentDTO> getAssignedStudentsForTeacher(Long teacherId);
    TeacherReportDTO getTeacherReport(Long teacherId);
    List<TeacherDTO> getAllTeachers();
    void deleteTeacher(Long id);
}


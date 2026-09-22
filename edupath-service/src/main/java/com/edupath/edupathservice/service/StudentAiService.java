package com.edupath.edupathservice.service;

import com.edupath.edupathservice.dto.DropoutRiskResponseDTO;
import com.edupath.edupathservice.dto.StudentAiFeatureDTO;

import java.util.List;
import java.util.Map;

public interface StudentAiService {

    DropoutRiskResponseDTO predictStudentDropoutRisk(Long studentId);

    DropoutRiskResponseDTO predictParentChildDropoutRisk(Long parentId);

    List<DropoutRiskResponseDTO> predictTeacherStudentsDropoutRisk(Long teacherId);

    List<DropoutRiskResponseDTO> predictCounselorStudentsDropoutRisk(Long counselorId);

    List<DropoutRiskResponseDTO> predictAdminAllStudentsDropoutRisk();

    StudentAiFeatureDTO buildStudentAiFeatureDTO(Long studentId);



    Map<String, Object> getDropoutRiskSummary(String className, Long teacherId, Long counselorId);
}



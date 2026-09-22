package com.edupath.edupathservice.service;

import com.edupath.edupathservice.dto.CounselorDTO;
import com.edupath.edupathservice.dto.CounselorReportDTO;
import com.edupath.edupathservice.dto.StudentDTO;
import java.util.List;

public interface CounselorService {
    CounselorDTO createCounselor(CounselorDTO dto);
    CounselorDTO updateCounselor(Long id, CounselorDTO dto);
    CounselorDTO getCounselorById(Long id);
    CounselorDTO findCounselorByIdentifier(String identifier);
    CounselorDTO getCounselorByEmail(String email);
    List<StudentDTO> getAssignedStudentsForCounselor(Long counselorId);
    CounselorReportDTO getCounselorReport(Long counselorId);
    List<CounselorDTO> getAllCounselors();
    void deleteCounselor(Long id);
}


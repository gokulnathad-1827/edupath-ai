package com.edupath.edupathservice.service;

import com.edupath.edupathservice.dto.CounselingSessionDTO;
import java.util.List;

public interface CounselingSessionService {
    CounselingSessionDTO createSession(CounselingSessionDTO dto);
    CounselingSessionDTO updateSession(Long id, CounselingSessionDTO dto);
    CounselingSessionDTO getSessionById(Long id);
    List<CounselingSessionDTO> getAllSessions();
    void deleteSession(Long id);
}

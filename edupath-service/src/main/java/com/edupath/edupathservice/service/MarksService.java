package com.edupath.edupathservice.service;

import com.edupath.edupathservice.dto.MarksDTO;

import java.util.List;

public interface MarksService {
    List<MarksDTO> getAllMarks();
    MarksDTO addMarks(MarksDTO dto);
    MarksDTO updateMarks(Long id, MarksDTO dto);
    void deleteMarks(Long id);
}

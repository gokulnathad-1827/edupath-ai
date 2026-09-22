package com.edupath.edupathservice.service;

import com.edupath.edupathservice.dto.ParentDTO;
import com.edupath.edupathservice.dto.StudentDTO;
import java.util.List;

public interface ParentService {
    ParentDTO createParent(ParentDTO dto);
    ParentDTO updateParent(Long id, ParentDTO dto);
    ParentDTO getParentById(Long id);
    ParentDTO findParentByIdentifier(String identifier);
    ParentDTO getParentByEmail(String email);
    StudentDTO getLinkedStudentForParent(Long parentId);
    void validateParentChildRelationship(Long parentId, Long studentId);
    List<ParentDTO> getAllParents();
    void deleteParent(Long id);
}


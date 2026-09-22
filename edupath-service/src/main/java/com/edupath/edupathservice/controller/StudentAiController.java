package com.edupath.edupathservice.controller;

import com.edupath.edupathservice.dto.DropoutRiskResponseDTO;
import com.edupath.edupathservice.dto.StudentAiFeatureDTO;
import com.edupath.edupathservice.service.StudentAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai/students")
@RequiredArgsConstructor
public class StudentAiController {

    private final StudentAiService studentAiService;

    @GetMapping("/{studentId}/dropout-risk")
    @PreAuthorize("permitAll()")
    public ResponseEntity<DropoutRiskResponseDTO> getStudentDropoutRisk(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentAiService.predictStudentDropoutRisk(studentId));
    }

    @GetMapping("/parent/{parentId}/dropout-risk")
    @PreAuthorize("permitAll()")
    public ResponseEntity<DropoutRiskResponseDTO> getParentChildDropoutRisk(@PathVariable Long parentId) {
        return ResponseEntity.ok(studentAiService.predictParentChildDropoutRisk(parentId));
    }

    @GetMapping("/teacher/{teacherId}/dropout-risk")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<DropoutRiskResponseDTO>> getTeacherStudentsDropoutRisk(@PathVariable Long teacherId) {
        return ResponseEntity.ok(studentAiService.predictTeacherStudentsDropoutRisk(teacherId));
    }

    @GetMapping("/counselor/{counselorId}/dropout-risk")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<DropoutRiskResponseDTO>> getCounselorStudentsDropoutRisk(@PathVariable Long counselorId) {
        return ResponseEntity.ok(studentAiService.predictCounselorStudentsDropoutRisk(counselorId));
    }

    @GetMapping("/admin/dropout-risk")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<DropoutRiskResponseDTO>> getAdminStudentsDropoutRisk() {
        return ResponseEntity.ok(studentAiService.predictAdminAllStudentsDropoutRisk());
    }





    @GetMapping("/{studentId}/features")
    @PreAuthorize("permitAll()")
    public ResponseEntity<StudentAiFeatureDTO> getStudentAiFeatures(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentAiService.buildStudentAiFeatureDTO(studentId));
    }

    @GetMapping("/dropout-risk/summary")
    @PreAuthorize("permitAll()")
    public ResponseEntity<java.util.Map<String, Object>> getDropoutRiskSummary(
            @RequestParam(required = false) String className,
            @RequestParam(required = false) Long teacherId,
            @RequestParam(required = false) Long counselorId) {
        return ResponseEntity.ok(studentAiService.getDropoutRiskSummary(className, teacherId, counselorId));
    }
}
